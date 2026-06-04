import type { TournamentRow } from '../schema';
import { WC2026_TOURNAMENT_ID, WC2026_YEAR } from '../../constants/tournament';

export async function listTournaments(db: D1Database): Promise<TournamentRow[]> {
  const row = await db
    .prepare('SELECT * FROM tournaments WHERE id = ?')
    .bind(WC2026_TOURNAMENT_ID)
    .first<TournamentRow>();
  return row ? [row] : [];
}

export async function getTournamentByYear(db: D1Database, year: number): Promise<TournamentRow | null> {
  if (year !== WC2026_YEAR) return null;
  return db
    .prepare('SELECT * FROM tournaments WHERE id = ?')
    .bind(WC2026_TOURNAMENT_ID)
    .first<TournamentRow>();
}
