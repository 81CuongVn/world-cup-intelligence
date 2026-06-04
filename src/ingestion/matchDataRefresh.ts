import type { AppEnv } from '../env';
import { nowIso } from '../utils/time';
import { logInfo } from '../utils/logger';
import { mockScoreAtMinute } from '../services/matchLifecycle';
import { processMatchCompletion } from '../services/tournamentProgression';

export type RefreshMatchDataResult = {
  updatedIds: string[];
  completedIds: string[];
};

const KICKOFF_WINDOW_MS = 2 * 60 * 60 * 1000;
const MATCH_DURATION_MS = 105 * 60 * 1000;

/** Near-real-time refresh: live ticks, finalize at FT, then progression + recompute. */
export async function refreshMatchData(env: AppEnv): Promise<RefreshMatchDataResult> {
  const updatedIds: string[] = [];
  const completedIds: string[] = [];
  const now = nowIso();
  const nowMs = Date.now();

  const { results: candidates } = await env.DB.prepare(
    `SELECT id, minute, home_score, away_score, status, kickoff_utc
     FROM matches
     WHERE tournament_id = 't-2026' AND status IN ('scheduled', 'live')
     ORDER BY kickoff_utc ASC`,
  ).all<{
    id: string;
    minute: number;
    home_score: number;
    away_score: number;
    status: string;
    kickoff_utc: string;
  }>();

  for (const m of candidates ?? []) {
    if (!m.kickoff_utc) continue;
    const kickoffMs = new Date(m.kickoff_utc).getTime();
    const inWindow = nowMs >= kickoffMs - KICKOFF_WINDOW_MS && nowMs < kickoffMs + MATCH_DURATION_MS;
    if (!inWindow) continue;

    const elapsedMin = Math.max(0, Math.floor((nowMs - kickoffMs) / 60000));
    const newMinute = Math.min(90, elapsedMin);
    const scores = mockScoreAtMinute(m.id, newMinute);

    if (newMinute >= 90) {
      await env.DB.prepare(
        `UPDATE matches
         SET status = 'completed', minute = 90,
             home_score = ?, away_score = ?,
             updated_at = ?
         WHERE id = ? AND status != 'completed'`,
      )
        .bind(scores.home, scores.away, now, m.id)
        .run();
      completedIds.push(m.id);
      logInfo('match finalized', { match_id: m.id, score: `${scores.home}-${scores.away}` });
      continue;
    }

    if (m.status === 'scheduled' || m.minute !== newMinute || m.home_score !== scores.home || m.away_score !== scores.away) {
      await env.DB.prepare(
        `UPDATE matches
         SET status = 'live', minute = ?,
             home_score = ?, away_score = ?,
             home_xg = home_xg + 0.02, away_xg = away_xg + 0.01,
             updated_at = ?
         WHERE id = ?`,
      )
        .bind(newMinute, scores.home, scores.away, now, m.id)
        .run();
      updatedIds.push(m.id);
    }
  }

  await env.KV.put('meta:last_data_refresh', now, { expirationTtl: 86400 });
  logInfo('minute refresh complete', {
    updated: updatedIds.length,
    completed: completedIds.length,
  });
  return { updatedIds, completedIds };
}

/** Finalize scores + advance bracket for matches that just ended. */
export async function handleCompletedMatches(env: AppEnv, matchIds: string[]): Promise<void> {
  for (const matchId of matchIds) {
    await processMatchCompletion(env, matchId);
  }
}
