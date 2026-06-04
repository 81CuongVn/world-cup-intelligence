import type { TeamRow } from '../schema';
import { applyEffectiveTeamProfile } from '../../services/teamProfile';

export async function listTeams(db: D1Database, limit = 50, offset = 0): Promise<TeamRow[]> {
  const { results } = await db
    .prepare('SELECT * FROM teams ORDER BY fifa_ranking ASC LIMIT ? OFFSET ?')
    .bind(limit, offset)
    .all<TeamRow>();
  return results ?? [];
}

export async function getTeam(db: D1Database, teamId: string): Promise<TeamRow | null> {
  const row = await db.prepare('SELECT * FROM teams WHERE id = ?').bind(teamId).first<TeamRow>();
  return row ? applyEffectiveTeamProfile(row) : null;
}

export async function getTeamsByTournament(db: D1Database, tournamentId: string): Promise<TeamRow[]> {
  const { results } = await db
    .prepare(
      `SELECT DISTINCT t.* FROM teams t
       JOIN matches m ON t.id = m.home_team_id OR t.id = m.away_team_id
       WHERE m.tournament_id = ?`,
    )
    .bind(tournamentId)
    .all<TeamRow>();
  return results ?? [];
}
