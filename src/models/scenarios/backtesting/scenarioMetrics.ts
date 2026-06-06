export type ScenarioMetrics = {
  scenarioHitRate: number;
  scenarioBrierScore: number;
  scenarioCalibrationError: number;
  scenarioRankAccuracy: number;
};

export function aggregateScenarioMetrics(samples: ScenarioMetrics[]): ScenarioMetrics {
  if (!samples.length) {
    return {
      scenarioHitRate: 0,
      scenarioBrierScore: 0,
      scenarioCalibrationError: 0,
      scenarioRankAccuracy: 0,
    };
  }
  const n = samples.length;
  return {
    scenarioHitRate: samples.reduce((s, x) => s + x.scenarioHitRate, 0) / n,
    scenarioBrierScore: samples.reduce((s, x) => s + x.scenarioBrierScore, 0) / n,
    scenarioCalibrationError: samples.reduce((s, x) => s + x.scenarioCalibrationError, 0) / n,
    scenarioRankAccuracy: samples.reduce((s, x) => s + x.scenarioRankAccuracy, 0) / n,
  };
}
