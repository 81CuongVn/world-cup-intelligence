import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, type NewsArticle } from '../../lib/api';
import { NewsArticleCard } from '../news/NewsArticleCard';
import { useI18n } from '../../lib/i18n/I18nContext';

export function HomeNewsPreview() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [hot, setHot] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .news({ page: 1, pageSize: 3, hot: 3 })
      .then((r) => setHot(r.data.hot.slice(0, 3)))
      .catch(() => setHot([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <section className="panel text-sm text-muted">{t('home.loadingHeadlines')}</section>;
  }

  if (!hot.length) return null;

  return (
    <section className="panel space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="label-tactical text-yellow">{t('home.headlines')}</h2>
        <Link to="/news-intelligence" className="text-sm text-cyan hover:underline">
          {t('common.allNews')}
        </Link>
      </div>
      <ul className="space-y-3">
        {hot.map((a) => (
          <li key={a.id}>
            <NewsArticleCard
              article={a}
              variant="hot"
              onSelect={() => navigate(`/news-intelligence/${a.id}`)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
