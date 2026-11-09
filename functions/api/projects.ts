import type { AuthUser } from "../../server/auth.ts";
interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;
  const user = context.data.user as AuthUser;
  if (!user) return Response.json({ error: "Please log in." }, { status: 401 });

  if (context.request.method === "GET") {
    const { results } = await DB.prepare(
      "SELECT * FROM projects WHERE created_by = ? ORDER BY updated_at DESC",
    )
      .bind(user.id)
      .all();
    return Response.json(results);
  }

  if (context.request.method === "POST") {
    const data = await context.request.json();
    const { name, type } = data;
    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.length > 160 ||
      ![
        "video",
        "image",
        "presentation",
        "present",
        "podcast",
        "script",
        "printing",
        "photo",
        "document",
        "excel",
        "website",
        "social",
      ].includes(type)
    )
      return Response.json(
        { error: "Enter a valid project name and type." },
        { status: 400 },
      );
    await DB.prepare(
      "INSERT OR IGNORE INTO profiles (id, full_name) VALUES (?, ?)",
    )
      .bind(user.id, user.name)
      .run();

    const id = crypto.randomUUID();
    await DB.prepare(
      "INSERT INTO projects (id, name, type, organization_id, created_by) VALUES (?, ?, ?, ?, ?)",
    )
      .bind(id, name.trim(), type, null, user.id)
      .run();

    return Response.json({ id, success: true });
  }

  return new Response("Method not allowed", { status: 405 });
};
