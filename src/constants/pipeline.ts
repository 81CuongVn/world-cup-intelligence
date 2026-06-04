export const BULK_RECOMPUTE_KV_KEY = 'bulk_recompute_wc2026';

export async function scheduleBulkRecompute(env: { KV: KVNamespace }): Promise<void> {
  await env.KV.put(BULK_RECOMPUTE_KV_KEY, '1', { expirationTtl: 3600 });
}
