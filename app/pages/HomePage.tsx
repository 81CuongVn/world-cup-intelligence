import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type DashboardData, type ScheduleMatch } from '../lib/api';
import { MatchScheduleCalendar } from '../components/home/MatchScheduleCalendar';
import { FeaturedMatchHero } from '../components/home/FeaturedMatchHero';
import { WorldCupCountdown } from '../components/home/WorldCupCountdown';
import { PlatformSnapshot } from '../components/home/PlatformSnapshot';
import { NewUserQuickStart } from '../components/home/NewUserQuickStart';
import { HomeNewsPreview } from '../components/home/HomeNewsPreview';
import { Bilingual } from '../components/i18n/Bilingual';
import { useI18n } from '../lib/i18n/I18nContext';

const REFRESH_MS = 30_000;
const WC2026_TOTAL = 104;
const WC2026_START = '2026-06-11T14:00:00Z';

export function HomePage() {
  const { t } = useI18n();
  const [schedule, setSchedule] = useState<Record<string, ScheduleMatch[]>>({});
  const [matches, setMatches] = useState<ScheduleMatch[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [s, d] = await Promise.all([api.schedule(), api.dashboard()]);
      setSchedule(s.data.byDate);
      setMatches(s.data.matches);
      setDashboard(d.data);
    } catch {
      setSchedule({});
      setMatches([]);
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  const tournamentStart = dashboard?.tournamentStartUtc ?? WC2026_START;
  const featured = dashboard?.featuredMatch ?? null;

  return (
    <div className="space-y-8">
      <header>
        <Bilingual
          k="home.calendarTitle"
          as="h1"
          className="font-heading text-4xl tracking-tight md:text-5xl"
        />
        <Bilingual k="home.calendarSubtitle" as="p" className="mt-3 max-w-2xl text-base text-foreground/80" />
        <p className="mt-2 text-sm text-muted-dim">
          {t('home.newUserHint')}{' '}
          <Link to="/guide" className="text-cyan hover:underline">
            {t('home.newUserHintLink')}
          </Link>{' '}
          {t('home.newUserHintTail')}
        </p>
      </header>

      {loading ? (
        <div className="panel text-muted">
          <Bilingual k="home.calendarLoading" />
        </div>
      ) : (
        <>
          <PlatformSnapshot dashboard={dashboard} />
          <NewUserQuickStart />
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
            <WorldCupCountdown targetUtc={tournamentStart} />
            {featured ? (
              <FeaturedMatchHero match={featured} />
            ) : (
              <div className="panel flex min-h-[200px] items-center justify-center text-muted">
                <Bilingual k="home.noFeatured" />
              </div>
            )}
          </div>
          <HomeNewsPreview />
          <MatchScheduleCalendar
            byDate={schedule}
            matches={matches}
            totalExpected={WC2026_TOTAL}
          />
        </>
      )}
    </div>
  );
}
