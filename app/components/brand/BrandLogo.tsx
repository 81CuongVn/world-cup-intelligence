import { Link } from 'react-router-dom';
import { brandTheme } from '../../lib/brand/brandTheme';
import { useI18n } from '../../lib/i18n/I18nContext';

type Props = {
  compact?: boolean;
  showTagline?: boolean;
};

export function BrandLogo({ compact = false, showTagline = true }: Props) {
  const { t } = useI18n();
  const tagline = t('footer.tagline');

  return (
    <Link to="/" className="flex min-w-0 items-center gap-2.5 transition opacity-95 hover:opacity-100">
      <img
        src="/favicon-32x32.png"
        alt=""
        width={compact ? 32 : 36}
        height={compact ? 32 : 36}
        className="shrink-0 rounded-lg ring-1 ring-border/80"
        decoding="async"
      />
      {!compact && (
        <div className="min-w-0 leading-tight">
          <span className="font-heading block truncate text-lg font-extrabold tracking-tight text-foreground md:text-xl">
            {brandTheme.name}
          </span>
          {showTagline && (
            <span className="hidden truncate text-[10px] font-medium text-muted-dim sm:block">
              {tagline}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
