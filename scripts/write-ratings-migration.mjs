import fs from 'fs';
import { ratingsSqlLines } from './wc2026-team-ratings.mjs';

const lines = [
  '-- WC2026 team priors calibrated from FIFA ranks + Mexico 2-0 SA opener',
  "DELETE FROM probability_snapshots WHERE match_id IN (SELECT id FROM matches WHERE tournament_id = 't-2026');",
  ...ratingsSqlLines(),
];

fs.writeFileSync(
  new URL('../migrations/0024_wc2026_team_ratings_calibrated.sql', import.meta.url),
  `${lines.join('\n')}\n`,
  'utf8',
);
