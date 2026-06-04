INSERT OR IGNORE INTO matches (id, tournament_id, stage, group_code, home_team_id, away_team_id, venue_id, kickoff_utc, status)
VALUES
  ('m-arg-mex-2026', 't-2026', 'Group', 'A', 'team-arg', 'team-mex', 'v-metlife', '2026-06-20T02:00:00Z', 'scheduled'),
  ('m-fra-eng-2026', 't-2026', 'Group', 'B', 'team-fra', 'team-eng', 'v-metlife', '2026-06-22T20:00:00Z', 'scheduled'),
  ('m-bra-usa-2026', 't-2026', 'Group', 'C', 'team-bra', 'team-usa', 'v-metlife', '2026-06-25T23:00:00Z', 'scheduled');
