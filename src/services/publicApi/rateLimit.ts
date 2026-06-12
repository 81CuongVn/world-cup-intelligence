import type { AppEnv } from '../../env';

const ANON_LIMIT = 60;
const KEY_LIMIT = 600;

export async function checkRateLimit(
  env: AppEnv,
  subject: string,
  hasApiKey: boolean,
): Promise<{ allowed: boolean; remaining: number; resetSec: number }> {
  const bucket = Math.floor(Date.now() / 60_000);
  const limit = hasApiKey ? KEY_LIMIT : ANON_LIMIT;
  const key = `ratelimit:api:${subject}:${bucket}`;
  const current = Number((await env.KV.get(key)) ?? '0');
  if (current >= limit) {
    return { allowed: false, remaining: 0, resetSec: 60 - (Math.floor(Date.now() / 1000) % 60) };
  }
  await env.KV.put(key, String(current + 1), { expirationTtl: 120 });
  return { allowed: true, remaining: limit - current - 1, resetSec: 60 - (Math.floor(Date.now() / 1000) % 60) };
}
