import type { MatchScenarioSet } from '../../lib/api';
import { pct } from '../../lib/format';

export function ScenarioComparisonCard({ data }: { data: MatchScenarioSet | null }) {
  if (!data?.comparison) return null;
  const { comparison } = data;
  return (
    <div className="rounded-card border border-cyan/25 bg-cyan/5 p-4">
      <p className="label-tactical text-cyan">Scenario comparison</p>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90">{comparison.summary}</p>
      <ul className="mt-3 space-y-1 text-xs text-muted">
        {comparison.keyDifferences.slice(0, 4).map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p className="mt-3 font-mono-data text-xs text-muted-dim">
        Likelihood gap {pct(comparison.probabilityGap)} · Away win delta{' '}
        {(comparison.awayWinDelta * 100).toFixed(1)} pp
      </p>
    </div>
  );
}
