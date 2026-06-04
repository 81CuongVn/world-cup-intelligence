import { describe, expect, it } from 'vitest';
import { newsThumbnailR2Key, newsAssetPublicPath } from '../src/services/newsImagePipeline';

describe('newsImagePipeline paths', () => {
  it('builds stable R2 and CDN paths', () => {
    expect(newsThumbnailR2Key('doc-abc')).toBe('news/thumbs/doc-abc.webp');
    expect(newsAssetPublicPath('doc-abc')).toBe('/api/news/assets/doc-abc');
  });
});
