-- WC 2026 squad lists for projected lineups (key nations)
INSERT OR IGNORE INTO squads (id, tournament_id, team_id, source_id, is_official, confidence)
VALUES
  ('sq-usa-2026', 't-2026', 'team-usa', 'src-mock', 1, 0.85),
  ('sq-mex-2026', 't-2026', 'team-mex', 'src-mock', 1, 0.85),
  ('sq-arg-2026', 't-2026', 'team-arg', 'src-mock', 1, 0.9),
  ('sq-fra-2026', 't-2026', 'team-fra', 'src-mock', 1, 0.9),
  ('sq-eng-2026', 't-2026', 'team-eng', 'src-mock', 1, 0.88),
  ('sq-bra-2026', 't-2026', 'team-bra', 'src-mock', 1, 0.9);

INSERT OR IGNORE INTO squad_players (squad_id, player_id, shirt_number, listed_position, status)
VALUES
  ('sq-usa-2026', 'p-pulisic', 10, 'LW', 'available'),
  ('sq-arg-2026', 'p-messi', 10, 'FW', 'available'),
  ('sq-fra-2026', 'p-mbappe', 10, 'FW', 'available'),
  ('sq-fra-2026', 'p-modric', 8, 'MF', 'available'),
  ('sq-eng-2026', 'p-kane', 9, 'FW', 'available');
