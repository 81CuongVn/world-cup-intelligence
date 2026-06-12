import { describe, expect, it } from 'vitest';
import {
  formatLineupPlayerLine,
  lineupPositionGroup,
  normalizeLineupPosition,
} from '../src/services/lineupDisplay';
import { sortLineupPlayers } from '../app/lib/lineupDisplay';

describe('lineupDisplay', () => {
  it('formats official player line as (number) - name - position', () => {
    expect(
      formatLineupPlayerLine({ shirtNumber: 10, name: 'Lionel Messi', position: 'ST' }),
    ).toBe('(10) - Lionel Messi - ST');
  });

  it('normalizes long position labels to short codes', () => {
    expect(normalizeLineupPosition(null, null, 'Goalkeeper')).toBe('GK');
    expect(normalizeLineupPosition('DM', null, null)).toBe('DM');
  });

  it('uses em dash placeholder when shirt number missing', () => {
    expect(formatLineupPlayerLine({ shirtNumber: null, name: 'Player', position: 'CM' })).toBe(
      '(—) - Player - CM',
    );
  });

  it('sorts lineup by position group then shirt number', () => {
    const sorted = sortLineupPlayers([
      { shirtNumber: 9, name: 'Striker', position: 'ST' },
      { shirtNumber: 12, name: 'Keeper', position: 'GK' },
      { shirtNumber: 4, name: 'Defender', position: 'CB' },
    ]);
    expect(sorted.map((p) => p.position)).toEqual(['GK', 'CB', 'ST']);
    expect(sorted[0].shirtNumber).toBe(12);
  });

  it('maps positions to lineup groups', () => {
    expect(lineupPositionGroup('GK')).toBe('GK');
    expect(lineupPositionGroup('CB')).toBe('DEF');
    expect(lineupPositionGroup('DM')).toBe('MID');
    expect(lineupPositionGroup('ST')).toBe('FWD');
    expect(lineupPositionGroup('LW')).toBe('FWD');
  });
});
