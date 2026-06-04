import type { AppEnv } from '../env';
import { isGatewayConfigured, gatewayChatJson } from './gatewayClient';
import { ModelVsMarketExplanationSchema } from './intelligenceSchemas';
import type { ModelVsMarketResult } from '../market/types';
import { MARKET_DISCLAIMER } from '../market/types';

function engineBackedExplanation(data: ModelVsMarketResult, summary: string) {
  return ModelVsMarketExplanationSchema.parse({
    matchId: data.matchId,
    summary,
    keyDifferences: (['home', 'draw', 'away'] as const).map((selection) => ({
      selection,
      modelProbability: data.model[selection],
      marketProbability: data.market[selection],
      delta: data.edge[selection],
      explanation: 'Probability signal delta for analytical context.',
    })),
    uncertaintyNotes: ['Outcomes remain uncertain until kickoff.'],
    sourceConfidenceSummary: `Source reliability ~${(data.sourceReliability * 100).toFixed(0)}%.`,
    disclaimer: MARKET_DISCLAIMER,
  });
}

export async function explainModelVsMarket(env: AppEnv, data: ModelVsMarketResult) {
  const defaultSummary =
    'Model and market-implied probabilities differ. Review deltas below for analytical context.';

  if (!isGatewayConfigured(env)) {
    return engineBackedExplanation(data, defaultSummary);
  }

  try {
    const raw = await gatewayChatJson<{ summary?: string }>(env, 'tactical_briefing', [
      {
        role: 'system',
        content:
          'Explain model vs market comparison in one short summary string only. Never recommend wagering. Do not output numeric probabilities.',
      },
      {
        role: 'user',
        content: JSON.stringify(data),
      },
    ]);
    const summary =
      typeof raw?.summary === 'string' && raw.summary.trim()
        ? raw.summary.trim()
        : defaultSummary;
    return engineBackedExplanation(data, summary);
  } catch {
    return engineBackedExplanation(data, defaultSummary);
  }
}
