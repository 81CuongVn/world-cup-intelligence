-- Pitch map: substitution links, event coordinates, sample movement vectors

INSERT OR IGNORE INTO match_events (id, match_id, team_id, player_id, related_player_id, event_type, minute, period, x, y, end_x, end_y, xg, source_id)
VALUES
  ('ev-mexsa-sub1', 'm-w26-ga-1v2', 'team-w26-a1', 'p-mex-alvarado', 'p-mex-reyes', 'substitution', 35, '1H', NULL, NULL, NULL, NULL, NULL, 'src-fifa'),
  ('ev-mexsa-sub2', 'm-w26-ga-1v2', 'team-w26-a1', 'p-mex-gutierrez', 'p-mex-vega', 'substitution', 62, '2H', NULL, NULL, NULL, NULL, NULL, 'src-fifa'),
  ('ev-mexsa-sub3', 'm-w26-ga-1v2', 'team-w26-a2', 'p-rsa-zwane', 'p-rsa-adams', 'substitution', 20, '1H', NULL, NULL, NULL, NULL, NULL, 'src-fifa');

UPDATE match_events SET x = 0.78, y = 0.42, end_x = 0.82, end_y = 0.38 WHERE id = 'ev-mexsa-g1';
UPDATE match_events SET x = 0.72, y = 0.35, end_x = 0.76, end_y = 0.32 WHERE id = 'ev-mexsa-g2';

INSERT OR IGNORE INTO match_events (id, match_id, team_id, player_id, event_type, minute, period, x, y, end_x, end_y, xg, source_id)
VALUES
  ('ev-mexsa-shot1', 'm-w26-ga-1v2', 'team-w26-a1', 'p-mex-quinones', 'shot', 8, '1H', 0.74, 0.44, 0.78, 0.42, 0.32, 'src-fifa'),
  ('ev-mexsa-shot2', 'm-w26-ga-1v2', 'team-w26-a1', 'p-mex-jimenez', 'shot', 66, '2H', 0.71, 0.38, 0.72, 0.35, 0.41, 'src-fifa'),
  ('ev-mexsa-pass1', 'm-w26-ga-1v2', 'team-w26-a1', 'p-mex-alvarado', 'pass', 66, '2H', 0.58, 0.72, 0.68, 0.40, NULL, 'src-fifa'),
  ('ev-mexsa-pass2', 'm-w26-ga-1v2', 'team-w26-a1', 'p-mex-lira', 'pass', 30, '1H', 0.42, 0.55, 0.52, 0.48, NULL, 'src-fifa');
