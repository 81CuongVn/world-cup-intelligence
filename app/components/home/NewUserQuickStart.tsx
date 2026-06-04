import { Link } from 'react-router-dom';
import { quickStartSteps, pickGuide } from '../../lib/guideContent';
import { useI18n } from '../../lib/i18n/I18nContext';

const accentClass: Record<string, string> = {
  cyan: 'border-cyan/30 hover:border-cyan/60',
  magenta: 'border-magenta/30 hover:border-magenta/60',
  yellow: 'border-yellow/30 hover:border-yellow/60',
  live: 'border-live/30 hover:border-live/60',
};

export function NewUserQuickStart() {
  const { mode, t } = useI18n();

  return (
    <section className="panel-elevated space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-heading text-xl text-foreground">{t('home.newHere')}</h2>
        <Link to="/guide" className="text-sm font-medium text-cyan hover:underline">
          {t('common.fullGuide')}
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {quickStartSteps.map((step) => (
          <Link
            key={step.to}
            to={step.to}
            className={`rounded-card border bg-panel2/30 p-4 transition ${accentClass[step.accent]}`}
          >
            <p className="font-medium text-foreground">{pickGuide(step.title, mode)}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{pickGuide(step.desc, mode)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
