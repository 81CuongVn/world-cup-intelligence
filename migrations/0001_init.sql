-- 03 - D1 Schema for WC Tactical Probability Platform

CREATE TABLE IF NOT EXISTS tournaments (
  id TEXT PRIMARY KEY,
  year INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  host_countries_json TEXT,
  start_date TEXT,
  end_date TEXT,
  teams_count INTEGER,
  status TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS source_registry (
  id TEXT PRIMARY KEY,
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  base_url TEXT,
  reliability_score REAL DEFAULT 0.5,
  allowed_usage TEXT,
  rate_limit_json TEXT,
  license_notes TEXT,
  robots_policy_notes TEXT,
  health_status TEXT DEFAULT 'unknown',
  last_success_at TEXT,
  last_error_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  fifa_id TEXT,
  name TEXT NOT NULL,
  short_name TEXT,
  country_code TEXT,
  confederation TEXT,
  crest_url TEXT,
  fifa_ranking INTEGER,
  elo_rating REAL,
  collective_strength_rating REAL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  external_ids_json TEXT,
  name TEXT NOT NULL,
  birth_date TEXT,
  age INTEGER,
  nationality TEXT,
  primary_team_id TEXT,
  club TEXT,
  position TEXT,
  role_tags_json TEXT,
  dominant_foot TEXT,
  height_cm INTEGER,
  weight_kg INTEGER,
  image_url TEXT,
  profile_status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS venues (
  id TEXT PRIMARY KEY,
  name TEXT,
  city TEXT,
  country TEXT,
  capacity INTEGER,
  latitude REAL,
  longitude REAL,
  timezone TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS squads (
  id TEXT PRIMARY KEY,
  tournament_id TEXT NOT NULL,
  team_id TEXT NOT NULL,
  source_id TEXT,
  is_official INTEGER DEFAULT 0,
  announced_at TEXT,
  confidence REAL DEFAULT 0.5,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(tournament_id) REFERENCES tournaments(id),
  FOREIGN KEY(team_id) REFERENCES teams(id),
  FOREIGN KEY(source_id) REFERENCES source_registry(id)
);

CREATE TABLE IF NOT EXISTS squad_players (
  squad_id TEXT NOT NULL,
  player_id TEXT NOT NULL,
  shirt_number INTEGER,
  listed_position TEXT,
  status TEXT DEFAULT 'available',
  PRIMARY KEY(squad_id, player_id),
  FOREIGN KEY(squad_id) REFERENCES squads(id),
  FOREIGN KEY(player_id) REFERENCES players(id)
);

CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  tournament_id TEXT NOT NULL,
  fifa_match_id TEXT,
  stage TEXT,
  group_code TEXT,
  home_team_id TEXT NOT NULL,
  away_team_id TEXT NOT NULL,
  venue_id TEXT,
  kickoff_utc TEXT,
  status TEXT DEFAULT 'scheduled',
  minute INTEGER DEFAULT 0,
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  home_xg REAL DEFAULT 0,
  away_xg REAL DEFAULT 0,
  weather_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(tournament_id) REFERENCES tournaments(id),
  FOREIGN KEY(home_team_id) REFERENCES teams(id),
  FOREIGN KEY(away_team_id) REFERENCES teams(id),
  FOREIGN KEY(venue_id) REFERENCES venues(id)
);

CREATE TABLE IF NOT EXISTS lineups (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  team_id TEXT NOT NULL,
  source_id TEXT,
  source_type TEXT,
  formation TEXT,
  is_official INTEGER DEFAULT 0,
  confidence REAL DEFAULT 0.5,
  published_at TEXT,
  raw_r2_key TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(match_id) REFERENCES matches(id),
  FOREIGN KEY(team_id) REFERENCES teams(id),
  FOREIGN KEY(source_id) REFERENCES source_registry(id)
);

CREATE TABLE IF NOT EXISTS lineup_players (
  lineup_id TEXT NOT NULL,
  player_id TEXT NOT NULL,
  is_starter INTEGER DEFAULT 0,
  role TEXT,
  position_slot TEXT,
  shirt_number INTEGER,
  x REAL,
  y REAL,
  PRIMARY KEY(lineup_id, player_id),
  FOREIGN KEY(lineup_id) REFERENCES lineups(id),
  FOREIGN KEY(player_id) REFERENCES players(id)
);

CREATE TABLE IF NOT EXISTS match_events (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  team_id TEXT,
  player_id TEXT,
  related_player_id TEXT,
  event_type TEXT NOT NULL,
  minute INTEGER,
  second INTEGER,
  period TEXT,
  x REAL,
  y REAL,
  end_x REAL,
  end_y REAL,
  outcome TEXT,
  xg REAL,
  xa REAL,
  value_added REAL,
  qualifiers_json TEXT,
  source_id TEXT,
  raw_r2_key TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(match_id) REFERENCES matches(id),
  FOREIGN KEY(team_id) REFERENCES teams(id),
  FOREIGN KEY(player_id) REFERENCES players(id),
  FOREIGN KEY(source_id) REFERENCES source_registry(id)
);

CREATE TABLE IF NOT EXISTS player_match_stats (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  player_id TEXT NOT NULL,
  team_id TEXT NOT NULL,
  minutes_played INTEGER DEFAULT 0,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  shots INTEGER DEFAULT 0,
  shots_on_target INTEGER DEFAULT 0,
  xg REAL DEFAULT 0,
  xa REAL DEFAULT 0,
  passes INTEGER DEFAULT 0,
  pass_accuracy REAL DEFAULT 0,
  progressive_passes INTEGER DEFAULT 0,
  carries INTEGER DEFAULT 0,
  progressive_carries INTEGER DEFAULT 0,
  dribbles_completed INTEGER DEFAULT 0,
  pressures INTEGER DEFAULT 0,
  tackles INTEGER DEFAULT 0,
  interceptions INTEGER DEFAULT 0,
  clearances INTEGER DEFAULT 0,
  aerial_duels_won INTEGER DEFAULT 0,
  fouls_committed INTEGER DEFAULT 0,
  fouls_won INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  goals_added REAL DEFAULT 0,
  contribution_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_match_stats (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  team_id TEXT NOT NULL,
  possession REAL DEFAULT 0,
  shots INTEGER DEFAULT 0,
  shots_on_target INTEGER DEFAULT 0,
  xg REAL DEFAULT 0,
  xa REAL DEFAULT 0,
  passes INTEGER DEFAULT 0,
  pass_accuracy REAL DEFAULT 0,
  ppda REAL,
  field_tilt REAL,
  box_entries INTEGER DEFAULT 0,
  high_turnovers INTEGER DEFAULT 0,
  set_piece_xg REAL DEFAULT 0,
  counterattack_xg REAL DEFAULT 0,
  collective_compactness REAL,
  defensive_actions_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tactical_signals (
  id TEXT PRIMARY KEY,
  match_id TEXT,
  team_id TEXT,
  player_id TEXT,
  signal_type TEXT NOT NULL,
  signal_value TEXT,
  confidence REAL DEFAULT 0.5,
  source_document_id TEXT,
  extracted_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS injury_reports (
  id TEXT PRIMARY KEY,
  player_id TEXT,
  team_id TEXT,
  status TEXT,
  injury_type TEXT,
  expected_return TEXT,
  severity TEXT,
  confidence REAL DEFAULT 0.5,
  source_document_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS source_documents (
  id TEXT PRIMARY KEY,
  source_id TEXT,
  source_url TEXT,
  title TEXT,
  author TEXT,
  published_at TEXT,
  retrieved_at TEXT,
  language TEXT,
  content_r2_key TEXT,
  summary TEXT,
  reliability_score REAL DEFAULT 0.5,
  vector_id TEXT,
  extracted_entities_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(source_id) REFERENCES source_registry(id)
);

CREATE TABLE IF NOT EXISTS model_runs (
  id TEXT PRIMARY KEY,
  model_name TEXT NOT NULL,
  model_version TEXT NOT NULL,
  match_id TEXT,
  run_type TEXT NOT NULL,
  input_hash TEXT,
  feature_snapshot_r2_key TEXT,
  output_r2_key TEXT,
  metrics_json TEXT,
  status TEXT DEFAULT 'created',
  error_message TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS probability_snapshots (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  minute INTEGER DEFAULT 0,
  second INTEGER DEFAULT 0,
  home_win_prob REAL NOT NULL,
  draw_prob REAL NOT NULL,
  away_win_prob REAL NOT NULL,
  expected_home_goals REAL NOT NULL,
  expected_away_goals REAL NOT NULL,
  most_likely_score TEXT,
  scoreline_json TEXT,
  interval_json TEXT,
  confidence REAL DEFAULT 0.5,
  model_version TEXT NOT NULL,
  input_hash TEXT NOT NULL,
  feature_snapshot_r2_key TEXT,
  explanation_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(match_id) REFERENCES matches(id)
);

CREATE TABLE IF NOT EXISTS analyst_scenarios (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  name TEXT,
  scenario_json TEXT NOT NULL,
  baseline_snapshot_id TEXT,
  simulated_probability_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
