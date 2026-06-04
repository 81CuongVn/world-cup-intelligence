export type IntervalKey = '15' | '30' | '45' | '60' | '75' | '90';

export type IntervalProbability = {
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  expectedHomeGoals: number;
  expectedAwayGoals: number;
};

export type ExplanationFactor = {
  key: string;
  label: string;
  direction: 'home' | 'away' | 'draw' | 'neutral';
  impact: number;
  confidence: number;
  evidenceType: 'statistical' | 'official' | 'news' | 'live_event' | 'tactical_signal';
};

export type SourceSummary = {
  sourceId: string;
  sourceName: string;
  reliabilityScore: number;
};

export type TeamFeatures = {
  teamId: string;
  eloRating: number;
  fifaRanking: number;
  recentForm: number;
  goalDifference: number;
  xgDifference: number;
  xgFor: number;
  xgAgainst: number;
  possessionProfile: number;
  fieldTilt: number;
  ppda: number;
  highTurnovers: number;
  transitionThreat: number;
  setPieceXg: number;
  setPieceXga: number;
  defensiveCompactness: number;
  formationStability: number;
  benchDepth: number;
  goalkeeperStrength: number;
  restDays: number;
};

export type LineupFeatures = {
  formation: string;
  strengthModifier: number;
  missingKeyRoles: string[];
};

export type MatchFeatureInput = {
  matchId: string;
  tournamentYear: number;
  stage: string;
  minute: number;
  second: number;
  homeTeam: TeamFeatures;
  awayTeam: TeamFeatures;
  homeLineup?: LineupFeatures;
  awayLineup?: LineupFeatures;
  currentScore: { home: number; away: number };
  sourceConfidence: number;
};

export type ProbabilityResult = {
  matchId: string;
  timestamp: string;
  minute: number;
  second: number;
  modelVersion: string;
  inputHash: string;
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  expectedHomeGoals: number;
  expectedAwayGoals: number;
  mostLikelyScore: string;
  scorelineDistribution: Record<string, number>;
  intervalDistribution: Record<IntervalKey, IntervalProbability>;
  confidence: number;
  topPositiveFactors: ExplanationFactor[];
  topNegativeFactors: ExplanationFactor[];
  sourceSummary: SourceSummary[];
  explanation: string;
};
