import type { AppEnv } from '../../env';
import { buildMatchSlug } from '../../utils/matchSlug';
import { appendFeedEvent } from './feed';
import { enqueueWebhookDeliveries } from './webhooks';
import type { MatchScorePayload, PublicApiEventType } from './types';

export type MatchEmitContext = {
  matchId: string;
  slug?: string;
  homeName?: string;
  awayName?: string;
  stage?: string | null;
  groupCode?: string | null;
  status: string;
  minute: number | null;
  homeScore: number;
  awayScore: number;
  updatedAt: string;
};

function buildSlug(ctx: MatchEmitContext): string | undefined {
  if (ctx.slug) return ctx.slug;
  if (ctx.homeName && ctx.awayName) {
    return buildMatchSlug({
      stage: ctx.stage ?? null,
      groupCode: ctx.groupCode ?? null,
      homeName: ctx.homeName,
      awayName: ctx.awayName,
    });
  }
  return undefined;
}

function toScorePayload(ctx: MatchEmitContext): MatchScorePayload {
  return {
    matchId: ctx.matchId,
    slug: buildSlug(ctx),
    status: ctx.status,
    minute: ctx.minute,
    homeScore: ctx.homeScore,
    awayScore: ctx.awayScore,
    updatedAt: ctx.updatedAt,
  };
}

async function emit(
  env: AppEnv,
  eventType: PublicApiEventType,
  matchId: string,
  data: unknown,
): Promise<void> {
  const event = await appendFeedEvent(env, eventType, matchId, data);
  if (event) {
    await enqueueWebhookDeliveries(env, event).catch(() => undefined);
  }
}

export async function emitMatchScoreUpdate(env: AppEnv, ctx: MatchEmitContext): Promise<void> {
  await emit(env, 'match.score_updated', ctx.matchId, toScorePayload(ctx));
}

export async function emitMatchStatusChange(env: AppEnv, ctx: MatchEmitContext): Promise<void> {
  await emit(env, 'match.status_changed', ctx.matchId, toScorePayload(ctx));
}

export async function emitMatchCompleted(env: AppEnv, ctx: MatchEmitContext): Promise<void> {
  await emit(env, 'match.completed', ctx.matchId, toScorePayload(ctx));
}

export async function emitMatchStatsUpdated(
  env: AppEnv,
  matchId: string,
  data: { matchId: string; slug?: string; updatedAt: string; dataSource: string },
): Promise<void> {
  await emit(env, 'match.stats_updated', matchId, data);
}

export async function emitMatchCommentaryUpdated(
  env: AppEnv,
  matchId: string,
  data: { matchId: string; slug?: string; lineCount: number; updatedAt: string },
): Promise<void> {
  await emit(env, 'match.commentary_updated', matchId, data);
}

export async function emitMatchEventsUpdated(
  env: AppEnv,
  matchId: string,
  data: { matchId: string; slug?: string; eventCount: number; updatedAt: string },
): Promise<void> {
  await emit(env, 'match.events_updated', matchId, data);
}
