-- Coaches, tournament assignments, and match officials (FIFA Match Centre)

CREATE TABLE IF NOT EXISTS coaches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nationality TEXT,
  birth_year INTEGER,
  wc_appearances INTEGER DEFAULT 0,
  tenure_years REAL DEFAULT 0,
  tactical_rating REAL DEFAULT 0.72,
  discipline_index REAL DEFAULT 0.5,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_coaches (
  team_id TEXT NOT NULL,
  tournament_id TEXT NOT NULL,
  coach_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'head',
  appointed_at TEXT,
  PRIMARY KEY (team_id, tournament_id, role),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
  FOREIGN KEY (coach_id) REFERENCES coaches(id)
);

CREATE TABLE IF NOT EXISTS match_officials (
  match_id TEXT NOT NULL,
  role TEXT NOT NULL,
  name TEXT NOT NULL,
  nationality TEXT,
  fifa_category TEXT,
  strictness REAL DEFAULT 0.5,
  avg_yellow_cards REAL,
  avg_red_cards REAL,
  PRIMARY KEY (match_id, role),
  FOREIGN KEY (match_id) REFERENCES matches(id)
);

-- Mexico vs South Africa opener (FIFA MC 400021443, BBC Sport)
INSERT OR REPLACE INTO coaches (id, name, nationality, birth_year, wc_appearances, tenure_years, tactical_rating, discipline_index)
VALUES
  ('coach-mex-aguirre', 'Javier Aguirre', 'MX', 1958, 3, 2.0, 0.86, 0.62),
  ('coach-rsa-broos', 'Hugo Broos', 'BE', 1952, 1, 5.5, 0.76, 0.68);

INSERT OR REPLACE INTO team_coaches (team_id, tournament_id, coach_id, role, appointed_at)
VALUES
  ('team-w26-a1', 't-2026', 'coach-mex-aguirre', 'head', '2024-07-01'),
  ('team-w26-a2', 't-2026', 'coach-rsa-broos', 'head', '2021-08-01');

INSERT OR REPLACE INTO match_officials (match_id, role, name, nationality, fifa_category, strictness, avg_yellow_cards, avg_red_cards)
VALUES
  ('m-w26-ga-1v2', 'referee', 'Wilton Sampaio', 'BR', 'FIFA Elite', 0.82, 4.6, 0.18),
  ('m-w26-ga-1v2', 'assistant_1', 'Bruno Pires', 'BR', 'FIFA', NULL, NULL, NULL),
  ('m-w26-ga-1v2', 'assistant_2', 'Bruno Boglioli', 'BR', 'FIFA', NULL, NULL, NULL),
  ('m-w26-ga-1v2', 'fourth_official', 'Guillermo Maradona', 'AR', 'FIFA', NULL, NULL, NULL);

DELETE FROM probability_snapshots WHERE match_id IN (
  SELECT id FROM matches WHERE tournament_id = 't-2026'
);
