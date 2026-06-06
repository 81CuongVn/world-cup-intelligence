import type { AppEnv } from '../../../env';
import { logInfo } from '../../../utils/logger';

export async function runScenarioBacktest(env: AppEnv, tournamentYear: number): Promise<void> {
  const { results } = await env.DB.prepare(
    `SELECT id FROM matches m
     JOIN tournaments t ON t.id = m.tournament_id
     WHERE t.year = ? AND m.status = 'completed'
     LIMIT 20`,
  )
    .bind(tournamentYear)
    .all<{ id: string }>();

  const ids = (results ?? []).map((r) => r.id);
  logInfo('scenario backtest queued', { tournamentYear, sample: ids.length });
  await env.R2_ARTIFACTS.put(
    `backtests/scenarios/${tournamentYear}-${Date.now()}.json`,
    JSON.stringify({ tournamentYear, matchIds: ids, status: 'stub' }),
    { httpMetadata: { contentType: 'application/json' } },
  );
}
