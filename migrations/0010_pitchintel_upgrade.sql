-- PitchIntel upgrade: team systems, scenarios, market signals

CREATE TABLE IF NOT EXISTS team_system_profiles (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL,
  tournament_id TEXT,
  tactical_identity TEXT,
  primary_formation TEXT,
  secondary_formations_json TEXT,
  formation_stability_score REAL,
  pressing_score REAL,
  defensive_compactness_score REAL,
  transition_score REAL,
  set_piece_score REAL,
  bench_depth_score REAL,
  lineup_cohesion_score REAL,
  possession_control_score REAL,
  tempo_score REAL,
  game_state_behavior_json TEXT,
  collective_strength_score REAL,
  source_id TEXT,
  model_version TEXT,
  input_hash TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(team_id) REFERENCES teams(id)
);

CREATE INDEX IF NOT EXISTS idx_team_system_team ON team_system_profiles(team_id, tournament_id);

CREATE TABLE IF NOT EXISTS scenario_probabilities (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  scenario_type TEXT NOT NULL,
  probability REAL NOT NULL,
  confidence REAL DEFAULT 0.5,
  model_version TEXT,
  input_hash TEXT,
  explanation_json TEXT,
  feature_snapshot_r2_key TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(match_id) REFERENCES matches(id)
);

CREATE INDEX IF NOT EXISTS idx_scenario_match ON scenario_probabilities(match_id, scenario_type);

CREATE TABLE IF NOT EXISTS market_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  base_url TEXT,
  reliability_score REAL DEFAULT 0.5,
  allowed_usage TEXT,
  license_notes TEXT,
  rate_limit_json TEXT,
  health_status TEXT DEFAULT 'unknown',
  last_success_at TEXT,
  last_error_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS market_odds_snapshots (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  market_type TEXT NOT NULL,
  selection TEXT NOT NULL,
  odds_decimal REAL,
  implied_probability REAL,
  normalized_probability REAL,
  overround REAL,
  line_value REAL,
  retrieved_at TEXT,
  raw_r2_key TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(match_id) REFERENCES matches(id),
  FOREIGN KEY(source_id) REFERENCES market_sources(id)
);

CREATE INDEX IF NOT EXISTS idx_market_odds_match ON market_odds_snapshots(match_id, retrieved_at);

CREATE TABLE IF NOT EXISTS market_signal_analysis (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  model_home_prob REAL,
  model_draw_prob REAL,
  model_away_prob REAL,
  market_home_prob REAL,
  market_draw_prob REAL,
  market_away_prob REAL,
  edge_home REAL,
  edge_draw REAL,
  edge_away REAL,
  volatility_score REAL,
  explanation_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(match_id) REFERENCES matches(id)
);

CREATE INDEX IF NOT EXISTS idx_market_signal_match ON market_signal_analysis(match_id, created_at);

INSERT OR IGNORE INTO market_sources (
  id, name, source_type, base_url, reliability_score, allowed_usage, license_notes, health_status
) VALUES (
  'mkt-manual',
  'Manual Analyst Input',
  'manual_analyst_input',
  NULL,
  0.7,
  'analytical_context_only',
  'Human-entered consensus for model comparison — not betting advice.',
  'healthy'
);

-- Historical World Cup tournaments (2006+)
INSERT OR IGNORE INTO tournaments (id, year, name, host_countries_json, teams_count, status)
VALUES
  ('t-2006', 2006, 'FIFA World Cup 2006', '["Germany"]', 32, 'completed'),
  ('t-2010', 2010, 'FIFA World Cup 2010', '["South Africa"]', 32, 'completed'),
  ('t-2014', 2014, 'FIFA World Cup 2014', '["Brazil"]', 32, 'completed'),
  ('t-2018', 2018, 'FIFA World Cup 2018', '["Russia"]', 32, 'completed'),
  ('t-2022', 2022, 'FIFA World Cup 2022', '["Qatar"]', 32, 'completed');
