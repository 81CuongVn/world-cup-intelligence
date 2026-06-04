import type { MarketDataAdapter } from './adapters/MarketDataAdapter';
import { ManualMarketInputAdapter } from './adapters/ManualMarketInputAdapter';
import { LicensedOddsApiAdapter } from './adapters/LicensedOddsApiAdapter';
import { CompliantPublicOddsAdapter } from './adapters/CompliantPublicOddsAdapter';

export function getMarketAdapters(env: { KV?: KVNamespace }): MarketDataAdapter[] {
  const adapters: MarketDataAdapter[] = [new ManualMarketInputAdapter()];
  const licensedUrl = env.KV ? undefined : undefined;
  adapters.push(new LicensedOddsApiAdapter('mkt-licensed', licensedUrl ?? null));
  adapters.push(new CompliantPublicOddsAdapter('mkt-public'));
  return adapters;
}
