type Props = {
  homeScore: number;
  awayScore: number;
  status: string;
  /** inline = next to team names; badge = pill for schedule cards; compact = minimal */
  variant?: 'inline' | 'badge' | 'compact';
  className?: string;
};

export function hasMatchResult(status: string): boolean {
  return status === 'live' || status === 'completed' || status === 'finished';
}

function scoreTone(homeScore: number, awayScore: number, side: 'home' | 'away', isLive: boolean) {
  const homeWins = homeScore > awayScore;
  const awayWins = awayScore > homeScore;
  const isDraw = homeScore === awayScore;

  if (side === 'home') {
    if (isLive) return 'font-bold text-cyan drop-shadow-[0_0_6px_rgba(34,211,238,0.55)]';
    if (isDraw) return 'font-bold text-cyan';
    if (homeWins) return 'font-bold text-cyan drop-shadow-[0_0_5px_rgba(34,211,238,0.45)]';
    return 'font-semibold text-cyan/45';
  }

  if (isLive) return 'font-bold text-magenta drop-shadow-[0_0_6px_rgba(244,114,182,0.55)]';
  if (isDraw) return 'font-bold text-magenta';
  if (awayWins) return 'font-bold text-magenta drop-shadow-[0_0_5px_rgba(244,114,182,0.45)]';
  return 'font-semibold text-magenta/45';
}

export function MatchResultScore({
  homeScore,
  awayScore,
  status,
  variant = 'inline',
  className = '',
}: Props) {
  const isLive = status === 'live';
  const isFinal = status === 'completed' || status === 'finished';

  const homeClass = scoreTone(homeScore, awayScore, 'home', isLive);
  const awayClass = scoreTone(homeScore, awayScore, 'away', isLive);

  const scoreBody = (
    <>
      <span className={homeClass}>{homeScore}</span>
      <span className={isLive ? 'text-live/80' : isFinal ? 'text-foreground/40' : 'text-muted/50'}>
        –
      </span>
      <span className={awayClass}>{awayScore}</span>
    </>
  );

  if (variant === 'compact') {
    return (
      <span
        className={`inline-flex items-center gap-0.5 font-mono-data tabular-nums leading-none ${className}`}
      >
        {scoreBody}
      </span>
    );
  }

  if (variant === 'badge') {
    return (
      <span
        className={`inline-flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 font-mono-data text-xs tabular-nums leading-none ${
          isLive
            ? 'border-live/50 bg-live/10 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
            : 'border-cyan/35 bg-gradient-to-r from-cyan/15 via-panel2/80 to-magenta/15 shadow-[0_0_8px_rgba(34,211,238,0.12)]'
        } ${className}`}
      >
        {scoreBody}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-0.5 font-mono-data text-xs tabular-nums leading-none sm:text-sm ${className}`}
    >
      {scoreBody}
    </span>
  );
}
