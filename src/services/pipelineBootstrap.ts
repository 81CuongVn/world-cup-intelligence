import type { AppEnv } from '../env';
import type { IngestJob } from '../queues/types';
import {
  NEWS_CRAWL_INTERVAL_SEC,
  NEWS_CRAWL_KV_KEY,
  NEWS_CRAWL_LOCK_KV_KEY,
} from '../constants/pipeline';
import { crawlWorldCupNews } from '../ingestion/newsCrawler';

/** Enqueue refresh if stale — never block read APIs on heavy inline recompute. */
export async function ensurePipelineFresh(env: AppEnv, maxAgeSec = 90): Promise<void> {
  const last = await env.KV.get('meta:last_data_refresh');
  if (last) {
    const age = (Date.now() - new Date(last).getTime()) / 1000;
    if (age < maxAgeSec) return;
  }

  const lock = await env.KV.get('meta:refresh_lock');
  if (lock) return;

  await env.KV.put('meta:refresh_lock', '1', { expirationTtl: 45 });

  if (env.INGEST_QUEUE) {
    const job: IngestJob = { type: 'refresh_minute', idempotencyKey: crypto.randomUUID() };
    await env.INGEST_QUEUE.send(job);
  }
}

/** Enqueue news crawl every ~15 min when cron or queue lags (backup for scheduled job). */
export async function ensureNewsCrawlFresh(
  env: AppEnv,
  maxAgeSec = NEWS_CRAWL_INTERVAL_SEC - 60,
): Promise<void> {
  const last = await env.KV.get(NEWS_CRAWL_KV_KEY);
  if (last) {
    const age = (Date.now() - new Date(last).getTime()) / 1000;
    if (age < maxAgeSec) return;
  }

  const lock = await env.KV.get(NEWS_CRAWL_LOCK_KV_KEY);
  if (lock) return;

  await env.KV.put(NEWS_CRAWL_LOCK_KV_KEY, '1', { expirationTtl: 300 });

  if (env.INGEST_QUEUE) {
    const job: IngestJob = { type: 'crawl_news', idempotencyKey: crypto.randomUUID() };
    await env.INGEST_QUEUE.send(job);
    return;
  }

  await crawlWorldCupNews(env);
}
