-- Official result: Mexico 2-0 South Africa (FIFA WC 2026 opener, 11 Jun 2026)
-- Sources: FIFA match centre 400021443, FotMob/Opta stats, BBC/Al Jazeera report

INSERT OR IGNORE INTO source_registry (id, source_name, source_type, base_url, reliability_score, allowed_usage, health_status)
VALUES ('src-fifa', 'FIFA Match Centre', 'official', 'https://www.fifa.com', 0.98, 'match_data', 'healthy');

UPDATE matches SET
  status = 'completed',
  minute = 90,
  home_score = 2,
  away_score = 0,
  home_xg = 1.41,
  away_xg = 0.07,
  updated_at = '2026-06-11T22:00:00Z'
WHERE id = 'm-w26-ga-1v2';

DELETE FROM match_events WHERE match_id = 'm-w26-ga-1v2';
DELETE FROM team_match_stats WHERE match_id = 'm-w26-ga-1v2';
DELETE FROM player_match_stats WHERE match_id = 'm-w26-ga-1v2';
DELETE FROM lineup_players WHERE lineup_id IN ('lu-m-w26-ga-1v2-home', 'lu-m-w26-ga-1v2-away');
DELETE FROM lineups WHERE match_id = 'm-w26-ga-1v2';

-- Key players (Mexico)
INSERT OR IGNORE INTO players (id, name, nationality, primary_team_id, club, position, role_tags_json, age) VALUES
  ('p-mex-rangel', 'Rodolfo Rangel', 'MX', 'team-w26-a1', 'Guadalajara', 'GK', '[]', 23),
  ('p-mex-gallardo', 'Jesús Gallardo', 'MX', 'team-w26-a1', 'Monterrey', 'DF', '[]', 28),
  ('p-mex-montes', 'César Montes', 'MX', 'team-w26-a1', 'Monterrey', 'DF', '[]', 28),
  ('p-mex-alvarez', 'Edson Álvarez', 'MX', 'team-w26-a1', 'West Ham', 'MF', '[]', 28),
  ('p-mex-vasquez', 'Johan Vásquez', 'MX', 'team-w26-a1', 'Genoa', 'DF', '[]', 27),
  ('p-mex-lira', 'Érik Lira', 'MX', 'team-w26-a1', 'Club América', 'MF', '[]', 25),
  ('p-mex-fidalgo', 'Álex Fidalgo', 'MX', 'team-w26-a1', 'Toluca', 'MF', '[]', 26),
  ('p-mex-vega', 'Alexis Vega', 'MX', 'team-w26-a1', 'Toluca', 'FW', '[]', 28),
  ('p-mex-jimenez', 'Raúl Jiménez', 'MX', 'team-w26-a1', 'Fulham', 'FW', '[]', 35),
  ('p-mex-reyes', 'Israel Reyes', 'MX', 'team-w26-a1', 'Club América', 'FW', '[]', 25),
  ('p-mex-quinones', 'Julián Quiñones', 'MX', 'team-w26-a1', 'América', 'FW', '[]', 29),
  ('p-mex-gutierrez', 'Brian Gutiérrez', 'MX', 'team-w26-a1', 'Chicago Fire', 'MF', '[]', 22),
  ('p-mex-alvarado', 'Roberto Alvarado', 'MX', 'team-w26-a1', 'Guadalajara', 'MF', '[]', 27),
  ('p-mex-mora', 'Gilberto Mora', 'MX', 'team-w26-a1', 'Tijuana', 'MF', '[]', 17),
  ('p-mex-chavez', 'Luis Chávez', 'MX', 'team-w26-a1', 'LAFC', 'MF', '[]', 29);

-- Key players (South Africa)
INSERT OR IGNORE INTO players (id, name, nationality, primary_team_id, club, position, role_tags_json, age) VALUES
  ('p-rsa-williams', 'Ronwen Williams', 'ZA', 'team-w26-a2', 'Mamelodi Sundowns', 'GK', '[]', 34),
  ('p-rsa-mudau', 'Khuliso Mudau', 'ZA', 'team-w26-a2', 'Mamelodi Sundowns', 'DF', '[]', 28),
  ('p-rsa-sibisi', 'Nkosinathi Sibisi', 'ZA', 'team-w26-a2', 'Orlando Pirates', 'DF', '[]', 29),
  ('p-rsa-okonkwa', 'Keanu Okonkwa', 'ZA', 'team-w26-a2', 'Orlando Pirates', 'DF', '[]', 24),
  ('p-rsa-mbokazi', 'Sphelele Mbokazi', 'ZA', 'team-w26-a2', 'AmaZulu', 'DF', '[]', 26),
  ('p-rsa-modiba', 'Terrence Masia', 'ZA', 'team-w26-a2', 'Orlando Pirates', 'DF', '[]', 27),
  ('p-rsa-sithole', 'Sphephelo Sithole', 'ZA', 'team-w26-a2', 'Orlando Pirates', 'MF', '[]', 26),
  ('p-rsa-mokoena', 'Teboho Mokoena', 'ZA', 'team-w26-a2', 'Rangers', 'MF', '[]', 28),
  ('p-rsa-adams', 'Jayden Adams', 'ZA', 'team-w26-a2', 'Anderlecht', 'MF', '[]', 24),
  ('p-rsa-foster', 'Lyle Foster', 'ZA', 'team-w26-a2', 'Burnley', 'FW', '[]', 25),
  ('p-rsa-rayners', 'Iqraam Rayners', 'ZA', 'team-w26-a2', 'Mamelodi Sundowns', 'FW', '[]', 31),
  ('p-rsa-zwane', 'Themba Zwane', 'ZA', 'team-w26-a2', 'Mamelodi Sundowns', 'MF', '[]', 36);

INSERT INTO lineups (id, match_id, team_id, source_id, source_type, formation, is_official, confidence, published_at) VALUES
  ('lu-m-w26-ga-1v2-home', 'm-w26-ga-1v2', 'team-w26-a1', 'src-fifa', 'match_official', '4-3-3', 1, 0.99, '2026-06-11T18:55:00Z'),
  ('lu-m-w26-ga-1v2-away', 'm-w26-ga-1v2', 'team-w26-a2', 'src-fifa', 'match_official', '5-3-2', 1, 0.99, '2026-06-11T18:55:00Z');

INSERT INTO lineup_players (lineup_id, player_id, is_starter, role, position_slot, shirt_number) VALUES
  ('lu-m-w26-ga-1v2-home', 'p-mex-rangel', 1, 'GK', 'GK', 1),
  ('lu-m-w26-ga-1v2-home', 'p-mex-gallardo', 1, 'LB', 'LB', 23),
  ('lu-m-w26-ga-1v2-home', 'p-mex-montes', 1, 'CB', 'CB', 3),
  ('lu-m-w26-ga-1v2-home', 'p-mex-vasquez', 1, 'CB', 'CB', 5),
  ('lu-m-w26-ga-1v2-home', 'p-mex-alvarez', 1, 'RB', 'RB', 4),
  ('lu-m-w26-ga-1v2-home', 'p-mex-lira', 1, 'DM', 'DM', 6),
  ('lu-m-w26-ga-1v2-home', 'p-mex-fidalgo', 1, 'CM', 'CM', 8),
  ('lu-m-w26-ga-1v2-home', 'p-mex-vega', 1, 'AM', 'AM', 10),
  ('lu-m-w26-ga-1v2-home', 'p-mex-quinones', 1, 'LW', 'LW', 16),
  ('lu-m-w26-ga-1v2-home', 'p-mex-jimenez', 1, 'ST', 'ST', 9),
  ('lu-m-w26-ga-1v2-home', 'p-mex-reyes', 1, 'RW', 'RW', 15),
  ('lu-m-w26-ga-1v2-home', 'p-mex-gutierrez', 0, 'CM', 'SUB', 26),
  ('lu-m-w26-ga-1v2-home', 'p-mex-alvarado', 0, 'RW', 'SUB', 25),
  ('lu-m-w26-ga-1v2-home', 'p-mex-mora', 0, 'CM', 'SUB', 19),
  ('lu-m-w26-ga-1v2-home', 'p-mex-chavez', 0, 'CM', 'SUB', 24);

INSERT INTO lineup_players (lineup_id, player_id, is_starter, role, position_slot, shirt_number) VALUES
  ('lu-m-w26-ga-1v2-away', 'p-rsa-williams', 1, 'GK', 'GK', 1),
  ('lu-m-w26-ga-1v2-away', 'p-rsa-mudau', 1, 'RB', 'RB', 20),
  ('lu-m-w26-ga-1v2-away', 'p-rsa-sibisi', 1, 'CB', 'CB', 19),
  ('lu-m-w26-ga-1v2-away', 'p-rsa-okonkwa', 1, 'CB', 'CB', 21),
  ('lu-m-w26-ga-1v2-away', 'p-rsa-mbokazi', 1, 'LB', 'LB', 14),
  ('lu-m-w26-ga-1v2-away', 'p-rsa-modiba', 1, 'LWB', 'LWB', 6),
  ('lu-m-w26-ga-1v2-away', 'p-rsa-sithole', 1, 'CM', 'CM', 13),
  ('lu-m-w26-ga-1v2-away', 'p-rsa-mokoena', 1, 'CM', 'CM', 4),
  ('lu-m-w26-ga-1v2-away', 'p-rsa-adams', 1, 'CM', 'CM', 23),
  ('lu-m-w26-ga-1v2-away', 'p-rsa-foster', 1, 'ST', 'ST', 9),
  ('lu-m-w26-ga-1v2-away', 'p-rsa-rayners', 1, 'ST', 'ST', 15),
  ('lu-m-w26-ga-1v2-away', 'p-rsa-zwane', 0, 'AM', 'SUB', 10);

INSERT INTO match_events (id, match_id, team_id, player_id, event_type, minute, period, outcome, xg, source_id) VALUES
  ('ev-mexsa-g1', 'm-w26-ga-1v2', 'team-w26-a1', 'p-mex-quinones', 'goal', 9, '1H', 'scored', 0.32, 'src-fifa'),
  ('ev-mexsa-g2', 'm-w26-ga-1v2', 'team-w26-a1', 'p-mex-jimenez', 'goal', 67, '2H', 'scored', 0.41, 'src-fifa'),
  ('ev-mexsa-rc1', 'm-w26-ga-1v2', 'team-w26-a2', 'p-rsa-sithole', 'red_card', 49, '2H', 'denying_goal', NULL, 'src-fifa'),
  ('ev-mexsa-yc1', 'm-w26-ga-1v2', 'team-w26-a2', 'p-rsa-sibisi', 'yellow_card', 74, '2H', NULL, NULL, 'src-fifa'),
  ('ev-mexsa-rc2', 'm-w26-ga-1v2', 'team-w26-a2', 'p-rsa-zwane', 'red_card', 84, '2H', 'violent_conduct', NULL, 'src-fifa'),
  ('ev-mexsa-rc3', 'm-w26-ga-1v2', 'team-w26-a1', 'p-mex-montes', 'red_card', 92, '2H', 'denying_goal', NULL, 'src-fifa');

INSERT INTO team_match_stats (id, match_id, team_id, possession, shots, shots_on_target, xg, passes, pass_accuracy) VALUES
  ('tms-mexsa-mex', 'm-w26-ga-1v2', 'team-w26-a1', 60, 16, 4, 1.41, 520, 90),
  ('tms-mexsa-rsa', 'm-w26-ga-1v2', 'team-w26-a2', 40, 3, 2, 0.07, 334, 81);

INSERT INTO player_match_stats (id, match_id, player_id, team_id, minutes_played, goals, assists, shots, shots_on_target, xg, passes, pass_accuracy, yellow_cards, red_cards) VALUES
  ('pms-mex-jimenez', 'm-w26-ga-1v2', 'p-mex-jimenez', 'team-w26-a1', 90, 1, 0, 3, 2, 0.55, 28, 82, 0, 0),
  ('pms-mex-quinones', 'm-w26-ga-1v2', 'p-mex-quinones', 'team-w26-a1', 88, 1, 0, 4, 2, 0.48, 31, 84, 0, 0),
  ('pms-mex-alvarado', 'm-w26-ga-1v2', 'p-mex-alvarado', 'team-w26-a1', 35, 0, 1, 1, 1, 0.12, 22, 86, 0, 0),
  ('pms-mex-gutierrez', 'm-w26-ga-1v2', 'p-mex-gutierrez', 'team-w26-a1', 72, 0, 0, 2, 1, 0.08, 45, 88, 0, 0),
  ('pms-mex-lira', 'm-w26-ga-1v2', 'p-mex-lira', 'team-w26-a1', 90, 0, 0, 1, 0, 0.04, 52, 91, 0, 0),
  ('pms-mex-montes', 'm-w26-ga-1v2', 'p-mex-montes', 'team-w26-a1', 92, 0, 0, 0, 0, 0, 41, 89, 0, 1),
  ('pms-rsa-williams', 'm-w26-ga-1v2', 'p-rsa-williams', 'team-w26-a2', 90, 0, 0, 0, 0, 0, 18, 78, 0, 0),
  ('pms-rsa-sithole', 'm-w26-ga-1v2', 'p-rsa-sithole', 'team-w26-a2', 49, 0, 0, 0, 0, 0, 22, 80, 0, 1),
  ('pms-rsa-zwane', 'm-w26-ga-1v2', 'p-rsa-zwane', 'team-w26-a2', 20, 0, 0, 0, 0, 0, 12, 75, 0, 1),
  ('pms-rsa-sibisi', 'm-w26-ga-1v2', 'p-rsa-sibisi', 'team-w26-a2', 90, 0, 0, 0, 0, 0, 38, 85, 1, 0);

CREATE TABLE IF NOT EXISTS match_recaps (
  match_id TEXT PRIMARY KEY,
  summary_vi TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  source_id TEXT,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(match_id) REFERENCES matches(id),
  FOREIGN KEY(source_id) REFERENCES source_registry(id)
);

CREATE TABLE IF NOT EXISTS match_commentary (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  minute INTEGER,
  period TEXT,
  sort_order INTEGER NOT NULL,
  text_vi TEXT NOT NULL,
  text_en TEXT NOT NULL,
  event_type TEXT,
  source_id TEXT,
  FOREIGN KEY(match_id) REFERENCES matches(id)
);

CREATE INDEX IF NOT EXISTS idx_match_commentary_match ON match_commentary(match_id, sort_order);

INSERT OR REPLACE INTO match_recaps (match_id, summary_vi, summary_en, source_id, updated_at) VALUES (
  'm-w26-ga-1v2',
  'Mexico thắng 2-0 trước Nam Phi tại Estadio Azteca — trận khai mạc World Cup 2026. Julián Quiñones mở tỷ số phút 9 sau sai lầm của Sphephelo Sithole; Raúl Jiménez ghi bàn đầu tiên ở World Cup bằng đánh đầu phút 67 từ quả bóng bổng của Roberto Alvarado. Trận đấu có 3 thẻ đỏ (Sithole, Themba Zwane — Nam Phi; César Montes — Mexico). Thống kê Opta/FIFA: kiểm soát bóng 60–40, sút 16–3, xG 1.41–0.07.',
  'Mexico beat South Africa 2-0 at Estadio Azteca in the World Cup 2026 opener. Julián Quiñones scored in the 9th minute after Sphephelo Sithole lost possession; Raúl Jiménez headed Mexico''s second in the 67th minute from Roberto Alvarado''s cross. Three red cards (Sithole, Themba Zwane for South Africa; César Montes for Mexico). Opta/FIFA stats: 60–40 possession, 16–3 shots, 1.41–0.07 xG.',
  'src-fifa',
  '2026-06-11T22:00:00Z'
);

INSERT OR REPLACE INTO match_commentary (id, match_id, minute, period, sort_order, text_vi, text_en, event_type, source_id) VALUES
  ('mc-mexsa-1', 'm-w26-ga-1v2', 0, '1H', 1, 'Khai cuộc World Cup 2026 tại Mexico City — Mexico (chủ nhà) đối đầu Nam Phi.', 'Kick-off in Mexico City — co-host Mexico face South Africa to open World Cup 2026.', 'kickoff', 'src-fifa'),
  ('mc-mexsa-2', 'm-w26-ga-1v2', 9, '1H', 2, '⚽ BÀN THẮNG! Julián Quiñones — Érik Lira cướp bóng từ Sithole, Quiñones dứt điểm xuyên thủng thành Ronwen Williams. Mexico 1-0.', '⚽ GOAL! Julián Quiñones — Érik Lira wins the ball from Sithole; Quiñones fires through Williams'' legs. Mexico 1-0.', 'goal', 'src-fifa'),
  ('mc-mexsa-3', 'm-w26-ga-1v2', 43, '1H', 3, 'Quiñones đánh đầu trúng cột dọc — Mexico suýt có bàn thứ hai trước giờ nghỉ.', 'Quiñones hits the post — Mexico nearly double their lead before half-time.', 'chance', 'src-fifa'),
  ('mc-mexsa-4', 'm-w26-ga-1v2', 45, '1H', 4, 'Hết hiệp một: Mexico 1-0 Nam Phi. Chủ nhà kiểm soát trận đấu (57% kiểm soát bóng).', 'Half-time: Mexico 1-0 South Africa. Hosts dominate (57% possession).', 'half_time', 'src-fifa'),
  ('mc-mexsa-5', 'm-w26-ga-1v2', 49, '2H', 5, '🟥 Thẻ đỏ! Sphephelo Sithole (Nam Phi) — phạm lỗi từ phía sau cản phá Brian Gutiérrez trong tình huống nguy hiểm.', '🟥 Red card! Sphephelo Sithole (South Africa) — denies a clear goalscoring opportunity on Brian Gutiérrez.', 'red_card', 'src-fifa'),
  ('mc-mexsa-6', 'm-w26-ga-1v2', 67, '2H', 6, '⚽ BÀN THẮNG! Raúl Jiménez đánh đầu cận thành từ quả bóng bổng của Roberto Alvarado. Mexico 2-0.', '⚽ GOAL! Raúl Jiménez powers a header from Roberto Alvarado''s cross. Mexico 2-0.', 'goal', 'src-fifa'),
  ('mc-mexsa-7', 'm-w26-ga-1v2', 74, '2H', 7, '🟨 Nkosinathi Sibisi (Nam Phi) nhận thẻ vàng.', '🟨 Nkosinathi Sibisi (South Africa) booked.', 'yellow_card', 'src-fifa'),
  ('mc-mexsa-8', 'm-w26-ga-1v2', 84, '2H', 8, '🟥 Thẻ đỏ! Themba Zwane (Nam Phi) — VAR xác nhận hành vi bạo lực, đánh vào mặt Roberto Alvarado.', '🟥 Red card! Themba Zwane (South Africa) — VAR confirms violent conduct against Roberto Alvarado.', 'red_card', 'src-fifa'),
  ('mc-mexsa-9', 'm-w26-ga-1v2', 92, '2H', 9, '🟥 César Montes (Mexico) bị đuổi vì phạm lỗi chặn cơ hội ghi bàn với Khuliso Mudau.', '🟥 César Montes (Mexico) sent off for denying a goalscoring opportunity on Khuliso Mudau.', 'red_card', 'src-fifa'),
  ('mc-mexsa-10', 'm-w26-ga-1v2', 90, '2H', 10, 'Kết thúc: Mexico 2-0 Nam Phi. Trận khai mạc có nhiều thẻ đỏ hơn bàn thắng — Mexico mở màn thành công trên sân nhà.', 'Full-time: Mexico 2-0 South Africa. An opener with more red cards than goals — hosts start with a win.', 'full_time', 'src-fifa');
