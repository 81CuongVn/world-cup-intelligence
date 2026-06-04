import type { AppEnv } from '../env';
import { WC2026_TOURNAMENT_ID } from '../constants/tournament';

export type HeadToHeadMatch = {
  id: string;
  kickoff_utc: string;
  stage: string | null;
  status: string;
  home_team_id: string;
  away_team_id: string;
  home_name: string;
  away_name: string;
  home_short: string | null;
  away_short: string | null;
  home_score: number;
  away_score: number;
  home_xg: number;
  away_xg: number;
  tournament_year?: number;
  tournament_name?: string;
};

export type HeadToHeadSummary = {
  totalMatches: number;
  homeTeamWins: number;
  awayTeamWins: number;
  draws: number;
  avgGoalsHome: number;
  avgGoalsAway: number;
  recentFormHome: string;
  recentFormAway: string;
};

export async function getHeadToHead(
  env: AppEnv,
  matchId: string,
): Promise<{ current: HeadToHeadMatch | null; history: HeadToHeadMatch[]; summary: HeadToHeadSummary } | null> {
  const current = await env.DB.prepare(
    `SELECT m.*, ht.name AS home_name, ht.short_name AS home_short,
            at.name AS away_name, at.short_name AS away_short,
            t.year AS tournament_year, t.name AS tournament_name
     FROM matches m
     JOIN teams ht ON ht.id = m.home_team_id
     JOIN teams at ON at.id = m.away_team_id
     LEFT JOIN tournaments t ON t.id = m.tournament_id
     WHERE m.id = ? AND m.tournament_id = ?`,
  )
    .bind(matchId, WC2026_TOURNAMENT_ID)
    .first<HeadToHeadMatch & { home_team_id: string; away_team_id: string }>();

  if (!current) return null;

  const { results } = await env.DB.prepare(
    `SELECT m.*, ht.name AS home_name, ht.short_name AS home_short,
            at.name AS away_name, at.short_name AS away_short,
            t.year AS tournament_year, t.name AS tournament_name
     FROM matches m
     JOIN teams ht ON ht.id = m.home_team_id
     JOIN teams at ON at.id = m.away_team_id
     LEFT JOIN tournaments t ON t.id = m.tournament_id
     WHERE m.id != ?
       AND m.tournament_id = ?
       AND m.status = 'completed'
       AND (
         (m.home_team_id = ? AND m.away_team_id = ?)
         OR (m.home_team_id = ? AND m.away_team_id = ?)
       )
     ORDER BY m.kickoff_utc DESC
     LIMIT 12`,
  )
    .bind(
      matchId,
      WC2026_TOURNAMENT_ID,
      current.home_team_id,
      current.away_team_id,
      current.away_team_id,
      current.home_team_id,
    )
    .all<HeadToHeadMatch>();

  const history = results ?? [];
  let homeWins = 0;
  let awayWins = 0;
  let draws = 0;
  let goalsHome = 0;
  let goalsAway = 0;

  for (const h of history) {
    const isCurrentOrientation =
      h.home_team_id === current.home_team_id && h.away_team_id === current.away_team_id;
    const hScore = isCurrentOrientation ? h.home_score : h.away_score;
    const aScore = isCurrentOrientation ? h.away_score : h.home_score;
    goalsHome += hScore;
    goalsAway += aScore;
    if (hScore > aScore) homeWins++;
    else if (hScore < aScore) awayWins++;
    else draws++;
  }

  const formSlice = history.slice(0, 5);
  const formHome = formSlice.map((h) => {
    const oriented = h.home_team_id === current.home_team_id;
    const hs = oriented ? h.home_score : h.away_score;
    const as = oriented ? h.away_score : h.home_score;
    return hs > as ? 'W' : hs < as ? 'L' : 'D';
  });
  const formAway = formSlice.map((h) => {
    const oriented = h.away_team_id === current.away_team_id;
    const hs = oriented ? h.home_score : h.away_score;
    const as = oriented ? h.away_score : h.home_score;
    return hs > as ? 'W' : hs < as ? 'L' : 'D';
  });

  return {
    current: current as HeadToHeadMatch,
    history,
    summary: {
      totalMatches: history.length,
      homeTeamWins: homeWins,
      awayTeamWins: awayWins,
      draws,
      avgGoalsHome: history.length ? goalsHome / history.length : 0,
      avgGoalsAway: history.length ? goalsAway / history.length : 0,
      recentFormHome: formHome.join(' ') || '—',
      recentFormAway: formAway.join(' ') || '—',
    },
  };
}
