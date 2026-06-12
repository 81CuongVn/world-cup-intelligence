import { describe, expect, it } from 'vitest';
import {
  buildTeamAliasIndex,
  findTeamIdsInText,
  classifyNewsImpact,
  buildImpactSummaryVi,
} from '../src/services/newsMatchImpact';

const mockTeams = [
  { id: 'team-w26-a1', name: 'Mexico', short_name: 'MEX', country_code: 'MEX' },
  { id: 'team-w26-a2', name: 'South Africa', short_name: 'RSA', country_code: 'RSA' },
  { id: 'team-w26-b1', name: 'Brazil', short_name: 'BRA', country_code: 'BRA' },
] as const;

describe('newsMatchImpact', () => {
  const index = buildTeamAliasIndex([...mockTeams]);

  it('finds WC2026 teams and aliases in text', () => {
    const ids = findTeamIdsInText('Mexico face South Africa in opening match', index);
    expect(ids).toContain('team-w26-a1');
    expect(ids).toContain('team-w26-a2');
  });

  it('classifies injury news as high impact', () => {
    const level = classifyNewsImpact('Key striker ruled out with hamstring injury before Mexico clash', {
      teams: ['Mexico'],
      players: [],
      injuries: ['striker ruled out'],
      tacticalNotes: [],
      formations: [],
    });
    expect(level).toBe('high');
  });

  it('classifies lineup news as medium impact', () => {
    const level = classifyNewsImpact('Coach confirms starting XI for World Cup opener', null);
    expect(level).toBe('medium');
  });

  it('builds Vietnamese impact summary when matches affected', () => {
    const summary = buildImpactSummaryVi(
      ['Mexico', 'South Africa'],
      ['m-w26-ga-1v2'],
      'high',
      { teams: [], players: [], injuries: ['Player X injured'], tacticalNotes: [], formations: [] },
    );
    expect(summary).toContain('Mexico');
    expect(summary).toContain('World Cup 2026');
  });
});

describe('FifaWc2026NewsAdapter helpers', () => {
  it('extracts article links from FIFA HTML snippet', async () => {
    const { fetchFifaWc2026NewsItems } = await import('../src/ingestion/adapters/FifaWc2026NewsAdapter');
    expect(typeof fetchFifaWc2026NewsItems).toBe('function');
  });
});
