import type { PitchMapPlayer } from '../../lib/api';

type Props = {
  players: PitchMapPlayer[];
  side: 'home' | 'away';
  width?: number;
  height?: number;
  showRatings?: boolean;
};

function toSvg(x: number, y: number, width: number, height: number) {
  return { cx: x * width, cy: (1 - y) * height };
}

function ratingColor(rating: number) {
  if (rating >= 7.5) return '#22c55e';
  if (rating >= 6.5) return '#d4ff00';
  if (rating >= 5.5) return '#fbbf24';
  return '#f87171';
}

export function PitchPlayerLayer({ players, side, width = 100, height = 65, showRatings }: Props) {
  const fill = side === 'home' ? '#00e5ff' : '#ec008c';
  const stroke = side === 'home' ? '#0891b2' : '#be185d';

  return (
    <g className={`pitch-players pitch-players-${side}`}>
      {players.map((p) => {
        const { cx, cy } = toSvg(p.x, p.y, width, height);
        const mv = p.movement;
        const mvLen = mv ? Math.min(mv.magnitude * 40, 8) : 0;
        const mvX = mv ? cx + mv.dx * mvLen * 10 : cx;
        const mvY = mv ? cy - mv.dy * mvLen * 10 : cy;

        return (
          <g key={p.playerId}>
            {mv && mv.magnitude > 0.02 && (
              <line
                x1={cx}
                y1={cy}
                x2={mvX}
                y2={mvY}
                stroke={fill}
                strokeWidth="0.5"
                strokeOpacity="0.55"
                markerEnd="url(#pitchMoveArrow)"
              />
            )}
            <circle cx={cx} cy={cy} r="3.2" fill={fill} fillOpacity="0.92" stroke={stroke} strokeWidth="0.35" />
            <text
              x={cx}
              y={cy + 0.8}
              textAnchor="middle"
              fontSize="2.4"
              fontWeight="700"
              fill="#04060a"
              pointerEvents="none"
            >
              {p.shirtNumber ?? '·'}
            </text>
            {p.subType === 'in' && p.subMinute != null && (
              <text x={cx + 3.5} y={cy - 2.5} fontSize="1.8" fill="#22c55e">
                ↑{p.subMinute}'
              </text>
            )}
            {showRatings && p.rating != null && (
              <g>
                <rect
                  x={cx - 3.2}
                  y={cy - 7.5}
                  width="6.4"
                  height="3"
                  rx="0.6"
                  fill={ratingColor(p.rating)}
                  fillOpacity="0.92"
                />
                <text x={cx} y={cy - 5.4} textAnchor="middle" fontSize="2" fontWeight="700" fill="#04060a">
                  {p.rating.toFixed(1)}
                </text>
              </g>
            )}
            <title>
              {p.name} ({p.position}){p.rating != null ? ` · ${p.rating}` : ''}
            </title>
          </g>
        );
      })}
    </g>
  );
}
