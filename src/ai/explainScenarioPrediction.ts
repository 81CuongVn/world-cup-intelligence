import { z } from 'zod';
import type { AppEnv } from '../env';
import type { MatchPredictionScenario } from '../models/scenarios/types';
import { ScenarioExplanationSchema } from './intelligenceSchemas';

export const ScenarioPredictionExplanationSchema = ScenarioExplanationSchema.extend({
  whyThisScenarioMatters: z.string(),
});

export async function explainScenarioPrediction(
  _env: AppEnv,
  matchId: string,
  scenario: MatchPredictionScenario,
) {
  const explanation = {
    matchId,
    scenarioId: scenario.id,
    summary: `${scenario.scenarioName} has a scenario likelihood of ${(scenario.scenarioProbability * 100).toFixed(1)}% with model confidence ${(scenario.scenarioConfidence * 100).toFixed(0)}%.`,
    whyThisScenarioMatters: scenario.keyDrivers[0] ?? 'This tactical path reflects current team-system inputs.',
    keyDrivers: scenario.keyDrivers,
    riskFactors: scenario.riskFactors,
    uncertaintyNotes: [
      'Probabilities are analytical context only — not betting advice.',
      scenario.featureSelection.missingInputs.length
        ? `Missing inputs may reduce confidence: ${scenario.featureSelection.missingInputs.join(', ')}`
        : 'Input coverage is sufficient for this scenario path.',
    ],
    sourceConfidenceSummary: `Model confidence ${(scenario.scenarioConfidence * 100).toFixed(0)}% based on available inputs.`,
    highlights: [
      {
        scenarioType: scenario.scenarioType,
        narrative: `${scenario.scenarioName}: H ${(scenario.homeWinProb * 100).toFixed(0)}% / D ${(scenario.drawProb * 100).toFixed(0)}% / A ${(scenario.awayWinProb * 100).toFixed(0)}%.`,
      },
    ],
    disclaimer: 'Scenario likelihoods are model estimates — analytical context only.',
  };

  return ScenarioPredictionExplanationSchema.parse(explanation);
}
