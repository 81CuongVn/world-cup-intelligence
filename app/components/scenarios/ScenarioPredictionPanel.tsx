import type { MatchPredictionScenario, MatchScenarioSet } from '../../lib/api';
import { pct } from '../../lib/format';
import { ScenarioProbabilityBar } from './ScenarioProbabilityBar';
import { ScenarioConfidenceInline } from './ScenarioConfidenceBadge';
import { ScenarioConditionList } from './ScenarioConditionList';
import { ScenarioTriggerStatus } from './ScenarioTriggerStatus';
import { ScenarioComparisonCard } from './ScenarioComparisonCard';
import { ScenarioRealtimeTimeline } from './ScenarioRealtimeTimeline';
import { useI18n } from '../../lib/i18n/I18nContext';

function ScenarioCard({ scenario, label }: { scenario: MatchPredictionScenario; label: string }) {
  return (
    <article className="rounded-card border border-border/50 bg-panel2/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
          <h3 className="font-heading text-lg text-foreground">{scenario.scenarioName}</h3>
        </div>
        <ScenarioConfidenceInline scenario={scenario} />
      </div>

      <div className="mt-4 space-y-3">
        <ScenarioProbabilityBar label="Scenario likelihood" value={scenario.scenarioProbability} />
        <p className="font-mono-data text-sm text-foreground">
          Home {pct(scenario.homeWinProb)} · Draw {pct(scenario.drawProb)} · Away{' '}
          {pct(scenario.awayWinProb)}
        </p>
        <p className="text-sm text-muted">
          Most likely score:{' '}
          <span className="font-mono-data text-yellow">{scenario.mostLikelyScore}</span> · xG{' '}
          {scenario.expectedHomeGoals.toFixed(2)}–{scenario.expectedAwayGoals.toFixed(2)}
        </p>
      </div>

      <div className="mt-4 space-y-4">
        <ScenarioConditionList title="Initial conditions" items={scenario.initialConditions} />
        <ScenarioTriggerStatus scenario={scenario} />
      </div>
    </article>
  );
}

type Props = {
  data: MatchScenarioSet | null;
  loading?: boolean;
};

export function ScenarioPredictionPanel({ data, loading }: Props) {
  const { t } = useI18n();
  if (loading) return <div className="panel-dense text-sm text-muted">{t('scenario.loading')}</div>;
  if (!data?.scenarios?.length) {
    return <div className="panel-dense text-sm text-muted">{t('scenario.empty')}</div>;
  }

  const baseline = data.scenarios.find((s) => s.isBaseline) ?? data.scenarios[0];
  const alternative = data.scenarios.find((s) => s.id !== baseline.id) ?? data.scenarios[1];

  return (
    <section className="panel-elevated space-y-5 border-magenta/20">
      <div>
        <h2 className="label-tactical text-magenta">{t('scenario.predictionTitle')}</h2>
        <p className="mt-1 text-xs text-muted">{t('scenario.predictionSubtitle')}</p>
        <ScenarioRealtimeTimeline updatedAt={data.updatedAt} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ScenarioCard scenario={baseline} label={t('scenario.pathA')} />
        {alternative && <ScenarioCard scenario={alternative} label={t('scenario.pathB')} />}
      </div>

      <details className="md:hidden">
        <summary className="cursor-pointer text-sm text-cyan">{t('scenario.comparisonToggle')}</summary>
        <div className="mt-3">
          <ScenarioComparisonCard data={data} />
        </div>
      </details>
      <div className="hidden md:block">
        <ScenarioComparisonCard data={data} />
      </div>
    </section>
  );
}
