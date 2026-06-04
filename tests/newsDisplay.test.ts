import { describe, expect, it } from 'vitest';
import { pickNewsTitle, pickNewsSummary } from '../app/lib/newsDisplay';
import type { NewsArticle } from '../app/lib/api';

const article: NewsArticle = {
  id: 'doc-1',
  title: 'Vietnamese default from API',
  titleEn: 'England win',
  titleVi: 'Anh thắng',
  source_url: 'https://example.com',
  summary: 'VI summary default',
  summaryEn: 'Short EN',
  summaryVi: 'Tóm tắt VI',
  published_at: '2026-06-01T00:00:00Z',
  reliability_score: 0.8,
};

describe('newsDisplay', () => {
  it('prefers Vietnamese in vi mode', () => {
    expect(pickNewsTitle(article, 'vi')).toBe('Anh thắng');
    expect(pickNewsSummary(article, 'vi')).toBe('Tóm tắt VI');
  });

  it('prefers English in en mode', () => {
    expect(pickNewsTitle(article, 'en')).toBe('England win');
    expect(pickNewsSummary(article, 'en')).toBe('Short EN');
  });
});
