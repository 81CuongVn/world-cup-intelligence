// Dixon-Coles adjustment for low-score correlation (rho placeholder)
export function dixonColesAdjust(
  homeGoals: number,
  awayGoals: number,
  prob: number,
  lambdaHome: number,
  lambdaAway: number,
  rho = -0.13,
): number {
  if (homeGoals === 0 && awayGoals === 0) return prob * (1 - lambdaHome * lambdaAway * rho);
  if (homeGoals === 0 && awayGoals === 1) return prob * (1 + lambdaHome * rho);
  if (homeGoals === 1 && awayGoals === 0) return prob * (1 + lambdaAway * rho);
  if (homeGoals === 1 && awayGoals === 1) return prob * (1 - rho);
  return prob;
}
