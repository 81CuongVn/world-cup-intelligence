import type { MatchRow } from '../db/schema';

export type MatchOutcome = {
  home_team_id: string;
  away_team_id: string;
  home_score: number;
  away_score: number;
  stage: string | null;
};

export function isKnockoutStage(stage: string | null): boolean {
  return !!stage && stage !== 'Group';
}

/** Fixed official results — mock ingest must not overwrite these. */
const OFFICIAL_FINAL_SCORES: Record<string, { home: number; away: number }> = {
  'm-w26-ga-1v2': { home: 2, away: 0 },
};

/** Deterministic mock score from match id + elapsed minute (for demo ingest). */
export function mockScoreAtMinute(matchId: string, minute: number): { home: number; away: number } {
  const official = OFFICIAL_FINAL_SCORES[matchId];
  if (official) {
    if (minute >= 67) return official;
    if (minute >= 9) return { home: 1, away: 0 };
    return { home: 0, away: 0 };
  }
  let hash = 0;
  for (let i = 0; i < matchId.length; i += 1) {
    hash = (hash * 31 + matchId.charCodeAt(i)) | 0;
  }
  const bias = (Math.abs(hash) % 7) - 3;
  const rate = 0.022 + (Math.abs(hash) % 10) * 0.001;
  const homeBase = Math.floor(minute * rate * (1 + bias * 0.08));
  const awayBase = Math.floor(minute * rate * (1 - bias * 0.08));
  const burst = Math.floor(minute / 20);
  const home = Math.min(6, Math.max(0, homeBase + (burst % 3 === 0 ? 1 : 0)));
  const away = Math.min(6, Math.max(0, awayBase + (burst % 5 === 0 ? 1 : 0)));
  return { home, away };
}

export function resolveWinnerTeamId(match: MatchOutcome): string | null {
  if (match.home_score > match.away_score) return match.home_team_id;
  if (match.away_score > match.home_score) return match.away_team_id;
  if (isKnockoutStage(match.stage)) {
    // Penalties tie-break (deterministic): home side advances on level scores.
    return match.home_team_id;
  }
  return null;
}

export function resolveLoserTeamId(match: MatchOutcome): string | null {
  const winner = resolveWinnerTeamId(match);
  if (!winner) return null;
  return winner === match.home_team_id ? match.away_team_id : match.home_team_id;
}

export function matchToOutcome(row: MatchRow): MatchOutcome {
  return {
    home_team_id: row.home_team_id,
    away_team_id: row.away_team_id,
    home_score: row.home_score,
    away_score: row.away_score,
    stage: row.stage,
  };
}
