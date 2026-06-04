import type { NormalizedMarketOdds } from '../../market/types';
import { newId } from '../../utils/ids';

export async function saveMarketOddsBatch(db: D1Database, rows: NormalizedMarketOdds[]): Promise<void> {
  for (const row of rows) {
    await db
      .prepare(
        `INSERT INTO market_odds_snapshots (
          id, match_id, source_id, market_type, selection, odds_decimal,
          implied_probability, normalized_probability, overround, line_value, retrieved_at, raw_r2_key
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        newId('mos'),
        row.matchId,
        row.sourceId,
        row.marketType,
        row.selection,
        row.oddsDecimal,
        row.impliedProbability,
        row.normalizedProbability,
        row.overround,
        row.lineValue ?? null,
        row.retrievedAt,
        row.rawR2Key,
      )
      .run();
  }
}

export async function saveMarketSignalAnalysis(
  db: D1Database,
  matchId: string,
  data: {
    model: { home: number; draw: number; away: number };
    market: { home: number; draw: number; away: number };
    edge: { home: number; draw: number; away: number };
    volatilityScore: number;
    explanationJson?: string;
  },
): Promise<string> {
  const id = newId('msa');
  await db
    .prepare(
      `INSERT INTO market_signal_analysis (
        id, match_id, model_home_prob, model_draw_prob, model_away_prob,
        market_home_prob, market_draw_prob, market_away_prob,
        edge_home, edge_draw, edge_away, volatility_score, explanation_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      matchId,
      data.model.home,
      data.model.draw,
      data.model.away,
      data.market.home,
      data.market.draw,
      data.market.away,
      data.edge.home,
      data.edge.draw,
      data.edge.away,
      data.volatilityScore,
      data.explanationJson ?? null,
    )
    .run();
  return id;
}

export async function getLatestMarketSignal(db: D1Database, matchId: string) {
  return db
    .prepare(`SELECT * FROM market_signal_analysis WHERE match_id = ? ORDER BY created_at DESC LIMIT 1`)
    .bind(matchId)
    .first<Record<string, unknown>>();
}

export async function getLatestMarketOdds(db: D1Database, matchId: string) {
  const { results } = await db
    .prepare(
      `SELECT * FROM market_odds_snapshots WHERE match_id = ? ORDER BY retrieved_at DESC LIMIT 6`,
    )
    .bind(matchId)
    .all<Record<string, unknown>>();
  return results ?? [];
}
