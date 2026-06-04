import type { LineupFeatures } from './types';

export function lineupModifier(lineup?: LineupFeatures): number {
  if (!lineup) return 0.97;
  const missingPenalty = lineup.missingKeyRoles.length * 0.04;
  return Math.max(0.75, lineup.strengthModifier - missingPenalty);
}
