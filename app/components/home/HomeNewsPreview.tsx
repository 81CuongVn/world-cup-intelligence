import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, type NewsArticle } from '../../lib/api';
import { NewsArticleCard } from '../news/NewsArticleCard';
import { useI18n } from '../../lib/i18n/I18nContext';

const REFRESH_MS = 30_000;
const POLL_MS = 4_000;
const MAX_POLLS = 8;

export function HomeNewsPreview() {
  const { mode, t } = useI18n();
  const navigate = useNavigate();
  const [hot, setHot] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [polls, setPolls] = useState(0);

  const load = useCallback(async () => {
    try {
      const r = await api.news({ page: 1, pageSize: 3, hot: 3 });
      setHot(r.data.hot.slice(0, 3));
    } catch {
      setHot([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setPolls(0);
    load();
  }, [load, mode]);

  useEffect(() => {
    const timer = setInterval(load, REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  const needsVi = mode === 'vi' && hot.some((a) => !a.translated);

  useEffect(() => {
    if (!needsVi || polls >= MAX_POLLS) return;
    const timer = setInterval(() => {
      setPolls((n) => n + 1);
      load();
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [needsVi, polls, load]);

  if (loading && !hot.length) {
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
