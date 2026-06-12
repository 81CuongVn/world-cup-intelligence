import type { AppEnv } from '../../env';
import { sha256Hex } from './crypto';
import type { PublicApiClient } from './types';

export type ApiKeyAuth = {
  client: PublicApiClient;
  keyId: string;
};

export async function hashApiKey(apiKey: string): Promise<string> {
  return sha256Hex(apiKey);
}

export async function resolveApiKey(env: AppEnv, apiKey: string | null | undefined): Promise<ApiKeyAuth | null> {
  if (!apiKey?.startsWith('pi_live_')) return null;
  const hash = await hashApiKey(apiKey);
  const row = await env.DB.prepare(
    `SELECT id, name, enabled, created_at FROM api_clients WHERE api_key_hash = ? AND enabled = 1`,
  )
    .bind(hash)
    .first<{ id: string; name: string; enabled: number; created_at: string }>();
  if (!row) return null;
  return {
    client: {
      id: row.id,
      name: row.name,
      enabled: row.enabled === 1,
      createdAt: row.created_at,
    },
    keyId: row.id,
  };
}

export function publicApiKeyRequired(env: AppEnv): boolean {
  return env.PUBLIC_API_REQUIRE_KEY === 'true';
}
