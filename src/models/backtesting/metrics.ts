export function brierScore(predicted: number[], actual: number[]): number {
  if (predicted.length !== actual.length) return 1;
  let sum = 0;
  for (let i = 0; i < predicted.length; i++) {
    sum += (predicted[i] - actual[i]) ** 2;
  }
  return sum / predicted.length;
}

export function logLoss(probs: number[], outcomeIndex: number): number {
  const p = Math.max(1e-15, probs[outcomeIndex] ?? 1e-15);
  return -Math.log(p);
}
