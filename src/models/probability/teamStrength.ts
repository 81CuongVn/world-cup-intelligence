import type { TeamFeatures } from './types';

export function teamAttackStrength(team: TeamFeatures): number {
  const elo = team.eloRating / 2000;
  const xg = team.xgFor / 1.5;
  const form = 0.5 + team.recentForm * 0.5;
  const transition = 0.9 + team.transitionThreat * 0.2;
  return clamp(elo * 0.4 + xg * 0.35 + form * 0.15 + transition * 0.1, 0.4, 1.6);
}

export function teamDefenseWeakness(team: TeamFeatures): number {
  const xga = team.xgAgainst / 1.5;
  const compact = 1 - team.defensiveCompactness * 0.15;
  const setPiece = 1 + team.setPieceXga * 0.1;
  return clamp(0.6 + xga * 0.5 + compact * 0.2 + setPiece * 0.1, 0.5, 1.5);
}

export function collectiveModifier(team: TeamFeatures): number {
  const press = 1 + (1 - team.ppda / 15) * 0.05;
  const tilt = 1 + team.fieldTilt * 0.08;
  const bench = 0.95 + team.benchDepth * 0.1;
  const gk = 0.95 + team.goalkeeperStrength * 0.1;
  const rest = 1 + Math.min(team.restDays, 7) * 0.01;
  return clamp(press * tilt * bench * gk * rest, 0.85, 1.2);
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
