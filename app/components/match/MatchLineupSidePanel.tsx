import { Link } from 'react-router-dom';
import { useI18n } from '../../lib/i18n/I18nContext';
import { lineupSourceBadgeClass, lineupSourceLocaleKey } from '../../lib/lineupSourceLabel';
import { formatLineupPlayerLine } from '../../lib/lineupDisplay';
import type { MatchLineupSide } from '../../lib/api';
import { lineupPagePath } from '@/utils/matchSlug';

type Props = {
  side: Pick<
    MatchLineupSide,
    | 'teamName'
    | 'formation'
    | 'hasAccurateLineup'
    | 'hasLineup'
    | 'source'
    | 'starters'
    | 'substitutes'
    | 'grouped'
    | 'lineupPlayers'
    | 'players'
  >;
  label: string;
  matchRef?: string;
  compact?: boolean;
};

const GROUP_KEYS = {
  GK: 'lineups.groupGK',
  DEF: 'lineups.groupDEF',
  MID: 'lineups.groupMID',
  FWD: 'lineups.groupFWD',
} as const;

function PlayerRow({
  shirtNumber,
  name,
  position,
}: {
  shirtNumber: number | null;
  name: string;
  position: string;
}) {
  return (
    <li className="flex items-baseline gap-2 font-mono-data text-[11px] leading-snug text-foreground/90 sm:text-xs">
      <span className="w-6 shrink-0 text-right tabular-nums text-muted">
        {shirtNumber ?? '—'}
      </span>
      <span className="min-w-0 flex-1 truncate">{name}</span>
      <span className="shrink-0 text-[10px] uppercase text-cyan/80">{position}</span>
    </li>
  );
}

export function MatchLineupSidePanel({ side, label, matchRef, compact = false }: Props) {
  const { t } = useI18n();
  const source = side.source ?? 'unknown';
  const hasLineup =
    side.hasLineup ??
    ((side.starters?.length ?? 0) >= 7 ||
      (side.lineupPlayers?.length ?? 0) >= 7 ||
      (side.players?.length ?? 0) >= 7);

  const starters =
    side.starters ??
    side.lineupPlayers?.map((p) => ({
      ...p,
      positionGroup: 'MID' as const,
      isStarter: true,
    })) ??
    [];

  const substitutes = side.substitutes ?? [];
  const grouped = side.grouped;

  return (
    <div className="rounded-card border border-border/50 bg-background/40 p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
        {hasLineup && (
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${lineupSourceBadgeClass(source)}`}
          >
            {t(lineupSourceLocaleKey(source))}
          </span>
        )}
      </div>

      <p className="mt-1 font-heading text-lg text-foreground sm:text-xl">
        {side.teamName}
        {hasLineup && side.formation && (
          <span className="font-mono-data text-sm text-cyan"> · {side.formation}</span>
        )}
      </p>

      {!hasLineup ? (
        <p className="mt-3 text-sm leading-relaxed text-muted">{t('match.lineupPending')}</p>
      ) : grouped && !compact ? (
        <div className="mt-3 space-y-3">
          {(Object.keys(GROUP_KEYS) as (keyof typeof GROUP_KEYS)[]).map((key) => {
            const rows = grouped[key] ?? [];
            if (rows.length === 0) return null;
            return (
              <div key={key}>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-dim">
                  {t(GROUP_KEYS[key])}
                </p>
                <ul className="space-y-0.5">
                  {rows.map((p) => (
                    <PlayerRow
                      key={`${p.name}-${p.shirtNumber}`}
                      shirtNumber={p.shirtNumber}
                      name={p.name}
                      position={p.position}
                    />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <ul className="mt-2 space-y-0.5">
          {starters.map((p, i) => (
            <li key={`${p.name}-${i}`} className="font-mono-data text-[11px] text-foreground/90">
              {formatLineupPlayerLine(p)}
            </li>
          ))}
        </ul>
      )}

      {!compact && substitutes.length > 0 && (
        <div className="mt-3 border-t border-border/40 pt-2">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-dim">
            {t('lineups.substitutes')}
          </p>
          <ul className="space-y-0.5">
            {substitutes.map((p) => (
              <PlayerRow
                key={`sub-${p.name}-${p.shirtNumber}`}
                shirtNumber={p.shirtNumber}
                name={p.name}
                position={p.position}
              />
            ))}
          </ul>
        </div>
      )}

      {matchRef && hasLineup && (
        <Link
          to={lineupPagePath(matchRef)}
          className="mt-3 inline-block text-[11px] font-medium text-cyan hover:underline"
        >
          {t('lineups.viewFull')} →
        </Link>
      )}
    </div>
  );
}
