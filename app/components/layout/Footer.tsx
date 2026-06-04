import { brandTheme } from '../../lib/brand/brandTheme';
import { useI18n } from '../../lib/i18n/I18nContext';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-10 border-t border-border/60 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-heading text-lg font-extrabold tracking-tight text-foreground">
            {brandTheme.name}
          </p>
          <p className="mt-1 text-base text-foreground/85">{t('footer.tagline')}</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{t('footer.description')}</p>
        </div>
        <p className="text-sm text-muted-dim">
          FIFA World Cup 2026 · {t('footer.analytics')}
        </p>
      </div>
    </footer>
  );
}
