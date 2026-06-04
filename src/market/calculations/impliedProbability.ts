export function decimalOddsToImpliedProbability(odds: number): number {
  if (!Number.isFinite(odds) || odds <= 1) {
    throw new Error('Invalid decimal odds');
  }
  return 1 / odds;
}
