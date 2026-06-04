export type PitchEvent = {
  x?: number;
  y?: number;
  event_type?: string;
  team_id?: string;
};

type Props = {
  events: PitchEvent[];
  width?: number;
  height?: number;
};

function eventColor(type?: string) {
  if (type === 'goal') return '#d4ff00';
  if (type === 'shot') return '#a855f7';
  if (type === 'pass') return '#00e5ff';
  return '#ec008c';
}

export function EventTrajectoryLayer({ events, width = 100, height = 65 }: Props) {
  const plotted = events.filter((e) => e.x != null && e.y != null);
  const toX = (x: number) => x * width;
  const toY = (y: number) => (1 - y) * height;

  return (
    <g className="event-trajectory">
      {plotted.slice(1).map((e, i) => {
        const prev = plotted[i];
        if (!prev?.x || !prev?.y || e.x == null || e.y == null) return null;
        return (
          <line
            key={`arrow-${i}`}
            x1={toX(prev.x)}
            y1={toY(prev.y)}
            x2={toX(e.x)}
            y2={toY(e.y)}
            stroke="url(#arrowGrad)"
            strokeWidth="0.35"
            strokeOpacity="0.55"
            markerEnd="url(#arrowhead)"
          />
        );
      })}
      {plotted.map((e, i) => (
        <circle
          key={`ev-${i}`}
          cx={toX(e.x!)}
          cy={toY(e.y!)}
          r={e.event_type === 'goal' ? 2.2 : 1.4}
          fill={eventColor(e.event_type)}
          stroke="#04060a"
          strokeWidth="0.3"
          opacity={0.95}
        />
      ))}
      <defs>
        <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ec008c" stopOpacity="0.8" />
        </linearGradient>
        <marker id="arrowhead" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="#ec008c" opacity="0.7" />
        </marker>
      </defs>
    </g>
  );
}
