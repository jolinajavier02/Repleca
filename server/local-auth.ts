import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync, readdirSync, chmodSync } from "node:fs";
import { join } from "node:path";
import type { Plugin, Connect } from "vite";
import type { AuthDatabase } from "./auth.ts";
import { handleAuth } from "./auth.ts";

export function openLocalAuth(directory: string): {
  db: AuthDatabase;
  close: () => void;
} {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const filename = join(directory, "auth.sqlite");
  const sqlite = new DatabaseSync(filename);
  chmodSync(filename, 0o600);
  sqlite.exec(
    "PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;",
  );
  const migrations = new URL("../migrations/", import.meta.url);
  for (const file of readdirSync(migrations)
    .filter((f) => f.endsWith(".sql"))
    .sort())
    sqlite.exec(readFileSync(new URL(file, migrations), "utf8"));
  const db: AuthDatabase = {
    prepare(sql) {
      return {
        bind(...values) {
          return {
            async first<T>() {
              return (sqlite.prepare(sql).get(...values) as T) || null;
            },
            async run() {
              return sqlite.prepare(sql).run(...values);
            },
            async all<T>() {
              return { results: sqlite.prepare(sql).all(...values) as T[] };
            },
          };
        },
      };
    },
  };
  return { db, close: () => sqlite.close() };
}
export function localAuthPlugin(): Plugin {
  let store: ReturnType<typeof openLocalAuth> | undefined;
  const install = (
    middlewares: Connect.Server,
    root: string,
    onClose: (fn: () => void) => void,
  ) => {
    const middleware: Connect.NextHandleFunction = async (req, res, next) => {
      if (!req.url?.startsWith("/api/auth/")) return next();
      try {
        store ??= openLocalAuth(join(root, ".repleca"));
        const chunks: Buffer[] = [];
        let size = 0;
        for await (const chunk of req) {
          size += Buffer.byteLength(chunk);
          if (size > 8192) {
            res.writeHead(413, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "The form is too large." }));
            return;
          }
          chunks.push(Buffer.from(chunk));
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers))
          if (value)
            headers.set(key, Array.isArray(value) ? value.join(", ") : value);
        const request = new Request(`http://${req.headers.host}${req.url}`, {
          method: req.method,
          headers,
          ...(chunks.length
            ? { body: Buffer.concat(chunks).toString("utf8") }
            : {}),
        });
        const response = await handleAuth(
          request,
          store.db,
          req.socket.remoteAddress || "local",
        );
        res.writeHead(response.status, Object.fromEntries(response.headers));
        res.end(await response.text());
      } catch {
        res.writeHead(503, {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        });
        res.end(
          JSON.stringify({
            error: "Account service is unavailable. Please try again shortly.",
          }),
        );
      }
    };
    middlewares.use(middleware);
    onClose(() => {
      store?.close();
      store = undefined;
    });
  };
  return {
    name: "repleca-local-auth",
    configureServer(server) {
      install(server.middlewares, server.config.root, (fn) =>
        server.httpServer?.once("close", fn),
      );
    },
    configurePreviewServer(server) {
      install(server.middlewares, server.config.root, (fn) =>
        server.httpServer.once("close", fn),
      );
    },
  };
}
