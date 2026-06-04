import { describe, it, expect } from 'vitest';
import { buildIntervalDistribution } from '../src/models/probability/interval';

describe('interval distribution', () => {
  it('returns all required intervals', () => {
    const d = buildIntervalDistribution(1.3, 1.1, 0, 0, 0, { homeWin: 0.4, draw: 0.28, awayWin: 0.32 });
    expect(d['15']).toBeDefined();
    expect(d['90']).toBeDefined();
    const i90 = d['90'];
    expect(i90.homeWinProb + i90.drawProb + i90.awayWinProb).toBeCloseTo(1, 2);
  });
});
