import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, type NewsArticle } from '../lib/api';
import { NewsArticleReadView } from '../components/news/NewsArticleReadView';
import type { ArticleLang } from '../components/news/NewsArticleLangToggle';
import { useI18n } from '../lib/i18n/I18nContext';

export function NewsArticlePage() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { mode, t } = useI18n();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [articleLang, setArticleLang] = useState<ArticleLang>(mode === 'en' ? 'en' : 'vi');

  useEffect(() => {
    if (!articleId) return;
    setLoading(true);
    setError(false);
    api
      .newsArticle(articleId)
      .then((r) => setArticle(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [articleId]);

  useEffect(() => {
    if (articleLang !== 'vi' || !article || article.translated) return;
    api
      .newsArticle(article.id)
      .then((r) => setArticle(r.data))
      .catch(() => undefined);
  }, [articleLang, article?.id, article?.translated]);

  if (!articleId) {
    return (
      <p className="text-muted">
        <Link to="/news-intelligence" className="text-cyan hover:underline">
          ← {t('news.backToFeed')}
        </Link>
      </p>
    );
  }

  if (error) {
    return (
      <div className="panel space-y-3">
        <p className="text-muted">{t('news.notFound')}</p>
        <Link to="/news-intelligence" className="text-sm text-cyan hover:underline">
          ← {t('news.backToFeed')}
        </Link>
      </div>
    );
  }

  if (loading || !article) {
    return (
      <div className="panel text-muted">
        {articleLang === 'vi' ? t('news.translating') : t('news.loading')}
      </div>
    );
  }

  return (
    <NewsArticleReadView
      article={article}
      articleLang={articleLang}
      onArticleLangChange={setArticleLang}
      onBack={() => navigate('/news-intelligence')}
    />
  );
}
