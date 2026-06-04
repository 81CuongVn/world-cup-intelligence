import { SectionLabel } from '../tactical/SectionLabel';
import { useI18n } from '../../lib/i18n/I18nContext';
import type { LocaleKey } from '../../lib/i18n/locales';

export type SourceItem = {
  name: string;
  score: number;
  url?: string;
};

type Props = {
  sources: SourceItem[];
  compact?: boolean;
};

function tier(score: number): { labelKey: LocaleKey; color: string } {
  if (score >= 0.85) return { labelKey: 'source.tierOfficial', color: 'bg-cyan/20 text-cyan' };
  if (score >= 0.7) return { labelKey: 'source.tierTrusted', color: 'bg-green/20 text-green' };
  return { labelKey: 'source.tierReview', color: 'bg-yellow/20 text-yellow' };
}

export function SourceConfidencePanel({ sources, compact }: Props) {
  const { t } = useI18n();
  if (!sources.length) return null;

  return (
    <div className={compact ? '' : 'panel-dense'}>
      {!compact && (
        <SectionLabel title={t('source.title')} subtitle={t('source.subtitle')} accent="cyan" />
      )}
      <ul className="space-y-2">
        {sources.map((s, i) => {
          const tierInfo = tier(s.score);
          return (
            <li
              key={`${s.name}-${i}`}
              className="flex items-center gap-3 rounded-card border border-border/50 bg-panel2/40 px-3 py-2"
            >
              <span
                className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${tierInfo.color}`}
              >
                {t(tierInfo.labelKey)}
              </span>
              <div className="min-w-0 flex-1">
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-sm text-foreground hover:text-cyan"
                  >
                    {s.name}
                  </a>
                ) : (
                  <span className="truncate text-sm text-foreground">{s.name}</span>
                )}
              </div>
              <div className="w-16">
                <div className="h-1.5 overflow-hidden rounded-full bg-background2">
                  <div
                    className="h-full bg-cyan transition-all"
                    style={{ width: `${s.score * 100}%` }}
                  />
                </div>
                <p className="mt-0.5 text-right font-mono-data text-[10px] text-muted">
                  {(s.score * 100).toFixed(0)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SourceConfidenceBadge({ name, score }: { name: string; score: number }) {
  const { t } = useI18n();
  const tierInfo = tier(score);
  return (
    <span className="inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-lg border border-border/60 bg-panel2/50 px-2 py-1 text-xs">
      <span className={`shrink-0 rounded px-1 text-[10px] font-semibold uppercase ${tierInfo.color}`}>
        {t(tierInfo.labelKey)}
      </span>
      <span className="truncate text-foreground/80">{name}</span>
    </span>
  );
}
