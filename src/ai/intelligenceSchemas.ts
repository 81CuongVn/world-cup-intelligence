import { z } from 'zod';

export const ModelVsMarketExplanationSchema = z.object({
  matchId: z.string(),
  summary: z.string(),
  keyDifferences: z.array(
    z.object({
      selection: z.enum(['home', 'draw', 'away']),
      modelProbability: z.number(),
      marketProbability: z.number(),
      delta: z.number(),
      explanation: z.string(),
    }),
  ),
  uncertaintyNotes: z.array(z.string()),
  sourceConfidenceSummary: z.string(),
  disclaimer: z.string(),
});

export const ScenarioExplanationSchema = z.object({
  matchId: z.string(),
  highlights: z.array(
    z.object({
      scenarioType: z.string(),
      narrative: z.string(),
    }),
  ),
  uncertaintyNotes: z.array(z.string()),
  disclaimer: z.string(),
});

export const TeamSystemExplanationSchema = z.object({
  matchId: z.string(),
  homeSummary: z.string(),
  awaySummary: z.string(),
  comparison: z.string(),
  uncertaintyNotes: z.array(z.string()),
  disclaimer: z.string(),
});
