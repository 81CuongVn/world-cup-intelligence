import type { AppEnv } from '../env';
import { gatewayChatJson, isGatewayConfigured } from './gatewayClient';
import { isLikelyVietnamese } from '../services/newsTranslationUtils';

export type NewsTranslation = {
  titleVi: string;
  summaryVi: string;
};

type TranslationResponse = {
  titleVi: string;
  summaryVi: string;
};

const SYSTEM =
  'You translate football news into natural Vietnamese for Vietnamese readers. Output JSON only. Use proper Vietnamese diacritics. Keep proper nouns (team names, players, FIFA, World Cup). Do not invent facts beyond the source text.';

const USER_PROMPT = (title: string, summary: string) =>
  `Dịch sang tiếng Việt tự nhiên. Viết tóm tắt 3–5 câu (tối đa 420 ký tự).

Title: ${title.slice(0, 300)}
Source text: ${summary.slice(0, 800)}

JSON: { "titleVi": "...", "summaryVi": "..." }`;

function parseTranslationJson(text: string): TranslationResponse | null {
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    return JSON.parse(text.slice(start, end + 1)) as TranslationResponse;
  } catch {
    return null;
  }
}

function normalizeTranslation(
  parsed: TranslationResponse,
  title: string,
  summary: string,
): NewsTranslation | null {
  const titleVi = parsed.titleVi?.trim().slice(0, 320);
  const summaryVi = (parsed.summaryVi ?? summary).trim().slice(0, 520);
  if (!titleVi || !isLikelyVietnamese(titleVi, title)) return null;
  if (!isLikelyVietnamese(summaryVi, summary)) return null;
  return { titleVi, summaryVi };
}

async function workersAiTranslate(
  env: AppEnv,
  title: string,
  summary: string,
): Promise<NewsTranslation | null> {
  if (!env.AI) return null;
  const models = [
    '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
    '@cf/meta/llama-3-8b-instruct',
  ] as const;

  for (const model of models) {
    try {
      const response = await env.AI.run(model, {
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: USER_PROMPT(title, summary) },
        ],
      });
      const text =
        typeof response === 'object' && response && 'response' in response
          ? String((response as { response: string }).response)
          : JSON.stringify(response);
      const parsed = parseTranslationJson(text);
      if (parsed) {
        const normalized = normalizeTranslation(parsed, title, summary);
        if (normalized) return normalized;
      }
    } catch {
      /* try next model */
    }
  }
  return null;
}

export async function translateNewsHeadline(
  env: AppEnv,
  title: string,
  summary: string,
): Promise<NewsTranslation | null> {
  if (!title.trim()) return null;

  if (isGatewayConfigured(env)) {
    try {
      const parsed = await gatewayChatJson<TranslationResponse>(env, 'news_summary', [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: USER_PROMPT(title, summary) },
      ]);
      if (parsed) {
        const normalized = normalizeTranslation(parsed, title, summary);
        if (normalized) return normalized;
      }
    } catch {
      /* Workers AI fallback below */
    }
  }

  return workersAiTranslate(env, title, summary);
}
