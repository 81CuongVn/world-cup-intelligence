import { describe, expect, it } from 'vitest';
import { isLikelyVietnamese, needsNewsTranslation, resolvePublisherLabel } from '../src/services/newsTranslationUtils';

describe('newsTranslationUtils', () => {
  it('detects Vietnamese diacritics', () => {
    expect(isLikelyVietnamese('Giá vé World Cup giảm mạnh', 'Ticket prices fall')).toBe(true);
    expect(isLikelyVietnamese('What is happening with World Cup ticket prices?')).toBe(false);
  });

  it('flags English copies as needing translation', () => {
    expect(
      needsNewsTranslation({
        id: 'doc-1',
        title: 'What is happening with World Cup ticket prices?',
        summary: 'With falling prices, fluctuating availability...',
        title_vi: 'What is happening with World Cup ticket prices?',
        summary_vi: 'With falling prices, fluctuating availability...',
      }),
    ).toBe(true);
  });

  it('resolves publisher from URL when mock source name', () => {
    expect(
      resolvePublisherLabel({
        source_name: 'Mock Development Source',
        source_url: 'https://www.bbc.co.uk/sport/football/articles/example',
      }),
    ).toBe('BBC');
  });
});
