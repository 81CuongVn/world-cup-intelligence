import type { AppEnv } from '../../env';
import { nowIso } from '../../utils/time';
import { getMarketAdapters } from '../marketSourceRegistry';
import { normalizeRawMarketBatch } from '../normalization/normalizeMarketOdds';
import * as marketRepo from '../../db/repositories/marketRepo';
import type { MarketOddsRawResult } from '../types';

export async function ingestMatchMarkets(env: AppEnv, matchId: string): Promise<number> {
  const adapters = getMarketAdapters(env);
  let stored = 0;

  for (const adapter of adapters) {
    const raw = await adapter.fetchMatchMarkets(matchId);
    if (!raw.length) continue;

    const r2Key = `market/raw/${adapter.sourceId}/${matchId}/${nowIso()}.json`;
    await env.R2_RAW.put(r2Key, JSON.stringify(raw), {
      httpMetadata: { contentType: 'application/json' },
    });

    const normalized = normalizeRawMarketBatch(adapter.sourceId, r2Key, raw);
    if (normalized.length) {
      await marketRepo.saveMarketOddsBatch(env.DB, normalized);
      stored += normalized.length;
    }
  }

  return stored;
}

export async function ingestManualMarketInput(
  env: AppEnv,
  matchId: string,
  odds: { home: number; draw: number; away: number },
): Promise<number> {
  const retrievedAt = nowIso();
  const raw: MarketOddsRawResult[] = [
    {
      matchId,
      marketType: 'match_winner',
      selection: 'home',
      oddsDecimal: odds.home,
      retrievedAt,
      rawPayload: { manual: true },
    },
    {
      matchId,
      marketType: 'match_winner',
      selection: 'draw',
      oddsDecimal: odds.draw,
      retrievedAt,
      rawPayload: { manual: true },
    },
    {
      matchId,
      marketType: 'match_winner',
      selection: 'away',
      oddsDecimal: odds.away,
      retrievedAt,
      rawPayload: { manual: true },
    },
  ];

  const r2Key = `market/raw/mkt-manual/${matchId}/${retrievedAt}.json`;
  await env.R2_RAW.put(r2Key, JSON.stringify(raw), {
    httpMetadata: { contentType: 'application/json' },
  });

  const normalized = normalizeRawMarketBatch('mkt-manual', r2Key, raw);
  await marketRepo.saveMarketOddsBatch(env.DB, normalized);
  return normalized.length;
}
