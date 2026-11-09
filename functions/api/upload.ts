import type { AuthUser } from "../../server/auth.ts";
interface Env {
  BUCKET: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { BUCKET } = context.env;
  const user = context.data.user as AuthUser;
  if (!user) return Response.json({ error: "Please log in." }, { status: 401 });
  const file = new URL(context.request.url).searchParams.get("file") || "";
  const name = file.startsWith(`${user.id}/`)
    ? file.slice(user.id.length + 1)
    : file;
  if (!name || name.length > 255 || /[\\/\x00-\x1f]/.test(name))
    return Response.json(
      { error: "Choose a valid file name." },
      { status: 400 },
    );
  const key = `${user.id}/${name}`;

  if (context.request.method === "PUT") {
    const fileName = new URL(context.request.url).searchParams.get("file");
    if (!fileName)
      return new Response("Missing file parameter", { status: 400 });

    const object = await BUCKET.put(key, context.request.body, {
      httpMetadata: {
        contentType:
          context.request.headers.get("content-type") ||
          "application/octet-stream",
      },
    });

    return Response.json({ key: object.key, success: true });
  }

  if (context.request.method === "GET") {
    const fileName = new URL(context.request.url).searchParams.get("file");
    if (!fileName)
      return new Response("Missing file parameter", { status: 400 });

    const object = await BUCKET.get(key);
    if (!object) return new Response("Not found", { status: 404 });

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);

    return new Response(object.body, { headers });
  }

  return new Response("Method not allowed", { status: 405 });
};
