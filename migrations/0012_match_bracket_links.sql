-- Knockout bracket links: winners/losers advance; group qualifiers fill Round of 32 slots.

CREATE TABLE IF NOT EXISTS match_bracket_links (
  id TEXT PRIMARY KEY,
  tournament_id TEXT NOT NULL,
  source_match_id TEXT,
  target_match_id TEXT NOT NULL,
  target_slot TEXT NOT NULL CHECK (target_slot IN ('home', 'away')),
  rule_type TEXT NOT NULL CHECK (rule_type IN ('winner', 'loser', 'group_rank')),
  rule_json TEXT,
  FOREIGN KEY (target_match_id) REFERENCES matches(id)
);

CREATE INDEX IF NOT EXISTS idx_bracket_links_source ON match_bracket_links(source_match_id);
CREATE INDEX IF NOT EXISTS idx_bracket_links_target ON match_bracket_links(target_match_id);

-- Group stage → Round of 32 (top 2 per group, simplified pairing)
INSERT INTO match_bracket_links (id, tournament_id, source_match_id, target_match_id, target_slot, rule_type, rule_json) VALUES
  ('bl-gr-a1-h', 't-2026', NULL, 'm-w26-r32-01', 'home', 'group_rank', '{"group":"A","rank":1}'),
  ('bl-gr-b2-a', 't-2026', NULL, 'm-w26-r32-01', 'away', 'group_rank', '{"group":"B","rank":2}'),
  ('bl-gr-c1-h', 't-2026', NULL, 'm-w26-r32-02', 'home', 'group_rank', '{"group":"C","rank":1}'),
  ('bl-gr-d2-a', 't-2026', NULL, 'm-w26-r32-02', 'away', 'group_rank', '{"group":"D","rank":2}'),
  ('bl-gr-e1-h', 't-2026', NULL, 'm-w26-r32-03', 'home', 'group_rank', '{"group":"E","rank":1}'),
  ('bl-gr-f2-a', 't-2026', NULL, 'm-w26-r32-03', 'away', 'group_rank', '{"group":"F","rank":2}'),
  ('bl-gr-g1-h', 't-2026', NULL, 'm-w26-r32-04', 'home', 'group_rank', '{"group":"G","rank":1}'),
  ('bl-gr-h2-a', 't-2026', NULL, 'm-w26-r32-04', 'away', 'group_rank', '{"group":"H","rank":2}'),
  ('bl-gr-i1-h', 't-2026', NULL, 'm-w26-r32-05', 'home', 'group_rank', '{"group":"I","rank":1}'),
  ('bl-gr-j2-a', 't-2026', NULL, 'm-w26-r32-05', 'away', 'group_rank', '{"group":"J","rank":2}'),
  ('bl-gr-k1-h', 't-2026', NULL, 'm-w26-r32-06', 'home', 'group_rank', '{"group":"K","rank":1}'),
  ('bl-gr-l2-a', 't-2026', NULL, 'm-w26-r32-06', 'away', 'group_rank', '{"group":"L","rank":2}'),
  ('bl-gr-b1-h', 't-2026', NULL, 'm-w26-r32-07', 'home', 'group_rank', '{"group":"B","rank":1}'),
  ('bl-gr-a2-a', 't-2026', NULL, 'm-w26-r32-07', 'away', 'group_rank', '{"group":"A","rank":2}'),
  ('bl-gr-d1-h', 't-2026', NULL, 'm-w26-r32-08', 'home', 'group_rank', '{"group":"D","rank":1}'),
  ('bl-gr-c2-a', 't-2026', NULL, 'm-w26-r32-08', 'away', 'group_rank', '{"group":"C","rank":2}'),
  ('bl-gr-f1-h', 't-2026', NULL, 'm-w26-r32-09', 'home', 'group_rank', '{"group":"F","rank":1}'),
  ('bl-gr-e2-a', 't-2026', NULL, 'm-w26-r32-09', 'away', 'group_rank', '{"group":"E","rank":2}'),
  ('bl-gr-h1-h', 't-2026', NULL, 'm-w26-r32-10', 'home', 'group_rank', '{"group":"H","rank":1}'),
  ('bl-gr-g2-a', 't-2026', NULL, 'm-w26-r32-10', 'away', 'group_rank', '{"group":"G","rank":2}'),
  ('bl-gr-j1-h', 't-2026', NULL, 'm-w26-r32-11', 'home', 'group_rank', '{"group":"J","rank":1}'),
  ('bl-gr-i2-a', 't-2026', NULL, 'm-w26-r32-11', 'away', 'group_rank', '{"group":"I","rank":2}'),
  ('bl-gr-l1-h', 't-2026', NULL, 'm-w26-r32-12', 'home', 'group_rank', '{"group":"L","rank":1}'),
  ('bl-gr-k2-a', 't-2026', NULL, 'm-w26-r32-12', 'away', 'group_rank', '{"group":"K","rank":2}');

-- Round of 32 winners → Round of 16
INSERT INTO match_bracket_links (id, tournament_id, source_match_id, target_match_id, target_slot, rule_type, rule_json) VALUES
  ('bl-r32-01-w', 't-2026', 'm-w26-r32-01', 'm-w26-r16-01', 'home', 'winner', NULL),
  ('bl-r32-02-w', 't-2026', 'm-w26-r32-02', 'm-w26-r16-01', 'away', 'winner', NULL),
  ('bl-r32-03-w', 't-2026', 'm-w26-r32-03', 'm-w26-r16-02', 'home', 'winner', NULL),
  ('bl-r32-04-w', 't-2026', 'm-w26-r32-04', 'm-w26-r16-02', 'away', 'winner', NULL),
  ('bl-r32-05-w', 't-2026', 'm-w26-r32-05', 'm-w26-r16-03', 'home', 'winner', NULL),
  ('bl-r32-06-w', 't-2026', 'm-w26-r32-06', 'm-w26-r16-03', 'away', 'winner', NULL),
  ('bl-r32-07-w', 't-2026', 'm-w26-r32-07', 'm-w26-r16-04', 'home', 'winner', NULL),
  ('bl-r32-08-w', 't-2026', 'm-w26-r32-08', 'm-w26-r16-04', 'away', 'winner', NULL),
  ('bl-r32-09-w', 't-2026', 'm-w26-r32-09', 'm-w26-r16-05', 'home', 'winner', NULL),
  ('bl-r32-10-w', 't-2026', 'm-w26-r32-10', 'm-w26-r16-05', 'away', 'winner', NULL),
  ('bl-r32-11-w', 't-2026', 'm-w26-r32-11', 'm-w26-r16-06', 'home', 'winner', NULL),
  ('bl-r32-12-w', 't-2026', 'm-w26-r32-12', 'm-w26-r16-06', 'away', 'winner', NULL),
  ('bl-r32-13-w', 't-2026', 'm-w26-r32-13', 'm-w26-r16-07', 'home', 'winner', NULL),
  ('bl-r32-14-w', 't-2026', 'm-w26-r32-14', 'm-w26-r16-07', 'away', 'winner', NULL),
  ('bl-r32-15-w', 't-2026', 'm-w26-r32-15', 'm-w26-r16-08', 'home', 'winner', NULL),
  ('bl-r32-16-w', 't-2026', 'm-w26-r32-16', 'm-w26-r16-08', 'away', 'winner', NULL);

-- Round of 16 → Quarter-finals
INSERT INTO match_bracket_links (id, tournament_id, source_match_id, target_match_id, target_slot, rule_type, rule_json) VALUES
  ('bl-r16-01-w', 't-2026', 'm-w26-r16-01', 'm-w26-qf-01', 'home', 'winner', NULL),
  ('bl-r16-02-w', 't-2026', 'm-w26-r16-02', 'm-w26-qf-01', 'away', 'winner', NULL),
  ('bl-r16-03-w', 't-2026', 'm-w26-r16-03', 'm-w26-qf-02', 'home', 'winner', NULL),
  ('bl-r16-04-w', 't-2026', 'm-w26-r16-04', 'm-w26-qf-02', 'away', 'winner', NULL),
  ('bl-r16-05-w', 't-2026', 'm-w26-r16-05', 'm-w26-qf-03', 'home', 'winner', NULL),
  ('bl-r16-06-w', 't-2026', 'm-w26-r16-06', 'm-w26-qf-03', 'away', 'winner', NULL),
  ('bl-r16-07-w', 't-2026', 'm-w26-r16-07', 'm-w26-qf-04', 'home', 'winner', NULL),
  ('bl-r16-08-w', 't-2026', 'm-w26-r16-08', 'm-w26-qf-04', 'away', 'winner', NULL);

-- Quarter-finals → Semi-finals
INSERT INTO match_bracket_links (id, tournament_id, source_match_id, target_match_id, target_slot, rule_type, rule_json) VALUES
  ('bl-qf-01-w', 't-2026', 'm-w26-qf-01', 'm-w26-sf-01', 'home', 'winner', NULL),
  ('bl-qf-02-w', 't-2026', 'm-w26-qf-02', 'm-w26-sf-01', 'away', 'winner', NULL),
  ('bl-qf-03-w', 't-2026', 'm-w26-qf-03', 'm-w26-sf-02', 'home', 'winner', NULL),
  ('bl-qf-04-w', 't-2026', 'm-w26-qf-04', 'm-w26-sf-02', 'away', 'winner', NULL);

-- Semi-finals → Final + Third place (losers)
INSERT INTO match_bracket_links (id, tournament_id, source_match_id, target_match_id, target_slot, rule_type, rule_json) VALUES
  ('bl-sf-01-w', 't-2026', 'm-w26-sf-01', 'm-w26-final-01', 'home', 'winner', NULL),
  ('bl-sf-02-w', 't-2026', 'm-w26-sf-02', 'm-w26-final-01', 'away', 'winner', NULL),
  ('bl-sf-01-l', 't-2026', 'm-w26-sf-01', 'm-w26-3rd-01', 'home', 'loser', NULL),
  ('bl-sf-02-l', 't-2026', 'm-w26-sf-02', 'm-w26-3rd-01', 'away', 'loser', NULL);
