import { SectionLabel } from './SectionLabel';
import { useI18n } from '../../lib/i18n/I18nContext';

type Props = {
  distribution: Record<string, number>;
  highlight?: string;
};

export function ScorelineMatrix({ distribution, highlight }: Props) {
  const { t } = useI18n();
  const keys = Object.keys(distribution).sort();
  const max = Math.max(...Object.values(distribution), 0.001);

  return (
    <div className="panel-dense overflow-x-auto">
      <SectionLabel title={t('matrix.title')} subtitle={t('matrix.subtitle')} accent="magenta" />
      <div className="inline-grid min-w-max grid-cols-4 gap-1.5 sm:grid-cols-6 md:grid-cols-7">
        {keys.map((k) => {
          const p = distribution[k] ?? 0;
          const intensity = p / max;
          const isHi = k === highlight;
          return (
            <div
              key={k}
              className={`rounded-card border px-2 py-2 text-center transition ${
                isHi
                  ? 'border-yellow/50 bg-yellow/10 shadow-glow-cyan'
                  : 'border-border/40 bg-panel2/50'
              }`}
              style={{
                boxShadow: isHi ? undefined : `inset 0 0 20px rgba(0,229,255,${intensity * 0.15})`,
              }}
            >
              <div className={`font-heading text-lg ${isHi ? 'text-yellow' : 'text-foreground'}`}>{k}</div>
              <div className="font-mono-data text-[10px] text-muted">{(p * 100).toFixed(1)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
