import { describe, expect, it } from 'vitest';
import {
  groupTeamWorldCupMeetings,
  summarizePairFromPerspective,
  type HeadToHeadMatch,
} from '../src/services/matchHistory';

function meeting(
  id: string,
  homeId: string,
  awayId: string,
  homeScore: number,
  awayScore: number,
  year: number,
): HeadToHeadMatch {
  return {
    id,
    kickoff_utc: `${year}-06-01T12:00:00Z`,
    stage: 'Group',
    status: 'completed',
    home_team_id: homeId,
    away_team_id: awayId,
    home_name: homeId,
    away_name: awayId,
    home_short: null,
    away_short: null,
    home_score: homeScore,
    away_score: awayScore,
    home_xg: 1,
    away_xg: 1,
    tournament_year: year,
    tournament_name: `WC ${year}`,
  };
}

describe('summarizePairFromPerspective', () => {
  it('counts wins from current match home/away orientation', () => {
    const meetings = [
      meeting('a', 'team-arg', 'team-fra', 3, 3, 2022),
      meeting('b', 'team-fra', 'team-arg', 4, 3, 2018),
    ];
    const summary = summarizePairFromPerspective(meetings, 'team-arg', 'team-fra');
    expect(summary.totalMatches).toBe(2);
    expect(summary.homeTeamWins).toBe(0);
    expect(summary.awayTeamWins).toBe(1);
    expect(summary.draws).toBe(1);
  });
});

describe('groupTeamWorldCupMeetings', () => {
  it('groups meetings by opponent with aggregate record', () => {
    const meetings = [
      meeting('1', 'team-arg', 'team-fra', 3, 3, 2022),
      meeting('2', 'team-fra', 'team-arg', 4, 3, 2018),
      meeting('3', 'team-arg', 'team-mex', 2, 1, 2006),
    ];
    const grouped = groupTeamWorldCupMeetings('team-arg', meetings);
    expect(grouped).toHaveLength(2);
    const fra = grouped.find((g) => g.opponentId === 'team-fra');
    expect(fra?.meetings).toHaveLength(2);
    expect(fra?.wins).toBe(0);
    expect(fra?.losses).toBe(1);
    expect(fra?.draws).toBe(1);
    const mex = grouped.find((g) => g.opponentId === 'team-mex');
    expect(mex?.wins).toBe(1);
  });
});
