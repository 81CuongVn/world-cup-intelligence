/** Pre-match view for completed fixtures — avoid baking final score into W/D/L display. */
export function predictionMatchState(
  status: string,
  minute: number,
  homeScore: number,
  awayScore: number,
): { minute: number; home: number; away: number } {
  if (status === 'live') {
    return { minute, home: homeScore, away: awayScore };
  }
  return { minute: 0, home: 0, away: 0 };
}
