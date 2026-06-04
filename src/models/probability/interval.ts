import type { IntervalKey, IntervalProbability } from './types';

const INTERVALS: IntervalKey[] = ['15', '30', '45', '60', '75', '90'];

export function buildIntervalDistribution(
  lambdaHome: number,
  lambdaAway: number,
  minute: number,
  homeScore: number,
  awayScore: number,
  wdl: { homeWin: number; draw: number; awayWin: number },
): Record<IntervalKey, IntervalProbability> {
  const result = {} as Record<IntervalKey, IntervalProbability>;
  for (const key of INTERVALS) {
    const target = Number(key);
    const elapsed = Math.max(minute, 0);
    const frac = Math.min(1, target / 90);
    const remainingFrac = Math.max(0, (target - elapsed) / 90);
    const rateHome = lambdaHome * frac;
    const rateAway = lambdaAway * frac;
    const scale = 0.85 + remainingFrac * 0.15;
    result[key] = {
      homeWinProb: clamp(wdl.homeWin * scale + (homeScore > awayScore ? 0.05 : 0)),
      drawProb: clamp(wdl.draw * scale),
      awayWinProb: clamp(wdl.awayWin * scale + (awayScore > homeScore ? 0.05 : 0)),
      expectedHomeGoals: rateHome + homeScore * (target <= elapsed ? 1 : 0.3),
      expectedAwayGoals: rateAway + awayScore * (target <= elapsed ? 1 : 0.3),
    };
    const sum = result[key].homeWinProb + result[key].drawProb + result[key].awayWinProb;
    result[key].homeWinProb /= sum;
    result[key].drawProb /= sum;
    result[key].awayWinProb /= sum;
  }
  return result;
}

function clamp(v: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, v));
}
