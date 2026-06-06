import type { AppEnv } from '../env';
import { ScenarioExplanationSchema } from './intelligenceSchemas';

export async function explainScenarioLikelihood(
  env: AppEnv,
  data: { matchId: string; scenarios: { scenarioType: string; probability: number }[] } | null,
) {
  if (!data) return null;
  return ScenarioExplanationSchema.parse({
    matchId: data.matchId,
    summary: 'Scenario likelihood summary from statistical engine outputs.',
    highlights: data.scenarios.slice(0, 5).map((s) => ({
      scenarioType: s.scenarioType,
      narrative: `Scenario likelihood ${(s.probability * 100).toFixed(1)}% — model estimate only.`,
    })),
    uncertaintyNotes: ['Scenario paths are not guaranteed outcomes.'],
    disclaimer: 'Scenario likelihoods are analytical estimates, not predictions of certainty.',
  });
}
