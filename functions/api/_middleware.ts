import { sessionUser, validOrigin } from "../../server/auth.ts";
import type { AuthDatabase } from "../../server/auth.ts";
export async function onRequest(context: {
  request: Request;
  env: { DB: AuthDatabase };
  data: Record<string, unknown>;
  next: () => Promise<Response>;
}) {
  if (new URL(context.request.url).pathname.startsWith("/api/auth/"))
    return context.next();
  const user = await sessionUser(context.request, context.env.DB);
  if (!user)
    return Response.json(
      { error: "Please log in to continue." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  if (
    !["GET", "HEAD"].includes(context.request.method) &&
    !validOrigin(context.request)
  )
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  context.data.user = user;
  const response = await context.next();
  const result = new Response(response.body, response);
  result.headers.set("Cache-Control", "no-store");
  return result;
}
