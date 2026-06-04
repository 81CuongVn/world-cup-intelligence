import { useCallback, useEffect, useState } from 'react';
import { api, type ProbabilityData, type ScheduleMatch } from '../lib/api';
import { MatchScheduleCalendar } from '../components/home/MatchScheduleCalendar';
import { FeaturedMatchHero } from '../components/home/FeaturedMatchHero';
import { Bilingual } from '../components/i18n/Bilingual';

const REFRESH_MS = 30_000;
const WC2026_TOTAL = 104;

export function MatchesPage() {
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

      {loading ? (
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
      )}
    </div>
  );
}
