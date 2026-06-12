import { useCallback, useEffect, useState } from 'react';
import { api, type MatchStatsPayload } from '../../lib/api';
import { useI18n } from '../../lib/i18n/I18nContext';
import { SectionLabel } from '../tactical/SectionLabel';
import { xg } from '../../lib/format';
import { DataKindLegend } from '../ui/DataKindBadge';

type Props = {
  matchId: string;
  homeLabel: string;
  awayLabel: string;
  live?: boolean;
};

const STATS_LIVE_REFRESH_MS = 15_000;

type StatRow = {
  key: string;
  home: string;
  away: string;
  homeNum: number | null;
  awayNum: number | null;
  showBar?: boolean;
};

function statOrDash(value: number | null, fmt?: (v: number) => string) {
  if (value == null) return '—';
  return fmt ? fmt(value) : String(value);
}

function valueTone(homeNum: number | null, awayNum: number | null, side: 'home' | 'away') {
  if (homeNum == null || awayNum == null || homeNum === awayNum) return 'text-foreground';
  const homeLeads = homeNum > awayNum;
  if (side === 'home') return homeLeads ? 'text-cyan font-semibold' : 'text-foreground/65';
  return !homeLeads ? 'text-magenta font-semibold' : 'text-foreground/65';
}

function buildRows(stats: MatchStatsPayload, t: ReturnType<typeof useI18n>['t']): StatRow[] {
  return [
    {
      key: t('stats.possession'),
      home: statOrDash(stats.home.possession, (v) => `${Math.round(v)}%`),
      away: statOrDash(stats.away.possession, (v) => `${Math.round(v)}%`),
      homeNum: stats.home.possession,
      awayNum: stats.away.possession,
      showBar: true,
    },
    {
      key: t('stats.shots'),
      home: statOrDash(stats.home.shots),
      away: statOrDash(stats.away.shots),
      homeNum: stats.home.shots,
      awayNum: stats.away.shots,
    },
    {
      key: t('stats.shotsOnTarget'),
      home: statOrDash(stats.home.shotsOnTarget),
      away: statOrDash(stats.away.shotsOnTarget),
      homeNum: stats.home.shotsOnTarget,
      awayNum: stats.away.shotsOnTarget,
    },
    {
      key: t('stats.xg'),
      home: statOrDash(stats.home.xg, xg),
      away: statOrDash(stats.away.xg, xg),
      homeNum: stats.home.xg,
      awayNum: stats.away.xg,
    },
    {
      key: t('stats.passes'),
      home: statOrDash(stats.home.passes),
      away: statOrDash(stats.away.passes),
      homeNum: stats.home.passes,
      awayNum: stats.away.passes,
    },
    {
      key: t('stats.passAccuracy'),
      home: statOrDash(stats.home.passAccuracy, (v) => `${Math.round(v)}%`),
      away: statOrDash(stats.away.passAccuracy, (v) => `${Math.round(v)}%`),
      homeNum: stats.home.passAccuracy,
      awayNum: stats.away.passAccuracy,
    },
  ];
}

function StatBar({ homeNum, awayNum }: { homeNum: number | null; awayNum: number | null }) {
  if (homeNum == null || awayNum == null) return null;
  const total = homeNum + awayNum;
  if (total <= 0) return null;
  const homePct = (homeNum / total) * 100;
  return (
    <div className="mt-1.5 flex h-1.5 w-full overflow-hidden rounded-full bg-background2 ring-1 ring-border/60">
      <div className="bg-cyan transition-all duration-500" style={{ width: `${homePct}%` }} />
      <div className="bg-magenta transition-all duration-500" style={{ width: `${100 - homePct}%` }} />
    </div>
  );
}

export function MatchLiveStatsPanel({ matchId, homeLabel, awayLabel, live }: Props) {
  const { t } = useI18n();
  const [stats, setStats] = useState<MatchStatsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(() => {
    return api
      .matchStats(matchId)
      .then((r) => setStats(r.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [matchId]);

  useEffect(() => {
    setLoading(true);
    loadStats();
  }, [matchId, loadStats]);

  useEffect(() => {
    if (!live) return;
    const timer = setInterval(loadStats, STATS_LIVE_REFRESH_MS);
    return () => clearInterval(timer);
  }, [live, loadStats]);

  const rows = stats ? buildRows(stats, t) : [];

  return (
    <section className="panel-dense">
      <SectionLabel
        title={t('stats.title')}
        subtitle={live ? t('stats.subtitleLive') : t('stats.subtitle')}
        accent="cyan"
        dataKind="actual"
      />
      <DataKindLegend className="mt-1" />
      {loading ? (
        <p className="mt-3 text-sm text-muted">{t('stats.loading')}</p>
      ) : !stats || stats.dataSource === 'unavailable' ? (
        <p className="mt-3 text-sm text-muted">{t('stats.unavailable')}</p>
      ) : (
        <>
          <div className="mx-auto mt-4 w-full max-w-lg">
            <div className="grid grid-cols-[1fr_minmax(6.5rem,9rem)_1fr] items-end gap-x-3 pb-1">
              <p className="truncate text-right text-sm font-semibold text-cyan" title={homeLabel}>
                {homeLabel}
              </p>
              <span aria-hidden="true" />
              <p className="truncate text-left text-sm font-semibold text-magenta" title={awayLabel}>
                {awayLabel}
              </p>
            </div>

            <div className="divide-y divide-border/40">
              {rows.map((row) => (
                <div key={row.key} className="py-2.5">
                  <div className="grid grid-cols-[1fr_minmax(6.5rem,9rem)_1fr] items-center gap-x-3">
                    <p
                      className={`text-right font-mono-data text-sm tabular-nums ${valueTone(row.homeNum, row.awayNum, 'home')}`}
                    >
                      {row.home}
                    </p>
                    <p className="text-center text-xs leading-snug text-muted">{row.key}</p>
                    <p
                      className={`text-left font-mono-data text-sm tabular-nums ${valueTone(row.homeNum, row.awayNum, 'away')}`}
                    >
                      {row.away}
                    </p>
                  </div>
                  {row.showBar && <StatBar homeNum={row.homeNum} awayNum={row.awayNum} />}
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-4 flex w-full max-w-lg flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono-data text-xs text-muted">
            <span>
              {t('stats.cards')}: 🟨 {stats.events.yellowCards} · 🟥 {stats.events.redCards}
            </span>
            <span>
              {t('stats.subs')}: {stats.events.substitutions}
            </span>
          </div>
          <div className="mx-auto mt-2 w-full max-w-lg space-y-0.5 text-center text-[11px] text-muted">
            <p>
              {stats.dataSourceLabel
                ? `${t('stats.officialSource')}: ${stats.dataSourceLabel} · ${stats.xgEstimateNote}`
                : stats.xgEstimateNote}
            </p>
            {stats.updatedAt && (
              <p>
                {t('common.lastUpdated')}: {new Date(stats.updatedAt).toLocaleString('vi-VN')}
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
