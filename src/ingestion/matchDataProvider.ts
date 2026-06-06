export type LiveMatchTick = {
  minute: number;
  homeScore: number;
  awayScore: number;
  status: 'live' | 'completed';
};

export type MatchDataProvider = {
  readonly name: string;
  getLiveTick(matchId: string, kickoffUtc: string, nowMs: number): LiveMatchTick | null;
};

/** Deterministic mock scores (current production behaviour). */
export class MockMatchDataProvider implements MatchDataProvider {
  readonly name = 'mock';

  constructor(private scoreFn: (matchId: string, minute: number) => { home: number; away: number }) {}

  getLiveTick(matchId: string, kickoffUtc: string, nowMs: number): LiveMatchTick | null {
    const kickoffMs = new Date(kickoffUtc).getTime();
    const windowStart = kickoffMs - 2 * 60 * 60 * 1000;
    const windowEnd = kickoffMs + 105 * 60 * 1000;
    if (nowMs < windowStart || nowMs >= windowEnd) return null;

    const elapsedMin = Math.max(0, Math.floor((nowMs - kickoffMs) / 60000));
    const minute = Math.min(90, elapsedMin);
    const scores = this.scoreFn(matchId, minute);

    if (minute >= 90) {
      return { minute: 90, homeScore: scores.home, awayScore: scores.away, status: 'completed' };
    }
    return { minute, homeScore: scores.home, awayScore: scores.away, status: 'live' };
  }
}

/** Placeholder for football-data.org or partner API — falls back to null (no update). */
export class FootballDataProvider implements MatchDataProvider {
  readonly name = 'football-data';

  getLiveTick(_matchId: string, _kickoffUtc: string, _nowMs: number): LiveMatchTick | null {
    return null;
  }
}

export function resolveMatchDataProvider(
  mockSources: boolean,
  scoreFn: (matchId: string, minute: number) => { home: number; away: number },
): MatchDataProvider {
  if (mockSources) return new MockMatchDataProvider(scoreFn);
  return new FootballDataProvider();
}
