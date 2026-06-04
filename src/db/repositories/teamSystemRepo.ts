import type { TeamSystemProfile } from '../../models/probability/teamSystemStrength';
import { newId } from '../../utils/ids';
import { nowIso } from '../../utils/time';

export async function upsertTeamSystemProfile(
  db: D1Database,
  teamId: string,
  tournamentId: string | null,
  profile: TeamSystemProfile,
  modelVersion: string,
  inputHash: string,
  sourceId = 'src-mock',
): Promise<string> {
  const existing = await db
    .prepare(
      `SELECT id FROM team_system_profiles WHERE team_id = ? AND (tournament_id = ? OR (tournament_id IS NULL AND ? IS NULL))`,
    )
    .bind(teamId, tournamentId, tournamentId)
    .first<{ id: string }>();

  const id = existing?.id ?? newId('tsp');
  const sql = existing
    ? `UPDATE team_system_profiles SET
        tactical_identity=?, primary_formation=?, formation_stability_score=?, pressing_score=?,
        defensive_compactness_score=?, transition_score=?, set_piece_score=?, bench_depth_score=?,
        lineup_cohesion_score=?, possession_control_score=?, tempo_score=?,
        collective_strength_score=?, source_id=?, model_version=?, input_hash=?, updated_at=?
       WHERE id=?`
    : `INSERT INTO team_system_profiles (
        id, team_id, tournament_id, tactical_identity, primary_formation,
        formation_stability_score, pressing_score, defensive_compactness_score, transition_score,
        set_piece_score, bench_depth_score, lineup_cohesion_score, possession_control_score,
        tempo_score, collective_strength_score, source_id, model_version, input_hash, updated_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  const binds = [
    profile.tacticalIdentity,
    profile.primaryFormation,
    profile.formationStabilityScore,
    profile.pressingScore,
    profile.defensiveCompactnessScore,
    profile.transitionScore,
    profile.setPieceScore,
    profile.benchDepthScore,
    profile.lineupCohesionScore,
    profile.possessionControlScore,
    profile.tempoScore,
    profile.collectiveStrengthScore,
    sourceId,
    modelVersion,
    inputHash,
    nowIso(),
  ];

  if (existing) {
    await db.prepare(sql).bind(...binds, id).run();
  } else {
    await db.prepare(sql).bind(id, teamId, tournamentId, ...binds).run();
  }
  return id;
}

export async function getTeamSystemsForMatch(
  db: D1Database,
  homeTeamId: string,
  awayTeamId: string,
  tournamentId: string,
): Promise<{ home: Record<string, unknown> | null; away: Record<string, unknown> | null }> {
  const load = async (teamId: string) =>
    db
      .prepare(`SELECT * FROM team_system_profiles WHERE team_id = ? AND tournament_id = ? ORDER BY updated_at DESC LIMIT 1`)
      .bind(teamId, tournamentId)
      .first<Record<string, unknown>>();

  return { home: await load(homeTeamId), away: await load(awayTeamId) };
}
