export function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

/** Integer % for compact schedule rows (e.g. 36·27·37). */
export function pctCompact(n: number): string {
  return String(Math.round(n * 100));
}

export function xg(n: number): string {
  return n.toFixed(2);
}

/** Canonical scoreline key for model matrix lookup (e.g. 2-0). */
export function formatScoreline(home: number, away: number): string {
  return `${home}-${away}`;
}

export function normalizeScorelineKey(score: string): string {
  return score.replace(/[–—]/g, '-').trim();
}
