export type LineupPlayerEntry = {
  shirtNumber: number | null;
  name: string;
  position: string;
};

type LineupPositionGroup = 'GK' | 'DEF' | 'MID' | 'FWD';

const GROUP_ORDER: LineupPositionGroup[] = ['GK', 'DEF', 'MID', 'FWD'];

export function lineupPositionGroup(position: string): LineupPositionGroup {
  const p = position.toUpperCase();
  if (p === 'GK' || p.includes('GOAL')) return 'GK';
  if (/^(CB|LB|RB|FB|WB|LWB|RWB|DF|DEF)/.test(p) || p === 'D') return 'DEF';
  if (/^(DM|CM|AM|LM|RM|MF|MID)/.test(p) || p === 'M') return 'MID';
  if (/^(ST|CF|SS|WG|LW|RW|FW|FWD)/.test(p) || p === 'F') return 'FWD';
  return 'MID';
}

export function sortLineupPlayers<T extends LineupPlayerEntry>(players: T[]): T[] {
  return [...players].sort((a, b) => {
    const ga = GROUP_ORDER.indexOf(lineupPositionGroup(a.position));
    const gb = GROUP_ORDER.indexOf(lineupPositionGroup(b.position));
    if (ga !== gb) return ga - gb;
    return (a.shirtNumber ?? 999) - (b.shirtNumber ?? 999);
  });
}

export function formatLineupPlayerLine(entry: LineupPlayerEntry): string {
  const num = entry.shirtNumber != null ? `(${entry.shirtNumber})` : '(—)';
  return `${num} - ${entry.name} - ${entry.position}`;
}
