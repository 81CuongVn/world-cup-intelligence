import { describe, it, expect } from 'vitest';
import { predictionMatchState } from '../src/models/probability/matchState';
import { matchContextModifier } from '../src/models/probability/matchContext';
import type { MatchFeatureInput, TeamFeatures } from '../src/models/probability/types';

const stubTeam = (fifa: number): TeamFeatures => ({
  teamId: 't',
  eloRating: 1800,
  fifaRanking: fifa,
  recentForm: 0.6,
  goalDifference: 0,
  xgDifference: 0,
  xgFor: 1.4,
  xgAgainst: 1.1,
  possessionProfile: 0.5,
  fieldTilt: 0.5,
  ppda: 9,
  highTurnovers: 0.5,
  transitionThreat: 0.5,
  setPieceXg: 0.2,
  setPieceXga: 0.18,
  defensiveCompactness: 0.7,
  formationStability: 0.7,
  benchDepth: 0.7,
  goalkeeperStrength: 0.7,
  restDays: 4,
});

describe('matchState', () => {
  it('resets completed matches to kickoff for prediction', () => {
    expect(predictionMatchState('completed', 90, 2, 0)).toEqual({ minute: 0, home: 0, away: 0 });
    expect(predictionMatchState('live', 67, 1, 0)).toEqual({ minute: 67, home: 1, away: 0 });
  });
});

describe('matchContext', () => {
  it('boosts WC host at home', () => {
    const input: MatchFeatureInput = {
      matchId: 'x',
      tournamentYear: 2026,
      stage: 'Group',
      minute: 0,
      second: 0,
      isHomeHost: true,
      homeTeam: stubTeam(15),
      awayTeam: stubTeam(61),
      currentScore: { home: 0, away: 0 },
      sourceConfidence: 0.9,
    };
    const mod = matchContextModifier(input);
    expect(mod.home).toBeGreaterThan(1.05);
    expect(mod.away).toBeLessThan(1);
  });
});
