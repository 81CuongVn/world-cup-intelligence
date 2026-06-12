import { formatScoreline, normalizeScorelineKey } from '../../lib/format';
import { useI18n } from '../../lib/i18n/I18nContext';
import { DataKindBadge, DataKindMark } from '../ui/DataKindBadge';

type Props = {
  predicted?: string | null;
  homeScore?: number;
  awayScore?: number;
  status?: string;
  layout?: 'stacked' | 'inline';
  size?: 'sm' | 'lg';
};

export function PredictedActualScores({
  predicted,
  homeScore,
  awayScore,
  status,
  layout = 'stacked',
  size = 'lg',
}: Props) {
  const { t } = useI18n();
  const hasActual =
    (status === 'live' || status === 'completed') &&
    homeScore != null &&
    awayScore != null;
  const actual = hasActual ? formatScoreline(homeScore!, awayScore!) : null;
  const predictedKey = predicted ? normalizeScorelineKey(predicted) : null;
  const matched = actual != null && predictedKey != null && actual === predictedKey;

  const scoreClass =
    size === 'lg' ? 'font-display text-2xl tabular-nums' : 'font-mono-data text-xs tabular-nums';

  if (layout === 'inline') {
    return (
      <span className="inline-flex flex-wrap items-center gap-1.5 font-mono-data text-xs">
        {predicted && (
          <span className="text-yellow" title={t('prediction.predictedScore')}>
            <DataKindMark />
            {predicted}
          </span>
        )}
        {actual && (
          <>
            <span className="text-muted/60">→</span>
            <span
              className={`font-semibold ${status === 'live' ? 'text-live' : 'text-foreground'}`}
              title={t('prediction.actualScore')}
            >
              <DataKindMark kind="actual" />
              {actual}
              {status === 'live' && <span className="ml-1 text-[10px] uppercase text-live">LIVE</span>}
            </span>
            {status === 'completed' && matched && (
              <span className="rounded border border-lime/40 bg-lime/10 px-1 py-0.5 text-[10px] text-lime">
                {t('prediction.scoreMatch')}
              </span>
            )}
          </>
        )}
      </span>
    );
  }

  return (
    <div className={hasActual ? 'grid grid-cols-2 gap-2' : ''}>
      <div>
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <DataKindBadge kind="predicted" compact />
          {t('prediction.predictedScore')}
        </p>
        <p className={`mt-1 text-yellow ${scoreClass}`}>
          <DataKindMark />
          {predicted ?? '—'}
        </p>
      </div>
      {actual && (
        <div>
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <DataKindBadge kind="actual" compact />
            {status === 'live' ? t('prediction.liveScore') : t('prediction.actualScore')}
          </p>
          <p
            className={`mt-1 ${scoreClass} ${
              status === 'live' ? 'text-live' : 'text-foreground'
            }`}
          >
            <DataKindMark kind="actual" />
            {actual}
          </p>
          {status === 'completed' && (
            <p className={`mt-1 text-[11px] ${matched ? 'text-lime' : 'text-muted'}`}>
              {matched ? t('prediction.scoreMatch') : t('prediction.scoreDiff')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
