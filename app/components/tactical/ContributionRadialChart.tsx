import { SectionLabel } from './SectionLabel';
import { useI18n } from '../../lib/i18n/I18nContext';
import type { LocaleKey } from '../../lib/i18n/locales';

type Segment = {
  labelKey?: LocaleKey;
  label?: string;
  value: number;
  color: string;
};

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
    const label = seg.labelKey ? t(seg.labelKey) : (seg.label ?? '');
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
    return { ...seg, label, d, pct: frac };
  });

  return (
    <section className="panel space-y-5">
      <SectionLabel title={chartTitle} subtitle={t('contribution.subtitle')} accent="purple" />
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(12rem,16rem)_1fr] lg:gap-12">
        <div className="mx-auto flex justify-center lg:mx-0">
          <svg viewBox="0 0 100 100" className="h-44 w-44 shrink-0 sm:h-48 sm:w-48" aria-hidden>
            {arcs.map((a) => (
              <path
                key={a.label}
                d={a.d}
                fill={a.color}
                opacity={0.88}
                stroke="#04060a"
                strokeWidth="0.5"
              />
            ))}
            <circle cx={cx} cy={cy} r={22} fill="#0c1119" stroke="#1e2a3a" strokeWidth="0.5" />
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#8b9cb3"
              fontSize="5.5"
              fontWeight="600"
            >
              {t('contribution.mixCenter')}
            </text>
          </svg>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {arcs.map((a) => (
            <li
              key={a.label}
              className="flex items-center gap-3 rounded-lg border border-border/40 bg-panel2/40 px-4 py-3"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-sm"
                style={{ background: a.color }}
                aria-hidden
              />
              <span className="min-w-0 flex-1 text-sm leading-snug text-foreground">{a.label}</span>
              <span className="shrink-0 font-mono-data text-sm font-semibold tabular-nums text-foreground">
                {(a.pct * 100).toFixed(0)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
