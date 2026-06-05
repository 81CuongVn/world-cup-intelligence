import type { NewsArticle } from '../../lib/api';
import { SourceConfidencePanel } from '../intelligence/SourceConfidencePanel';
import { useI18n } from '../../lib/i18n/I18nContext';
import { pickNewsTitle, pickNewsSummary } from '../../lib/newsDisplay';
import { NewsArticleLangToggle, type ArticleLang } from './NewsArticleLangToggle';

type Props = {
  article: NewsArticle;
  articleLang: ArticleLang;
  onArticleLangChange: (lang: ArticleLang) => void;
  onBack: () => void;
  translationPending?: boolean;
};

export function NewsArticleReadView({
  article,
  articleLang,
  onArticleLangChange,
  onBack,
  translationPending = false,
}: Props) {
  const { t } = useI18n();
  const locale = articleLang === 'en' ? 'en' : 'vi-VN';

  const needsVi = articleLang === 'vi' && !article.translated;
  const title = needsVi
    ? translationPending
      ? t('news.translating')
      : pickNewsTitle(article, 'en')
    : pickNewsTitle(article, articleLang);
  const summary = needsVi
    ? translationPending
      ? t('news.translatingBody')
      : pickNewsSummary(article, 'en')
    : pickNewsSummary(article, articleLang);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="text-sm text-muted hover:text-cyan">
          ← {t('news.backToFeed')}
        </button>
        <NewsArticleLangToggle lang={articleLang} onChange={onArticleLangChange} />
      </div>

      <article className="panel mx-auto max-w-3xl space-y-6">
        <header className="space-y-3 border-b border-border/60 pb-5">
          <time className="text-xs text-muted">
            {new Date(article.published_at).toLocaleDateString(locale, {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
          <h1 className="font-heading text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
            {title}
          </h1>
          <SourceConfidencePanel
            sources={[
              {
                name: article.source_name ?? 'RSS',
                score: article.reliability_score,
                url: article.source_url,
              },
            ]}
            compact
          />
        </header>

        <div className="space-y-3">
          <p className="label-tactical text-cyan">{t('news.briefLabel')}</p>
          {needsVi && !translationPending && (
            <p className="text-sm text-muted">{t('news.translationFallback')}</p>
          )}
          <div className="editorial-prose whitespace-pre-line text-foreground/95">{summary}</div>
        </div>

        {(!needsVi || !translationPending) && article.source_url && (
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-cyan/40 bg-cyan/10 px-5 py-3 text-sm font-semibold text-cyan transition hover:bg-cyan/20"
          >
            {t('news.readAtSource')}
          </a>
        )}
      </article>
    </div>
  );
}
