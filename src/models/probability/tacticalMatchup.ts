import type { LineupFeatures } from './types';

export function tacticalMatchupModifier(home?: LineupFeatures, away?: LineupFeatures): { home: number; away: number } {
  const homeForm = home?.formation ?? '4-3-3';
  const awayForm = away?.formation ?? '4-3-3';
  let homeMod = 1;
  let awayMod = 1;
  if (homeForm.includes('3') && awayForm.includes('4')) {
    homeMod *= 1.03;
    awayMod *= 0.98;
  }
  if (homeForm.includes('5') && awayForm.includes('3')) {
    homeMod *= 0.97;
    awayMod *= 1.02;
  }
  return { home: homeMod, away: awayMod };
}
