import { Link } from 'react-router-dom';
import { Bilingual } from '../i18n/Bilingual';
import { useI18n } from '../../lib/i18n/I18nContext';

export type HistoryMatch = {
  id: string;
  kickoff_utc: string;
  stage: string | null;
  home_name: string;
  away_name: string;
  home_short?: string | null;
  away_short?: string | null;
  home_score: number;
  away_score: number;
  tournament_year?: number;
};

export type H2HSummary = {
  totalMatches: number;
  homeTeamWins: number;
  awayTeamWins: number;
  draws: number;
  avgGoalsHome: number;
  avgGoalsAway: number;
  recentFormHome: string;
  recentFormAway: string;
};

type Props = {
  homeName: string;
  awayName: string;
  history: HistoryMatch[];
  summary: H2HSummary;
};

export function MatchHistoryPanel({ homeName, awayName, history, summary }: Props) {
  const { mode, t } = useI18n();

  return (
    <section className="panel space-y-4">
      <Bilingual k="match.history" as="h3" className="text-sm font-semibold uppercase tracking-wider text-pressing" />

      {history.length === 0 ? (
        <Bilingual k="match.historyEmpty" as="p" className="text-sm" />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-panel2/60 p-3 text-center text-xs">
            <div>
              <p className="font-bold text-defending">{summary.homeTeamWins}</p>
              <p className="text-muted">{homeName}</p>
            </div>
            <div>
              <p className="font-bold text-muted">{summary.draws}</p>
              <p className="text-muted">{t('common.draws')}</p>
            </div>
            <div>
              <p className="font-bold text-shooting">{summary.awayTeamWins}</p>
              <p className="text-muted">{awayName}</p>
            </div>
          </div>

          <div className="flex justify-between text-xs text-muted">
            <span>
              {t('common.form')}: {summary.recentFormHome}
            </span>
            <span>{summary.recentFormAway}</span>
          </div>

          <ul className="max-h-64 space-y-2 overflow-y-auto">
            {history.map((m) => (
              <li key={m.id}>
                <Link
                  to={`/matches/${m.id}`}
                  className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2 text-sm transition hover:border-pressing/40 hover:bg-panel2/50"
                >
                  <div>
                    <span className="font-medium">
                      {m.home_short ?? m.home_name} {m.home_score}–{m.away_score}{' '}
                      {m.away_short ?? m.away_name}
                    </span>
                    <p className="text-xs text-muted">
                      {m.stage ?? t('history.matchStage')}
                      {m.tournament_year ? ` · ${m.tournament_year}` : ''} ·{' '}
                      {new Date(m.kickoff_utc).toLocaleDateString(mode === 'en' ? 'en' : 'vi-VN')}
                    </p>
                  </div>
                  <span className="text-pressing">→</span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="text-xs text-muted">
            {t('history.avgGoals')
              .replace('{home}', summary.avgGoalsHome.toFixed(1))
              .replace('{away}', summary.avgGoalsAway.toFixed(1))
              .replace('{n}', String(summary.totalMatches))}
          </p>
        </>
      )}
    </section>
  );
}
