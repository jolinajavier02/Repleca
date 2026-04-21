interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;
  
  if (context.request.method === 'GET') {
    const { results } = await DB.prepare('SELECT * FROM projects ORDER BY updated_at DESC').all();
    return Response.json(results);
  }

  if (context.request.method === 'POST') {
    const data = await context.request.json();
    const { name, type, organization_id, created_by } = data;
    
    const id = crypto.randomUUID();
    await DB.prepare(
      'INSERT INTO projects (id, name, type, organization_id, created_by) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, name, type, organization_id, created_by).run();
    
    return Response.json({ id, success: true });
  }

  return new Response('Method not allowed', { status: 405 });
};
