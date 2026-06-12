import type { CoachFeatures, RefereeFeatures } from './types';

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Head-coach experience, tactical index, and home-nation familiarity. */
export function coachModifier(
  home?: CoachFeatures,
  away?: CoachFeatures,
): { home: number; away: number } {
  const side = (c?: CoachFeatures): number => {
    if (!c) return 1;
    let m = 1 + (c.tacticalRating - 0.72) * 0.18;
    if (c.wcAppearances >= 2) m += 0.022;
    if (c.tenureYears >= 4) m += 0.018;
    else if (c.tenureYears >= 2) m += 0.01;
    if (c.homeNationMatch) m += 0.022;
    return clamp(m, 0.94, 1.1);
  };
  return { home: side(home), away: side(away) };
}

/**
 * Strict referees slightly amplify pre-match edge for the higher-ranked side
 * (card risk for aggressive underdogs — observed in Mexico 2-0 SA with 3 reds).
 */
export function refereeModifier(
  ref: RefereeFeatures | undefined,
  homeFifaRank: number,
  awayFifaRank: number,
): { home: number; away: number } {
  if (!ref) return { home: 1, away: 1 };
  const gap = awayFifaRank - homeFifaRank;
  if (gap < 20) return { home: 1, away: 1 };

  const strictDelta = (ref.strictness - 0.5) * 0.06;
  return {
    home: clamp(1 + strictDelta, 1, 1.06),
    away: clamp(1 - strictDelta * 1.15, 0.9, 1),
  };
}
