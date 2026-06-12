import { describe, expect, it } from 'vitest';
import { assignFormationCoords } from '../src/lib/formationLayout';
import {
  aggregateMovement,
  applySubstitutions,
  computePlayerRating,
} from '../src/services/pitchMap';

describe('assignFormationCoords', () => {
  it('places home GK deep left and ST advanced', () => {
    const players = [
      { playerId: 'gk', position: 'GK' },
      { playerId: 'st', position: 'ST' },
    ];
    const coords = assignFormationCoords('4-3-3', players, 'home');
    expect(coords.get('gk')!.x).toBeLessThan(coords.get('st')!.x);
    expect(coords.get('gk')!.y).toBeCloseTo(0.5, 1);
  });

  it('mirrors away team to the right half', () => {
    const players = [{ playerId: 'cb', position: 'CB' }];
    const home = assignFormationCoords('4-3-3', players, 'home');
    const away = assignFormationCoords('4-3-3', players, 'away');
    expect(away.get('cb')!.x).toBeGreaterThan(home.get('cb')!.x);
  });
});

describe('applySubstitutions', () => {
  it('swaps starters with subs at given minute', () => {
    const starters = new Set(['a', 'b']);
    const onPitch = new Set(starters);
    const marks = applySubstitutions(
      starters,
      onPitch,
      [{ minute: 60, player_id: 'c', related_player_id: 'a', team_id: 't1' }],
      90,
    );
    expect(onPitch.has('a')).toBe(false);
    expect(onPitch.has('c')).toBe(true);
    expect(marks.get('a')?.subType).toBe('out');
    expect(marks.get('c')?.subType).toBe('in');
  });
});

describe('computePlayerRating', () => {
  it('rewards goals and caps range', () => {
    const high = computePlayerRating({
      player_id: 'p1',
      team_id: 't',
      minutes_played: 90,
      goals: 2,
      assists: 1,
      shots: 4,
      shots_on_target: 3,
      xg: 1.2,
      passes: 40,
      pass_accuracy: 85,
      yellow_cards: 0,
      red_cards: 0,
    });
    expect(high).toBeGreaterThan(7);
    expect(high).toBeLessThanOrEqual(10);
  });
});

describe('aggregateMovement', () => {
  it('averages movement vectors per player', () => {
    const map = aggregateMovement([
      { player_id: 'p1', team_id: 't', x: 0.5, y: 0.5, end_x: 0.6, end_y: 0.5 },
      { player_id: 'p1', team_id: 't', x: 0.6, y: 0.5, end_x: 0.8, end_y: 0.5 },
    ]);
    const v = map.get('p1');
    expect(v?.dx).toBeCloseTo(0.15, 2);
    expect(v?.dy).toBeCloseTo(0, 2);
  });
});
