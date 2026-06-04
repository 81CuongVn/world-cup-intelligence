import type { ExplanationFactor, MatchFeatureInput } from './types';
import { teamAttackStrength, teamDefenseWeakness } from './teamStrength';

export function buildExplanationFactors(input: MatchFeatureInput): {
  positive: ExplanationFactor[];
  negative: ExplanationFactor[];
} {
  const factors: ExplanationFactor[] = [
    {
      key: 'home_elo',
      label: 'Home Elo advantage',
      direction: input.homeTeam.eloRating >= input.awayTeam.eloRating ? 'home' : 'away',
      impact: Math.abs(input.homeTeam.eloRating - input.awayTeam.eloRating) / 500,
      confidence: 0.9,
      evidenceType: 'statistical',
    },
    {
      key: 'xg_for',
      label: 'Expected goals profile',
      direction: input.homeTeam.xgFor >= input.awayTeam.xgFor ? 'home' : 'away',
      impact: Math.abs(input.homeTeam.xgFor - input.awayTeam.xgFor) / 2,
      confidence: 0.85,
      evidenceType: 'statistical',
    },
    {
      key: 'defense',
      label: 'Defensive solidity',
      direction:
        teamDefenseWeakness(input.awayTeam) < teamDefenseWeakness(input.homeTeam) ? 'home' : 'away',
      impact: 0.15,
      confidence: 0.8,
      evidenceType: 'statistical',
    },
    {
      key: 'attack',
      label: 'Collective attack strength',
      direction:
        teamAttackStrength(input.homeTeam) >= teamAttackStrength(input.awayTeam) ? 'home' : 'away',
      impact: 0.2,
      confidence: 0.82,
      evidenceType: 'statistical',
    },
  ];
  const sorted = [...factors].sort((a, b) => b.impact - a.impact);
  return { positive: sorted.slice(0, 3), negative: sorted.slice(-2) };
}
