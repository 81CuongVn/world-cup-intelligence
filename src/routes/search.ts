import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { AppEnv } from '../env';
import { searchQuerySchema } from '../utils/zod';
import { WC2026_TOURNAMENT_ID } from '../constants/tournament';

export const searchRoutes = new Hono<{ Bindings: AppEnv }>();

searchRoutes.get('/', zValidator('query', searchQuerySchema), async (c) => {
  const { q } = c.req.valid('query');
  const pattern = `%${q}%`;
  const [teams, players, matches] = await Promise.all([
    c.env.DB
      .prepare(
        `SELECT DISTINCT t.id, t.name FROM teams t
         JOIN matches m ON t.id = m.home_team_id OR t.id = m.away_team_id
         WHERE m.tournament_id = ? AND t.name LIKE ?
         LIMIT 10`,
      )
      .bind(WC2026_TOURNAMENT_ID, pattern)
      .all(),
    c.env.DB
      .prepare(
        `SELECT DISTINCT p.id, p.name FROM players p
         JOIN squad_players sp ON sp.player_id = p.id
         JOIN squads s ON s.id = sp.squad_id
         WHERE s.tournament_id = ? AND p.name LIKE ?
         LIMIT 10`,
      )
      .bind(WC2026_TOURNAMENT_ID, pattern)
      .all(),
    c.env.DB
      .prepare(
        `SELECT m.id, m.stage, ht.name as home, at.name as away
         FROM matches m
         JOIN teams ht ON ht.id = m.home_team_id
         JOIN teams at ON at.id = m.away_team_id
         WHERE m.tournament_id = ?
           AND (ht.name LIKE ? OR at.name LIKE ?)
         LIMIT 10`,
      )
      .bind(WC2026_TOURNAMENT_ID, pattern, pattern)
      .all(),
  ]);
  return c.json({
    data: {
      teams: teams.results ?? [],
      players: players.results ?? [],
      matches: matches.results ?? [],
    },
  });
});
