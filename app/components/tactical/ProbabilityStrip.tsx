import { pct, xg } from '../../lib/format';
import { Bilingual } from '../i18n/Bilingual';
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
};

export function ProbabilityStrip({
  homeWin,
  draw,
  awayWin,
  xgHome,
  xgAway,
  confidence,
  simulated,
}: Props) {
  const { t } = useI18n();
  const bars = [
    { label: t('match.home'), value: homeWin, color: 'bg-cyan', text: 'text-cyan' },
    { label: t('match.draw'), value: draw, color: 'bg-slate', text: 'text-muted' },
    { label: t('match.away'), value: awayWin, color: 'bg-magenta', text: 'text-magenta' },
  ];
  const leader = bars.reduce((a, b) => (b.value > a.value ? b : a));

  return (
    <div className={`panel-dense ${simulated ? 'border-lime/40' : 'border-cyan/15'}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <SectionLabel
          title={simulated ? t('simulator.scenarioOutput') : t('simulator.winProb')}
          subtitle={simulated ? t('probStrip.subtitleSim') : t('probStrip.subtitle')}
          accent={simulated ? 'lime' : 'cyan'}
        />
        {confidence != null && (
          <span className="font-mono-data text-sm font-medium text-cyan">
            {t('match.confidence')} {pct(confidence)}
          </span>
        )}
      </div>

      <div className="flex h-5 overflow-hidden rounded-sm bg-background2 ring-1 ring-border/80">
        {bars.map((b) => (
          <div
            key={b.label}
            className={`${b.color} transition-all duration-500`}
            style={{ width: `${Math.max(b.value * 100, 0.5)}%` }}
            title={`${b.label} ${pct(b.value)}`}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        {bars.map((b) => (
          <div
            key={b.label}
            className={`rounded-lg border px-3 py-3 ${
              b.label === leader.label
                ? 'border-cyan/40 bg-cyan/5'
                : 'border-border/50 bg-panel2/40'
            }`}
          >
            <p className="text-sm font-medium text-foreground/80">{b.label}</p>
            <p className={`font-mono-data text-xl font-semibold ${b.text}`}>{pct(b.value)}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between font-mono-data text-sm">
        <span className="text-muted">
          xG <span className="text-cyan">{xg(xgHome)}</span>
        </span>
        <Bilingual k="match.probability" as="span" className="text-muted" />
        <span className="text-muted">
          xG <span className="text-magenta">{xg(xgAway)}</span>
        </span>
      </div>
    </div>
  );
}
