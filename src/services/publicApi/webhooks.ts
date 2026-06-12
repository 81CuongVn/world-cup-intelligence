import type { AppEnv } from '../../env';
import { nowIso } from '../../utils/time';
import { logError, logInfo } from '../../utils/logger';
import { generateWebhookSecret, hmacSha256Hex } from './crypto';
import type { PublicApiFeedEvent, PublicApiEventType, WebhookSubscription } from './types';

function parseEventsJson(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : ['*'];
  } catch {
    return ['*'];
  }
}

function rowToSubscription(row: {
  id: string;
  client_id: string;
  url: string;
  events_json: string;
  enabled: number;
  created_at: string;
}): WebhookSubscription {
  return {
    id: row.id,
    clientId: row.client_id,
    url: row.url,
    events: parseEventsJson(row.events_json),
    enabled: row.enabled === 1,
    createdAt: row.created_at,
  };
}

export async function createWebhook(
  env: AppEnv,
  clientId: string,
  url: string,
  events: string[],
): Promise<{ subscription: WebhookSubscription; secret: string }> {
  const id = `wh-${crypto.randomUUID()}`;
  const secret = generateWebhookSecret();
  const eventsJson = JSON.stringify(events.length ? events : ['*']);
  const ts = nowIso();

  await env.DB.prepare(
    `INSERT INTO api_webhook_subscriptions (id, client_id, url, secret, events_json, enabled, created_at)
     VALUES (?, ?, ?, ?, ?, 1, ?)`,
  )
    .bind(id, clientId, url, secret, eventsJson, ts)
    .run();

  return {
    subscription: { id, clientId, url, events: events.length ? events : ['*'], enabled: true, createdAt: ts },
    secret,
  };
}

export async function listWebhooks(env: AppEnv, clientId: string): Promise<WebhookSubscription[]> {
  const { results } = await env.DB.prepare(
    `SELECT id, client_id, url, events_json, enabled, created_at
     FROM api_webhook_subscriptions WHERE client_id = ? ORDER BY created_at DESC`,
  )
    .bind(clientId)
    .all<{
      id: string;
      client_id: string;
      url: string;
      events_json: string;
      enabled: number;
      created_at: string;
    }>();
  return (results ?? []).map(rowToSubscription);
}

export async function deleteWebhook(env: AppEnv, clientId: string, webhookId: string): Promise<boolean> {
  const result = await env.DB.prepare(
    `DELETE FROM api_webhook_subscriptions WHERE id = ? AND client_id = ?`,
  )
    .bind(webhookId, clientId)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

function eventMatchesSubscription(eventType: PublicApiEventType, events: string[]): boolean {
  if (events.includes('*')) return true;
  return events.includes(eventType);
}

export async function enqueueWebhookDeliveries(env: AppEnv, event: PublicApiFeedEvent): Promise<void> {
  if (!env.INGEST_QUEUE) return;

  const { results } = await env.DB.prepare(
    `SELECT id, client_id, url, secret, events_json FROM api_webhook_subscriptions WHERE enabled = 1`,
  ).all<{
    id: string;
    client_id: string;
    url: string;
    secret: string;
    events_json: string;
  }>();

  for (const row of results ?? []) {
    const events = parseEventsJson(row.events_json);
    if (!eventMatchesSubscription(event.type, events)) continue;
    await env.INGEST_QUEUE.send({
      type: 'webhook_deliver',
      subscriptionId: row.id,
      eventId: event.id,
      idempotencyKey: `wh-${row.id}-${event.id}`,
    });
  }
}

export async function deliverWebhook(
  env: AppEnv,
  subscriptionId: string,
  eventId: number,
): Promise<{ ok: boolean; status?: number }> {
  const [sub, feedRow] = await Promise.all([
    env.DB.prepare(
      `SELECT id, url, secret, enabled FROM api_webhook_subscriptions WHERE id = ?`,
    )
      .bind(subscriptionId)
      .first<{ id: string; url: string; secret: string; enabled: number }>(),
    env.DB.prepare(`SELECT id, event_type, match_id, payload_json, created_at FROM api_feed_events WHERE id = ?`)
      .bind(eventId)
      .first<{
        id: number;
        event_type: string;
        match_id: string | null;
        payload_json: string;
        created_at: string;
      }>(),
  ]);

  if (!sub || sub.enabled !== 1 || !feedRow) return { ok: false };

  const body = JSON.stringify({
    id: feedRow.id,
    type: feedRow.event_type,
    matchId: feedRow.match_id,
    createdAt: feedRow.created_at,
    data: JSON.parse(feedRow.payload_json),
  });

  const deliveryId = `del-${subscriptionId}-${eventId}`;
  const signature = await hmacSha256Hex(sub.secret, body);
  const ts = nowIso();

  try {
    const res = await fetch(sub.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PitchIntel-Webhook/1.0',
        'X-PitchIntel-Event': feedRow.event_type,
        'X-PitchIntel-Delivery-Id': deliveryId,
        'X-PitchIntel-Timestamp': ts,
        'X-PitchIntel-Signature': `sha256=${signature}`,
      },
      body,
      signal: AbortSignal.timeout(15_000),
    });
    logInfo('webhook delivered', { subscriptionId, eventId, status: res.status });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    logError('webhook delivery failed', { subscriptionId, eventId, error: String(e) });
    return { ok: false };
  }
}
