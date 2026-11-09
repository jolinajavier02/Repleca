import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { onRequest as protectedApi } from "../functions/api/_middleware.ts";
import { onRequest as projectsApi } from "../functions/api/projects.ts";
import { handleAuth } from "../server/auth.ts";
import { openLocalAuth } from "../server/local-auth.ts";

const origin = "http://localhost:3000";
const password = "Art!26"; // Exactly six characters: exercise the signup boundary.
const account = {
  name: "Creative Tester",
  email: "Creator@Example.test",
  password,
  confirmPassword: password,
};
function request(
  action: string,
  body?: unknown,
  cookie?: string,
  requestOrigin = origin,
) {
  return new Request(`${origin}/api/auth/${action}`, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      ...(body === undefined
        ? {}
        : { "Content-Type": "application/json", Origin: requestOrigin }),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
const cookieOf = (response: Response) =>
  response.headers.get("set-cookie")!.split(";")[0];
test("real email/password signup and session lifecycle", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "repleca-auth-test-"));
  const store = openLocalAuth(directory);
  t.after(() => {
    store.close();
    rmSync(directory, { recursive: true });
  });
  const call = (
    action: string,
    body?: unknown,
    cookie?: string,
    ip = "test-ip",
  ) => handleAuth(request(action, body, cookie), store.db, ip);
  await t.test("anonymous users have no session", async () => {
    assert.deepEqual(await (await call("session")).json(), { user: null });
  });
  await t.test("cross-origin signup is rejected", async () => {
    assert.equal(
      (
        await handleAuth(
          request("signup", account, undefined, "https://other.test"),
          store.db,
        )
      ).status,
      403,
    );
  });
  await t.test("invalid forms cannot create accounts", async () => {
    for (const fields of [
      { password: "short", confirmPassword: "short" },
      { confirmPassword: "different" },
      { email: "not-an-email" },
      { name: "" },
    ])
      assert.equal(
        (
          await call(
            "signup",
            { ...account, ...fields },
            undefined,
            `validation-${JSON.stringify(Object.keys(fields))}`,
          )
        ).status,
        400,
      );
  });
  await t.test(
    "signup persists salted password hashes and does not log in",
    async () => {
      const result = await call("signup", account);
      assert.equal(result.status, 201);
      assert.equal(result.headers.get("set-cookie"), null);
      const row = await store.db
        .prepare("SELECT email, password_hash FROM auth_users WHERE email = ?")
        .bind("creator@example.test")
        .first<{ email: string; password_hash: string }>();
      assert.equal(row!.email, "creator@example.test");
      assert.match(row!.password_hash, /^scrypt\$/);
      assert.ok(!row!.password_hash.includes(password));
      assert.deepEqual(await (await call("session")).json(), { user: null });
    },
  );
  await t.test("duplicate emails are rejected case insensitively", async () => {
    assert.equal(
      (await call("signup", { ...account, email: "CREATOR@EXAMPLE.TEST" }))
        .status,
      409,
    );
  });
  await t.test(
    "wrong password and unknown account cannot authenticate",
    async () => {
      const wrong = await call("login", {
        email: account.email,
        password: "wrong password",
      });
      const missing = await call("login", {
        email: "missing@example.test",
        password,
      });
      assert.equal(wrong.status, 401);
      assert.equal(missing.status, 401);
      assert.deepEqual(await wrong.json(), await missing.json());
      assert.equal(wrong.headers.get("set-cookie"), null);
    },
  );
  let cookie = "";
  await t.test(
    "valid login creates an HTTP-only session and returns public account fields only",
    async () => {
      const response = await call("login", {
        email: " CREATOR@example.test ",
        password,
      });
      assert.equal(response.status, 200);
      const header = response.headers.get("set-cookie")!;
      assert.match(header, /HttpOnly/);
      assert.match(header, /SameSite=Lax/);
      assert.match(header, /Path=\//);
      cookie = cookieOf(response);
      const body = await response.json();
      assert.equal(body.user.email, "creator@example.test");
      assert.deepEqual(Object.keys(body.user).sort(), ["email", "id", "name"]);
      assert.equal(
        (await (await call("session", undefined, cookie)).json()).user.name,
        account.name,
      );
      const row = await store.db
        .prepare("SELECT token_hash FROM auth_sessions WHERE user_id = ?")
        .bind(body.user.id)
        .first<{ token_hash: string }>();
      assert.notEqual(row!.token_hash, cookie.split("=")[1]);
    },
  );
  await t.test("forged cookies have no session", async () => {
    assert.deepEqual(
      await (
        await call("session", undefined, "repleca_session=" + "a".repeat(64))
      ).json(),
      { user: null },
    );
  });
  await t.test("login rotates existing sessions", async () => {
    const next = await call(
      "login",
      { email: account.email, password },
      cookie,
    );
    assert.equal(next.status, 200);
    assert.deepEqual(await (await call("session", undefined, cookie)).json(), {
      user: null,
    });
    cookie = cookieOf(next);
  });
  await t.test("logout invalidates the server session", async () => {
    const response = await call("logout", {}, cookie);
    assert.match(response.headers.get("set-cookie")!, /Max-Age=0/);
    assert.deepEqual(await (await call("session", undefined, cookie)).json(), {
      user: null,
    });
  });
  await t.test(
    "sessions use Secure cookies over HTTPS and expire on the server",
    async () => {
      const response = await handleAuth(
        new Request("https://repleca.test/api/auth/login", {
          method: "POST",
          headers: {
            Origin: "https://repleca.test",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: account.email, password }),
        }),
        store.db,
      );
      assert.equal(response.status, 200);
      assert.match(response.headers.get("set-cookie")!, /; Secure/);
      await store.db
        .prepare("UPDATE auth_sessions SET expires_at = ?")
        .bind(Date.now() - 1)
        .run();
      assert.deepEqual(
        await (await call("session", undefined, cookieOf(response))).json(),
        { user: null },
      );
    },
  );
  await t.test("repeated failed logins are throttled", async () => {
    for (let i = 0; i < 10; i++)
      assert.equal(
        (
          await call(
            "login",
            { email: "throttle@example.test", password: "wrong" },
            undefined,
            "throttle-ip",
          )
        ).status,
        401,
      );
    const result = await call(
      "login",
      { email: "throttle@example.test", password: "wrong" },
      undefined,
      "throttle-ip",
    );
    assert.equal(result.status, 429);
    assert.equal(result.headers.get("retry-after"), "900");
  });
  await t.test("malformed JSON is rejected", async () => {
    const r = new Request(`${origin}/api/auth/login`, {
      method: "POST",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body: "{broken",
    });
    assert.equal((await handleAuth(r, store.db)).status, 400);
  });
  await t.test(
    "API middleware rejects unauthenticated and cross-origin requests",
    async () => {
      let called = false;
      const next = async () => {
        called = true;
        return new Response("private");
      };
      const anonymous = await protectedApi({
        request: new Request(`${origin}/api/projects`),
        env: { DB: store.db },
        data: {},
        next,
      });
      assert.equal(anonymous.status, 401);
      assert.equal(called, false);
      const login = await call(
        "login",
        { email: account.email, password },
        undefined,
        "api-ip",
      );
      const request = new Request(`${origin}/api/projects`, {
        method: "POST",
        headers: { Cookie: cookieOf(login), Origin: "https://outside.test" },
      });
      assert.equal(
        (await protectedApi({ request, env: { DB: store.db }, data: {}, next }))
          .status,
        403,
      );
      assert.equal(called, false);
    },
  );
  await t.test(
    "project APIs isolate users and ignore a forged owner ID",
    async () => {
      const first = await store.db
        .prepare(
          "SELECT id, email, full_name AS name FROM auth_users WHERE email = ?",
        )
        .bind("creator@example.test")
        .first<{ id: string; email: string; name: string }>();
      const other = {
        id: crypto.randomUUID(),
        email: "other@example.test",
        name: "Other Creator",
      };
      const invoke = (user: unknown, method: string, body?: unknown) =>
        projectsApi({
          request: new Request(`${origin}/api/projects`, {
            method,
            ...(body
              ? {
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(body),
                }
              : {}),
          }),
          env: { DB: store.db },
          data: { user },
        } as never);
      assert.equal(
        (
          await invoke(first, "POST", {
            name: "My private project",
            type: "video",
            created_by: other.id,
          })
        ).status,
        200,
      );
      assert.equal(
        (
          await invoke(other, "POST", {
            name: "Other private project",
            type: "image",
          })
        ).status,
        200,
      );
      const mine = await (await invoke(first, "GET")).json();
      const theirs = await (await invoke(other, "GET")).json();
      assert.deepEqual(
        mine.map((p: { name: string }) => p.name),
        ["My private project"],
      );
      assert.deepEqual(
        theirs.map((p: { name: string }) => p.name),
        ["Other private project"],
      );
      assert.equal(mine[0].created_by, first!.id);
    },
  );
  await t.test("credentials survive a new database connection", async () => {
    const second = openLocalAuth(directory);
    try {
      assert.equal(
        (
          await handleAuth(
            request("login", { email: account.email, password }),
            second.db,
            "persistence-ip",
          )
        ).status,
        200,
      );
    } finally {
      second.close();
    }
  });
});
