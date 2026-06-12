import { describe, it, expect } from 'vitest';
import { coachModifier, refereeModifier } from '../src/models/probability/staffModifiers';
import type { CoachFeatures } from '../src/models/probability/types';

const aguirre: CoachFeatures = {
  coachId: 'coach-mex-aguirre',
  name: 'Javier Aguirre',
  wcAppearances: 3,
  tenureYears: 2,
  tacticalRating: 0.86,
  disciplineIndex: 0.62,
  homeNationMatch: true,
};

const broos: CoachFeatures = {
  coachId: 'coach-rsa-broos',
  name: 'Hugo Broos',
  wcAppearances: 1,
  tenureYears: 5.5,
  tacticalRating: 0.76,
  disciplineIndex: 0.68,
  homeNationMatch: false,
};

describe('staffModifiers', () => {
  it('boosts home coach with WC experience and home-nation match', () => {
    const { home, away } = coachModifier(aguirre, broos);
    expect(home).toBeGreaterThan(1.02);
    expect(away).toBeGreaterThan(1);
    expect(home).toBeGreaterThan(away);
  });

  it('returns neutral when coach data missing', () => {
    expect(coachModifier(undefined, undefined)).toEqual({ home: 1, away: 1 });
  });

  it('amplifies home edge for strict referee when ranking gap is large', () => {
    const ref = { name: 'Wilton Sampaio', strictness: 0.82, avgYellowCards: 4.6, avgRedCards: 0.18 };
    const { home, away } = refereeModifier(ref, 15, 61);
    expect(home).toBeGreaterThan(1);
    expect(away).toBeLessThan(1);
  });

  it('ignores referee modifier when ranking gap is small', () => {
    const ref = { name: 'Test', strictness: 0.9, avgYellowCards: 5, avgRedCards: 0.2 };
    expect(refereeModifier(ref, 10, 12)).toEqual({ home: 1, away: 1 });
  });
});
