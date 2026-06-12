import type { RssItem } from './TrustedNewsRssAdapter';

const FIFA_WC2026_NEWS =
  'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/news';

const FIFA_HEADERS = {
  Accept: 'text/html,application/json',
  'User-Agent': 'wc-tactical-platform/1.0 (FIFA WC2026 news reader)',
};

/** Candidate FIFA CMS / API paths (best-effort; site structure may change). */
const FIFA_API_CANDIDATES = [
  'https://www.fifa.com/api/v3/topic/worldcup2026/news?locale=en&limit=24',
  'https://www.fifa.com/api/v3/articles?locale=en&limit=24&tags=worldcup2026',
];

type FifaArticleJson = {
  title?: string;
  headline?: string;
  slug?: string;
  url?: string;
  link?: string;
  publishDate?: string;
  publishedAt?: string;
  date?: string;
  teaser?: string;
  summary?: string;
  description?: string;
  image?: { url?: string };
  thumbnail?: { url?: string };
};

function normalizeArticleUrl(path: string): string {
  if (path.startsWith('http')) return path.split('?')[0]!;
  const base = 'https://www.fifa.com';
  return `${base}${path.startsWith('/') ? path : `/${path}`}`.split('?')[0]!;
}

function mapJsonArticle(raw: FifaArticleJson): RssItem | null {
  const title = (raw.title ?? raw.headline ?? '').trim();
  const link = raw.url ?? raw.link ?? (raw.slug ? normalizeArticleUrl(raw.slug) : '');
  if (!title || !link) return null;
  const description = (raw.teaser ?? raw.summary ?? raw.description ?? title).trim();
  const pubDate = raw.publishDate ?? raw.publishedAt ?? raw.date ?? new Date().toISOString();
  const imageUrl = raw.image?.url ?? raw.thumbnail?.url ?? null;
  return { title, link: normalizeArticleUrl(link), description, pubDate, imageUrl };
}

function extractArticlesFromJson(payload: unknown): RssItem[] {
  if (!payload || typeof payload !== 'object') return [];
  const root = payload as Record<string, unknown>;
  const arrays: unknown[] = [];
  for (const key of ['items', 'articles', 'results', 'data', 'news']) {
    const val = root[key];
    if (Array.isArray(val)) arrays.push(...val);
    if (val && typeof val === 'object' && 'items' in (val as object)) {
      const nested = (val as { items?: unknown[] }).items;
      if (Array.isArray(nested)) arrays.push(...nested);
    }
  }
  return arrays
    .map((a) => mapJsonArticle(a as FifaArticleJson))
    .filter((x): x is RssItem => x != null);
}

function extractNextDataArticles(html: string): RssItem[] {
  const match = /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/i.exec(
    html,
  );
  if (!match?.[1]) return [];
  try {
    const data = JSON.parse(match[1]) as Record<string, unknown>;
    const items: RssItem[] = [];
    const walk = (node: unknown, depth = 0) => {
      if (depth > 12 || !node || typeof node !== 'object') return;
      const obj = node as Record<string, unknown>;
      if (typeof obj.title === 'string' && (obj.slug || obj.url || obj.path)) {
        const mapped = mapJsonArticle({
          title: obj.title as string,
          headline: obj.headline as string | undefined,
          slug: (obj.slug ?? obj.path ?? obj.url) as string,
          teaser: (obj.teaser ?? obj.summary ?? obj.description) as string | undefined,
          publishDate: (obj.publishDate ?? obj.date ?? obj.publishedAt) as string | undefined,
          image: obj.image as FifaArticleJson['image'],
          thumbnail: obj.thumbnail as FifaArticleJson['thumbnail'],
        });
        if (mapped) items.push(mapped);
      }
      for (const v of Object.values(obj)) {
        if (Array.isArray(v)) v.forEach((c) => walk(c, depth + 1));
        else walk(v, depth + 1);
      }
    };
    walk(data);
    const seen = new Set<string>();
    return items.filter((i) => {
      if (seen.has(i.link)) return false;
      seen.add(i.link);
      return i.link.includes('/articles/') || i.link.includes('canadamexicousa2026');
    });
  } catch {
    return [];
  }
}

function extractArticleLinksFromHtml(html: string): string[] {
  const links = new Set<string>();
  const re = /href="(\/en\/articles\/[^"?#]+)"/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    links.add(normalizeArticleUrl(m[1]!));
  }
  return [...links];
}

async function fetchArticleMeta(url: string): Promise<RssItem | null> {
  try {
    const res = await fetch(url, { headers: FIFA_HEADERS, signal: AbortSignal.timeout(12000) });
    if (!res.ok) return null;
    const html = await res.text();
    const title =
      /<meta property="og:title" content="([^"]+)"/i.exec(html)?.[1] ??
      /<title>([^<]+)<\/title>/i.exec(html)?.[1] ??
      '';
    const description =
      /<meta property="og:description" content="([^"]+)"/i.exec(html)?.[1] ??
      /<meta name="description" content="([^"]+)"/i.exec(html)?.[1] ??
      title;
    const imageUrl = /<meta property="og:image" content="([^"]+)"/i.exec(html)?.[1] ?? null;
    const pubDate =
      /<meta property="article:published_time" content="([^"]+)"/i.exec(html)?.[1] ??
      new Date().toISOString();
    if (!title.trim()) return null;
    return {
      title: title.trim(),
      link: url,
      description: description.trim().slice(0, 600),
      pubDate,
      imageUrl,
    };
  } catch {
    return null;
  }
}

export async function fetchFifaWc2026NewsItems(maxItems = 12): Promise<RssItem[]> {
  for (const apiUrl of FIFA_API_CANDIDATES) {
    try {
      const res = await fetch(apiUrl, { headers: FIFA_HEADERS, signal: AbortSignal.timeout(10000) });
      if (!res.ok) continue;
      const json = (await res.json()) as unknown;
      const items = extractArticlesFromJson(json);
      if (items.length > 0) return items.slice(0, maxItems);
    } catch {
      /* try next */
    }
  }

  try {
    const res = await fetch(FIFA_WC2026_NEWS, { headers: FIFA_HEADERS, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return [];
    const html = await res.text();
    const fromNext = extractNextDataArticles(html);
    if (fromNext.length > 0) return fromNext.slice(0, maxItems);

    const links = extractArticleLinksFromHtml(html).slice(0, maxItems);
    const metas = await Promise.all(links.map((u) => fetchArticleMeta(u)));
    return metas.filter((x): x is RssItem => x != null);
  } catch {
    return [];
  }
}
