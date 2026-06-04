import { Hono } from 'hono';
import type { AppEnv } from '../env';
import * as tournamentsRepo from '../db/repositories/tournamentsRepo';
import * as matchesRepo from '../db/repositories/matchesRepo';
import * as teamsRepo from '../db/repositories/teamsRepo';

export const tournamentRoutes = new Hono<{ Bindings: AppEnv }>();

tournamentRoutes.get('/', async (c) => {
  const data = await tournamentsRepo.listTournaments(c.env.DB);
  return c.json({ data });
});

tournamentRoutes.get('/:year', async (c) => {
  const year = Number(c.req.param('year'));
  const tournament = await tournamentsRepo.getTournamentByYear(c.env.DB, year);
  if (!tournament) return c.json({ error: 'Not found' }, 404);
  return c.json({ data: tournament });
});

tournamentRoutes.get('/:year/matches', async (c) => {
  const year = Number(c.req.param('year'));
  const tournament = await tournamentsRepo.getTournamentByYear(c.env.DB, year);
  if (!tournament) return c.json({ error: 'Not found' }, 404);
  const matches = await matchesRepo.getMatchesByTournament(c.env.DB, tournament.id);
  return c.json({ data: matches });
});

tournamentRoutes.get('/:year/teams', async (c) => {
  const year = Number(c.req.param('year'));
  const tournament = await tournamentsRepo.getTournamentByYear(c.env.DB, year);
  if (!tournament) return c.json({ error: 'Not found' }, 404);
  const teams = await teamsRepo.getTeamsByTournament(c.env.DB, tournament.id);
  return c.json({ data: teams });
});
