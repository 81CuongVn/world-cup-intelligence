import { useCallback, useEffect, useState } from 'react';
import { api, type ProbabilityData, type ScheduleMatch } from '../lib/api';
import { MatchScheduleCalendar } from '../components/home/MatchScheduleCalendar';
import { FeaturedMatchHero } from '../components/home/FeaturedMatchHero';
import { BracketPanel, GroupStandingsGrid } from '../components/tournament/TournamentPanels';
import { Bilingual } from '../components/i18n/Bilingual';
import { useI18n } from '../lib/i18n/I18nContext';

const REFRESH_MS = 30_000;
const WC2026_TOTAL = 104;

type Tab = 'schedule' | 'standings' | 'bracket';

export function MatchesPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>('schedule');
  const [schedule, setSchedule] = useState<Record<string, ScheduleMatch[]>>({});
  const [matches, setMatches] = useState<ScheduleMatch[]>([]);
  const [featured, setFeatured] = useState<
    (ScheduleMatch & { probability?: ProbabilityData | null }) | null
  >(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [s, d] = await Promise.all([api.schedule(), api.dashboard()]);
      setSchedule(s.data.byDate);
      setMatches(s.data.matches);
      setFeatured(d.data.featuredMatch ?? null);
    } catch {
      setSchedule({});
      setMatches([]);
      setFeatured(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'schedule', label: t('matches.tabSchedule') },
    { id: 'standings', label: t('matches.tabStandings') },
    { id: 'bracket', label: t('matches.tabBracket') },
  ];

  return (
    <div className="space-y-8">
      <header>
        <Bilingual
          k="matches.pageTitle"
          as="h1"
          className="font-heading text-4xl tracking-tight md:text-5xl"
        />
        <Bilingual
          k="matches.pageSubtitle"
          as="p"
          className="mt-3 max-w-2xl text-base text-foreground/80"
        />
      </header>

      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              tab === item.id
                ? 'border-pressing bg-pressing/15 text-pressing'
                : 'border-border text-muted hover:border-pressing/40'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'standings' && (
        <div className="panel">
          <GroupStandingsGrid />
        </div>
      )}

      {tab === 'bracket' && (
        <div className="panel">
          <BracketPanel />
        </div>
      )}

      {tab === 'schedule' &&
        (loading ? (
          <div className="panel text-muted">
            <Bilingual k="matches.loading" />
          </div>
        ) : (
          <>
            {featured ? (
              <FeaturedMatchHero match={featured} />
            ) : (
              <div className="panel flex min-h-[160px] items-center justify-center text-muted">
                <Bilingual k="home.noFeatured" />
              </div>
            )}

            <MatchScheduleCalendar
              byDate={schedule}
              matches={matches}
              totalExpected={WC2026_TOTAL}
            />
          </>
        ))}
    </div>
  );
}
