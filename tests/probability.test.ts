import { describe, it, expect } from 'vitest';
import { computeProbability } from '../src/models/probability/engine';
import type { MatchFeatureInput, TeamFeatures } from '../src/models/probability/types';

function baseTeam(id: string, elo: number): TeamFeatures {
  return {
    teamId: id,
    eloRating: elo,
    fifaRanking: 5,
    recentForm: 0.6,
    goalDifference: 5,
    xgDifference: 0.5,
    xgFor: 1.5,
    xgAgainst: 1.0,
    possessionProfile: 0.55,
    fieldTilt: 0.52,
    ppda: 9,
    highTurnovers: 0.6,
    transitionThreat: 0.65,
    setPieceXg: 0.25,
    setPieceXga: 0.2,
    defensiveCompactness: 0.7,
    formationStability: 0.75,
    benchDepth: 0.7,
    goalkeeperStrength: 0.72,
    restDays: 5,
  };
}

const input: MatchFeatureInput = {
  matchId: 'test',
  tournamentYear: 2022,
  stage: 'Final',
  minute: 0,
  second: 0,
  homeTeam: baseTeam('h', 1980),
  awayTeam: baseTeam('a', 1960),
  currentScore: { home: 0, away: 0 },
  sourceConfidence: 0.85,
};

describe('probability engine', () => {
  it('produces normalized W/D/L', async () => {
    const r = await computeProbability(input);
    const sum = r.homeWinProb + r.drawProb + r.awayWinProb;
    expect(sum).toBeCloseTo(1, 2);
    expect(r.confidence).toBeGreaterThan(0.85);
    expect(r.confidence).toBeLessThanOrEqual(0.96);
  });
});
