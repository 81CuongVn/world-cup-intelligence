import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { NewsFeedPanel } from '../components/home/NewsFeedPanel';
import { Bilingual } from '../components/i18n/Bilingual';

const PAGE_SIZE = 8;
const REFRESH_MS = 900_000;

export function NewsIntelligencePage() {
  const navigate = useNavigate();
  const [hot, setHot] = useState<Awaited<ReturnType<typeof api.news>>['data']['hot']>([]);
  const [articles, setArticles] = useState<Awaited<ReturnType<typeof api.news>>['data']['articles']>([]);
  const [lastCrawl, setLastCrawl] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const r = await api.news({ page: p, pageSize: PAGE_SIZE });
      setHot(r.data.hot);
      setArticles(r.data.articles);
      setLastCrawl(r.meta.lastCrawl);
      setTotalPages(r.meta.totalPages);
    } catch {
      setHot([]);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  useEffect(() => {
    const t = setInterval(() => load(page), REFRESH_MS);
    return () => clearInterval(t);
  }, [page, load]);

  const handlePageChange = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openArticle = (id: string) => {
    navigate(`/news-intelligence/${id}`);
  };

  return (
    <div className="space-y-6">
      <header>
        <Bilingual
          k="news.pageTitle"
          as="h1"
          className="font-heading text-4xl tracking-tight md:text-5xl"
        />
        <Bilingual k="news.pageSubtitle" as="p" className="mt-2 max-w-2xl text-editorial text-muted" />
      </header>

      <NewsFeedPanel
        hot={hot}
        articles={articles}
        lastCrawl={lastCrawl}
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPageChange={handlePageChange}
        onSelectArticle={(a) => openArticle(a.id)}
      />
    </div>
  );
}
