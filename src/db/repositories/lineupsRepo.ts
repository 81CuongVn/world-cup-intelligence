export async function getMatchLineups(db: D1Database, matchId: string) {
  const lineups = await db.prepare('SELECT * FROM lineups WHERE match_id = ?').bind(matchId).all();
  const rows = lineups.results ?? [];
  const enriched = [];
  for (const lineup of rows) {
    const lp = await db
      .prepare('SELECT * FROM lineup_players WHERE lineup_id = ?')
      .bind((lineup as { id: string }).id)
      .all();
    enriched.push({ ...lineup, players: lp.results ?? [] });
  }
  return enriched;
}
