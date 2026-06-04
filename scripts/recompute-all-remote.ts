/**
 * Bulk-recompute all WC 2026 matches against remote D1 (no admin token).
 * Usage: npx tsx scripts/recompute-all-remote.ts
 */
import { getPlatformProxy } from 'wrangler';
import type { AppEnv } from '../src/env';
import { recomputeAllWc2026Matches } from '../src/services/recomputeMatch';

const { env, dispose } = await getPlatformProxy<AppEnv>({
  configPath: './wrangler.jsonc',
  persist: false,
  remoteBindings: true,
});

try {
  const result = await recomputeAllWc2026Matches(env);
  console.log(JSON.stringify(result, null, 2));
} finally {
  await dispose();
}
