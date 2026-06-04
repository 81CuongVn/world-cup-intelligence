import { decimalOddsToImpliedProbability } from '../calculations/impliedProbability';
import { normalizeMarketProbabilities } from '../calculations/normalizeOverround';
import type { MarketOddsRawResult, NormalizedMarketOdds } from '../types';

export function normalizeRawMarketBatch(
  sourceId: string,
  rawR2Key: string,
  rows: MarketOddsRawResult[],
): NormalizedMarketOdds[] {
  const matchId = rows[0]?.matchId;
  if (!matchId) return [];

  const implied: Record<string, number> = {};
  const meta = new Map<string, MarketOddsRawResult>();

  for (const row of rows) {
    if (row.marketType !== 'match_winner') continue;
    implied[row.selection] = decimalOddsToImpliedProbability(row.oddsDecimal);
    meta.set(row.selection, row);
  }

  if (Object.keys(implied).length < 2) return [];

  const { normalized, overround } = normalizeMarketProbabilities(implied);

  return (['home', 'draw', 'away'] as const)
    .filter((s) => normalized[s] != null && meta.has(s))
    .map((selection) => {
      const row = meta.get(selection)!;
      return {
        matchId,
        sourceId,
        marketType: row.marketType,
        selection,
        oddsDecimal: row.oddsDecimal,
        impliedProbability: implied[selection]!,
        normalizedProbability: normalized[selection]!,
        overround,
        lineValue: row.lineValue ?? null,
        retrievedAt: row.retrievedAt,
        rawR2Key,
      };
    });
}
