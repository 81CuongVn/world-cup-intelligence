import { Hono } from 'hono';
import type { AppEnv } from '../env';
import * as teamsRepo from '../db/repositories/teamsRepo';
import { getTeamWorldCupHeadToHead } from '../services/matchHistory';
import { WC2026_TOURNAMENT_ID } from '../constants/tournament';

export const teamRoutes = new Hono<{ Bindings: AppEnv }>();

teamRoutes.get('/', async (c) => {
  const data = await teamsRepo.getTeamsByTournament(c.env.DB, WC2026_TOURNAMENT_ID);
  return c.json({ data });
});

teamRoutes.get('/:teamId', async (c) => {
  const team = await teamsRepo.getTeam(c.env.DB, c.req.param('teamId'));
  if (!team) return c.json({ error: 'Not found' }, 404);
  return c.json({ data: team });
});

teamRoutes.get('/:teamId/squad', async (c) => {
  const { results } = await c.env.DB
    .prepare(
      `SELECT sp.*, p.name, p.position FROM squad_players sp
       JOIN players p ON p.id = sp.player_id
       JOIN squads s ON s.id = sp.squad_id
       WHERE s.team_id = ?`,
    )
    .bind(c.req.param('teamId'))
    .all();
  return c.json({ data: results ?? [] });
});

teamRoutes.get('/:teamId/wc-h2h', async (c) => {
  const data = await getTeamWorldCupHeadToHead(c.env, c.req.param('teamId'));
  if (!data) return c.json({ error: 'Not found' }, 404);
  return c.json({ data });
});

teamRoutes.get('/:teamId/form', async (c) => {
  const team = await teamsRepo.getTeam(c.env.DB, c.req.param('teamId'));
  if (!team) return c.json({ error: 'Not found' }, 404);
  return c.json({
    data: {
      teamId: team.id,
      eloRating: team.elo_rating,
      collectiveStrength: team.collective_strength_rating,
      recentForm: team.collective_strength_rating ?? 0.75,
    },
  });
});
