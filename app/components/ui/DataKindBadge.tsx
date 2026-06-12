import { useI18n } from '../../lib/i18n/I18nContext';

export type DataKind = 'predicted' | 'actual' | 'simulated';

const KIND_CLASS: Record<DataKind, string> = {
  predicted: 'border-yellow/45 bg-yellow/10 text-yellow',
  actual: 'border-cyan/45 bg-cyan/10 text-cyan',
  simulated: 'border-lime/45 bg-lime/10 text-lime',
};

const KIND_SYMBOL: Record<DataKind, string> = {
  predicted: '',
  actual: '●',
  simulated: '≈',
};

const KIND_LABEL_KEY: Record<DataKind, 'dataKind.predicted' | 'dataKind.actual' | 'dataKind.simulated'> = {
  predicted: 'dataKind.predicted',
  actual: 'dataKind.actual',
  simulated: 'dataKind.simulated',
};

type BadgeProps = {
  kind: DataKind;
  compact?: boolean;
  className?: string;
};

/** Section badge: Dự đoán · ● Thực tế · ≈ Giả lập */
export function DataKindBadge({ kind, compact = false, className = '' }: BadgeProps) {
  const { t } = useI18n();
  const symbol = KIND_SYMBOL[kind];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 font-mono-data text-[10px] font-semibold uppercase tracking-wide ${KIND_CLASS[kind]} ${className}`}
      title={t('dataKind.legend')}
    >
      {symbol ? (
        <span aria-hidden>{symbol}</span>
      ) : compact ? (
        <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-sm bg-current opacity-90" />
      ) : null}
      {!compact && <span>{t(KIND_LABEL_KEY[kind])}</span>}
    </span>
  );
}

type MarkProps = {
  kind?: DataKind;
  className?: string;
};

/** Inline prefix on numeric values (● actual, ≈ simulated) */
export function DataKindMark({ kind = 'predicted', className = '' }: MarkProps) {
  const symbol = KIND_SYMBOL[kind];
  if (!symbol) return null;
  const { t } = useI18n();
  const labelKey = KIND_LABEL_KEY[kind];
  return (
    <span
      className={`mr-0.5 font-normal opacity-90 ${KIND_CLASS[kind].split(' ').pop()} ${className}`}
      title={t(labelKey)}
      aria-label={t(labelKey)}
    >
      {symbol}
    </span>
  );
}

/** Compact legend for panels with both predicted and actual data */
export function DataKindLegend({ className = '' }: { className?: string }) {
  const { t } = useI18n();
  return (
    <p className={`font-mono-data text-[10px] text-muted ${className}`} title={t('dataKind.legendHint')}>
      {t('dataKind.legend')}
    </p>
  );
}
