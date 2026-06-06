CREATE TABLE IF NOT EXISTS match_prediction_scenarios (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  scenario_type TEXT NOT NULL,
  scenario_name TEXT NOT NULL,
  scenario_rank INTEGER NOT NULL,
  is_baseline INTEGER DEFAULT 0,

  initial_conditions_json TEXT NOT NULL,
  trigger_conditions_json TEXT,
  invalidation_conditions_json TEXT,

  scenario_probability REAL NOT NULL,
  scenario_confidence REAL DEFAULT 0.5,

  home_win_prob REAL,
  draw_prob REAL,
  away_win_prob REAL,

  expected_home_goals REAL,
  expected_away_goals REAL,
  most_likely_score TEXT,

  scoreline_distribution_json TEXT,
  interval_distribution_json TEXT,

  key_drivers_json TEXT,
  risk_factors_json TEXT,
  explanation_json TEXT,

  model_version TEXT NOT NULL,
  input_hash TEXT NOT NULL,
  feature_snapshot_r2_key TEXT,

  status TEXT DEFAULT 'active',
  generated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(match_id) REFERENCES matches(id)
);

CREATE TABLE IF NOT EXISTS scenario_probability_snapshots (
  id TEXT PRIMARY KEY,
  scenario_id TEXT NOT NULL,
  match_id TEXT NOT NULL,

  minute INTEGER,
  second INTEGER,

  scenario_probability REAL NOT NULL,
  home_win_prob REAL,
  draw_prob REAL,
  away_win_prob REAL,

  expected_home_goals REAL,
  expected_away_goals REAL,

  delta_from_previous REAL,
  update_reason TEXT,
  realtime_event_id TEXT,

  model_version TEXT,
  input_hash TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(scenario_id) REFERENCES match_prediction_scenarios(id),
  FOREIGN KEY(match_id) REFERENCES matches(id)
);

CREATE TABLE IF NOT EXISTS scenario_comparisons (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,

  scenario_a_id TEXT NOT NULL,
  scenario_b_id TEXT NOT NULL,

  probability_gap REAL,
  confidence_gap REAL,

  home_win_delta REAL,
  draw_delta REAL,
  away_win_delta REAL,
  xg_home_delta REAL,
  xg_away_delta REAL,

  comparison_summary TEXT,
  comparison_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(match_id) REFERENCES matches(id),
  FOREIGN KEY(scenario_a_id) REFERENCES match_prediction_scenarios(id),
  FOREIGN KEY(scenario_b_id) REFERENCES match_prediction_scenarios(id)
);

CREATE INDEX IF NOT EXISTS idx_match_prediction_scenarios_match_id
ON match_prediction_scenarios(match_id);

CREATE INDEX IF NOT EXISTS idx_match_prediction_scenarios_rank
ON match_prediction_scenarios(match_id, scenario_rank);

CREATE INDEX IF NOT EXISTS idx_scenario_snapshots_match_id
ON scenario_probability_snapshots(match_id);

CREATE INDEX IF NOT EXISTS idx_scenario_snapshots_scenario_id
ON scenario_probability_snapshots(scenario_id);
