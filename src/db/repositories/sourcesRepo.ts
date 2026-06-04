export async function listSources(db: D1Database) {
  const { results } = await db.prepare('SELECT * FROM source_registry ORDER BY source_name').all();
  return results ?? [];
}

export async function getSource(db: D1Database, sourceId: string) {
  return db.prepare('SELECT * FROM source_registry WHERE id = ?').bind(sourceId).first();
}
