import type { AppEnv } from '../env';
import { logError, logInfo } from '../utils/logger';

const MAX_DOWNLOAD_BYTES = 2_500_000;
const MAX_WIDTH = 640;
const WEBP_QUALITY = 0.82;
const FETCH_TIMEOUT_MS = 12_000;

function looksLikeImageUrl(url: string): boolean {
  return /\.(jpe?g|png|gif|webp|avif)(\?|$)/i.test(url);
}

function isImageContentType(contentType: string, url: string): boolean {
  const ct = contentType.toLowerCase();
  if (ct.startsWith('image/')) return true;
  if (ct.includes('octet-stream') && looksLikeImageUrl(url)) return true;
  return looksLikeImageUrl(url);
}

export function newsThumbnailR2Key(docId: string): string {
  return `news/thumbs/${docId}.webp`;
}

export function newsAssetPublicPath(docId: string): string {
  return `/api/news/assets/${docId}`;
}

/**
 * Download RSS image, resize/compress to WebP, store on R2_ARTIFACTS for CDN serve.
 */
export async function compressAndStoreNewsImage(
  env: AppEnv,
  docId: string,
  imageUrl: string | null | undefined,
): Promise<string | null> {
  if (!imageUrl?.trim()) return null;

  try {
    const res = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'wc-tactical-platform/1.0 (news-thumb)',
        Accept: 'image/*',
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      cf: { cacheTtl: 86400 },
    } as RequestInit);

    if (!res.ok) {
      logError('thumb fetch failed', { docId, status: res.status });
      return null;
    }

    const contentType = res.headers.get('content-type') ?? '';
    if (!isImageContentType(contentType, imageUrl)) {
      logError('thumb not an image', { docId, contentType });
      return null;
    }

    const buf = await res.arrayBuffer();
    if (buf.byteLength > MAX_DOWNLOAD_BYTES || buf.byteLength < 200) {
      logError('thumb size rejected', { docId, bytes: buf.byteLength });
      return null;
    }

    const blob = new Blob([buf], { type: contentType });
    let outBlob: Blob;

    try {
      const bitmap = await createImageBitmap(blob);
      const scale = Math.min(1, MAX_WIDTH / bitmap.width);
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = new OffscreenCanvas(w, h);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('no 2d context');
      ctx.drawImage(bitmap, 0, 0, w, h);
      bitmap.close();
      outBlob = await canvas.convertToBlob({ type: 'image/webp', quality: WEBP_QUALITY });
    } catch {
      outBlob = blob;
    }

    const r2Key = newsThumbnailR2Key(docId);
    const outType = outBlob.type.includes('webp') ? 'image/webp' : contentType;
    await env.R2_ARTIFACTS.put(r2Key, await outBlob.arrayBuffer(), {
      httpMetadata: {
        contentType: outType,
        cacheControl: 'public, max-age=31536000, immutable',
      },
    });

    logInfo('news thumb stored', { docId, r2Key, bytes: outBlob.size });
    return r2Key;
  } catch (e) {
    logError('news image pipeline failed', { docId, error: String(e) });
    return null;
  }
}
