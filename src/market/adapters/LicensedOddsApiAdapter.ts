import type { MarketDataAdapter } from './MarketDataAdapter';
import type { MarketOddsRawResult } from '../types';

/** Placeholder for licensed partner API — configure via KV + secrets. */
export class LicensedOddsApiAdapter implements MarketDataAdapter {
  constructor(
    public sourceId: string,
    private apiBaseUrl: string | null,
  ) {}

  sourceType = 'licensed_odds_api' as const;

  async fetchMatchMarkets(_matchId: string): Promise<MarketOddsRawResult[]> {
    if (!this.apiBaseUrl) return [];
    return [];
  }
}
