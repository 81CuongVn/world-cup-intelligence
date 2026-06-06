import { pct } from '../../lib/format';

export function ScenarioProbabilityBar({
  label,
  value,
  accent = 'magenta',
}: {
  label: string;
  value: number;
  accent?: 'magenta' | 'cyan' | 'yellow';
}) {
  const color =
    accent === 'cyan' ? 'bg-cyan' : accent === 'yellow' ? 'bg-yellow' : 'bg-magenta';
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span className="font-mono-data text-foreground">{pct(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-panel2">
        <div className={`h-full ${color}`} style={{ width: `${Math.min(100, value * 100)}%` }} />
      </div>
    </div>
  );
}
