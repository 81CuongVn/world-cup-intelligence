import type { AppEnv } from '../../env';
import { nowIso } from '../../utils/time';
import { logError, logInfo } from '../../utils/logger';
import { FIFA_SOURCE_ID } from './constants';
import { fetchFifaTimeline, fetchFifaMatchInfo, type FifaMatchInfo } from './fifaApiClient';
import { fetchFifaGamedayTeamMatchStats } from './fifaGamedayClient';
import {
  deriveShotsFromTimeline,
  parseFifaTimelineCommentary,
  type FifaTimelinePayload,
} from './parseFifaTimeline';
import { parseGamedayTeamStats } from './parseFifaGamedayStats';
import {
  emitMatchCommentaryUpdated,
  emitMatchStatsUpdated,
} from '../../services/publicApi/emitter';

type TeamStatPatch = {
  possession: number | null;
  shots: number | null;
  shotsOnTarget: number | null;
  passes: number | null;
  passAccuracy: number | null;
};

async function upsertTeamMatchStats(
  db: D1Database,
  matchId: string,
  teamId: string,
  patch: TeamStatPatch,
): Promise<void> {
  const hasAny =
    patch.possession != null ||
    patch.shots != null ||
    patch.shotsOnTarget != null ||
    patch.passes != null ||
    patch.passAccuracy != null;
  if (!hasAny) return;

  const ts = nowIso();
  const existing = await db
    .prepare(`SELECT id FROM team_match_stats WHERE match_id = ? AND team_id = ?`)
    .bind(matchId, teamId)
    .first<{ id: string }>();

  if (existing) {
    await db
      .prepare(
        `UPDATE team_match_stats SET
           possession = COALESCE(?, possession),
           shots = COALESCE(?, shots),
           shots_on_target = COALESCE(?, shots_on_target),
           passes = COALESCE(?, passes),
           pass_accuracy = COALESCE(?, pass_accuracy),
           created_at = ?
         WHERE id = ?`,
      )
      .bind(
        patch.possession,
        patch.shots,
        patch.shotsOnTarget,
        patch.passes,
        patch.passAccuracy,
        ts,
        existing.id,
      )
      .run();
    return;
  }

  await db
    .prepare(
      `INSERT INTO team_match_stats (
         id, match_id, team_id, possession, shots, shots_on_target, passes, pass_accuracy, created_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      `tms-fifa-${matchId}-${teamId}`,
      matchId,
      teamId,
      patch.possession ?? 0,
      patch.shots ?? 0,
      patch.shotsOnTarget ?? 0,
      patch.passes ?? 0,
      patch.passAccuracy ?? 0,
      ts,
    )
    .run();
}

async function runBatchChunked(db: D1Database, stmts: D1PreparedStatement[], chunkSize = 40): Promise<void> {
  for (let i = 0; i < stmts.length; i += chunkSize) {
    await db.batch(stmts.slice(i, i + chunkSize));
  }
}

async function syncCommentary(
  db: D1Database,
  internalMatchId: string,
  timeline: FifaTimelinePayload,
): Promise<number> {
  const lines = parseFifaTimelineCommentary(timeline, internalMatchId);
  if (!lines.length) return 0;

  await db
    .prepare(`DELETE FROM match_commentary WHERE match_id = ? AND source_id = ?`)
    .bind(internalMatchId, FIFA_SOURCE_ID)
    .run();

  const stmts = lines.map((line) =>
    db
      .prepare(
        `INSERT INTO match_commentary (
           id, match_id, minute, period, sort_order, text_vi, text_en, event_type, source_id
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        line.id,
        internalMatchId,
        line.minute,
        line.period,
        line.sortOrder,
        line.textEn,
        line.textEn,
        line.eventType,
        FIFA_SOURCE_ID,
      ),
  );

  await runBatchChunked(db, stmts);
  return lines.length;
}

function resolveFifaTeamIds(info: FifaMatchInfo): {
  homeFifaTeamId: string | null;
  awayFifaTeamId: string | null;
  idIfes: string | null;
} {
  const idIfes = info.Properties?.IdIFES ?? null;
  return {
    homeFifaTeamId: info.HomeTeam?.IdTeam ?? null,
    awayFifaTeamId: info.AwayTeam?.IdTeam ?? null,
    idIfes: idIfes ? String(idIfes) : null,
  };
}

/** Pull Match Centre live blog (timeline) + Gameday team stats into D1. */
export async function syncFifaMatchBlogAndStats(
  env: AppEnv,
  internalMatchId: string,
  homeTeamId: string,
  awayTeamId: string,
  info: FifaMatchInfo,
  fifaMatchIdOverride?: string | null,
): Promise<{ commentary: number; statsUpdated: boolean }> {
  const fifaMatchId = fifaMatchIdOverride ?? info.IdMatch;
  if (!fifaMatchId) {
    logInfo('fifa blog sync skipped — no fifa match id', { match_id: internalMatchId });
    return { commentary: 0, statsUpdated: false };
  }
  let commentary = 0;
  let statsUpdated = false;

  const timeline = await fetchFifaTimeline(fifaMatchId);
  if (timeline?.Event?.length) {
    try {
      commentary = await syncCommentary(env.DB, internalMatchId, timeline);
    } catch (e) {
      logError('fifa commentary sync failed', { match_id: internalMatchId, error: String(e) });
    }

    const { homeFifaTeamId, awayFifaTeamId } = resolveFifaTeamIds(info);
    if (homeFifaTeamId && awayFifaTeamId) {
      const derived = deriveShotsFromTimeline(timeline, homeFifaTeamId, awayFifaTeamId);
      if (derived.homeShots > 0 || derived.awayShots > 0) {
        await upsertTeamMatchStats(env.DB, internalMatchId, homeTeamId, {
          possession: null,
          shots: derived.homeShots,
          shotsOnTarget: derived.homeSot,
          passes: null,
          passAccuracy: null,
        });
        await upsertTeamMatchStats(env.DB, internalMatchId, awayTeamId, {
          possession: null,
          shots: derived.awayShots,
          shotsOnTarget: derived.awaySot,
          passes: null,
          passAccuracy: null,
        });
      }
    }
  }

  const { idIfes, homeFifaTeamId, awayFifaTeamId } = resolveFifaTeamIds(info);
  if (idIfes) {
    const teamsStats = await fetchFifaGamedayTeamMatchStats(idIfes);
    if (teamsStats?.length && homeFifaTeamId && awayFifaTeamId) {
      const homeStats = teamsStats.find((t) => t.idTeam === homeFifaTeamId);
      const awayStats = teamsStats.find((t) => t.idTeam === awayFifaTeamId);
      if (homeStats) {
        await upsertTeamMatchStats(env.DB, internalMatchId, homeTeamId, parseGamedayTeamStats(homeStats.stats));
      }
      if (awayStats) {
        await upsertTeamMatchStats(env.DB, internalMatchId, awayTeamId, parseGamedayTeamStats(awayStats.stats));
      }
      statsUpdated = !!(homeStats || awayStats);
    }
  }

  if (commentary > 0 || statsUpdated) {
    await env.KV.put(`meta:fifa_blog_sync:${internalMatchId}`, nowIso(), { expirationTtl: 300 });
  }

  logInfo('fifa blog sync done', {
    match_id: internalMatchId,
    fifa_match_id: fifaMatchId,
    timeline_events: timeline?.Event?.length ?? 0,
    commentary,
    statsUpdated,
  });

  const ts = nowIso();
  if (commentary > 0) {
    await emitMatchCommentaryUpdated(env, internalMatchId, {
      matchId: internalMatchId,
      lineCount: commentary,
      updatedAt: ts,
    }).catch(() => undefined);
  }
  if (statsUpdated) {
    await emitMatchStatsUpdated(env, internalMatchId, {
      matchId: internalMatchId,
      updatedAt: ts,
      dataSource: 'fifa_live',
    }).catch(() => undefined);
  }

  return { commentary, statsUpdated };
}

/** Sync blog/stats when D1 is missing FIFA data (bypasses KV throttle). */
export async function ensureFifaBlogAndStats(
  env: AppEnv,
  matchId: string,
  homeTeamId: string,
  awayTeamId: string,
  fifaMatchId: string | null | undefined,
  status: string,
): Promise<void> {
  if (!fifaMatchId || (status !== 'live' && status !== 'completed')) return;

  const [statsRow, commentaryRow] = await Promise.all([
    env.DB.prepare(
      `SELECT 1 FROM team_match_stats
       WHERE match_id = ? AND (shots > 0 OR possession > 0 OR passes > 0)
       LIMIT 1`,
    )
      .bind(matchId)
      .first(),
    env.DB.prepare(`SELECT 1 FROM match_commentary WHERE match_id = ? LIMIT 1`).bind(matchId).first(),
  ]);

  if (statsRow && commentaryRow) return;

  const info = await fetchFifaMatchInfo(fifaMatchId);
  if (!info) return;

  await syncFifaMatchBlogAndStats(env, matchId, homeTeamId, awayTeamId, info, fifaMatchId);
}

export async function shouldSyncFifaBlogAndStats(
  env: AppEnv,
  internalMatchId: string,
  status: string,
): Promise<boolean> {
  if (status !== 'live' && status !== 'completed') return false;
  const last = await env.KV.get(`meta:fifa_blog_sync:${internalMatchId}`);
  if (!last) return true;
  const interval = status === 'live' ? 25_000 : 120_000;
  return Date.now() - new Date(last).getTime() > interval;
}
