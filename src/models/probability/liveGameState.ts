export function gameStateModifier(
  minute: number,
  homeScore: number,
  awayScore: number,
): { home: number; away: number } {
  const remaining = Math.max(1, 90 - minute) / 90;
  const diff = homeScore - awayScore;
  if (diff === 0) return { home: 1, away: 1 };
  if (diff > 0) {
    const leadBoost = 1 + (diff * 0.04 * (1 - remaining));
    const trailPenalty = 1 - diff * 0.06 * remaining;
    return { home: leadBoost, away: Math.max(0.7, trailPenalty) };
  }
  const awayLead = 1 + (-diff * 0.04 * (1 - remaining));
  const homeTrail = 1 - (-diff) * 0.06 * remaining;
  return { home: Math.max(0.7, homeTrail), away: awayLead };
}
