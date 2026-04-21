interface Env {
  BUCKET: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { BUCKET } = context.env;

  if (context.request.method === 'PUT') {
    const fileName = new URL(context.request.url).searchParams.get('file');
    if (!fileName) return new Response('Missing file parameter', { status: 400 });

    const object = await BUCKET.put(fileName, context.request.body, {
      httpMetadata: { contentType: context.request.headers.get('content-type') || 'application/octet-stream' }
    });

    return Response.json({ key: object.key, success: true });
  }

  if (context.request.method === 'GET') {
     const fileName = new URL(context.request.url).searchParams.get('file');
     if (!fileName) return new Response('Missing file parameter', { status: 400 });

     const object = await BUCKET.get(fileName);
     if (!object) return new Response('Not found', { status: 404 });

     const headers = new Headers();
     object.writeHttpMetadata(headers);
     headers.set('etag', object.httpEtag);

     return new Response(object.body, { headers });
  }

  return new Response('Method not allowed', { status: 405 });
};
