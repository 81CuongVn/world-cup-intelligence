import type { TeamSystemSide } from '../../lib/api';
import { useI18n } from '../../lib/i18n/I18nContext';
import { metricLabel, tacticalIdentityLabel } from '../../lib/i18n/termLabels';
import { pct } from '../../lib/format';

type Props = {
  home: TeamSystemSide | null;
  away: TeamSystemSide | null;
  loading?: boolean;
};

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border/40 bg-background/40 px-2 py-1.5">
      <p className="text-sm font-medium text-foreground/75">{label}</p>
      <p className="font-mono-data text-base font-semibold text-cyan">{pct(value)}</p>
    </div>
  );
}

function Side({
  side,
  label,
  mode,
}: {
  side: TeamSystemSide;
  label: string;
  mode: ReturnType<typeof useI18n>['mode'];
}) {
  const metrics = [
    ['Collective', side.collectiveStrengthScore],
    ['Pressing', side.pressingScore],
    ['Compactness', side.defensiveCompactnessScore],
    ['Transition', side.transitionScore],
    ['Set piece', side.setPieceScore],
    ['Bench', side.benchDepthScore],
    ['Cohesion', side.lineupCohesionScore],
    ['Possession', side.possessionControlScore],
    ['Tempo', side.tempoScore],
  ] as const;

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground">
        {label}{' '}
        <span className="font-mono-data text-xs text-muted">
          {side.primaryFormation} · {tacticalIdentityLabel(side.tacticalIdentity, mode)}
        </span>
      </p>
      <div className="grid grid-cols-3 gap-2">
        {metrics.map(([l, v]) => (
          <Metric key={l} label={metricLabel(l, mode)} value={v} />
        ))}
      </div>
    </div>
  );
}

export function TeamSystemPanel({ home, away, loading }: Props) {
  const { t, mode } = useI18n();

  if (loading) return <div className="panel-dense text-sm text-muted">{t('team.loading')}</div>;
  if (!home && !away) {
    return <div className="panel-dense text-sm text-muted">{t('team.empty')}</div>;
  }

  return (
    <section className="panel-elevated space-y-4">
      <h2 className="label-tactical text-cyan">{t('team.title')}</h2>
      <p className="text-xs text-muted">{t('team.subtitle')}</p>
      {home && <Side side={home} label={t('common.home')} mode={mode} />}
      {away && <Side side={away} label={t('common.away')} mode={mode} />}
    </section>
  );
}
