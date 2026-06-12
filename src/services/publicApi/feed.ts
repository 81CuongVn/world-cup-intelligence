import type { AppEnv } from '../../env';
import { nowIso } from '../../utils/time';
import type { PublicApiEventType, PublicApiFeedEvent } from './types';

const MAX_FEED_ROWS = 5000;

export async function appendFeedEvent(
  env: AppEnv,
  eventType: PublicApiEventType,
  matchId: string | null,
  data: unknown,
): Promise<PublicApiFeedEvent | null> {
  const payloadJson = JSON.stringify(data);
  const createdAt = nowIso();

  const result = await env.DB.prepare(
    `INSERT INTO api_feed_events (event_type, match_id, payload_json, created_at)
     VALUES (?, ?, ?, ?)`,
  )
    .bind(eventType, matchId, payloadJson, createdAt)
    .run();

  const id = Number(result.meta.last_row_id);
  if (!id) return null;

  // Trim old events (keep last N rows)
  await env.DB.prepare(
    `DELETE FROM api_feed_events WHERE id NOT IN (
       SELECT id FROM api_feed_events ORDER BY id DESC LIMIT ?
     )`,
  )
    .bind(MAX_FEED_ROWS)
    .run()
    .catch(() => undefined);

  return { id, type: eventType, matchId, createdAt, data };
}

export async function queryFeed(
  env: AppEnv,
  opts: { cursor?: number; limit?: number; matchId?: string; types?: string[] },
): Promise<{ events: PublicApiFeedEvent[]; nextCursor: number | null }> {
  const limit = Math.min(Math.max(opts.limit ?? 50, 1), 200);
  const cursor = opts.cursor ?? 0;

  let sql = `SELECT id, event_type, match_id, payload_json, created_at
             FROM api_feed_events WHERE id > ?`;
  const binds: (string | number)[] = [cursor];

  if (opts.matchId) {
    sql += ` AND match_id = ?`;
    binds.push(opts.matchId);
  }
  if (opts.types?.length) {
    sql += ` AND event_type IN (${opts.types.map(() => '?').join(',')})`;
    binds.push(...opts.types);
  }
  sql += ` ORDER BY id ASC LIMIT ?`;
  binds.push(limit + 1);

  const { results } = await env.DB.prepare(sql).bind(...binds).all<{
    id: number;
    event_type: string;
    match_id: string | null;
    payload_json: string;
    created_at: string;
  }>();

  const rows = results ?? [];
  const hasMore = rows.length > limit;
  const slice = hasMore ? rows.slice(0, limit) : rows;

  const events: PublicApiFeedEvent[] = slice.map((r) => ({
    id: r.id,
    type: r.event_type as PublicApiFeedEvent['type'],
    matchId: r.match_id,
    createdAt: r.created_at,
    data: JSON.parse(r.payload_json),
  }));

  const nextCursor = hasMore && slice.length ? slice[slice.length - 1].id : null;
  return { events, nextCursor };
}

export async function getLatestFeedCursor(env: AppEnv): Promise<number> {
  const row = await env.DB.prepare(`SELECT MAX(id) AS max_id FROM api_feed_events`).first<{ max_id: number | null }>();
  return row?.max_id ?? 0;
}
