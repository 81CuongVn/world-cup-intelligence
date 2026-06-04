import type { AppEnv } from '../env';
import type { IngestJob } from '../queues/types';
import { BULK_RECOMPUTE_KV_KEY } from '../constants/pipeline';
import { logInfo } from '../utils/logger';
import { recomputeAllWc2026Matches } from '../services/recomputeMatch';

export async function handleScheduledCron(env: AppEnv, cron: string): Promise<void> {
  const bulkPending = await env.KV.get(BULK_RECOMPUTE_KV_KEY);
  if (bulkPending === '1') {
    const result = await recomputeAllWc2026Matches(env);
    await env.KV.delete(BULK_RECOMPUTE_KV_KEY);
    logInfo('bulk wc2026 recompute finished', {
      total: result.total,
      recomputed: result.recomputed,
      failed: result.failed.length,
    });
    return;
  }

  if (cron === '* * * * *' || cron === 'every-minute') {
    const job: IngestJob = { type: 'refresh_minute', idempotencyKey: crypto.randomUUID() };
    await env.INGEST_QUEUE?.send(job);
    logInfo('scheduled minute refresh enqueued');
    return;
  }
  if (cron === '*/15 * * * *' || cron === 'every-15-min') {
    const job: IngestJob = { type: 'crawl_news', idempotencyKey: crypto.randomUUID() };
    await env.INGEST_QUEUE?.send(job);
    logInfo('scheduled news crawl enqueued');
  }
}
