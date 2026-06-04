-- Register RSS publishers and re-link crawled news away from mock source

INSERT OR IGNORE INTO source_registry (id, source_name, source_type, base_url, reliability_score, allowed_usage, health_status)
VALUES
  ('src-rss-guardian-wc', 'The Guardian', 'rss', 'https://www.theguardian.com/football/world-cup', 0.82, 'news', 'healthy'),
  ('src-rss-bbc-football', 'BBC', 'rss', 'https://www.bbc.co.uk/sport/football', 0.85, 'news', 'healthy'),
  ('src-rss-fifa-news', 'FIFA', 'rss', 'https://www.fifa.com/news', 0.9, 'news', 'healthy');

UPDATE source_documents SET source_id = 'src-rss-guardian-wc', reliability_score = 0.82
WHERE content_r2_key LIKE 'news/rss-guardian-wc/%' OR source_url LIKE '%theguardian.%';

UPDATE source_documents SET source_id = 'src-rss-bbc-football', reliability_score = 0.85
WHERE content_r2_key LIKE 'news/rss-bbc-football/%' OR source_url LIKE '%bbc.%' OR source_url LIKE '%bbci.%';

UPDATE source_documents SET source_id = 'src-rss-fifa-news', reliability_score = 0.9
WHERE content_r2_key LIKE 'news/rss-fifa-news/%' OR source_url LIKE '%fifa.%';
