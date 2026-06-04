import type { TeamFeatures } from './types';

export type TeamSystemProfile = {
  teamId: string;
  primaryFormation: string;
  collectiveStrengthScore: number;
  tacticalIdentity: string;
  formationStabilityScore: number;
  pressingScore: number;
  defensiveCompactnessScore: number;
  transitionScore: number;
  setPieceScore: number;
  benchDepthScore: number;
  lineupCohesionScore: number;
  possessionControlScore: number;
  tempoScore: number;
  confidence: number;
  explanationFactors: string[];
};

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function buildTeamSystemProfile(
  team: TeamFeatures,
  formation = '4-3-3',
): TeamSystemProfile {
  const base = clamp01((team.eloRating - 1400) / 700);
  const pressing = clamp01(1 - team.ppda / 18);
  const defensiveCompactness = clamp01(team.defensiveCompactness);
  const transition = clamp01(team.transitionThreat);
  const setPiece = clamp01((team.setPieceXg - team.setPieceXga + 0.3) / 0.6);
  const bench = clamp01(team.benchDepth);
  const cohesion = clamp01(team.formationStability * 0.75 + 0.15);
  const possession = clamp01(team.possessionProfile);
  const tempo = clamp01(0.45 + team.highTurnovers * 0.35);

  const collective =
    base * 0.22 +
    pressing * 0.12 +
    defensiveCompactness * 0.14 +
    transition * 0.12 +
    setPiece * 0.08 +
    bench * 0.1 +
    cohesion * 0.12 +
    possession * 0.1;

  const tacticalIdentity =
    pressing > 0.65
      ? 'high_press_collective'
      : possession > 0.58
        ? 'possession_control'
        : transition > 0.6
          ? 'transition_focused'
          : 'balanced_block';

  const factors: string[] = [];
  if (pressing > 0.6) factors.push('Collective pressing intensity elevates chance creation.');
  if (defensiveCompactness > 0.65) factors.push('Compact defensive shape limits opponent xG.');
  if (setPiece > 0.55) factors.push('Set-piece threat adds scenario upside.');
  if (bench > 0.6) factors.push('Bench depth supports late-game state management.');

  return {
    teamId: team.teamId,
    collectiveStrengthScore: clamp01(collective),
    tacticalIdentity,
    formationStabilityScore: clamp01(team.formationStability),
    pressingScore: pressing,
    defensiveCompactnessScore: defensiveCompactness,
    transitionScore: transition,
    setPieceScore: setPiece,
    benchDepthScore: bench,
    lineupCohesionScore: cohesion,
    possessionControlScore: possession,
    tempoScore: tempo,
    confidence: clamp01(0.55 + cohesion * 0.25 + team.restDays / 20),
    explanationFactors: factors.slice(0, 4),
    primaryFormation: formation,
  };
}
