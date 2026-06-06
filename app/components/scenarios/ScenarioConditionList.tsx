import type { MatchPredictionScenario } from '../../lib/api';

export function ScenarioConditionList({
  title,
  items,
}: {
  title: string;
  items: MatchPredictionScenario['initialConditions'];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-foreground/90">
        {items.map((c, i) => (
          <li key={i} className="rounded border border-border/40 bg-background/30 px-2 py-1">
            {c.condition}: <span className="font-mono-data text-cyan">{String(c.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
