-- News → match impact tracking for prediction refresh

ALTER TABLE source_documents ADD COLUMN affected_match_ids_json TEXT;
ALTER TABLE source_documents ADD COLUMN impact_level TEXT;
ALTER TABLE source_documents ADD COLUMN impact_summary_vi TEXT;

INSERT OR IGNORE INTO source_registry (id, source_name, source_type, base_url, reliability_score, allowed_usage, health_status)
VALUES
  ('src-rss-fifa-wc2026', 'FIFA World Cup 2026', 'fifa', 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/news', 0.92, 'news', 'healthy'),
  ('src-rss-espn-soccer', 'ESPN FC', 'rss', 'https://www.espn.com/soccer/', 0.8, 'news', 'healthy'),
  ('src-rss-goal-com', 'GOAL.com', 'rss', 'https://www.goal.com/', 0.78, 'news', 'healthy'),
  ('src-rss-fourfourtwo', 'FourFourTwo', 'rss', 'https://www.fourfourtwo.com/', 0.77, 'news', 'healthy'),
  ('src-rss-concacaf', 'CONCACAF', 'rss', 'https://www.concacaf.com/', 0.82, 'news', 'healthy');
