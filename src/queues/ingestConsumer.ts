import type { IngestJob } from './types';
import type { AppEnv } from '../env';
import { BULK_RECOMPUTE_KV_KEY } from '../constants/pipeline';
import { logInfo } from '../utils/logger';
import { refreshMatchData, handleCompletedMatches } from '../ingestion/matchDataRefresh';
import { crawlWorldCupNews } from '../ingestion/newsCrawler';
import { recomputeAllWc2026Matches, recomputeMatchProbability } from '../services/recomputeMatch';
import { processMatchCompletion } from '../services/tournamentProgression';

async function runBulkRecomputeIfPending(env: AppEnv): Promise<boolean> {
  const bulkPending = await env.KV.get(BULK_RECOMPUTE_KV_KEY);
  if (bulkPending !== '1') return false;
  const result = await recomputeAllWc2026Matches(env);
  await env.KV.delete(BULK_RECOMPUTE_KV_KEY);
  logInfo('bulk wc2026 recompute finished', {
    total: result.total,
    recomputed: result.recomputed,
    failed: result.failed.length,
  });
  return true;
}

export async function handleIngestBatch(
  batch: MessageBatch<IngestJob>,
  env: AppEnv,
): Promise<void> {
  for (const msg of batch.messages) {
    try {
      switch (msg.body.type) {
        case 'refresh_minute': {
          if (await runBulkRecomputeIfPending(env)) break;

          const { updatedIds, completedIds } = await refreshMatchData(env);

          if (completedIds.length) {
            await handleCompletedMatches(env, completedIds);
            if (await runBulkRecomputeIfPending(env)) break;
          }

          const recomputeIds =
            updatedIds.length > 0
              ? updatedIds
              : completedIds.length > 0
                ? []
                : (
                    await env.DB.prepare(
                      `SELECT id FROM matches
                       WHERE tournament_id = 't-2026' AND status IN ('scheduled', 'live')
                       ORDER BY kickoff_utc ASC LIMIT 8`,
                    ).all<{ id: string }>()
                  ).results?.map((r) => r.id) ?? [];

          if (recomputeIds.length && env.MODEL_QUEUE) {
            await env.MODEL_QUEUE.send({ type: 'recompute_all', matchIds: recomputeIds });
          } else if (recomputeIds.length) {
            for (const id of recomputeIds) await recomputeMatchProbability(env, id);
          }
          break;
        }
        case 'match_complete': {
          await processMatchCompletion(env, msg.body.matchId);
          await runBulkRecomputeIfPending(env);
          break;
        }
        case 'crawl_news': {
          const count = await crawlWorldCupNews(env);
          if (count > 0 && env.MODEL_QUEUE) {
            const { results } = await env.DB.prepare(
              `SELECT id FROM matches WHERE status IN ('scheduled', 'live') LIMIT 5`,
            ).all<{ id: string }>();
            for (const m of results ?? []) {
              await env.MODEL_QUEUE.send({ type: 'ai_briefing', matchId: m.id });
            }
          }
          break;
        }
        default:
          logInfo('ingest job noop', { job_id: msg.body.idempotencyKey });
      }
      msg.ack();
    } catch (e) {
      logInfo('ingest retry', { error: String(e) });
      msg.retry();
    }
  }
}
