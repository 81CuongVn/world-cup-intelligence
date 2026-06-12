import { describe, it, expect } from 'vitest';
import {
  parseFifaMinute,
  resolveFifaPlatformStatus,
  normalizeTeamName,
  fifaCountryToTeamName,
} from '../src/ingestion/fifa/parse';

describe('fifa parse helpers', () => {
  it('parses FIFA minute strings', () => {
    expect(parseFifaMinute("67'")).toBe(67);
    expect(parseFifaMinute("90'+2'")).toBe(92);
    expect(parseFifaMinute("98'")).toBe(98);
    expect(parseFifaMinute('0')).toBe(0);
  });

  it('maps FIFA status to platform status', () => {
    expect(resolveFifaPlatformStatus({ MatchStatus: 0, Period: 10, MatchTime: "98'" })).toBe('completed');
    expect(resolveFifaPlatformStatus({ MatchStatus: 3, Period: 5, MatchTime: "55'" })).toBe('live');
    expect(resolveFifaPlatformStatus({ MatchStatus: 1, Period: 0, MatchTime: "0'" })).toBe('scheduled');
  });

  it('normalizes team names for lookup', () => {
    expect(normalizeTeamName('Korea Republic')).toBe('korea republic');
    expect(normalizeTeamName("Côte d'Ivoire")).toBe('cote d ivoire');
  });

  it('maps FIFA country codes to display names', () => {
    expect(fifaCountryToTeamName('RSA', 'South Africa')).toBe('South Africa');
    expect(fifaCountryToTeamName('MEX', 'Mexico')).toBe('Mexico');
  });
});
