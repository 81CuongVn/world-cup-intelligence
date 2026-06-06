/**
 * Generates SQL to rename WC 2026 placeholder teams (team-w26-*).
 * Run: node scripts/expand-wc2026-data.mjs
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const NATIONS = [
  'United States', 'Mexico', 'Canada', 'Argentina', 'Brazil', 'France', 'England', 'Spain',
  'Germany', 'Italy', 'Netherlands', 'Portugal', 'Belgium', 'Croatia', 'Uruguay', 'Colombia',
  'Ecuador', 'Chile', 'Paraguay', 'Peru', 'Japan', 'South Korea', 'Australia', 'Saudi Arabia',
  'Iran', 'Qatar', 'Morocco', 'Senegal', 'Nigeria', 'Ghana', 'Cameroon', 'Tunisia',
  'Egypt', 'Algeria', 'Poland', 'Switzerland', 'Austria', 'Denmark', 'Sweden', 'Norway',
  'Serbia', 'Ukraine', 'Turkey', 'Wales', 'Scotland', 'Costa Rica', 'Panama', 'Jamaica',
];

/** Placeholder team ids seeded in 0006_wc2026_104_matches.sql (groups B–L). */
const PLACEHOLDER_IDS = [
  'team-w26-b3', 'team-w26-b4',
  ...'CDEFGHIJKL'.split('').flatMap((g) =>
    [1, 2, 3, 4].map((n) => `team-w26-${g.toLowerCase()}${n}`),
  ),
];

const lines = [
  '-- Rename WC 2026 placeholder teams to real nation names (groups B–L)',
  '-- Group A uses team-usa, team-mex, team-arg, team-bra from reference seed',
  '',
];

PLACEHOLDER_IDS.forEach((teamId, i) => {
  const nation = NATIONS[i % NATIONS.length];
  const short = nation.length <= 3 ? nation.toUpperCase() : nation.slice(0, 3).toUpperCase();
  const cc = nation.slice(0, 2).toUpperCase();
  lines.push(
    `UPDATE teams SET name = '${nation.replace(/'/g, "''")}', short_name = '${short}', country_code = '${cc}' WHERE id = '${teamId}';`,
  );
});

const out = path.join(__dirname, '../migrations/0018_wc2026_teams_squads.sql');
writeFileSync(out, lines.join('\n') + '\n');
console.log(`Wrote ${out} (${PLACEHOLDER_IDS.length} team updates)`);
