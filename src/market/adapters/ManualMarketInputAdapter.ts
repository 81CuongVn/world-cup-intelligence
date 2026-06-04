import type { MarketDataAdapter } from './MarketDataAdapter';
import type { MarketOddsRawResult } from '../types';

/** Reads latest manual odds from D1 via service layer — adapter returns empty by default. */
export class ManualMarketInputAdapter implements MarketDataAdapter {
  sourceId = 'mkt-manual';
  sourceType = 'manual_analyst_input' as const;

  async fetchMatchMarkets(_matchId: string): Promise<MarketOddsRawResult[]> {
    return [];
  }
}
