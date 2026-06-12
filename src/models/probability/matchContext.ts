import type { MatchFeatureInput } from './types';

/** Co-host nations — WC2026 */
const WC2026_HOST_COUNTRY_CODES = new Set(['MX', 'US', 'CA']);

export function isWc2026HostTeam(countryCode?: string | null): boolean {
  return !!countryCode && WC2026_HOST_COUNTRY_CODES.has(countryCode.toUpperCase());
}

/** Home-field / host-nation lift; away slight suppression at co-host venues. */
export function matchContextModifier(input: MatchFeatureInput): { home: number; away: number } {
  let home = 1;
  let away = 1;

  if (input.tournamentYear >= 2026 && input.isHomeHost) {
    home *= 1.07;
    away *= 0.96;
  } else if (input.tournamentYear >= 2026) {
    home *= 1.03;
  }

  if (input.stage === 'Group' && input.tournamentYear >= 2026) {
    home *= 1.01;
  }

  return { home, away };
}

/** Widen lambda gap when FIFA ranking gap is large (e.g. Mexico #15 vs South Africa #61). */
export function rankingGapModifier(
  home: MatchFeatureInput['homeTeam'],
  away: MatchFeatureInput['awayTeam'],
): { home: number; away: number } {
  const gap = away.fifaRanking - home.fifaRanking;
  if (gap <= 8) return { home: 1, away: 1 };
  const boost = Math.min(0.11, gap * 0.0022);
  let homeMod = 1 + boost;
  let awayMod = Math.max(0.72, 1 - boost * 0.85);

  if (gap >= 35) {
    homeMod *= 1.03;
    awayMod *= 0.78;
  }

  return { home: homeMod, away: awayMod };
}
