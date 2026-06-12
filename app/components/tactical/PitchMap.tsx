import type { PitchMapPayload } from '../../lib/api';
import { EventTrajectoryLayer, type PitchEvent } from './EventTrajectoryLayer';
import { PitchPlayerLayer } from './PitchPlayerLayer';
import { SectionLabel } from './SectionLabel';
import { useI18n } from '../../lib/i18n/I18nContext';
import { DataKindBadge, DataKindLegend } from '../ui/DataKindBadge';

type Props = {
  data: PitchMapPayload | null;
  loading?: boolean;
  homeLabel?: string;
  awayLabel?: string;
};

function lineupSourceLabel(source: string, t: ReturnType<typeof useI18n>['t']) {
  if (source === 'match_official') return t('match.lineupOfficial');
  if (source === 'squad_roster' || source === 'squad_official') return t('match.lineupSquad');
  if (source === 'projected') return t('match.lineupProjected');
  return t('match.lineupUnknown');
}

export function PitchMap({ data, loading, homeLabel, awayLabel }: Props) {
  const { t } = useI18n();
  const home = homeLabel ?? data?.home.teamName ?? t('pitch.home');
  const away = awayLabel ?? data?.away.teamName ?? t('pitch.away');

  const events: PitchEvent[] =
    data?.events.map((e) => ({
      x: e.x,
      y: e.y,
      end_x: e.endX ?? undefined,
      end_y: e.endY ?? undefined,
      event_type: e.eventType,
      team_id: e.teamId ?? undefined,
    })) ?? [];

  return (
    <div className="panel hero-glow overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <SectionLabel
          title={t('pitch.title')}
          subtitle={t('pitch.subtitleLineup')}
          accent="lime"
          dataKind="actual"
          className="mb-0 min-w-0 flex-1"
        />
        {data?.status === 'live' && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-live/40 bg-live/10 px-2 py-0.5 font-mono-data text-[10px] uppercase tracking-wider text-live">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-live" />
            {t('common.live')}
          </span>
        )}
      </div>

      {data && (
        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 font-mono-data text-[10px] text-muted">
          <span>
            {home} {data.home.formation ?? '—'} · {lineupSourceLabel(data.home.source, t)}
          </span>
          <span>
            {away} {data.away.formation ?? '—'} · {lineupSourceLabel(data.away.source, t)}
          </span>
          {data.minute != null && (
            <span>
              {t('pitch.minute')}: {data.minute}'
            </span>
          )}
        </div>
      )}

      <DataKindLegend className="mb-3" />

      {loading && !data && <p className="text-sm text-muted">{t('pitch.loading')}</p>}

      {!loading && !data && <p className="text-sm text-muted">{t('pitch.unavailable')}</p>}

      {data && (
        <div className="relative">
          <div className="pointer-events-none absolute left-2 top-2 z-10 font-display text-[10px] tracking-widest text-cyan/70">
            {home}
          </div>
          <div className="pointer-events-none absolute right-2 top-2 z-10 font-display text-[10px] tracking-widest text-magenta/70">
            {away}
          </div>
          <svg viewBox="0 0 100 65" className="w-full rounded-card bg-pitch" aria-label={t('pitch.title')}>
            <rect x="1" y="1" width="98" height="63" fill="#0B1118" rx="1" />
            <rect x="2" y="2" width="96" height="61" fill="none" stroke="#253244" strokeWidth="0.4" />
            <line x1="50" y1="2" x2="50" y2="63" stroke="#253244" strokeWidth="0.35" />
            <circle cx="50" cy="32.5" r="9" fill="none" stroke="#253244" strokeWidth="0.35" />
            <rect x="2" y="22" width="12" height="21" fill="none" stroke="#253244" strokeWidth="0.3" />
            <rect x="86" y="22" width="12" height="21" fill="none" stroke="#253244" strokeWidth="0.3" />

            <PitchPlayerLayer
              players={data.home.players}
              side="home"
              showRatings={data.showRatings}
            />
            <PitchPlayerLayer
              players={data.away.players}
              side="away"
              showRatings={data.showRatings}
            />
            <EventTrajectoryLayer events={events} />

            <defs>
              <marker id="pitchMoveArrow" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                <path d="M0,0 L4,2 L0,4 Z" fill="#00e5ff" opacity="0.8" />
              </marker>
            </defs>
          </svg>

          {(data.home.bench.length > 0 || data.away.bench.length > 0) && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[data.home, data.away].map((side) =>
                side.bench.length > 0 ? (
                  <div key={side.teamId} className="rounded-lg border border-border/40 bg-panel2/30 px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                      {side.teamName} · {t('lineups.substitutes')}
                    </p>
                    <ul className="mt-1 space-y-0.5 text-xs text-foreground/85">
                      {side.bench.map((p) => (
                        <li key={p.playerId} className="font-mono-data">
                          {p.shirtNumber != null ? `#${p.shirtNumber}` : '—'} {p.name}
                          {p.subType === 'out' && p.subMinute != null && (
                            <span className="ml-1 text-shooting">↓{p.subMinute}'</span>
                          )}
                          {data.showRatings && p.rating != null && (
                            <span className="ml-1 text-yellow">{p.rating.toFixed(1)}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null,
              )}
            </div>
          )}

          {data.showRatings && (
            <p className="mt-2 text-[11px] text-muted">{t('pitch.ratingsNote')}</p>
          )}
        </div>
      )}
    </div>
  );
}
