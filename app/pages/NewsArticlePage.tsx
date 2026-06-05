import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, type NewsArticle } from '../lib/api';
import { NewsArticleReadView } from '../components/news/NewsArticleReadView';
import type { ArticleLang } from '../components/news/NewsArticleLangToggle';
import { useI18n } from '../lib/i18n/I18nContext';

const POLL_MS = 2500;
const MAX_POLLS = 12;

export function NewsArticlePage() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { mode, t } = useI18n();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [articleLang, setArticleLang] = useState<ArticleLang>(mode === 'en' ? 'en' : 'vi');
  const [polls, setPolls] = useState(0);

  useEffect(() => {
    if (!articleId) return;
    setLoading(true);
    setError(false);
    setPolls(0);
    api
      .newsArticle(articleId)
      .then((r) => setArticle(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [articleId]);

  useEffect(() => {
    if (articleLang !== 'vi' || !article?.id || article.translated || polls >= MAX_POLLS) return;

    const timer = setInterval(() => {
      setPolls((n) => n + 1);
      api
        .newsArticle(article.id)
        .then((r) => setArticle(r.data))
        .catch(() => undefined);
    }, POLL_MS);

    return () => clearInterval(timer);
  }, [articleLang, article?.id, article?.translated, polls]);

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
      translationPending={articleLang === 'vi' && !article.translated && polls < MAX_POLLS}
    />
  );
}
