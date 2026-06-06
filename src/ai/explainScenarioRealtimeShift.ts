import { z } from 'zod';
import type { AppEnv } from '../env';

export const ScenarioRealtimeShiftSchema = z.object({
  matchId: z.string(),
  summary: z.string(),
  deltaNotes: z.array(z.string()),
  uncertaintyNotes: z.array(z.string()),
  disclaimer: z.string(),
});

export async function explainScenarioRealtimeShift(
  _env: AppEnv,
  input: { matchId: string; updateReason: string; deltaPct: number },
) {
  return ScenarioRealtimeShiftSchema.parse({
    matchId: input.matchId,
    summary: `Scenario likelihood shifted by ${(input.deltaPct * 100).toFixed(1)} percentage points after ${input.updateReason}.`,
    deltaNotes: [`Update reason: ${input.updateReason}`],
    uncertaintyNotes: ['Live updates may be noisy until more events are observed.'],
    disclaimer: 'Realtime scenario shifts are analytical context only.',
  });
}
