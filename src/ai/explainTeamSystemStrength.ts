import type { AppEnv } from '../env';
import { TeamSystemExplanationSchema } from './intelligenceSchemas';

export async function explainTeamSystemStrength(
  env: AppEnv,
  data: {
    matchId: string;
    home: { collectiveStrengthScore?: number; tacticalIdentity?: string } | null;
    away: { collectiveStrengthScore?: number; tacticalIdentity?: string } | null;
  } | null,
) {
  if (!data) return null;
  return TeamSystemExplanationSchema.parse({
    matchId: data.matchId,
    homeSummary: data.home
      ? `Collective strength ${((data.home.collectiveStrengthScore ?? 0.5) * 100).toFixed(0)}% — ${data.home.tacticalIdentity ?? 'balanced'}.`
      : 'Home team system profile pending recompute.',
    awaySummary: data.away
      ? `Collective strength ${((data.away.collectiveStrengthScore ?? 0.5) * 100).toFixed(0)}% — ${data.away.tacticalIdentity ?? 'balanced'}.`
      : 'Away team system profile pending recompute.',
    comparison: 'Compare pressing, compactness, and transition scores in the team system panel.',
    uncertaintyNotes: ['Lineup changes can shift collective metrics materially.'],
    disclaimer: 'Team system metrics describe structure — not individual player quality alone.',
  });
}
