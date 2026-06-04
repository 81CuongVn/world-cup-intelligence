import { describe, expect, it } from 'vitest';
import {
  isWc2026Tournament,
  resolveScheduleTournamentId,
  WC2026_MATCH_COUNT,
  WC2026_TOURNAMENT_ID,
} from '../src/constants/tournament';

describe('WC2026 tournament scope', () => {
  it('identifies WC 2026 tournament id', () => {
    expect(isWc2026Tournament('t-2026')).toBe(true);
    expect(isWc2026Tournament('t-2022')).toBe(false);
  });

  it('always resolves schedule to WC 2026', () => {
    expect(resolveScheduleTournamentId(undefined)).toBe(WC2026_TOURNAMENT_ID);
    expect(resolveScheduleTournamentId('t-2022')).toBe(WC2026_TOURNAMENT_ID);
  });

  it('expects 104 tournament matches', () => {
    expect(WC2026_MATCH_COUNT).toBe(104);
  });
});
