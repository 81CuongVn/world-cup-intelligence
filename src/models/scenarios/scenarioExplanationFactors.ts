import type { MatchPredictionScenario } from './types';

export function buildScenarioExplanationFactors(scenario: MatchPredictionScenario): string[] {
  return [
    ...scenario.keyDrivers.slice(0, 2),
    `Scenario likelihood ${(scenario.scenarioProbability * 100).toFixed(1)}% with model confidence ${(scenario.scenarioConfidence * 100).toFixed(0)}%.`,
    `Conditional W/D/L: ${(scenario.homeWinProb * 100).toFixed(0)}/${(scenario.drawProb * 100).toFixed(0)}/${(scenario.awayWinProb * 100).toFixed(0)}.`,
  ];
}
