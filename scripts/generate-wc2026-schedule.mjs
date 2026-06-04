/**
 * Generates migrations/0006_wc2026_104_matches.sql
 * FIFA World Cup 2026: 48 teams, 12×6 group + 32 knockout = 104 matches
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GROUPS = 'ABCDEFGHIJKL'.split('');
const VENUE = 'v-metlife';
const TOURNAMENT = 't-2026';
const START = new Date('2026-06-11T17:00:00Z').getTime();
const MS_DAY = 86400000;

const REAL_TEAMS = {
  A1: 'team-usa',
  A2: 'team-mex',
  A3: 'team-arg',
  A4: 'team-bra',
  B1: 'team-fra',
  B2: 'team-eng',
};

function slotId(group, slot) {
  const key = `${group}${slot}`;
  return REAL_TEAMS[key] ?? `team-w26-${group.toLowerCase()}${slot}`;
}

function teamInserts() {
  const lines = [];
  const realMeta = {
    'team-usa': ['United States', 'USA', 'US', 'CONCACAF', 12, 1780, 0.78],
    'team-mex': ['Mexico', 'MEX', 'MX', 'CONCACAF', 15, 1760, 0.76],
    'team-arg': ['Argentina', 'ARG', 'AR', 'CONMEBOL', 1, 1985, 0.92],
    'team-fra': ['France', 'FRA', 'FR', 'UEFA', 2, 1960, 0.91],
    'team-eng': ['England', 'ENG', 'GB', 'UEFA', 4, 1890, 0.88],
    'team-bra': ['Brazil', 'BRA', 'BR', 'CONMEBOL', 3, 1940, 0.9],
  };
  for (const g of GROUPS) {
    for (let s = 1; s <= 4; s++) {
      const id = slotId(g, s);
      if (realMeta[id]) {
        continue;
      }
      const name = `Bảng ${g} · Đội ${s}`;
      const short = `${g}${s}`;
      lines.push(
        `  ('${id}', '${name}', '${short}', 'XX', 'TBD', 99, 1500, 0.5)`,
      );
    }
  }
  return lines;
}

function groupPairings() {
  return [
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 3],
    [2, 4],
    [3, 4],
  ];
}

function kickoffAt(matchIndex) {
  const dayOffset = Math.floor(matchIndex / 4);
  const slotHour = [14, 17, 20, 23][matchIndex % 4];
  const d = new Date(START + dayOffset * MS_DAY);
  d.setUTCHours(slotHour, 0, 0, 0);
  return d.toISOString().replace('.000Z', 'Z');
}

const matchRows = [];
let idx = 0;

for (const g of GROUPS) {
  for (const [h, a] of groupPairings()) {
    const home = slotId(g, h);
    const away = slotId(g, a);
    const id = `m-w26-g${g.toLowerCase()}-${h}v${a}`;
    matchRows.push(
      `  ('${id}', '${TOURNAMENT}', 'Group', '${g}', '${home}', '${away}', '${VENUE}', '${kickoffAt(idx++)}', 'scheduled')`,
    );
  }
}

const KO_STAGES = [
  { stage: 'Round of 32', count: 16, prefix: 'r32' },
  { stage: 'Round of 16', count: 8, prefix: 'r16' },
  { stage: 'Quarter-final', count: 4, prefix: 'qf' },
  { stage: 'Semi-final', count: 2, prefix: 'sf' },
  { stage: 'Third place', count: 1, prefix: '3rd' },
  { stage: 'Final', count: 1, prefix: 'final' },
];

for (const { stage, count, prefix } of KO_STAGES) {
  for (let n = 1; n <= count; n++) {
    const home = `team-w26-ko-${prefix}-h${n}`;
    const away = `team-w26-ko-${prefix}-a${n}`;
    const id = `m-w26-${prefix}-${String(n).padStart(2, '0')}`;
    matchRows.push(
      `  ('${id}', '${TOURNAMENT}', '${stage}', NULL, '${home}', '${away}', '${VENUE}', '${kickoffAt(idx++)}', 'scheduled')`,
    );
  }
}

const koTeams = [];
for (const { stage, count, prefix } of KO_STAGES) {
  for (let n = 1; n <= count; n++) {
    koTeams.push(
      `  ('team-w26-ko-${prefix}-h${n}', 'TBD ${stage} ${n} (H)', 'TBD${n}H', 'XX', 'TBD', 99, 1500, 0.5)`,
    );
    koTeams.push(
      `  ('team-w26-ko-${prefix}-a${n}', 'TBD ${stage} ${n} (A)', 'TBD${n}A', 'XX', 'TBD', 99, 1500, 0.5)`,
    );
  }
}

if (matchRows.length !== 104) {
  throw new Error(`Expected 104 matches, got ${matchRows.length}`);
}

const sql = `-- World Cup 2026 full schedule: 104 matches (48-team format)
DELETE FROM analyst_scenarios WHERE match_id IN (SELECT id FROM matches WHERE tournament_id = '${TOURNAMENT}');
DELETE FROM probability_snapshots WHERE match_id IN (SELECT id FROM matches WHERE tournament_id = '${TOURNAMENT}');
DELETE FROM model_runs WHERE match_id IN (SELECT id FROM matches WHERE tournament_id = '${TOURNAMENT}');
DELETE FROM match_events WHERE match_id IN (SELECT id FROM matches WHERE tournament_id = '${TOURNAMENT}');
DELETE FROM player_match_stats WHERE match_id IN (SELECT id FROM matches WHERE tournament_id = '${TOURNAMENT}');
DELETE FROM team_match_stats WHERE match_id IN (SELECT id FROM matches WHERE tournament_id = '${TOURNAMENT}');
DELETE FROM tactical_signals WHERE match_id IN (SELECT id FROM matches WHERE tournament_id = '${TOURNAMENT}');
DELETE FROM lineup_players WHERE lineup_id IN (SELECT id FROM lineups WHERE match_id IN (SELECT id FROM matches WHERE tournament_id = '${TOURNAMENT}'));
DELETE FROM lineups WHERE match_id IN (SELECT id FROM matches WHERE tournament_id = '${TOURNAMENT}');
DELETE FROM matches WHERE tournament_id = '${TOURNAMENT}';

INSERT OR IGNORE INTO teams (id, name, short_name, country_code, confederation, fifa_ranking, elo_rating, collective_strength_rating)
VALUES
${teamInserts().join(',\n')},
${koTeams.join(',\n')};

INSERT INTO matches (id, tournament_id, stage, group_code, home_team_id, away_team_id, venue_id, kickoff_utc, status)
VALUES
${matchRows.join(',\n')};
`;

const out = join(__dirname, '..', 'migrations', '0006_wc2026_104_matches.sql');
writeFileSync(out, sql, 'utf8');
console.log(`Wrote ${matchRows.length} matches to ${out}`);
