import { describe, expect, it } from 'vitest';
import {
  groupTeamWorldCupMeetings,
  mapMatchesToTeamPerspective,
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

describe('mapMatchesToTeamPerspective', () => {
  it('maps scores and result from team perspective with alias ids', () => {
    const meetings = [
      {
        ...meeting('1', 'team-mex', 'team-bra', 0, 2, 2018),
        home_name: 'Mexico',
        away_name: 'Brazil',
        home_short: 'MEX',
        away_short: 'BRA',
      },
      {
        ...meeting('2', 'team-fra', 'team-mex', 0, 2, 2010),
        home_name: 'France',
        away_name: 'Mexico',
        home_short: 'FRA',
        away_short: 'MEX',
      },
    ];
    const aliasIds = new Set(['team-w26-a1', 'team-mex']);
    const mapped = mapMatchesToTeamPerspective(aliasIds, meetings);
    expect(mapped).toHaveLength(2);
    expect(mapped[0]).toMatchObject({
      opponentName: 'Brazil',
      teamScore: 0,
      opponentScore: 2,
      result: 'L',
      isHome: true,
    });
    expect(mapped[1]).toMatchObject({
      opponentName: 'France',
      teamScore: 2,
      opponentScore: 0,
      result: 'W',
      isHome: false,
    });
  });
});
