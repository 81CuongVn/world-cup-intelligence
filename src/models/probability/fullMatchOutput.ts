import type { MatchFeatureInput } from './types';
import { computeProbability, MODEL_VERSION } from './engine';
import { buildTeamSystemProfile, type TeamSystemProfile } from './teamSystemStrength';
import { computeScenarioLikelihoods, type ScenarioLikelihood } from './scenarioLikelihood';
import type { ProbabilityResult } from './types';

export type MatchProbabilityOutput = {
  matchId: string;
  modelVersion: string;
  inputHash: string;
  timestamp: string;
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  expectedHomeGoals: number;
  expectedAwayGoals: number;
  mostLikelyScore: string;
  scorelineDistribution: Record<string, number>;
  intervalDistribution: ProbabilityResult['intervalDistribution'];
  scenarioLikelihoods: ScenarioLikelihood[];
  teamSystemFactors: { home: TeamSystemProfile; away: TeamSystemProfile };
  topPositiveFactors: ProbabilityResult['topPositiveFactors'];
  topNegativeFactors: ProbabilityResult['topNegativeFactors'];
  confidence: number;
};

export async function computeFullMatchProbability(
  input: MatchFeatureInput,
  homeFormation = '4-3-3',
  awayFormation = '4-3-3',
): Promise<MatchProbabilityOutput> {
  const base = await computeProbability(input);
  const homeSystem = buildTeamSystemProfile(input.homeTeam, homeFormation);
  const awaySystem = buildTeamSystemProfile(input.awayTeam, awayFormation);
  const scenarios = computeScenarioLikelihoods(input, base, homeSystem, awaySystem);

  return {
    matchId: base.matchId,
    modelVersion: MODEL_VERSION,
    inputHash: base.inputHash,
    timestamp: base.timestamp,
    homeWinProb: base.homeWinProb,
    drawProb: base.drawProb,
    awayWinProb: base.awayWinProb,
    expectedHomeGoals: base.expectedHomeGoals,
    expectedAwayGoals: base.expectedAwayGoals,
    mostLikelyScore: base.mostLikelyScore,
    scorelineDistribution: base.scorelineDistribution,
    intervalDistribution: base.intervalDistribution,
    scenarioLikelihoods: scenarios,
    teamSystemFactors: { home: homeSystem, away: awaySystem },
    topPositiveFactors: base.topPositiveFactors,
    topNegativeFactors: base.topNegativeFactors,
    confidence: base.confidence,
  };
}
