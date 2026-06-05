-- Past FIFA World Cup tournaments and head-to-head meetings (completed, with scores)
-- Used for team WC history and match-page H2H context.

INSERT OR IGNORE INTO venues (id, name, city, country, capacity, timezone)
VALUES ('v-historic', 'Historic venue', '—', '—', 0, 'UTC');

INSERT OR IGNORE INTO tournaments (id, year, name, host_countries_json, start_date, end_date, teams_count, status)
VALUES
  ('t-2018', 2018, 'FIFA World Cup Russia 2018', '["Russia"]', '2018-06-14', '2018-07-15', 32, 'completed'),
  ('t-2014', 2014, 'FIFA World Cup Brazil 2014', '["Brazil"]', '2014-06-12', '2014-07-13', 32, 'completed'),
  ('t-2010', 2010, 'FIFA World Cup South Africa 2010', '["South Africa"]', '2010-06-11', '2010-07-11', 32, 'completed'),
  ('t-2006', 2006, 'FIFA World Cup Germany 2006', '["Germany"]', '2006-06-09', '2006-07-09', 32, 'completed'),
  ('t-2002', 2002, 'FIFA World Cup Korea/Japan 2002', '["South Korea","Japan"]', '2002-05-31', '2002-06-30', 32, 'completed'),
  ('t-1998', 1998, 'FIFA World Cup France 1998', '["France"]', '1998-06-10', '1998-07-12', 32, 'completed'),
  ('t-1990', 1990, 'FIFA World Cup Italy 1990', '["Italy"]', '1990-06-08', '1990-07-08', 24, 'completed'),
  ('t-1986', 1986, 'FIFA World Cup Mexico 1986', '["Mexico"]', '1986-05-31', '1986-06-29', 24, 'completed'),
  ('t-1982', 1982, 'FIFA World Cup Spain 1982', '["Spain"]', '1982-06-13', '1982-07-11', 24, 'completed'),
  ('t-1950', 1950, 'FIFA World Cup Brazil 1950', '["Brazil"]', '1950-06-24', '1950-07-16', 13, 'completed'),
  ('t-1930', 1930, 'FIFA World Cup Uruguay 1930', '["Uruguay"]', '1930-07-13', '1930-07-30', 13, 'completed');

INSERT OR IGNORE INTO matches (id, tournament_id, stage, group_code, home_team_id, away_team_id, venue_id, kickoff_utc, status, minute, home_score, away_score, home_xg, away_xg)
VALUES
  -- Argentina vs France (2018 R16 seeded via UPDATE below from 0005)
  ('m-wc90-arg-bra-r16', 't-1990', 'R16', NULL, 'team-arg', 'team-bra', 'v-historic', '1990-06-24T16:00:00Z', 'completed', 90, 1, 0, 1.2, 0.9),
  ('m-wc82-bra-arg-2nd', 't-1982', 'Second Group', 'F', 'team-bra', 'team-arg', 'v-historic', '1982-07-02T16:00:00Z', 'completed', 90, 3, 1, 2.4, 1.1),
  ('m-wc98-bra-arg-gr', 't-1998', 'Group', 'A', 'team-bra', 'team-arg', 'v-historic', '1998-06-21T20:00:00Z', 'completed', 90, 2, 1, 1.8, 1.4),
  ('m-wc06-arg-bra-gr', 't-2006', 'Group', 'F', 'team-arg', 'team-bra', 'v-historic', '2006-06-18T20:00:00Z', 'completed', 90, 0, 0, 0.9, 1.0),
  -- Argentina vs England
  ('m-wc86-arg-eng-qf', 't-1986', 'QF', NULL, 'team-arg', 'team-eng', 'v-historic', '1986-06-22T16:00:00Z', 'completed', 90, 2, 1, 1.6, 1.2),
  ('m-wc98-arg-eng-r16', 't-1998', 'R16', NULL, 'team-arg', 'team-eng', 'v-historic', '1998-06-30T20:00:00Z', 'completed', 90, 2, 2, 1.5, 1.4),
  ('m-wc02-eng-arg-gr', 't-2002', 'Group', 'F', 'team-eng', 'team-arg', 'v-historic', '2002-06-07T12:30:00Z', 'completed', 90, 1, 0, 1.1, 0.7),
  -- Argentina vs Mexico
  ('m-wc06-arg-mex-gr', 't-2006', 'Group', 'D', 'team-arg', 'team-mex', 'v-historic', '2006-06-10T20:00:00Z', 'completed', 90, 2, 1, 1.7, 1.0),
  ('m-wc10-arg-mex-r16', 't-2010', 'R16', NULL, 'team-arg', 'team-mex', 'v-historic', '2010-06-27T18:00:00Z', 'completed', 90, 3, 1, 2.2, 0.9),
  -- Argentina vs USA (1930 semi omitted — use 2008? skip; include 1930 as historic)
  ('m-wc30-arg-usa-sf', 't-1930', 'SF', NULL, 'team-arg', 'team-usa', 'v-historic', '1930-07-26T00:00:00Z', 'completed', 90, 6, 1, 0, 0),
  -- France vs England
  ('m-wc82-eng-fra-gr', 't-1982', 'Group', 'B', 'team-eng', 'team-fra', 'v-historic', '1982-06-16T16:00:00Z', 'completed', 90, 3, 1, 2.0, 1.1),
  ('m-wc22-eng-fra-qf', 't-2022', 'QF', NULL, 'team-eng', 'team-fra', 'v-historic', '2022-12-10T19:00:00Z', 'completed', 90, 1, 2, 0.9, 1.6),
  -- France vs Brazil
  ('m-wc86-fra-bra-qf', 't-1986', 'QF', NULL, 'team-fra', 'team-bra', 'v-historic', '1986-06-21T16:00:00Z', 'completed', 90, 1, 1, 1.3, 1.2),
  ('m-wc98-fra-bra-final', 't-1998', 'Final', NULL, 'team-fra', 'team-bra', 'v-historic', '1998-07-12T20:00:00Z', 'completed', 90, 3, 0, 2.1, 0.8),
  -- France vs Mexico
  ('m-wc10-fra-mex-gr', 't-2010', 'Group', 'A', 'team-fra', 'team-mex', 'v-historic', '2010-06-17T18:00:00Z', 'completed', 90, 0, 2, 0.7, 1.4),
  -- Brazil vs Mexico
  ('m-wc50-bra-mex-gr', 't-1950', 'Group', 'A', 'team-bra', 'team-mex', 'v-historic', '1950-07-02T00:00:00Z', 'completed', 90, 4, 0, 0, 0),
  ('m-wc14-bra-mex-gr', 't-2014', 'Group', 'A', 'team-bra', 'team-mex', 'v-historic', '2014-06-17T20:00:00Z', 'completed', 90, 0, 0, 1.4, 0.6),
  ('m-wc18-bra-mex-gr', 't-2018', 'Group', 'E', 'team-bra', 'team-mex', 'v-historic', '2018-07-02T18:00:00Z', 'completed', 90, 2, 0, 1.8, 0.5),
  -- Brazil vs England
  ('m-wc02-bra-eng-qf', 't-2002', 'QF', NULL, 'team-bra', 'team-eng', 'v-historic', '2002-06-21T12:30:00Z', 'completed', 90, 2, 1, 1.6, 1.2),
  -- USA vs Mexico
  ('m-wc02-usa-mex-gr', 't-2002', 'Group', 'C', 'team-usa', 'team-mex', 'v-historic', '2002-06-17T17:00:00Z', 'completed', 90, 2, 0, 1.3, 0.6),
  -- USA vs England
  ('m-wc50-usa-eng-gr', 't-1950', 'Group', 'B', 'team-usa', 'team-eng', 'v-historic', '1950-06-29T00:00:00Z', 'completed', 90, 1, 0, 0, 0),
  ('m-wc10-eng-usa-gr', 't-2010', 'Group', 'C', 'team-eng', 'team-usa', 'v-historic', '2010-06-12T18:00:00Z', 'completed', 90, 1, 1, 1.2, 0.9);

-- Fix mis-tagged 2018 R16 match from migration 0005 (was under t-2022 as Group)
UPDATE matches SET tournament_id = 't-2018', stage = 'R16', group_code = NULL
WHERE id = 'm-arg-fra-2018';
