import { useI18n } from '../../lib/i18n/I18nContext';

export function MarketDisclaimer({ className = '' }: { className?: string }) {
  const { t } = useI18n();
  return (
    <p className={`text-sm leading-relaxed text-foreground/75 ${className}`}>
      {t('market.disclaimer')}
    </p>
  );
}
