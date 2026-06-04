export type MarketSourceType =
  | 'licensed_odds_api'
  | 'partner_feed'
  | 'manual_analyst_input'
  | 'compliant_public_api';

export type MarketSelection = 'home' | 'draw' | 'away';

export type MarketOddsRawResult = {
  matchId: string;
  marketType: string;
  selection: MarketSelection;
  oddsDecimal: number;
  lineValue?: number | null;
  retrievedAt: string;
  rawPayload: unknown;
};

export type NormalizedMarketOdds = {
  matchId: string;
  sourceId: string;
  marketType: string;
  selection: MarketSelection;
  oddsDecimal: number;
  impliedProbability: number;
  normalizedProbability: number;
  overround: number;
  lineValue?: number | null;
  retrievedAt: string;
  rawR2Key: string;
};

export type ModelVsMarketResult = {
  matchId: string;
  model: { home: number; draw: number; away: number };
  market: { home: number; draw: number; away: number };
  edge: { home: number; draw: number; away: number };
  volatilityScore: number;
  sourceId: string;
  sourceName: string;
  sourceReliability: number;
  retrievedAt: string | null;
  disclaimer: string;
};

export const MARKET_DISCLAIMER =
  'Market signals are shown for analytical context only and are not betting advice.';
