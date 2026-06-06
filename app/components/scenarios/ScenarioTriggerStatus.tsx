import type { MatchPredictionScenario } from '../../lib/api';

const statusClass: Record<string, string> = {
  not_triggered: 'border-border/50 text-muted',
  partially_triggered: 'border-yellow/40 text-yellow',
  triggered: 'border-green/40 text-green',
  valid: 'border-cyan/40 text-cyan',
  at_risk: 'border-yellow/40 text-yellow',
  invalidated: 'border-magenta/40 text-magenta',
};

export function ScenarioTriggerStatus({ scenario }: { scenario: MatchPredictionScenario }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Triggers</p>
        <ul className="mt-2 space-y-1">
          {scenario.triggerConditions.map((t, i) => (
            <li
              key={i}
              className={`rounded border px-2 py-1 text-xs ${statusClass[t.status] ?? statusClass.not_triggered}`}
            >
              {t.condition} ({String(t.threshold)})
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Invalidation</p>
        <ul className="mt-2 space-y-1">
          {scenario.invalidationConditions.map((t, i) => (
            <li
              key={i}
              className={`rounded border px-2 py-1 text-xs ${statusClass[t.status] ?? statusClass.valid}`}
            >
              {t.condition}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
