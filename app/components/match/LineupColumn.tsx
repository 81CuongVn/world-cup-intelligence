import { MatchLineupSidePanel } from './MatchLineupSidePanel';
import type { MatchPreviewAnalysis } from '../../lib/api';

export function LineupColumn({
  side,
  label,
  matchRef,
}: {
  side: MatchPreviewAnalysis['home'];
  label: string;
  matchRef?: string;
}) {
  return (
    <MatchLineupSidePanel
      side={{
        teamName: side.teamName,
        formation: side.formation,
        hasAccurateLineup: side.hasAccurateLineup,
        hasLineup: (side.fullLineup?.length ?? 0) >= 7,
        source: side.lineupSource,
        lineupPlayers: side.lineupPlayers,
        players: side.fullLineup,
        starters: side.lineupPlayers?.map((p) => ({
          ...p,
          positionGroup: 'MID' as const,
          isStarter: true,
        })),
      }}
      label={label}
      matchRef={matchRef}
      compact
    />
  );
}
