import { SectionLabel } from './SectionLabel';
import { useI18n } from '../../lib/i18n/I18nContext';

type Segment = { label: string; value: number; color: string };

type Props = {
  segments: Segment[];
  title?: string;
};

export function ContributionRadialChart({ segments, title }: Props) {
  const { t } = useI18n();
  const chartTitle = title ?? t('contribution.title');
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;
  const r = 42;
  const cx = 50;
  const cy = 50;

  const arcs = segments.map((seg) => {
    const frac = seg.value / total;
    const start = offset * 360;
    offset += frac;
    const end = offset * 360;
    const large = end - start > 180 ? 1 : 0;
    const sRad = ((start - 90) * Math.PI) / 180;
    const eRad = ((end - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(sRad);
    const y1 = cy + r * Math.sin(sRad);
    const x2 = cx + r * Math.cos(eRad);
    const y2 = cy + r * Math.sin(eRad);
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    return { ...seg, d, pct: frac };
  });

  return (
    <div className="panel-dense">
      <SectionLabel title={chartTitle} subtitle={t('contribution.subtitle')} accent="purple" />
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <svg viewBox="0 0 100 100" className="h-36 w-36 shrink-0">
          {arcs.map((a) => (
            <path key={a.label} d={a.d} fill={a.color} opacity={0.85} stroke="#04060a" strokeWidth="0.5" />
          ))}
          <circle cx={cx} cy={cy} r={22} fill="#0c1119" stroke="#1e2a3a" strokeWidth="0.5" />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#8b9cb3" fontSize="6">
            MIX
          </text>
        </svg>
        <ul className="flex-1 space-y-1.5 text-xs">
          {arcs.map((a) => (
            <li key={a.label} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-muted">
                <span className="h-2 w-2 rounded-sm" style={{ background: a.color }} />
                {a.label}
              </span>
              <span className="font-mono-data text-foreground">{(a.pct * 100).toFixed(0)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
