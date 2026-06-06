import type { MatchPredictionScenario, ScenarioComparison } from './types';

export function compareScenarios(scenarios: MatchPredictionScenario[]): ScenarioComparison {
  const sorted = [...scenarios].sort((a, b) => b.scenarioProbability - a.scenarioProbability);
  const primary = sorted.find((s) => s.isBaseline) ?? sorted[0];
  const alternative =
    sorted.find((s) => s.id !== primary.id && !s.isBaseline) ??
    sorted.find((s) => s.id !== primary.id) ??
    primary;

  const homeWinDelta = alternative.homeWinProb - primary.homeWinProb;
  const awayWinDelta = alternative.awayWinProb - primary.awayWinProb;
  const drawDelta = alternative.drawProb - primary.drawProb;
  const xgHomeDelta = alternative.expectedHomeGoals - primary.expectedHomeGoals;
  const xgAwayDelta = alternative.expectedAwayGoals - primary.expectedAwayGoals;
  const probabilityGap = primary.scenarioProbability - alternative.scenarioProbability;
  const confidenceGap = primary.scenarioConfidence - alternative.scenarioConfidence;

  const summary =
    probabilityGap >= 0.12
      ? `The baseline scenario remains more likely, but ${alternative.scenarioName.toLowerCase()} materially shifts the ${awayWinDelta > homeWinDelta ? 'away' : 'home'} win probability path.`
      : `Scenario likelihood is tightly balanced between ${primary.scenarioName.toLowerCase()} and ${alternative.scenarioName.toLowerCase()}.`;

  const keyDifferences = [
    `Scenario likelihood gap: ${(probabilityGap * 100).toFixed(1)} percentage points`,
    `Home win delta: ${(homeWinDelta * 100).toFixed(1)} pp`,
    `Away win delta: ${(awayWinDelta * 100).toFixed(1)} pp`,
    `xG delta: ${xgHomeDelta.toFixed(2)} / ${xgAwayDelta.toFixed(2)}`,
    `Most likely score: ${primary.mostLikelyScore} vs ${alternative.mostLikelyScore}`,
  ];

  return {
    primaryScenarioId: primary.id,
    alternativeScenarioId: alternative.id,
    probabilityGap,
    confidenceGap,
    summary,
    keyDifferences,
    homeWinDelta,
    drawDelta,
    awayWinDelta,
    xgHomeDelta,
    xgAwayDelta,
  };
}
