import type { AppEnv } from '../env';
import { translateNewsHeadline } from '../ai/translateNews';
import { logInfo } from '../utils/logger';
import {
  isLikelyVietnamese,
  needsNewsTranslation,
  type NewsDocRow,
} from './newsTranslationUtils';

export type { NewsDocRow } from './newsTranslationUtils';
export {
  isLikelyVietnamese,
  needsNewsTranslation,
  resolvePublisherLabel,
} from './newsTranslationUtils';

export async function ensureNewsArticleTranslated(
  env: AppEnv,
  row: NewsDocRow,
): Promise<NewsDocRow | null> {
  if (!needsNewsTranslation(row)) return null;

  const translation = await translateNewsHeadline(env, row.title, row.summary);
  if (!translation) return null;

  await env.DB.prepare(`UPDATE source_documents SET title_vi = ?, summary_vi = ? WHERE id = ?`)
    .bind(translation.titleVi, translation.summaryVi, row.id)
    .run();

  return {
    ...row,
    title_vi: translation.titleVi,
    summary_vi: translation.summaryVi,
  };
}

export async function countUntranslatedNews(env: AppEnv): Promise<number> {
  const { results } = await env.DB.prepare(
    `SELECT id, title, summary, title_vi, summary_vi FROM source_documents ORDER BY published_at DESC LIMIT 120`,
  ).all<NewsDocRow>();
  return (results ?? []).filter(needsNewsTranslation).length;
}

export async function backfillNewsTranslations(env: AppEnv, limit = 25): Promise<number> {
  const { results } = await env.DB.prepare(
    `SELECT id, title, summary, title_vi, summary_vi
     FROM source_documents
     ORDER BY published_at DESC
     LIMIT ?`,
  )
    .bind(Math.max(limit * 4, 80))
    .all<NewsDocRow>();

  const rows = (results ?? []).filter(needsNewsTranslation).slice(0, limit);
  if (!rows.length) return 0;

  let updated = 0;
  for (const row of rows) {
    const patched = await ensureNewsArticleTranslated(env, row);
    if (patched) updated++;
  }

  if (updated) logInfo('news translations backfilled', { updated });
  return updated;
}
