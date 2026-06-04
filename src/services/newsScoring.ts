/** Recency + source reliability for "hot" ranking (0–1 scale). */
export function computeHotScore(publishedAt: string, reliability: number): number {
  const pub = new Date(publishedAt).getTime();
  if (Number.isNaN(pub)) return reliability * 0.6;
  const ageHours = (Date.now() - pub) / 3_600_000;
  const recency = Math.max(0, Math.min(1, 1 - ageHours / 72));
  return Math.min(1, reliability * 0.55 + recency * 0.45);
}

/** Prefer ~medium width for card thumbnails when URL supports query params. */
export function mediumThumbnailUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('theguardian.com') && !u.searchParams.has('width')) {
      u.searchParams.set('width', '460');
      return u.toString();
    }
    if (u.hostname.includes('i.guim.co.uk') && !u.searchParams.has('width')) {
      u.searchParams.set('width', '460');
      return u.toString();
    }
    return url;
  } catch {
    return url;
  }
}
