import { useCountdown } from '../../lib/useCountdown';
import { useI18n } from '../../lib/i18n/I18nContext';

type Props = {
  targetUtc: string;
  title?: string;
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function WorldCupCountdown({ targetUtc, title }: Props) {
  const { t } = useI18n();
  const cd = useCountdown(targetUtc);

  const heading = title ?? t('wc.title');

  const units = [
    { value: pad(cd.days), label: t('wc.days') },
    { value: pad(cd.hours), label: t('wc.hours') },
    { value: pad(cd.minutes), label: t('wc.mins') },
    { value: pad(cd.seconds), label: t('wc.secs') },
  ];

  return (
    <section className="rounded-panel border border-border/80 bg-panel2/60 p-4 shadow-tactical md:p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/95 p-1.5 shadow-sm">
          <span className="text-2xl leading-none" aria-hidden>
            🏆
          </span>
        </div>
        <p className="font-heading text-lg font-extrabold tracking-tight text-foreground md:text-xl">
          {heading}
        </p>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {units.map((u) => (
          <div
            key={u.label}
            className="rounded-card border border-border/60 bg-panel/80 px-2 py-3 text-center"
          >
            <p className="font-mono-data text-2xl font-semibold tabular-nums text-foreground md:text-3xl">
              {u.value}
            </p>
            <p className="mt-1 text-[11px] font-medium text-muted">{u.label}</p>
          </div>
        ))}
      </div>
      {cd.expired && (
        <p className="mt-3 text-center text-xs text-cyan">{t('wc.underway')}</p>
      )}
    </section>
  );
}
