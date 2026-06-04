import { useCountdown } from '../../lib/useCountdown';
import { useI18n } from '../../lib/i18n/I18nContext';

type Props = {
  kickoffUtc: string;
  status: string;
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function MatchKickoffCountdown({ kickoffUtc, status }: Props) {
  const { t } = useI18n();
  const cd = useCountdown(kickoffUtc);

  if (status === 'live') {
    return (
      <span className="font-mono-data text-xs font-semibold uppercase tracking-wider text-live animate-pulse">
        ● {t('common.live')}
      </span>
    );
  }

  if (status === 'completed') {
    return (
      <span className="font-mono-data text-xs uppercase tracking-wider text-muted">
        {t('common.ft')}
      </span>
    );
  }

  if (cd.expired) {
    return (
      <span className="font-mono-data text-xs uppercase tracking-wider text-yellow">
        {t('common.startingSoon')}
      </span>
    );
  }

  const sep = ' ';

  return (
    <span className="font-mono-data text-xs font-medium tabular-nums text-cyan">
      {pad(cd.days)}
      {t('countdown.day')}
      {sep}
      {pad(cd.hours)}
      {t('countdown.hour')}
      {sep}
      {pad(cd.minutes)}
      {t('countdown.min')}
      {sep}
      {pad(cd.seconds)}
      {t('countdown.sec')}
    </span>
  );
}
