import { Link } from 'react-router-dom';
import {
  guideIntro,
  guideSections,
  newUserNeedsBrainstorm,
  pickGuide,
  quickStartSteps,
} from '../lib/guideContent';
import { useI18n } from '../lib/i18n/I18nContext';

export function GuidePage() {
  const { mode, t } = useI18n();
  const p = (b: { vi: string; en: string }) => pickGuide(b, mode);

  return (
    <div className="mx-auto max-w-3xl space-y-10 pb-8">
      <header className="space-y-3">
        <Link to="/" className="text-sm text-muted hover:text-cyan">
          ← {t('common.backHome')}
        </Link>
        <h1 className="font-heading text-4xl tracking-tight text-foreground">{t('guide.title')}</h1>
        <p className="text-lg leading-relaxed text-muted">{p(guideIntro)}</p>
      </header>

      <section className="panel-elevated space-y-3">
        <h2 className="label-tactical text-cyan">{t('guide.quickStart')}</h2>
        <ol className="space-y-3">
          {quickStartSteps.map((step) => (
            <li key={step.to}>
              <Link to={step.to} className="block rounded-lg border border-border/50 p-3 hover:border-cyan/40">
                <span className="font-medium text-foreground">{p(step.title)}</span>
                <p className="mt-1 text-sm text-muted">{p(step.desc)}</p>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {guideSections.map((sec) => (
        <section key={sec.id} id={sec.id} className="space-y-3">
          <h2 className="font-heading text-2xl text-foreground">{p(sec.title)}</h2>
          <p className="leading-relaxed text-muted">{p(sec.body)}</p>
          {sec.bullets && (
            <ul className="list-disc space-y-2 pl-5 text-sm text-foreground/90">
              {sec.bullets.map((b, i) => (
                <li key={i}>{p(b)}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section className="panel space-y-6 border-magenta/20">
        <div>
          <h2 className="font-heading text-2xl text-foreground">{t('guide.newUsers')}</h2>
          <p className="mt-2 text-sm text-muted">{t('guide.newUsersBrainstorm')}</p>
        </div>
        {newUserNeedsBrainstorm.map((group) => (
          <div key={p(group.category)}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-magenta">
              {p(group.category)}
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-foreground/90">
              {group.items.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-cyan">·</span>
                  <span>{p(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
