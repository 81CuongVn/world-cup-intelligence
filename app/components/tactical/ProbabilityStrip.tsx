import { pct, xg } from '../../lib/format';
import { useI18n } from '../../lib/i18n/I18nContext';
import { SectionLabel } from './SectionLabel';

type Props = {
  homeWin: number;
  draw: number;
  awayWin: number;
  xgHome: number;
  xgAway: number;
  confidence?: number;
  simulated?: boolean;
  homeLabel?: string;
  awayLabel?: string;
  live?: boolean;
};

export function ProbabilityStrip({
  homeWin,
  draw,
  awayWin,
  xgHome,
  xgAway,
  confidence,
  simulated,
  homeLabel,
  awayLabel,
  live,
}: Props) {
  const { t } = useI18n();
  const homeName = homeLabel?.trim() || t('match.home');
  const awayName = awayLabel?.trim() || t('match.away');
  const drawName = t('match.draw');

  const segments = [
    {
      key: 'home',
      label: homeName,
      value: homeWin,
      bar: 'bg-cyan',
      text: 'text-cyan',
      border: 'border-cyan/40',
      bg: 'bg-cyan/5',
      xgVal: xgHome,
    },
    {
      key: 'draw',
      label: drawName,
      value: draw,
      bar: 'bg-slate',
      text: 'text-muted',
      border: 'border-border/50',
      bg: 'bg-panel2/40',
      xgVal: null as number | null,
    },
    {
      key: 'away',
      label: awayName,
      value: awayWin,
      bar: 'bg-magenta',
      text: 'text-magenta',
      border: 'border-magenta/30',
      bg: 'bg-magenta/5',
      xgVal: xgAway,
    },
  ];

  const leader = segments.reduce((a, b) => (b.value > a.value ? b : a));

  return (
    <div className={`panel-dense ${simulated ? 'border-lime/40' : 'border-cyan/15'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <SectionLabel
          title={simulated ? t('simulator.scenarioOutput') : t('simulator.winProb')}
          subtitle={simulated ? t('probStrip.subtitleSim') : t('probStrip.subtitle')}
          accent={simulated ? 'lime' : 'cyan'}
        />
        <div className="flex flex-wrap items-center gap-2">
          {live && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-live/40 bg-live/10 px-2 py-0.5 font-mono-data text-[10px] uppercase tracking-wider text-live">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-live" />
              {t('common.live')}
            </span>
          )}
          {confidence != null && (
            <span className="font-mono-data text-sm font-medium text-cyan">
              {t('match.confidence')} {pct(confidence)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-background2 ring-1 ring-border/80 sm:h-3">
        {segments.map((s) => (
          <div
            key={s.key}
            className={`${s.bar} transition-all duration-700 ease-out`}
            style={{ width: `${Math.max(s.value * 100, s.value > 0 ? 0.5 : 0)}%` }}
            title={`${s.label} ${pct(s.value)}`}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        {segments.map((s) => {
          const isLeader = s.key === leader.key;
          return (
            <div
              key={s.key}
              className={`flex min-w-0 flex-col rounded-lg border px-2 py-3 text-center sm:px-3 ${
                isLeader ? `${s.border} ${s.bg}` : 'border-border/50 bg-panel2/30'
              }`}
            >
              <p
                className="truncate text-xs font-medium leading-snug text-foreground/85 sm:text-sm"
                title={s.label}
              >
                {s.label}
              </p>
              <p className={`mt-1 font-mono-data text-xl font-semibold tabular-nums sm:text-2xl ${s.text}`}>
                {pct(s.value)}
              </p>
              {s.xgVal != null ? (
                <p className="mt-1.5 font-mono-data text-[11px] text-muted sm:text-xs">
                  xG{' '}
                  <span className={`font-medium ${s.text}`}>{xg(s.xgVal)}</span>
                </p>
              ) : (
                <p className="mt-1.5 text-[11px] text-transparent select-none sm:text-xs" aria-hidden>
                  —
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
