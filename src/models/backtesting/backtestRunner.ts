import { brierScore, logLoss } from './metrics';

const HISTORICAL_YEARS = [2006, 2010, 2014, 2018, 2022];

export async function runBacktest(db: D1Database) {
  const { results: matches } = await db
    .prepare(
      `SELECT m.*, t.year FROM matches m
       JOIN tournaments t ON t.id = m.tournament_id
       WHERE t.year IN (${HISTORICAL_YEARS.join(',')}) AND m.status = 'completed'`,
    )
    .all();

  const rows = matches ?? [];
  let brierSum = 0;
  let logLossSum = 0;
  let count = 0;

  for (const m of rows) {
    const snap = await db
      .prepare('SELECT * FROM probability_snapshots WHERE match_id = ? ORDER BY minute ASC LIMIT 1')
      .bind((m as { id: string }).id)
      .first<{ home_win_prob: number; draw_prob: number; away_win_prob: number }>();
    if (!snap) continue;
    const home = (m as { home_score: number }).home_score;
    const away = (m as { away_score: number }).away_score;
    const actual = home > away ? [1, 0, 0] : home === away ? [0, 1, 0] : [0, 0, 1];
    const predicted = [snap.home_win_prob, snap.draw_prob, snap.away_win_prob];
    brierSum += brierScore(predicted, actual);
    logLossSum += logLoss(predicted, actual.indexOf(1));
    count++;
  }

  const metrics = {
    tournaments: HISTORICAL_YEARS,
    matchCount: count,
    brierScore: count ? brierSum / count : null,
    logLoss: count ? logLossSum / count : null,
    scorelineTop1: null,
    calibrationBuckets: [],
  };

  await db
    .prepare(
      `INSERT INTO model_runs (id, model_name, model_version, run_type, metrics_json, status)
       VALUES (?, 'wc-prob', 'wc-prob-v1', 'backtest', ?, 'completed')`,
    )
    .bind(`backtest-${Date.now()}`, JSON.stringify(metrics))
    .run();

  return metrics;
}
