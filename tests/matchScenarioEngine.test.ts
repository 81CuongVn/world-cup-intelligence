import { describe, expect, it } from 'vitest';
import { buildCandidateScenarios, ensureAtLeastTwoScenarios } from '../src/models/scenarios/scenarioGenerator';
import { selectScenarioFeatures } from '../src/models/scenarios/scenarioFeatureSelector';
import { runScenarioProbabilityModel } from '../src/models/scenarios/scenarioEngine';
import { compareScenarios } from '../src/models/scenarios/scenarioComparison';
import { validateScenarioSet } from '../src/models/scenarios/scenarioValidation';
import { applyRealtimeEventToScenarios } from '../src/models/scenarios/scenarioRealtimeUpdater';
import { explainScenarioPrediction } from '../src/ai/explainScenarioPrediction';
import { buildTeamSystemProfile } from '../src/models/probability/teamSystemStrength';
import type { MatchScenarioContext, MatchPredictionScenario } from '../src/models/scenarios/types';
import { newId } from '../src/utils/ids';

function mockContext(overrides: Partial<MatchScenarioContext> = {}): MatchScenarioContext {
  const homeTeam = {
    teamId: 'team-usa',
    eloRating: 1780,
    fifaRanking: 12,
    recentForm: 0.3,
    goalDifference: 2,
    xgDifference: 0.4,
    xgFor: 1.6,
    xgAgainst: 1.2,
    possessionProfile: 0.55,
    fieldTilt: 0.52,
    ppda: 8,
    highTurnovers: 0.6,
    transitionThreat: 0.55,
    setPieceXg: 0.25,
    setPieceXga: 0.2,
    defensiveCompactness: 0.6,
    formationStability: 0.7,
    benchDepth: 0.65,
    goalkeeperStrength: 0.7,
    restDays: 4,
  };
  const awayTeam = { ...homeTeam, teamId: 'team-mex', recentForm: 0.2 };
  const homeSystem = buildTeamSystemProfile(homeTeam, '4-3-3');
  const awaySystem = buildTeamSystemProfile(awayTeam, '4-4-2');
  const probability = {
    matchId: 'm-1',
    modelVersion: 'wc-prob-v2',
    inputHash: 'hash',
    timestamp: new Date().toISOString(),
    homeWinProb: 0.4,
    drawProb: 0.28,
    awayWinProb: 0.32,
    expectedHomeGoals: 1.5,
    expectedAwayGoals: 1.3,
    mostLikelyScore: '1-1',
    scorelineDistribution: { '1-1': 0.12, '2-1': 0.1, '1-2': 0.09 },
    intervalDistribution: {},
    scenarioLikelihoods: [],
    teamSystemFactors: { home: homeSystem, away: awaySystem },
    topPositiveFactors: [],
    topNegativeFactors: [],
    confidence: 0.82,
  };

  return {
    matchId: 'm-1',
    tournamentYear: 2026,
    stage: 'Group',
    minute: 0,
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    homeTeamName: 'United States',
    awayTeamName: 'Mexico',
    features: {
      matchId: 'm-1',
      tournamentYear: 2026,
      stage: 'Group',
      minute: 0,
      second: 0,
      homeTeam,
      awayTeam,
      currentScore: { home: 0, away: 0 },
      sourceConfidence: 0.85,
    },
    probability,
    homeSystem,
    awaySystem,
    homeLineupSource: 'projected',
    awayLineupSource: 'projected',
    marketImplied: null,
    ...overrides,
  };
}

function toScenario(
  context: MatchScenarioContext,
  scenarioType: MatchScenarioContext['probability'] extends infer _ ? import('../src/models/scenarios/types').ScenarioType : never,
  rank: number,
  isBaseline: boolean,
): MatchPredictionScenario {
  const selection = selectScenarioFeatures(scenarioType, context);
  const output = runScenarioProbabilityModel(scenarioType, context, selection);
  return {
    id: newId('mps'),
    matchId: context.matchId,
    scenarioType,
    scenarioName: scenarioType,
    scenarioRank: rank,
    isBaseline,
    initialConditions: output.initialConditions,
    triggerConditions: output.triggerConditions,
    invalidationConditions: output.invalidationConditions,
    scenarioProbability: output.scenarioProbability,
    scenarioConfidence: output.scenarioConfidence,
    homeWinProb: output.homeWinProb,
    drawProb: output.drawProb,
    awayWinProb: output.awayWinProb,
    expectedHomeGoals: output.expectedHomeGoals,
    expectedAwayGoals: output.expectedAwayGoals,
    mostLikelyScore: output.mostLikelyScore,
    scorelineDistribution: output.scorelineDistribution,
    intervalDistribution: output.intervalDistribution,
    keyDrivers: output.keyDrivers,
    riskFactors: output.riskFactors,
    featureSelection: selection,
    modelVersion: context.probability.modelVersion,
    inputHash: context.probability.inputHash,
    featureSnapshotR2Key: 'scenarios/m-1/test.json',
    status: 'active',
    updatedAt: new Date().toISOString(),
  };
}

describe('multi-scenario engine', () => {
  it('always returns at least two scenarios', () => {
    const context = mockContext();
    const candidates = buildCandidateScenarios(context);
    const scored = candidates.map((c) => ({
      ...c,
      output: runScenarioProbabilityModel(
        c.scenarioType,
        context,
        selectScenarioFeatures(c.scenarioType, context),
      ),
    }));
    const finalScenarios = ensureAtLeastTwoScenarios(scored, context);
    expect(finalScenarios.length).toBeGreaterThanOrEqual(2);
  });

  it('includes baseline scenario', () => {
    const context = mockContext();
    const candidates = buildCandidateScenarios(context);
    expect(candidates.some((c) => c.scenarioType === 'baseline_expected_flow')).toBe(true);
  });

  it('reduces confidence when required input missing', () => {
    const context = mockContext({ marketImplied: null });
    const withMarket = selectScenarioFeatures('baseline_expected_flow', {
      ...context,
      marketImplied: { home: 0.4, draw: 0.3, away: 0.3 },
    });
    const withoutMarket = selectScenarioFeatures('baseline_expected_flow', context);
    expect(withoutMarket.confidencePenalty).toBeGreaterThanOrEqual(withMarket.confidencePenalty);
  });

  it('updates scenario probabilities on realtime goal event', () => {
    const context = mockContext({ minute: 20, homeScore: 1, awayScore: 0 });
    const scenarios = [
      toScenario(context, 'baseline_expected_flow', 1, true),
      toScenario(context, 'early_goal_swing', 2, false),
    ];
    const result = applyRealtimeEventToScenarios(context, scenarios, {
      matchId: 'm-1',
      eventId: 'e-1',
      eventType: 'goal',
      minute: 20,
    });
    const early = result.scenarios.find((s) => s.scenarioType === 'early_goal_swing');
    expect(early?.scenarioProbability).toBeGreaterThan(scenarios[1].scenarioProbability);
  });

  it('invalidates lineup surprise when lineup confirmed', () => {
    const context = mockContext();
    const scenarios = [
      toScenario(context, 'baseline_expected_flow', 1, true),
      toScenario(context, 'lineup_surprise', 2, false),
    ];
    const result = applyRealtimeEventToScenarios(context, scenarios, {
      matchId: 'm-1',
      eventId: 'e-2',
      eventType: 'lineup_confirmed',
      minute: 0,
    });
    expect(result.invalidatedIds.length).toBeGreaterThan(0);
  });

  it('compareScenarios returns structured comparison', () => {
    const context = mockContext();
    const scenarios = [
      toScenario(context, 'baseline_expected_flow', 1, true),
      toScenario(context, 'transition_dominance', 2, false),
    ];
    const comparison = compareScenarios(scenarios);
    expect(comparison.summary.length).toBeGreaterThan(10);
    expect(comparison.keyDifferences.length).toBeGreaterThan(0);
  });

  it('validates scenario set metadata', () => {
    const context = mockContext();
    const scenarios = [
      toScenario(context, 'baseline_expected_flow', 1, true),
      toScenario(context, 'early_goal_swing', 2, false),
    ];
    expect(validateScenarioSet(scenarios)).toEqual([]);
  });

  it('AI explanation schema validates and avoids betting wording', async () => {
    const context = mockContext();
    const scenario = toScenario(context, 'baseline_expected_flow', 1, true);
    const explanation = await explainScenarioPrediction({} as import('../src/env').AppEnv, 'm-1', scenario);
    expect(explanation.summary).toContain('scenario likelihood');
    expect(explanation.summary.toLowerCase()).not.toContain('sure bet');
    expect(explanation.disclaimer.toLowerCase()).not.toContain('nên cược');
  });
});
