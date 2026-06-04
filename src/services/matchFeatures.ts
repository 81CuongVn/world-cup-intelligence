import type { MatchRow, TeamRow } from '../db/schema';
import type { MatchFeatureInput, TeamFeatures } from '../models/probability/types';

function teamToFeatures(team: TeamRow): TeamFeatures {
  const elo = team.elo_rating ?? 1700;
  const rank = team.fifa_ranking ?? 20;
  const strength = team.collective_strength_rating ?? 0.75;
  return {
    teamId: team.id,
    eloRating: elo,
    fifaRanking: rank,
    recentForm: strength - 0.5,
    goalDifference: (strength - 0.5) * 10,
    xgDifference: (strength - 0.5) * 2,
    xgFor: 1.2 + strength * 0.5,
    xgAgainst: 1.1 - strength * 0.3,
    possessionProfile: 0.45 + strength * 0.2,
    fieldTilt: 0.5 + (strength - 0.5) * 0.3,
    ppda: 10 - strength * 3,
    highTurnovers: strength * 0.8,
    transitionThreat: strength * 0.7,
    setPieceXg: 0.2 + strength * 0.15,
    setPieceXga: 0.18,
    defensiveCompactness: strength,
    formationStability: strength,
    benchDepth: strength * 0.9,
    goalkeeperStrength: strength * 0.85,
    restDays: 4,
  };
}

export function buildMatchFeatures(
  match: MatchRow,
  home: TeamRow,
  away: TeamRow,
  tournamentYear: number,
): MatchFeatureInput {
  return {
    matchId: match.id,
    tournamentYear,
    stage: match.stage ?? 'Group',
    minute: match.minute,
    second: 0,
    homeTeam: teamToFeatures(home),
    awayTeam: teamToFeatures(away),
    currentScore: { home: match.home_score, away: match.away_score },
    sourceConfidence: tournamentYear >= 2026 ? 0.9 : 0.82,
  };
}
