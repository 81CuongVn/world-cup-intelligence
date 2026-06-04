export function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

export function xg(n: number): string {
  return n.toFixed(2);
}
