import type { MarketDataAdapter } from './MarketDataAdapter';
import type { MarketOddsRawResult } from '../types';

/** Compliant public feeds only — no scraping of betting sites. */
export class CompliantPublicOddsAdapter implements MarketDataAdapter {
  constructor(public sourceId: string) {}

  sourceType = 'compliant_public_api' as const;

  async fetchMatchMarkets(_matchId: string): Promise<MarketOddsRawResult[]> {
    return [];
  }
}
