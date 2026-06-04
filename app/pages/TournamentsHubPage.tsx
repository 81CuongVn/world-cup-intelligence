import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type HistoricalTournament } from '../lib/api';
import { useI18n } from '../lib/i18n/I18nContext';

export function TournamentsHubPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<HistoricalTournament[]>([]);

  useEffect(() => {
    api.historicalTournaments().then((r) => setItems(r.data as HistoricalTournament[])).catch(() => setItems([]));
  }, []);

  const sorted = [...items].sort((a, b) => b.year - a.year);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="font-heading text-3xl text-foreground">{t('tournaments.hubTitle')}</h1>
        <p className="mt-2 text-muted">{t('tournaments.subtitle')}</p>
      </header>
      <ul className="space-y-3">
        {sorted.map((row) => {
          const hosts = row.host_countries_json
            ? (JSON.parse(row.host_countries_json) as string[]).join(', ')
            : '—';
          return (
            <li key={row.id}>
              <Link
                to={row.year === 2026 ? '/' : `/tournaments`}
                className="panel block hover:border-cyan/40"
              >
                <span className="font-heading text-xl">{row.name}</span>
                <span className="mt-1 block text-sm text-muted">
                  {hosts} · {row.teams_count ?? '—'} {t('tournaments.teams')} · {row.status}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
