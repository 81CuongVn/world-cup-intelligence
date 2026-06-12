/** FIFA Gameday `/stats/match/{IdIFES}/teams.json` stat row. */
export type FifaGamedayStatRow = {
  name: string;
  value: number;
  isPostMatch: boolean;
};

export type FifaGamedayTeamStats = {
  idTeam: string;
  stats: FifaGamedayStatRow[];
};

export type ParsedTeamMatchStats = {
  possession: number | null;
  shots: number | null;
  shotsOnTarget: number | null;
  passes: number | null;
  passAccuracy: number | null;
};

function statValue(stats: FifaGamedayStatRow[], name: string): number | null {
  const hit = stats.find((s) => s.name === name);
  return hit?.value ?? null;
}

/** Map FIFA Match Centre / Gameday team stat names to platform columns. */
export function parseGamedayTeamStats(stats: FifaGamedayStatRow[]): ParsedTeamMatchStats {
  const passes = statValue(stats, 'Passes');
  const passesCompleted = statValue(stats, 'PassesCompleted');
  let passAccuracy: number | null = null;
  if (passes != null && passesCompleted != null && passes > 0) {
    passAccuracy = Math.round((passesCompleted / passes) * 1000) / 10;
  }

  return {
    possession: statValue(stats, 'Possession'),
    shots: statValue(stats, 'AttemptAtGoal'),
    shotsOnTarget: statValue(stats, 'AttemptAtGoalOnTarget'),
    passes,
    passAccuracy,
  };
}

/** Parse Gameday teams.json object keyed by FIFA team id. */
export function parseGamedayTeamsPayload(
  data: Record<string, [string, number, boolean][]>,
): FifaGamedayTeamStats[] {
  const out: FifaGamedayTeamStats[] = [];
  for (const [idTeam, rows] of Object.entries(data)) {
    out.push({
      idTeam,
      stats: rows.map(([name, value, isPostMatch]) => ({ name, value, isPostMatch })),
    });
  }
  return out;
}
