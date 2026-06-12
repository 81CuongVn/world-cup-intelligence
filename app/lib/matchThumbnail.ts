export function matchThumbnailUrl(ref: string): string {
  return `/api/matches/${encodeURIComponent(ref)}/thumbnail`;
}

/** PNG for Open Graph / social share previews. */
export function matchOgImageUrl(ref: string): string {
  return `/api/matches/${encodeURIComponent(ref)}/thumbnail.png`;
}
