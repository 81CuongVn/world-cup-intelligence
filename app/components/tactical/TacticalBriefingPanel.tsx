import type { TacticalBriefing } from '../../lib/api';
import { SourceConfidencePanel } from '../intelligence/SourceConfidencePanel';
import { SectionLabel } from './SectionLabel';
import { useI18n } from '../../lib/i18n/I18nContext';
import { Bilingual } from '../i18n/Bilingual';
import { pickLocalized, type LocalizedString } from '../../lib/briefingText';

type Props = { briefing: TacticalBriefing | null; loading?: boolean };

function LocalizedBlock({
  value,
  as = 'p',
  className = '',
}: {
  value: LocalizedString;
  as?: 'p' | 'li';
  className?: string;
}) {
  const { mode } = useI18n();
  const Tag = as;
  return <Tag className={className}>{pickLocalized(value, mode)}</Tag>;
}

export function TacticalBriefingPanel({ briefing, loading }: Props) {
  const { mode, t } = useI18n();

  if (loading) {
    return (
      <div className="panel-dense text-sm text-muted">
        <Bilingual k="match.briefingLoading" />
      </div>
    );
  }
  if (!briefing) return null;

  const citations = briefing.citations.map((c) => ({
    name: c.title ? `${c.sourceName} — ${c.title}` : c.sourceName,
    score: 0.75,
  }));

  return (
    <div className="panel-dense space-y-3 border-magenta/15">
      <SectionLabel
        title={t('match.briefingTitle')}
        subtitle={t('match.briefingAiSubtitle')}
        accent="magenta"
      />

      <LocalizedBlock value={briefing.summary} className="text-sm leading-relaxed text-foreground/90" />

      {briefing.probabilityExplanation.length > 0 && (
        <div className="takeaway-card">
          <Bilingual k="match.briefingTakeaways" as="p" className="label-tactical mb-2 text-cyan" />
          <ul className="list-disc space-y-2 pl-5 text-sm text-foreground/85">
            {briefing.probabilityExplanation.map((line, i) => (
              <LocalizedBlock key={i} value={line} as="li" />
            ))}
          </ul>
        </div>
      )}

      {briefing.uncertaintyNotes.length > 0 && (
        <div className="rounded-card border border-yellow/20 bg-yellow/5 px-3 py-2 text-xs text-yellow/90">
          {briefing.uncertaintyNotes.map((note, i) => (
            <span key={i}>
              {i > 0 ? ' ' : ''}
              {pickLocalized(note, mode)}
            </span>
          ))}
        </div>
      )}

      <SourceConfidencePanel sources={citations} compact />
    </div>
  );
}
