import type { MarketOddsRawResult, MarketSourceType } from '../types';

export interface MarketDataAdapter {
  sourceId: string;
  sourceType: MarketSourceType;
  fetchMatchMarkets(matchId: string): Promise<MarketOddsRawResult[]>;
}
