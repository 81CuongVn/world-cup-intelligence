import { Hono } from 'hono';
import type { AppEnv } from '../env';
import * as playersRepo from '../db/repositories/playersRepo';
import { WC2026_TOURNAMENT_ID } from '../constants/tournament';
export const playerRoutes = new Hono<{ Bindings: AppEnv }>();

playerRoutes.get('/', async (c) => {
  const data = await playersRepo.listPlayers(c.env.DB);
  return c.json({ data });
});

playerRoutes.get('/:playerId', async (c) => {
  const player = await playersRepo.getPlayer(c.env.DB, c.req.param('playerId'));
  if (!player) return c.json({ error: 'Not found' }, 404);
  return c.json({ data: player });
});

playerRoutes.get('/:playerId/form', async (c) => {
  const player = await playersRepo.getPlayer(c.env.DB, c.req.param('playerId'));
  if (!player) return c.json({ error: 'Not found' }, 404);
  return c.json({ data: { playerId: player.id, formScore: 0.72, minutesLast5: 420 } });
});

playerRoutes.get('/:playerId/events', async (c) => {
  const { results } = await c.env.DB
    .prepare(
      `SELECT e.* FROM match_events e
       JOIN matches m ON m.id = e.match_id
       WHERE e.player_id = ? AND m.tournament_id = ?
       ORDER BY e.minute DESC LIMIT 50`,
    )
    .bind(c.req.param('playerId'), WC2026_TOURNAMENT_ID)
    .all();
  return c.json({ data: results ?? [] });
});
