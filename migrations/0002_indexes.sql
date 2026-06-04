CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_teams ON matches(home_team_id, away_team_id);
CREATE INDEX IF NOT EXISTS idx_events_match_minute ON match_events(match_id, minute, second);
CREATE INDEX IF NOT EXISTS idx_probability_match_time ON probability_snapshots(match_id, minute, second);
CREATE INDEX IF NOT EXISTS idx_source_documents_source ON source_documents(source_id, published_at);
CREATE INDEX IF NOT EXISTS idx_tactical_signals_match ON tactical_signals(match_id, signal_type);
CREATE INDEX IF NOT EXISTS idx_injury_player ON injury_reports(player_id, status);
