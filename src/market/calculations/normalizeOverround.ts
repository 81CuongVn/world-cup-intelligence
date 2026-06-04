export function normalizeMarketProbabilities(probabilities: Record<string, number>): {
  normalized: Record<string, number>;
  overround: number;
} {
  const total = Object.values(probabilities).reduce((sum, value) => sum + value, 0);

  if (!Number.isFinite(total) || total <= 0) {
    throw new Error('Invalid probability total');
  }

  const normalized = Object.fromEntries(
    Object.entries(probabilities).map(([key, value]) => [key, value / total]),
  );

  return {
    normalized,
    overround: total - 1,
  };
}
