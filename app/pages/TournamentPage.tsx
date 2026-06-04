import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Bilingual } from '../components/i18n/Bilingual';
import { useI18n } from '../lib/i18n/I18nContext';

type Tournament = { id: string; year: number; name: string };

export function TournamentPage() {
  const { t } = useI18n();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    api.tournaments().then((r) => setTournaments(r.data as Tournament[]));
  }, []);

  const linkFor = (row: Tournament) => {
    if (row.id === 't-2026' || row.year === 2026) return '/';
    if (row.year === 2022) return '/matches/m-final-2022';
    return '/';
  };

  return (
    <div className="space-y-4">
      <Bilingual k="tournaments.title" as="h1" className="text-2xl font-bold tracking-tight" />
      <div className="grid gap-3 md:grid-cols-2">
        {tournaments.map((row) => (
          <div key={row.id} className="panel">
            <h2 className="font-semibold">{row.name}</h2>
            <p className="text-sm text-muted">{row.year}</p>
            <Link to={linkFor(row)} className="mt-3 inline-block text-sm font-medium text-pressing hover:underline">
              {row.year === 2026 ? t('tournaments.viewSchedule') : t('tournaments.viewFinal')}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
