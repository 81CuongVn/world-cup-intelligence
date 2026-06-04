import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../lib/i18n/I18nContext';

export function MatchPageGuideStrip() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-card border border-border/50 bg-panel2/30 text-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-muted hover:text-foreground"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{t('match.guideTitle')}</span>
        <span className="font-mono-data text-cyan">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="space-y-2 border-t border-border/40 px-3 py-3 text-muted">
          <p>{t('match.guideProbNote')}</p>
          <ul className="list-disc space-y-1 pl-4">
            <li>{t('match.guideStrip')}</li>
            <li>{t('match.guidePreview')}</li>
            <li>{t('match.guideMatrix')}</li>
          </ul>
          <Link to="/guide" className="inline-block font-medium text-cyan hover:underline">
            {t('match.guideGlossary')}
          </Link>
        </div>
      )}
    </div>
  );
}
