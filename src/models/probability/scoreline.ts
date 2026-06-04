import { poissonPmf } from './poisson';
import { dixonColesAdjust } from './dixonColes';

const MAX_GOALS = 6;

export function buildScorelineMatrix(lambdaHome: number, lambdaAway: number): Record<string, number> {
  const matrix: Record<string, number> = {};
  let total = 0;
  for (let i = 0; i <= MAX_GOALS; i++) {
    for (let j = 0; j <= MAX_GOALS; j++) {
      let p = poissonPmf(i, lambdaHome) * poissonPmf(j, lambdaAway);
      p = dixonColesAdjust(i, j, p, lambdaHome, lambdaAway);
      const key = `${i}-${j}`;
      matrix[key] = p;
      total += p;
    }
  }
  for (const key of Object.keys(matrix)) {
    matrix[key] /= total;
  }
  return matrix;
}

export function aggregateWdl(matrix: Record<string, number>): {
  homeWin: number;
  draw: number;
  awayWin: number;
} {
  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;
  for (const [key, p] of Object.entries(matrix)) {
    const [h, a] = key.split('-').map(Number);
    if (h > a) homeWin += p;
    else if (h === a) draw += p;
    else awayWin += p;
  }
  return { homeWin, draw, awayWin };
}

export function mostLikelyScore(matrix: Record<string, number>): string {
  return Object.entries(matrix).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '0-0';
}
