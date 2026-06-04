import type { DisplayMode } from './i18n/I18nContext';
import type { NewsArticle } from './api';

export type ArticleLang = 'vi' | 'en';

export function pickNewsTitle(article: NewsArticle, mode: DisplayMode | ArticleLang): string {
  if (mode === 'en') return article.titleEn ?? article.title;
  if (article.titleVi?.trim()) return article.titleVi;
  return article.title;
}

export function pickNewsSummary(article: NewsArticle, mode: DisplayMode | ArticleLang): string {
  if (mode === 'en') return article.summaryEn ?? article.summary;
  if (article.summaryVi?.trim()) return article.summaryVi;
  return article.summary;
}
