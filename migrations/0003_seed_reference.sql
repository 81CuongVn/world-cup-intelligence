-- Reference seed data for local development

INSERT OR IGNORE INTO source_registry (id, source_name, source_type, base_url, reliability_score, allowed_usage, health_status)
VALUES
  ('src-mock', 'Mock Development Source', 'manual', NULL, 0.9, 'development', 'healthy'),
  ('src-statsbomb', 'StatsBomb Open Data', 'open_data', 'https://github.com/statsbomb/open-data', 0.85, 'research', 'healthy'),
  ('src-football-data', 'Football-Data.org', 'licensed', 'https://www.football-data.org', 0.8, 'api', 'unknown');

INSERT OR IGNORE INTO tournaments (id, year, name, host_countries_json, start_date, end_date, teams_count, status)
VALUES
  ('t-2022', 2022, 'FIFA World Cup Qatar 2022', '["Qatar"]', '2022-11-20', '2022-12-18', 32, 'completed'),
  ('t-2026', 2026, 'FIFA World Cup 2026', '["USA","Mexico","Canada"]', '2026-06-11', '2026-07-19', 48, 'upcoming');

INSERT OR IGNORE INTO venues (id, name, city, country, capacity, timezone)
VALUES
  ('v-lusail', 'Lusail Stadium', 'Lusail', 'Qatar', 88966, 'Asia/Qatar'),
  ('v-metlife', 'MetLife Stadium', 'East Rutherford', 'USA', 82500, 'America/New_York');

INSERT OR IGNORE INTO teams (id, name, short_name, country_code, confederation, fifa_ranking, elo_rating, collective_strength_rating)
VALUES
  ('team-arg', 'Argentina', 'ARG', 'AR', 'CONMEBOL', 1, 1985, 0.92),
  ('team-fra', 'France', 'FRA', 'FR', 'UEFA', 2, 1960, 0.91),
  ('team-bra', 'Brazil', 'BRA', 'BR', 'CONMEBOL', 3, 1940, 0.90),
  ('team-eng', 'England', 'ENG', 'GB', 'UEFA', 4, 1890, 0.88),
  ('team-usa', 'United States', 'USA', 'US', 'CONCACAF', 12, 1780, 0.78),
  ('team-mex', 'Mexico', 'MEX', 'MX', 'CONCACAF', 15, 1760, 0.76);

INSERT OR IGNORE INTO players (id, name, nationality, primary_team_id, club, position, role_tags_json, age)
VALUES
  ('p-messi', 'Lionel Messi', 'AR', 'team-arg', 'Inter Miami', 'FW', '["playmaker","finisher"]', 37),
  ('p-mbappe', 'Kylian Mbappé', 'FR', 'team-fra', 'Real Madrid', 'FW', '["pace","finisher"]', 26),
  ('p-modric', 'Luka Modrić', 'HR', 'team-fra', 'Real Madrid', 'MF', '["creator"]', 39),
  ('p-kane', 'Harry Kane', 'GB', 'team-eng', 'Bayern Munich', 'FW', '["finisher"]', 31),
  ('p-pulisic', 'Christian Pulisic', 'US', 'team-usa', 'AC Milan', 'FW', '["wide_attacker"]', 26);

INSERT OR IGNORE INTO squads (id, tournament_id, team_id, source_id, is_official, confidence)
VALUES
  ('sq-arg-2022', 't-2022', 'team-arg', 'src-mock', 1, 0.95),
  ('sq-fra-2022', 't-2022', 'team-fra', 'src-mock', 1, 0.95);

INSERT OR IGNORE INTO squad_players (squad_id, player_id, shirt_number, listed_position, status)
VALUES
  ('sq-arg-2022', 'p-messi', 10, 'FW', 'available'),
  ('sq-fra-2022', 'p-mbappe', 10, 'FW', 'available'),
  ('sq-fra-2022', 'p-modric', 10, 'MF', 'available');

INSERT OR IGNORE INTO matches (id, tournament_id, stage, group_code, home_team_id, away_team_id, venue_id, kickoff_utc, status, minute, home_score, away_score, home_xg, away_xg)
VALUES
  ('m-final-2022', 't-2022', 'Final', NULL, 'team-arg', 'team-fra', 'v-lusail', '2022-12-18T15:00:00Z', 'completed', 90, 3, 3, 2.1, 2.4),
  ('m-usa-mex-2026', 't-2026', 'Group', 'A', 'team-usa', 'team-mex', 'v-metlife', '2026-06-15T20:00:00Z', 'scheduled', 0, 0, 0, 0, 0);

INSERT OR IGNORE INTO lineups (id, match_id, team_id, source_id, formation, is_official, confidence)
VALUES
  ('lu-arg-final', 'm-final-2022', 'team-arg', 'src-mock', '4-4-2', 1, 0.9),
  ('lu-fra-final', 'm-final-2022', 'team-fra', 'src-mock', '4-2-3-1', 1, 0.9);

INSERT OR IGNORE INTO lineup_players (lineup_id, player_id, is_starter, role, position_slot, shirt_number, x, y)
VALUES
  ('lu-arg-final', 'p-messi', 1, 'RW', 'RW', 10, 0.75, 0.35),
  ('lu-fra-final', 'p-mbappe', 1, 'ST', 'ST', 10, 0.55, 0.2),
  ('lu-fra-final', 'p-modric', 1, 'CM', 'CM', 10, 0.5, 0.5);

INSERT OR IGNORE INTO match_events (id, match_id, team_id, player_id, event_type, minute, period, x, y, xg, outcome, source_id)
VALUES
  ('ev-1', 'm-final-2022', 'team-arg', 'p-messi', 'goal', 23, '1H', 0.82, 0.45, 0.35, 'scored', 'src-mock'),
  ('ev-2', 'm-final-2022', 'team-fra', 'p-mbappe', 'goal', 36, '1H', 0.78, 0.42, 0.41, 'scored', 'src-mock'),
  ('ev-3', 'm-final-2022', 'team-fra', 'p-mbappe', 'goal', 81, '2H', 0.85, 0.38, 0.78, 'scored', 'src-mock');

INSERT OR IGNORE INTO probability_snapshots (id, match_id, minute, home_win_prob, draw_prob, away_win_prob, expected_home_goals, expected_away_goals, most_likely_score, scoreline_json, interval_json, confidence, model_version, input_hash, explanation_json)
VALUES
  ('ps-final-pre', 'm-final-2022', 0, 0.38, 0.26, 0.36, 1.42, 1.48, '1-1', '{}', '{}', 0.82, 'wc-prob-v1', 'seed-hash-1', '{"topPositiveFactors":[],"topNegativeFactors":[]}'),
  ('ps-usa-pre', 'm-usa-mex-2026', 0, 0.44, 0.28, 0.28, 1.35, 1.05, '1-0', '{}', '{}', 0.71, 'wc-prob-v1', 'seed-hash-2', '{"topPositiveFactors":[],"topNegativeFactors":[]}');

INSERT OR IGNORE INTO source_documents (id, source_id, source_url, title, published_at, retrieved_at, summary, reliability_score)
VALUES
  ('doc-1', 'src-mock', 'https://example.com/preview', 'Argentina vs France tactical preview', '2022-12-17T10:00:00Z', '2022-12-17T12:00:00Z', 'High pressing expected from France in wide areas.', 0.75);

INSERT OR IGNORE INTO injury_reports (id, player_id, team_id, status, injury_type, severity, confidence)
VALUES
  ('inj-1', 'p-modric', 'team-fra', 'doubtful', 'muscle', 'low', 0.6);
