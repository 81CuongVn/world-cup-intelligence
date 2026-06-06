import type { AppEnv } from '../env';
import { WC2026_TOURNAMENT_ID } from '../constants/tournament';
import { buildMatchSlug } from '../utils/matchSlug';
import { attachSlugToScheduleRow } from './matchRef';

export type BracketMatchNode = {
  id: string;
  slug: string;
  stage: string | null;
  kickoffUtc: string;
  status: string;
  homeTeamId: string;
  awayTeamId: string;
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
};

export type BracketRound = {
  stage: string;
  matches: BracketMatchNode[];
};

export async function buildBracketPayload(env: AppEnv): Promise<{ tournamentId: string; rounds: BracketRound[] }> {
  const { results } = await env.DB.prepare(
    `SELECT m.id, m.stage, m.kickoff_utc, m.status,
            m.home_team_id, m.away_team_id, m.home_score, m.away_score,
            ht.name AS home_name, at.name AS away_name
     FROM matches m
     JOIN teams ht ON ht.id = m.home_team_id
     JOIN teams at ON at.id = m.away_team_id
     WHERE m.tournament_id = ? AND m.stage != 'Group'
     ORDER BY m.kickoff_utc ASC`,
  )
    .bind(WC2026_TOURNAMENT_ID)
    .all<{
      id: string;
      stage: string | null;
      kickoff_utc: string;
      status: string;
      home_team_id: string;
      away_team_id: string;
      home_score: number;
      away_score: number;
      home_name: string;
      away_name: string;
    }>();

  const stageOrder = [
    'Round of 32',
    'Round of 16',
    'Quarter-final',
    'Semi-final',
    'Third place',
    'Final',
  ];

  const byStage = new Map<string, BracketMatchNode[]>();

  for (const row of results ?? []) {
    const stage = row.stage ?? 'Knockout';
    const slug = buildMatchSlug({
      stage: row.stage,
      groupCode: null,
      homeName: row.home_name,
      awayName: row.away_name,
    });
    const node: BracketMatchNode = {
      id: row.id,
      slug,
      stage: row.stage,
      kickoffUtc: row.kickoff_utc,
      status: row.status,
      homeTeamId: row.home_team_id,
      awayTeamId: row.away_team_id,
      homeName: row.home_name,
      awayName: row.away_name,
      homeScore: row.home_score,
      awayScore: row.away_score,
    };
    if (!byStage.has(stage)) byStage.set(stage, []);
    byStage.get(stage)!.push(node);
  }

  const rounds: BracketRound[] = [];
  for (const stage of stageOrder) {
    const matches = byStage.get(stage);
    if (matches?.length) rounds.push({ stage, matches });
  }

  for (const [stage, matches] of byStage) {
    if (!stageOrder.includes(stage)) rounds.push({ stage, matches });
  }

  return { tournamentId: WC2026_TOURNAMENT_ID, rounds };
}

/** Attach slug to schedule row helper re-export for bracket consumers. */
export { attachSlugToScheduleRow };
