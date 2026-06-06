import type { MatchFeatureInput } from '../probability/types';
import type { MatchProbabilityOutput } from '../probability/fullMatchOutput';
import type { TeamSystemProfile } from '../probability/teamSystemStrength';

export type ScenarioType =
  | 'baseline_expected_flow'
  | 'early_goal_swing'
  | 'low_event_controlled_match'
  | 'high_event_open_match'
  | 'set_piece_decider'
  | 'red_card_disruption'
  | 'lineup_surprise'
  | 'key_player_absence'
  | 'pressing_breakthrough'
  | 'low_block_frustration'
  | 'transition_dominance'
  | 'late_bench_impact'
  | 'extra_time_path'
  | 'penalty_shootout_path';

export type ScenarioFeatureGroup =
  | 'team_system'
  | 'lineup'
  | 'player_availability'
  | 'recent_form'
  | 'tactical_matchup'
  | 'game_state'
  | 'event_flow'
  | 'set_piece'
  | 'transition'
  | 'pressing'
  | 'defensive_block'
  | 'bench_depth'
  | 'weather_venue'
  | 'market_signal'
  | 'historical_tournament';

export type ScenarioFeatureSelection = {
  scenarioType: ScenarioType;
  selectedFeatureGroups: ScenarioFeatureGroup[];
  requiredInputs: string[];
  optionalInputs: string[];
  missingInputs: string[];
  inputQualityScore: number;
  confidencePenalty: number;
  reason: string[];
};

export type ScenarioConditionStatus = 'not_triggered' | 'partially_triggered' | 'triggered';
export type InvalidationStatus = 'valid' | 'at_risk' | 'invalidated';

export type InitialCondition = {
  condition: string;
  value: string | number | boolean;
  confidence: number;
  source?: string;
};

export type TriggerCondition = {
  condition: string;
  threshold: string | number;
  currentValue?: string | number;
  status: ScenarioConditionStatus;
};

export type InvalidationCondition = {
  condition: string;
  threshold: string | number;
  currentValue?: string | number;
  status: InvalidationStatus;
};

export type ScenarioIntervalKey = '15' | '30' | '45' | '60' | '75' | '90';

export type ScenarioIntervalDistribution = Record<
  ScenarioIntervalKey,
  {
    homeWinProb: number;
    drawProb: number;
    awayWinProb: number;
    topScorelines: Array<{ score: string; probability: number }>;
  }
>;

export type MatchPredictionScenario = {
  id: string;
  matchId: string;
  scenarioType: ScenarioType;
  scenarioName: string;
  scenarioRank: number;
  isBaseline: boolean;
  initialConditions: InitialCondition[];
  triggerConditions: TriggerCondition[];
  invalidationConditions: InvalidationCondition[];
  scenarioProbability: number;
  scenarioConfidence: number;
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  expectedHomeGoals: number;
  expectedAwayGoals: number;
  mostLikelyScore: string;
  scorelineDistribution: Record<string, number>;
  intervalDistribution: ScenarioIntervalDistribution;
  keyDrivers: string[];
  riskFactors: string[];
  featureSelection: ScenarioFeatureSelection;
  modelVersion: string;
  inputHash: string;
  featureSnapshotR2Key: string;
  status: 'active' | 'invalidated' | 'archived';
  updatedAt: string;
};

export type ScenarioComparison = {
  primaryScenarioId: string;
  alternativeScenarioId: string;
  probabilityGap: number;
  confidenceGap: number;
  summary: string;
  keyDifferences: string[];
  homeWinDelta: number;
  drawDelta: number;
  awayWinDelta: number;
  xgHomeDelta: number;
  xgAwayDelta: number;
};

export type MatchScenarioSet = {
  matchId: string;
  generatedAt: string;
  updatedAt: string;
  scenarios: MatchPredictionScenario[];
  comparison: ScenarioComparison;
  sourceConfidence: {
    overall: number;
    notes: string[];
  };
};

export type MatchScenarioContext = {
  matchId: string;
  tournamentYear: number;
  stage: string;
  minute: number;
  homeScore: number;
  awayScore: number;
  status: string;
  homeTeamName: string;
  awayTeamName: string;
  features: MatchFeatureInput;
  probability: MatchProbabilityOutput;
  homeSystem: TeamSystemProfile;
  awaySystem: TeamSystemProfile;
  homeLineupSource: string;
  awayLineupSource: string;
  marketImplied?: { home: number; draw: number; away: number } | null;
};

export type ScenarioCandidate = {
  scenarioType: ScenarioType;
  scenarioName: string;
  isBaseline: boolean;
  weight: number;
};

export type ScenarioModelOutput = {
  scenarioProbability: number;
  scenarioConfidence: number;
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  expectedHomeGoals: number;
  expectedAwayGoals: number;
  mostLikelyScore: string;
  scorelineDistribution: Record<string, number>;
  intervalDistribution: ScenarioIntervalDistribution;
  initialConditions: InitialCondition[];
  triggerConditions: TriggerCondition[];
  invalidationConditions: InvalidationCondition[];
  keyDrivers: string[];
  riskFactors: string[];
};

export const SCENARIO_TYPE_LABELS: Record<ScenarioType, string> = {
  baseline_expected_flow: 'Controlled possession match',
  early_goal_swing: 'Early transition swing',
  low_event_controlled_match: 'Low-event controlled match',
  high_event_open_match: 'High-event open match',
  set_piece_decider: 'Set-piece decider',
  red_card_disruption: 'Red card disruption',
  lineup_surprise: 'Lineup surprise',
  key_player_absence: 'Key player absence',
  pressing_breakthrough: 'Pressing breakthrough',
  low_block_frustration: 'Low block frustration',
  transition_dominance: 'Transition dominance',
  late_bench_impact: 'Late bench impact',
  extra_time_path: 'Extra time path',
  penalty_shootout_path: 'Penalty shootout path',
};
