import type { MarketSignalsPayload } from '../../lib/api';
import { useI18n } from '../../lib/i18n/I18nContext';
import { MarketDisclaimer } from './MarketDisclaimer';
import { ModelVsMarketChart } from './ModelVsMarketChart';
import { pct } from '../../lib/format';

type Props = {
  payload: MarketSignalsPayload | null;
  loading?: boolean;
};

export function MarketSignalPanel({ payload, loading }: Props) {
  const { t } = useI18n();

  if (loading) {
    return <div className="panel-dense text-sm text-muted">{t('market.loading')}</div>;
  }

  const signals = payload?.signals;

  return (
    <section className="panel-elevated space-y-4 border-yellow/20">
      <div>
        <h2 className="font-heading text-xl text-foreground">{t('market.title')}</h2>
        <p className="mt-1 text-sm text-muted">{t('market.subtitle')}</p>
        <MarketDisclaimer className="mt-2" />
      </div>

      {!signals ? (
        <p className="text-sm text-muted">{t('market.empty')}</p>
      ) : (
        <>
          <ModelVsMarketChart data={signals} />
          <p className="font-mono-data text-xs text-muted">
            {t('market.volatility')} {pct(signals.volatilityScore)} · {t('common.updated')}{' '}
            {signals.updatedAt ? new Date(signals.updatedAt).toLocaleString() : '—'}
          </p>
          <MarketDisclaimer className="border-t border-border/40 pt-3" />
        </>
      )}
    </section>
  );
}
