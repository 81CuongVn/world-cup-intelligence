-- Historical head-to-head matches for display on match pages

INSERT OR IGNORE INTO matches (id, tournament_id, stage, group_code, home_team_id, away_team_id, venue_id, kickoff_utc, status, minute, home_score, away_score, home_xg, away_xg)
VALUES
  ('m-arg-fra-2018', 't-2022', 'Group', 'C', 'team-arg', 'team-fra', 'v-lusail', '2018-06-30T14:00:00Z', 'completed', 90, 4, 3, 2.8, 2.5),
  ('m-fra-arg-2014', 't-2022', 'Friendly', NULL, 'team-fra', 'team-arg', 'v-lusail', '2014-02-06T20:00:00Z', 'completed', 90, 2, 0, 1.9, 0.6),
  ('m-arg-fra-2006', 't-2022', 'Friendly', NULL, 'team-arg', 'team-fra', 'v-lusail', '2006-02-07T20:00:00Z', 'completed', 90, 1, 2, 0.9, 1.8),
  ('m-usa-mex-2022', 't-2022', 'Friendly', NULL, 'team-usa', 'team-mex', 'v-metlife', '2022-11-13T01:00:00Z', 'completed', 90, 0, 3, 0.4, 2.1),
  ('m-mex-usa-2019', 't-2022', 'Friendly', NULL, 'team-mex', 'team-usa', 'v-metlife', '2019-09-07T02:30:00Z', 'completed', 90, 0, 0, 0.8, 0.7),
  ('m-usa-mex-2017', 't-2022', 'WCQ', NULL, 'team-usa', 'team-mex', 'v-metlife', '2017-11-12T01:00:00Z', 'completed', 90, 1, 2, 1.1, 1.6);
