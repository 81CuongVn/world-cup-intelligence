/**
 * FIFA ranking / Elo / collective strength priors for WC2026 draw teams.
 * Calibrated against Mexico 2–0 South Africa (xG 1.41–0.07, Jun 2026 opener).
 * @see migrations/0024_wc2026_team_ratings_calibrated.sql
 */
import { GROUPS, teamId } from './fifa-wc2026-official-data.mjs';

/** @type {Record<string, { fifa: number; elo: number; strength: number }>} */
export const WC2026_TEAM_RATINGS = {
  Mexico: { fifa: 15, elo: 1840, strength: 0.77 },
  'South Africa': { fifa: 61, elo: 1510, strength: 0.54 },
  'Korea Republic': { fifa: 23, elo: 1780, strength: 0.72 },
  Czechia: { fifa: 39, elo: 1685, strength: 0.65 },
  Canada: { fifa: 33, elo: 1710, strength: 0.68 },
  'Bosnia and Herzegovina': { fifa: 62, elo: 1600, strength: 0.62 },
  Qatar: { fifa: 37, elo: 1650, strength: 0.64 },
  Switzerland: { fifa: 19, elo: 1810, strength: 0.75 },
  Haiti: { fifa: 87, elo: 1450, strength: 0.48 },
  Scotland: { fifa: 36, elo: 1700, strength: 0.67 },
  Brazil: { fifa: 5, elo: 1995, strength: 0.91 },
  Morocco: { fifa: 13, elo: 1860, strength: 0.8 },
  'United States': { fifa: 14, elo: 1855, strength: 0.78 },
  Paraguay: { fifa: 52, elo: 1580, strength: 0.58 },
  Australia: { fifa: 24, elo: 1775, strength: 0.71 },
  Türkiye: { fifa: 27, elo: 1750, strength: 0.69 },
  "Côte d'Ivoire": { fifa: 38, elo: 1695, strength: 0.66 },
  Ecuador: { fifa: 31, elo: 1720, strength: 0.68 },
  Germany: { fifa: 11, elo: 1895, strength: 0.84 },
  Curaçao: { fifa: 88, elo: 1420, strength: 0.46 },
  Netherlands: { fifa: 7, elo: 1940, strength: 0.87 },
  Japan: { fifa: 18, elo: 1820, strength: 0.76 },
  Sweden: { fifa: 25, elo: 1765, strength: 0.7 },
  Tunisia: { fifa: 41, elo: 1675, strength: 0.64 },
  'IR Iran': { fifa: 21, elo: 1790, strength: 0.73 },
  'New Zealand': { fifa: 93, elo: 1400, strength: 0.45 },
  Belgium: { fifa: 8, elo: 1930, strength: 0.86 },
  Egypt: { fifa: 36, elo: 1705, strength: 0.67 },
  'Saudi Arabia': { fifa: 58, elo: 1540, strength: 0.55 },
  Uruguay: { fifa: 10, elo: 1900, strength: 0.83 },
  Spain: { fifa: 3, elo: 2010, strength: 0.91 },
  'Cabo Verde': { fifa: 65, elo: 1500, strength: 0.53 },
  France: { fifa: 2, elo: 2040, strength: 0.92 },
  Senegal: { fifa: 17, elo: 1830, strength: 0.77 },
  Iraq: { fifa: 58, elo: 1530, strength: 0.55 },
  Norway: { fifa: 46, elo: 1640, strength: 0.61 },
  Argentina: { fifa: 1, elo: 2090, strength: 0.93 },
  Algeria: { fifa: 32, elo: 1715, strength: 0.68 },
  Austria: { fifa: 22, elo: 1785, strength: 0.72 },
  Jordan: { fifa: 71, elo: 1480, strength: 0.52 },
  Portugal: { fifa: 6, elo: 1955, strength: 0.88 },
  'Congo DR': { fifa: 67, elo: 1490, strength: 0.54 },
  Uzbekistan: { fifa: 64, elo: 1505, strength: 0.54 },
  Colombia: { fifa: 12, elo: 1870, strength: 0.81 },
  Ghana: { fifa: 70, elo: 1485, strength: 0.53 },
  Panama: { fifa: 42, elo: 1665, strength: 0.63 },
  England: { fifa: 4, elo: 1970, strength: 0.89 },
  Croatia: { fifa: 9, elo: 1910, strength: 0.82 },
};

/** Post Mexico 2–0 South Africa (FIFA/Opta xG 1.41–0.07). */
export const POST_MATCH_STRENGTH_NUDGE = {
  'team-w26-a1': 0.78,
  'team-w26-a2': 0.52,
};

export function ratingsSqlLines() {
  const lines = [];
  for (const [group, teams] of Object.entries(GROUPS)) {
    teams.forEach((name, idx) => {
      const id = teamId(group, idx + 1);
      const r = WC2026_TEAM_RATINGS[name];
      if (!r) throw new Error(`Missing rating: ${name}`);
      lines.push(
        `UPDATE teams SET fifa_ranking = ${r.fifa}, elo_rating = ${r.elo}, collective_strength_rating = ${r.strength}, updated_at = datetime('now') WHERE id = '${id}';`,
      );
    });
  }
  for (const [id, strength] of Object.entries(POST_MATCH_STRENGTH_NUDGE)) {
    lines.push(
      `UPDATE teams SET collective_strength_rating = ${strength}, updated_at = datetime('now') WHERE id = '${id}';`,
    );
  }
  return lines;
}

if (process.argv[1]?.endsWith('wc2026-team-ratings.mjs')) {
  console.log(ratingsSqlLines().join('\n'));
}
