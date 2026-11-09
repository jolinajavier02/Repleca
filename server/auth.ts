import { randomBytes, scrypt, timingSafeEqual, createHash } from "node:crypto";

export type AuthUser = { id: string; email: string; name: string };
export interface AuthDatabase {
  prepare(sql: string): {
    bind(...values: (string | number | null)[]): {
      first<T>(): Promise<T | null>;
      all<T>(): Promise<{ results: T[] }>;
      run(): Promise<unknown>;
    };
  };
}
const SESSION_SECONDS = 60 * 60 * 24 * 7;
const COOKIE = "repleca_session";
const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const json = (
  data: unknown,
  status = 200,
  extra: Record<string, string> = {},
) =>
  Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extra,
    },
  });
export function validOrigin(request: Request) {
  return request.headers.get("origin") === new URL(request.url).origin;
}
function cookie(request: Request, value: string, age: number) {
  return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;
}
function token(request: Request) {
  const value = request.headers
    .get("cookie")
    ?.split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  return value && /^[a-f0-9]{64}$/.test(value) ? value : null;
}
function derive(password: string, salt: string) {
  return new Promise<Buffer>((resolve, reject) =>
    scrypt(
      password,
      salt,
      64,
      { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 },
      (error, key) => (error ? reject(error) : resolve(key)),
    ),
  );
}
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt$${salt}$${(await derive(password, salt)).toString("hex")}`;
}
async function verifyPassword(password: string, encoded?: string) {
  const [, salt, hash] = (
    encoded || `scrypt$${"0".repeat(32)}$${"0".repeat(128)}`
  ).split("$");
  const derived = await derive(password, salt);
  return timingSafeEqual(derived, Buffer.from(hash, "hex")) && Boolean(encoded);
}
export async function sessionUser(
  request: Request,
  db: AuthDatabase,
): Promise<AuthUser | null> {
  const value = token(request);
  if (!value) return null;
  return db
    .prepare(
      "SELECT u.id, u.email, u.full_name AS name FROM auth_sessions s JOIN auth_users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?",
    )
    .bind(digest(value), Date.now())
    .first<AuthUser>();
}
async function limited(db: AuthDatabase, key: string, limit: number) {
  const now = Date.now();
  await db
    .prepare(
      "INSERT INTO auth_rate_limits (key, attempts, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET attempts = CASE WHEN expires_at < ? THEN 1 ELSE attempts + 1 END, expires_at = CASE WHEN expires_at < ? THEN excluded.expires_at ELSE expires_at END",
    )
    .bind(digest(key), now + 900_000, now, now)
    .run();
  const row = await db
    .prepare("SELECT attempts FROM auth_rate_limits WHERE key = ?")
    .bind(digest(key))
    .first<{ attempts: number }>();
  return !row || row.attempts > limit;
}
export async function handleAuth(
  request: Request,
  db: AuthDatabase,
  clientIp = "local",
) {
  try {
    const action = new URL(request.url).pathname
      .replace(/\/$/, "")
      .split("/")
      .pop();
    if (action === "session" && request.method === "GET")
      return json({ user: await sessionUser(request, db) });
    if (request.method !== "POST")
      return json({ error: "Method not allowed." }, 405, { Allow: "POST" });
    if (!validOrigin(request))
      return json({ error: "Please submit this form from Repleca." }, 403);
    if (action === "logout") {
      const value = token(request);
      if (value)
        await db
          .prepare("DELETE FROM auth_sessions WHERE token_hash = ?")
          .bind(digest(value))
          .run();
      return json({ success: true }, 200, {
        "Set-Cookie": cookie(request, "", 0),
      });
    }
    if (action !== "signup" && action !== "login")
      return json({ error: "Not found." }, 404);
    if (!request.headers.get("content-type")?.startsWith("application/json"))
      return json({ error: "Send a JSON request." }, 415);
    const text = await request.text();
    if (text.length > 8192)
      return json({ error: "The form is too large." }, 413);
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(text);
      if (!body || typeof body !== "object" || Array.isArray(body))
        throw new Error();
    } catch {
      return json({ error: "Please check the form and try again." }, 400);
    }
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254 ||
      !password ||
      password.length > 128
    )
      return json({ error: "Enter a valid email and password." }, 400);
    if (
      (await limited(
        db,
        `${action}:ip:${clientIp}`,
        action === "signup" ? 10 : 40,
      )) ||
      (await limited(db, `${action}:email:${email}`, 10))
    )
      return json(
        { error: "Too many attempts. Please try again in 15 minutes." },
        429,
        { "Retry-After": "900" },
      );
    if (action === "signup") {
      const name = typeof body.name === "string" ? body.name.trim() : "";
      if (name.length < 2 || name.length > 80)
        return json({ error: "Enter your name (2–80 characters)." }, 400);
      if (password.length < 6)
        return json(
          { error: "Choose a password with at least 6 characters." },
          400,
        );
      if (body.confirmPassword !== password)
        return json({ error: "Your passwords do not match." }, 400);
      if (
        await db
          .prepare("SELECT id FROM auth_users WHERE email = ?")
          .bind(email)
          .first()
      )
        return json(
          {
            error: "An account with this email already exists. Log in instead.",
          },
          409,
        );
      const hash = await hashPassword(password);
      try {
        await db
          .prepare(
            "INSERT INTO auth_users (id, email, full_name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
          )
          .bind(crypto.randomUUID(), email, name, hash, Date.now())
          .run();
      } catch (error) {
        if (String(error).includes("UNIQUE"))
          return json(
            {
              error:
                "An account with this email already exists. Log in instead.",
            },
            409,
          );
        throw error;
      }
      return json({ success: true }, 201);
    }
    const account = await db
      .prepare(
        "SELECT id, email, full_name AS name, password_hash FROM auth_users WHERE email = ?",
      )
      .bind(email)
      .first<AuthUser & { password_hash: string }>();
    if (!(await verifyPassword(password, account?.password_hash)) || !account)
      return json(
        { error: "Email or password is incorrect. Please try again." },
        401,
      );
    const oldToken = token(request);
    if (oldToken)
      await db
        .prepare("DELETE FROM auth_sessions WHERE token_hash = ?")
        .bind(digest(oldToken))
        .run();
    await db
      .prepare("DELETE FROM auth_sessions WHERE expires_at <= ?")
      .bind(Date.now())
      .run();
    await db
      .prepare("DELETE FROM auth_rate_limits WHERE expires_at <= ? OR key = ?")
      .bind(Date.now(), digest(`login:email:${email}`))
      .run();
    const value = randomBytes(32).toString("hex");
    await db
      .prepare(
        "INSERT INTO auth_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
      )
      .bind(digest(value), account.id, Date.now() + SESSION_SECONDS * 1000)
      .run();
    return json(
      { user: { id: account.id, email: account.email, name: account.name } },
      200,
      { "Set-Cookie": cookie(request, value, SESSION_SECONDS) },
    );
  } catch {
    return json(
      { error: "Account service is unavailable. Please try again shortly." },
      503,
    );
  }
}
