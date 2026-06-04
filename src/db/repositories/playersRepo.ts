import type { PlayerRow } from '../schema';

export async function listPlayers(db: D1Database, limit = 50, offset = 0): Promise<PlayerRow[]> {
  const { results } = await db
    .prepare('SELECT * FROM players ORDER BY name ASC LIMIT ? OFFSET ?')
    .bind(limit, offset)
    .all<PlayerRow>();
  return results ?? [];
}

export async function getPlayer(db: D1Database, playerId: string): Promise<PlayerRow | null> {
  return db.prepare('SELECT * FROM players WHERE id = ?').bind(playerId).first<PlayerRow>();
}
