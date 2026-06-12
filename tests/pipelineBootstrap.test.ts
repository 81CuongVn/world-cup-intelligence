import { describe, expect, it, vi } from 'vitest';
import { ensureNewsCrawlFresh } from '../src/services/pipelineBootstrap';

function mockEnv(opts: {
  lastCrawl?: string | null;
  lock?: string | null;
  queue?: boolean;
}) {
  const kv = new Map<string, string>();
  if (opts.lastCrawl) kv.set('meta:last_news_crawl', opts.lastCrawl);
  if (opts.lock) kv.set('meta:news_crawl_lock', opts.lock);

  const send = vi.fn(async () => undefined);
  return {
    env: {
      KV: {
        get: vi.fn(async (k: string) => kv.get(k) ?? null),
        put: vi.fn(async (k: string, v: string) => {
          kv.set(k, v);
        }),
      },
      INGEST_QUEUE: opts.queue === false ? undefined : { send },
    } as never,
    send,
  };
}

describe('ensureNewsCrawlFresh', () => {
  it('skips when last crawl is recent', async () => {
    const { env, send } = mockEnv({
      lastCrawl: new Date(Date.now() - 5 * 60_000).toISOString(),
      queue: true,
    });
    await ensureNewsCrawlFresh(env);
    expect(send).not.toHaveBeenCalled();
  });

  it('enqueues crawl when stale', async () => {
    const { env, send } = mockEnv({
      lastCrawl: new Date(Date.now() - 20 * 60_000).toISOString(),
      queue: true,
    });
    await ensureNewsCrawlFresh(env);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'crawl_news' }),
    );
  });
});
