import type { NewsArticle } from '../../lib/api';
import { SourceConfidenceBadge } from '../intelligence/SourceConfidenceBadge';
import { NewsThumbnail } from './NewsThumbnail';
import { useI18n } from '../../lib/i18n/I18nContext';
import { pickNewsTitle, pickNewsSummary } from '../../lib/newsDisplay';

type Props = {
  article: NewsArticle;
  variant?: 'standard' | 'hot';
  onSelect: () => void;
};

export function NewsArticleCard({ article, variant = 'standard', onSelect }: Props) {
  const { mode, t } = useI18n();
  const locale = mode === 'en' ? 'en' : 'vi-VN';
  const isHot = variant === 'hot';
  const title = pickNewsTitle(article, mode);
  const summary = pickNewsSummary(article, mode);
  const thumbClass = isHot ? 'block shrink-0 md:w-[42%]' : 'block';
  const titleClass = `font-medium text-foreground group-hover:text-cyan ${isHot ? 'text-base md:text-lg' : 'text-sm'}`;

  return (
    <article
      className={`group cursor-pointer overflow-hidden rounded-xl border border-border/60 bg-panel2/30 transition hover:border-cyan/40 hover:bg-panel2/60 ${
        isHot ? 'md:flex md:gap-4' : ''
      }`}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      role="button"
      tabIndex={0}
    >
      <div className={thumbClass}>
        <NewsThumbnail article={article} size={isHot ? 'large' : 'medium'} />
      </div>
      <div className={`p-3 ${isHot ? 'md:flex md:flex-1 md:flex-col md:justify-center md:py-4' : ''}`}>
        {isHot && (
          <span className="mb-1 inline-block w-fit rounded-full bg-live/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-live">
            {t('common.hot')}
          </span>
        )}
        <p className={titleClass}>{title}</p>
        <p className={`mt-1 text-muted ${isHot ? 'line-clamp-3 text-sm' : 'line-clamp-2 text-xs'}`}>
          {summary}
        </p>
        <div className="mt-3 flex min-w-0 items-start justify-between gap-3 border-t border-border/40 pt-2">
          <SourceConfidenceBadge name={article.source_name ?? 'RSS'} score={article.reliability_score} />
          <time className="shrink-0 text-xs text-muted">
            {new Date(article.published_at).toLocaleDateString(locale, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </time>
        </div>
        <p className="mt-2 text-xs font-medium text-cyan/80 group-hover:text-cyan">
          {t('news.tapToRead')} →
        </p>
      </div>
    </article>
  );
}
