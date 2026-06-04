export async function getMatchEvents(db: D1Database, matchId: string) {
  const { results } = await db
    .prepare('SELECT * FROM match_events WHERE match_id = ? ORDER BY minute ASC, second ASC')
    .bind(matchId)
    .all();
  return results ?? [];
}
