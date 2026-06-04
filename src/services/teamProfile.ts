import type { TeamRow } from '../db/schema';

const KNOWN_TEAMS = new Set([
  'team-usa',
  'team-mex',
  'team-arg',
  'team-bra',
  'team-fra',
  'team-eng',
]);

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Deterministic profile so placeholder teams are not all identical */
export function deriveTeamProfile(teamId: string): {
  elo_rating: number;
  collective_strength_rating: number;
  fifa_ranking: number;
} {
  const h = hashString(teamId);
  return {
    elo_rating: 1580 + (h % 380),
    collective_strength_rating: 0.52 + (h % 36) / 100,
    fifa_ranking: 8 + (h % 85),
  };
}

export function isPlaceholderTeam(team: TeamRow): boolean {
  if (KNOWN_TEAMS.has(team.id)) return false;
  if ((team.elo_rating ?? 0) > 1550 && (team.collective_strength_rating ?? 0) > 0.55) return false;
  return (team.elo_rating ?? 1500) <= 1505 && (team.collective_strength_rating ?? 0.5) <= 0.52;
}

export function applyEffectiveTeamProfile(team: TeamRow): TeamRow {
  if (!isPlaceholderTeam(team)) return team;
  const derived = deriveTeamProfile(team.id);
  return {
    ...team,
    elo_rating: derived.elo_rating,
    collective_strength_rating: derived.collective_strength_rating,
    fifa_ranking: team.fifa_ranking && team.fifa_ranking < 90 ? team.fifa_ranking : derived.fifa_ranking,
  };
}
