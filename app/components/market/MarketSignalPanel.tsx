import type { MarketSignalsPayload } from '../../lib/api';
import { useI18n } from '../../lib/i18n/I18nContext';
import { MarketDisclaimer } from './MarketDisclaimer';
import { ModelVsMarketChart } from './ModelVsMarketChart';
import { pct } from '../../lib/format';
import { DataKindBadge, DataKindLegend } from '../ui/DataKindBadge';

type Props = {
  payload: MarketSignalsPayload | null;
  loading?: boolean;
};

export function MarketSignalPanel({ payload, loading }: Props) {
  const { t } = useI18n();

  const signals = payload?.signals;
  if (loading || !signals) return null;

  return (
    <section className="panel-elevated space-y-4 border-yellow/20">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-heading text-xl text-foreground">{t('market.chartTitle')}</h2>
          <DataKindBadge kind="predicted" compact />
        </div>
        <p className="mt-1 text-sm text-muted">{t('market.subtitle')}</p>
        <DataKindLegend className="mt-2" />
      </div>

      <ModelVsMarketChart data={signals} />
      <p className="font-mono-data text-xs text-muted">
        {t('market.volatility')} {pct(signals.volatilityScore)} · {t('common.updated')}{' '}
        {signals.updatedAt ? new Date(signals.updatedAt).toLocaleString() : '—'}
      </p>
      <MarketDisclaimer className="border-t border-border/40 pt-3" />
    </section>
  );
}
