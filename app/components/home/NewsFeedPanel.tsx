import type { NewsArticle } from '../../lib/api';
import { Bilingual } from '../i18n/Bilingual';
import { NewsArticleCard } from '../news/NewsArticleCard';
import { NewsPagination } from '../news/NewsPagination';
import { useI18n } from '../../lib/i18n/I18nContext';

type Props = {
  hot: NewsArticle[];
  articles: NewsArticle[];
  lastCrawl: string | null;
  page: number;
  totalPages: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onSelectArticle: (article: NewsArticle) => void;
};

export function NewsFeedPanel({
  hot,
  articles,
  lastCrawl,
  page,
  totalPages,
  loading,
  onPageChange,
  onSelectArticle,
}: Props) {
  const { mode, t } = useI18n();
  const locale = mode === 'en' ? 'en' : 'vi-VN';

  return (
    <section className="panel space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Bilingual k="news.feedTitle" as="h2" className="label-tactical text-cyan" />
        {lastCrawl && (
          <span className="text-xs text-muted">
            {t('common.updatedAt')}{' '}
            {new Date(lastCrawl).toLocaleTimeString(locale)}
          </span>
        )}
      </div>

      {hot.length > 0 && page === 1 && (
        <div className="space-y-3">
          <Bilingual k="news.hot" as="h3" className="text-xs font-semibold uppercase tracking-wider text-live" />
          <ul className="space-y-4">
            {hot.map((a) => (
              <li key={a.id}>
                <NewsArticleCard
                  article={a}
                  variant="hot"
                  onSelect={() => onSelectArticle(a)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-3">
        <Bilingual k="news.latest" as="h3" className="text-xs font-semibold uppercase tracking-wider text-muted" />
        {loading && articles.length === 0 ? (
          <p className="text-sm text-muted">
            <Bilingual k="news.loading" />
          </p>
        ) : articles.length === 0 ? (
          <p className="text-sm text-muted">
            <Bilingual k="news.empty" />
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {articles.map((a) => (
              <li key={a.id}>
                <NewsArticleCard
                  article={a}
                  variant="standard"
                  onSelect={() => onSelectArticle(a)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <NewsPagination page={page} totalPages={totalPages} onPageChange={onPageChange} loading={loading} />
    </section>
  );
}
