import type { LineupFeatures } from './types';

export function tacticalMatchupModifier(home?: LineupFeatures, away?: LineupFeatures): { home: number; away: number } {
  const homeForm = home?.formation ?? '4-3-3';
  const awayForm = away?.formation ?? '4-3-3';
  let homeMod = 1;
  let awayMod = 1;

  const homeAttacking = homeForm.startsWith('4-3') || homeForm.startsWith('3-');
  const awayLowBlock = awayForm.startsWith('5-') || awayForm.startsWith('5-3') || awayForm.startsWith('5-4');

  if (homeAttacking && awayLowBlock) {
    homeMod *= 1.05;
    awayMod *= 0.88;
  } else if (homeForm.includes('3') && awayForm.includes('4')) {
    homeMod *= 1.03;
    awayMod *= 0.98;
  } else if (homeForm.includes('5') && awayForm.includes('3')) {
    homeMod *= 0.97;
    awayMod *= 1.02;
  }

  if (awayLowBlock) {
    awayMod *= 0.95;
  }

  return { home: homeMod, away: awayMod };
}
