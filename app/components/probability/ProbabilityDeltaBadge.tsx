import { pct } from '../../lib/format';

export function ProbabilityDeltaBadge({ delta }: { delta: number }) {
  const positive = delta > 0.005;
  const negative = delta < -0.005;
  const color = positive ? 'text-cyan' : negative ? 'text-live' : 'text-muted';
  const sign = positive ? '+' : '';
  return (
    <span className={`font-mono-data text-xs ${color}`}>
      {sign}
      {pct(delta)}
    </span>
  );
}
