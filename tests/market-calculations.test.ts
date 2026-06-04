import { describe, expect, it } from 'vitest';
import { decimalOddsToImpliedProbability } from '../src/market/calculations/impliedProbability';
import { normalizeMarketProbabilities } from '../src/market/calculations/normalizeOverround';
import { calculateModelVsMarketDelta } from '../src/market/calculations/modelVsMarket';
import { normalizeRawMarketBatch } from '../src/market/normalization/normalizeMarketOdds';
import { buildTeamSystemProfile } from '../src/models/probability/teamSystemStrength';
import { computeScenarioLikelihoods } from '../src/models/probability/scenarioLikelihood';
import type { MatchFeatureInput, ProbabilityResult } from '../src/models/probability/types';
import { ModelVsMarketExplanationSchema } from '../src/ai/intelligenceSchemas';

describe('market calculations', () => {
  it('decimalOddsToImpliedProbability', () => {
    expect(decimalOddsToImpliedProbability(2)).toBeCloseTo(0.5);
    expect(() => decimalOddsToImpliedProbability(0.5)).toThrow();
  });

  it('normalizeMarketProbabilities', () => {
    const { normalized, overround } = normalizeMarketProbabilities({
      home: 0.4,
      draw: 0.3,
      away: 0.4,
    });
    expect(normalized.home + normalized.draw + normalized.away).toBeCloseTo(1);
    expect(overround).toBeCloseTo(0.1);
  });

  it('calculateModelVsMarketDelta', () => {
    const d = calculateModelVsMarketDelta({
      model: { home: 0.5, draw: 0.25, away: 0.25 },
      market: { home: 0.45, draw: 0.3, away: 0.25 },
    });
    expect(d.home).toBeCloseTo(0.05);
    expect(d.draw).toBeCloseTo(-0.05);
  });

  it('normalizeRawMarketBatch stores provenance path', () => {
    const rows = normalizeRawMarketBatch('mkt-manual', 'market/raw/x.json', [
      {
        matchId: 'm-1',
        marketType: 'match_winner',
        selection: 'home',
        oddsDecimal: 2,
        retrievedAt: '2026-01-01T00:00:00Z',
        rawPayload: {},
      },
      {
        matchId: 'm-1',
        marketType: 'match_winner',
        selection: 'draw',
        oddsDecimal: 3.2,
        retrievedAt: '2026-01-01T00:00:00Z',
        rawPayload: {},
      },
      {
        matchId: 'm-1',
        marketType: 'match_winner',
        selection: 'away',
        oddsDecimal: 3.5,
        retrievedAt: '2026-01-01T00:00:00Z',
        rawPayload: {},
      },
    ]);
    expect(rows[0]?.rawR2Key).toBe('market/raw/x.json');
    expect(rows.length).toBe(3);
  });
});

describe('teamSystemStrength', () => {
  it('builds collective profile', () => {
    const p = buildTeamSystemProfile({
      teamId: 't1',
      eloRating: 1900,
      fifaRanking: 5,
      recentForm: 0.2,
      goalDifference: 5,
      xgDifference: 1,
      xgFor: 1.8,
      xgAgainst: 0.9,
      possessionProfile: 0.55,
      fieldTilt: 0.6,
      ppda: 8,
      highTurnovers: 0.7,
      transitionThreat: 0.65,
      setPieceXg: 0.3,
      setPieceXga: 0.15,
      defensiveCompactness: 0.7,
      formationStability: 0.75,
      benchDepth: 0.8,
      goalkeeperStrength: 0.7,
      restDays: 5,
    });
    expect(p.collectiveStrengthScore).toBeGreaterThan(0.4);
    expect(p.explanationFactors.length).toBeGreaterThan(0);
  });
});

describe('scenarioLikelihood', () => {
  it('returns scenario set', () => {
    const input: MatchFeatureInput = {
      matchId: 'm1',
      tournamentYear: 2026,
      stage: 'Group',
      minute: 0,
      second: 0,
      homeTeam: buildTeamSystemProfile({
        teamId: 'h',
        eloRating: 1800,
        fifaRanking: 10,
        recentForm: 0,
        goalDifference: 0,
        xgDifference: 0,
        xgFor: 1.4,
        xgAgainst: 1,
        possessionProfile: 0.5,
        fieldTilt: 0.5,
        ppda: 10,
        highTurnovers: 0.5,
        transitionThreat: 0.5,
        setPieceXg: 0.2,
        setPieceXga: 0.2,
        defensiveCompactness: 0.6,
        formationStability: 0.6,
        benchDepth: 0.6,
        goalkeeperStrength: 0.6,
        restDays: 4,
      }) as unknown as MatchFeatureInput['homeTeam'],
      awayTeam: buildTeamSystemProfile({
        teamId: 'a',
        eloRating: 1750,
        fifaRanking: 15,
        recentForm: 0,
        goalDifference: 0,
        xgDifference: 0,
        xgFor: 1.3,
        xgAgainst: 1.1,
        possessionProfile: 0.48,
        fieldTilt: 0.48,
        ppda: 11,
        highTurnovers: 0.45,
        transitionThreat: 0.45,
        setPieceXg: 0.18,
        setPieceXga: 0.2,
        defensiveCompactness: 0.55,
        formationStability: 0.55,
        benchDepth: 0.55,
        goalkeeperStrength: 0.55,
        restDays: 4,
      }) as unknown as MatchFeatureInput['awayTeam'],
      currentScore: { home: 0, away: 0 },
      sourceConfidence: 0.8,
    };
    const prob = {
      expectedHomeGoals: 1.5,
      expectedAwayGoals: 1.1,
      drawProb: 0.25,
      confidence: 0.8,
    } as ProbabilityResult;
    const homeSys = buildTeamSystemProfile(input.homeTeam);
    const awaySys = buildTeamSystemProfile(input.awayTeam);
    const scenarios = computeScenarioLikelihoods(input, prob, homeSys, awaySys);
    expect(scenarios.some((s) => s.scenarioType === 'both_teams_score')).toBe(true);
  });
});

describe('AI schema', () => {
  it('validates model vs market explanation', () => {
    const parsed = ModelVsMarketExplanationSchema.parse({
      matchId: 'm1',
      summary: 'Model leans home.',
      keyDifferences: [],
      uncertaintyNotes: ['Sample size limited'],
      sourceConfidenceSummary: 'Moderate',
      disclaimer: 'Market signals are shown for analytical context only and are not betting advice.',
    });
    expect(parsed.disclaimer).toContain('not betting advice');
  });
});
