import type { AppEnv } from '../env';
import { WC_NEWS_FEEDS, parseRssItems, isWorldCupRelated } from './adapters/TrustedNewsRssAdapter';
import { computeHotScore } from '../services/newsScoring';
import { compressAndStoreNewsImage, newsAssetPublicPath } from '../services/newsImagePipeline';
import { normalizeFeedImageUrl } from '../services/newsImageUrls';
import { backfillNewsThumbnails } from '../services/newsThumbnailBackfill';
import { registerNewsFeedSource } from '../services/newsSourceBackfill';
import { translateNewsHeadline } from '../ai/translateNews';
import { newId } from '../utils/ids';
import { nowIso } from '../utils/time';
import { logInfo, logError } from '../utils/logger';

export async function crawlWorldCupNews(env: AppEnv): Promise<number> {
  let inserted = 0;

  for (const feed of WC_NEWS_FEEDS) {
    const sourceId = await registerNewsFeedSource(env, feed);
    try {
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'wc-tactical-platform/1.0 (rss-reader)' },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) {
        logError('rss fetch failed', { feed: feed.id, status: res.status });
        continue;
      }
      const xml = await res.text();
      const items = parseRssItems(xml, 20).filter((i) =>
        isWorldCupRelated(i.title, i.description),
      );

      for (const item of items.slice(0, 8)) {
        const existing = await env.DB.prepare(
          'SELECT id FROM source_documents WHERE source_url = ?',
        )
          .bind(item.link)
          .first();
        if (existing) continue;

        const docId = newId('doc');
        const summaryEn = item.description.slice(0, 500);

        const translation = await translateNewsHeadline(env, item.title, summaryEn);
        const titleVi = translation?.titleVi?.trim() || null;
        const summaryVi = translation?.summaryVi?.trim() || null;
        if (!titleVi || !summaryVi) {
          logError('news translation deferred — will backfill on read', {
            title: item.title.slice(0, 80),
          });
        }

        const feedImage = normalizeFeedImageUrl(item.imageUrl);
        const thumbnailR2Key = await compressAndStoreNewsImage(env, docId, feedImage);
        const thumbnailUrl = thumbnailR2Key
          ? newsAssetPublicPath(docId)
          : feedImage;

        const r2Key = `news/${feed.id}/${docId}.json`;
        await env.R2_RAW.put(
          r2Key,
          JSON.stringify({
            ...item,
            feedId: feed.id,
            crawledAt: nowIso(),
            titleVi,
            summaryVi,
            thumbnailR2Key,
          }),
          { httpMetadata: { contentType: 'application/json' } },
        );

        const hotScore = computeHotScore(item.pubDate, feed.reliability);

        await env.DB.prepare(
          `INSERT INTO source_documents (
            id, source_id, source_url, title, title_vi, published_at, retrieved_at,
            summary, summary_vi, reliability_score, content_r2_key, thumbnail_url, thumbnail_r2_key, hot_score
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
          .bind(
            docId,
            sourceId,
            item.link,
            item.title,
            titleVi,
            item.pubDate,
            nowIso(),
            summaryEn,
            summaryVi,
            feed.reliability,
            r2Key,
            thumbnailUrl,
            thumbnailR2Key,
            hotScore,
          )
          .run();
        inserted++;

        if (env.MODEL_QUEUE) {
          await env.MODEL_QUEUE.send({
            type: 'ai_extract_news',
            documentId: docId,
            content: `${titleVi}\n${summaryVi}`,
          });
        }
      }
    } catch (e) {
      logError('rss crawl error', { feed: feed.id, error: String(e) });
    }
  }

  await backfillNewsThumbnails(env, 60);

  await env.KV.put('meta:last_news_crawl', nowIso(), { expirationTtl: 86400 });
  logInfo('news crawl complete', { inserted });
  return inserted;
}
