-- South Africa World Cup match history (1998, 2002, 2010) for recent-form panels

INSERT OR IGNORE INTO teams (id, name, short_name, country_code, confederation, fifa_ranking, elo_rating, collective_strength_rating)
VALUES ('team-svn', 'Slovenia', 'SVN', 'SI', 'UEFA', 55, 1580, 0.58);

INSERT OR IGNORE INTO matches (id, tournament_id, stage, group_code, home_team_id, away_team_id, venue_id, kickoff_utc, status, minute, home_score, away_score, home_xg, away_xg)
VALUES
  ('m-wc10-rsa-mex-gr', 't-2010', 'Group', 'A', 'team-w26-a2', 'team-mex', 'v-historic', '2010-06-11T18:00:00Z', 'completed', 90, 0, 0, 0.8, 1.1),
  ('m-wc10-rsa-uru-gr', 't-2010', 'Group', 'A', 'team-w26-a2', 'team-uru', 'v-historic', '2010-06-16T18:30:00Z', 'completed', 90, 0, 3, 0.5, 2.4),
  ('m-wc10-rsa-fra-gr', 't-2010', 'Group', 'A', 'team-w26-a2', 'team-fra', 'v-historic', '2010-06-22T18:00:00Z', 'completed', 90, 1, 2, 1.0, 1.8),
  ('m-wc02-par-rsa-gr', 't-2002', 'Group', 'B', 'team-par', 'team-w26-a2', 'v-historic', '2002-06-02T12:30:00Z', 'completed', 90, 2, 2, 1.4, 1.3),
  ('m-wc02-esp-rsa-gr', 't-2002', 'Group', 'B', 'team-esp', 'team-w26-a2', 'v-historic', '2002-06-07T12:30:00Z', 'completed', 90, 3, 2, 2.1, 1.5),
  ('m-wc02-rsa-svn-gr', 't-2002', 'Group', 'B', 'team-w26-a2', 'team-svn', 'v-historic', '2002-06-12T12:30:00Z', 'completed', 90, 1, 0, 1.2, 0.6),
  ('m-wc98-fra-rsa-gr', 't-1998', 'Group', 'C', 'team-fra', 'team-w26-a2', 'v-historic', '1998-06-12T20:00:00Z', 'completed', 90, 3, 0, 2.5, 0.4),
  ('m-wc98-den-rsa-gr', 't-1998', 'Group', 'C', 'team-den', 'team-w26-a2', 'v-historic', '1998-06-18T20:00:00Z', 'completed', 90, 1, 1, 1.3, 0.9),
  ('m-wc98-rsa-ksa-gr', 't-1998', 'Group', 'C', 'team-w26-a2', 'team-ksa', 'v-historic', '1998-06-24T20:00:00Z', 'completed', 90, 2, 2, 1.6, 1.4);
