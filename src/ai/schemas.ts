import { z } from 'zod';

/** Plain string (legacy) or bilingual { vi, en } — Vietnamese first in UI */
export const LocalizedStringSchema = z.union([
  z.string(),
  z.object({ vi: z.string(), en: z.string() }),
]);

export const TacticalBriefingSchema = z.object({
  matchId: z.string(),
  generatedAt: z.string(),
  summary: LocalizedStringSchema,
  tacticalThemes: z.array(
    z.object({
      title: LocalizedStringSchema,
      detail: LocalizedStringSchema,
      confidence: z.number().min(0).max(1),
      supportingSources: z.array(z.string()),
    }),
  ),
  collectiveTeamFactors: z.array(
    z.object({
      teamId: z.string(),
      factor: LocalizedStringSchema,
      explanation: LocalizedStringSchema,
      direction: z.enum(['positive', 'negative', 'neutral']),
      confidence: z.number().min(0).max(1),
    }),
  ),
  lineupRisks: z.array(
    z.object({
      teamId: z.string(),
      playerId: z.string().optional(),
      risk: LocalizedStringSchema,
      confidence: z.number().min(0).max(1),
    }),
  ),
  keyPlayers: z.array(
    z.object({
      playerId: z.string(),
      reason: LocalizedStringSchema,
      impactArea: LocalizedStringSchema,
      confidence: z.number().min(0).max(1),
    }),
  ),
  probabilityExplanation: z.array(LocalizedStringSchema),
  uncertaintyNotes: z.array(LocalizedStringSchema),
  citations: z.array(
    z.object({
      sourceDocumentId: z.string(),
      title: z.string().optional(),
      sourceName: z.string(),
      sourceUrl: z.string().optional(),
      reliabilityScore: z.number().min(0).max(1),
    }),
  ),
});

export type TacticalBriefing = z.infer<typeof TacticalBriefingSchema>;
