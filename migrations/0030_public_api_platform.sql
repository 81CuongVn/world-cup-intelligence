-- Public API platform: partner keys, webhook subscriptions, event feed

CREATE TABLE IF NOT EXISTS api_clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  api_key_hash TEXT NOT NULL UNIQUE,
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS api_webhook_subscriptions (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  events_json TEXT NOT NULL DEFAULT '["*"]',
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES api_clients(id)
);

CREATE INDEX IF NOT EXISTS idx_api_webhooks_client ON api_webhook_subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_api_webhooks_enabled ON api_webhook_subscriptions(enabled);

CREATE TABLE IF NOT EXISTS api_feed_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  match_id TEXT,
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_api_feed_events_id ON api_feed_events(id);
CREATE INDEX IF NOT EXISTS idx_api_feed_events_created ON api_feed_events(created_at);
CREATE INDEX IF NOT EXISTS idx_api_feed_events_match ON api_feed_events(match_id, id);
