import type { AppEnv } from '../../env';
import { nowIso } from '../../utils/time';
import { generateApiKey } from './crypto';
import { hashApiKey } from './apiKey';
import type { PublicApiClient } from './types';

export async function createApiClient(
  env: AppEnv,
  name: string,
): Promise<{ client: PublicApiClient; apiKey: string }> {
  const id = `client-${crypto.randomUUID()}`;
  const apiKey = generateApiKey();
  const hash = await hashApiKey(apiKey);
  const ts = nowIso();

  await env.DB.prepare(
    `INSERT INTO api_clients (id, name, api_key_hash, enabled, created_at) VALUES (?, ?, ?, 1, ?)`,
  )
    .bind(id, name, hash, ts)
    .run();

  return {
    client: { id, name, enabled: true, createdAt: ts },
    apiKey,
  };
}

export async function listApiClients(env: AppEnv): Promise<PublicApiClient[]> {
  const { results } = await env.DB.prepare(
    `SELECT id, name, enabled, created_at FROM api_clients ORDER BY created_at DESC`,
  ).all<{ id: string; name: string; enabled: number; created_at: string }>();

  return (results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    enabled: r.enabled === 1,
    createdAt: r.created_at,
  }));
}

export async function revokeApiClient(env: AppEnv, clientId: string): Promise<boolean> {
  const result = await env.DB.prepare(`UPDATE api_clients SET enabled = 0 WHERE id = ?`).bind(clientId).run();
  return (result.meta.changes ?? 0) > 0;
}
