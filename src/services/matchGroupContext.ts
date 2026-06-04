import type { AppEnv } from '../env';
import { WC2026_TOURNAMENT_ID } from '../constants/tournament';

export type GroupFixture = {
  id: string;
  home: string;
  away: string;
  kickoff_utc: string;
};

export async function getGroupContextForMatch(
  env: AppEnv,
  matchId: string,
  groupCode: string | null,
): Promise<{ fixtures: GroupFixture[]; groupCode: string | null }> {
  if (!groupCode) return { fixtures: [], groupCode: null };

  const { results } = await env.DB.prepare(
    `SELECT m.id, m.kickoff_utc, ht.short_name AS home_short, ht.name AS home_name,
            at.short_name AS away_short, at.name AS away_name
     FROM matches m
     JOIN teams ht ON ht.id = m.home_team_id
     JOIN teams at ON at.id = m.away_team_id
     WHERE m.tournament_id = ? AND m.group_code = ? AND m.id != ?
     ORDER BY m.kickoff_utc ASC
     LIMIT 8`,
  )
    .bind(WC2026_TOURNAMENT_ID, groupCode, matchId)
    .all<{
      id: string;
      kickoff_utc: string;
      home_short: string | null;
      home_name: string;
      away_short: string | null;
      away_name: string;
    }>();

  return {
    groupCode,
    fixtures: (results ?? []).map((r) => ({
      id: r.id,
      home: r.home_short ?? r.home_name,
      away: r.away_short ?? r.away_name,
      kickoff_utc: r.kickoff_utc,
    })),
  };
}
