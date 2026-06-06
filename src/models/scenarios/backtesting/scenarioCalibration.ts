export function scenarioCalibrationError(predicted: number[], observed: number[]): number {
  if (!predicted.length || predicted.length !== observed.length) return 1;
  const n = predicted.length;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += Math.abs(predicted[i] - observed[i]);
  return sum / n;
}

export function scenarioBrierScore(predicted: number, observed: number): number {
  return (predicted - observed) ** 2;
}
