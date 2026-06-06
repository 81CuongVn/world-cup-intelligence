import { z } from 'zod';
import type { AppEnv } from '../env';
import type { MatchScenarioSet } from '../models/scenarios/types';

export const ScenarioComparisonExplanationSchema = z.object({
  matchId: z.string(),
  summary: z.string(),
  keyDifferences: z.array(z.string()),
  uncertaintyNotes: z.array(z.string()),
  disclaimer: z.string(),
});

export async function explainScenarioComparison(_env: AppEnv, data: MatchScenarioSet | null) {
  if (!data) {
    return ScenarioComparisonExplanationSchema.parse({
      matchId: '',
      summary: 'No scenario comparison available.',
      keyDifferences: [],
      uncertaintyNotes: ['Insufficient data to compare scenarios.'],
      disclaimer: 'Analytical context only.',
    });
  }

  return ScenarioComparisonExplanationSchema.parse({
    matchId: data.matchId,
    summary: data.comparison.summary,
    keyDifferences: data.comparison.keyDifferences,
    uncertaintyNotes: [
      'Scenario likelihood compares tactical paths — not outcome guarantees.',
      ...data.sourceConfidence.notes,
    ],
    disclaimer: 'Scenario comparison is for analytical context only.',
  });
}
