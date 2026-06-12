import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, type MatchLineupsPayload } from '../lib/api';
import { useI18n } from '../lib/i18n/I18nContext';
import { formatMatchVersus } from '../lib/matchTeams';
import { matchVersusSeparator } from '../lib/i18n/stageLabels';
import { resolveMatchHref } from '../lib/matchPaths';
import { useLegacyMatchRedirect } from '../lib/useLegacyMatchRedirect';
import { lineupPagePath } from '@/utils/matchSlug';
import { MatchLineupSidePanel } from '../components/match/MatchLineupSidePanel';

export function LineupPage() {
  const { matchId } = useParams();
  const { t, mode } = useI18n();
  const [data, setData] = useState<MatchLineupsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!matchId) return;
    setLoading(true);
    setError(false);
    api
      .matchLineups(matchId)
      .then((r) => setData(r.data))
      .catch(() => {
        setData(null);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [matchId]);

  useLegacyMatchRedirect(matchId, data?.slug, lineupPagePath);

  const versusLabel =
    data &&
    formatMatchVersus(
      data.home.teamId,
      data.away.teamId,
      data.home.teamName,
      data.away.teamName,
      matchVersusSeparator(mode),
    );

  return (
    <div className="panel space-y-4">
      <div>
        <h1 className="text-xl font-bold">{t('lineups.title')}</h1>
        <p className="font-mono-data text-xs text-muted">
          {versusLabel || (loading ? t('lineups.loading') : matchId)}
        </p>
        <p className="mt-1 text-xs text-muted">{t('lineups.detailHint')}</p>
      </div>

      {loading && <p className="text-sm text-muted">{t('lineups.loading')}</p>}
      {error && <p className="text-sm text-magenta">{t('lineups.apiError')}</p>}

      {data && (
        <div className="grid gap-4 lg:grid-cols-2">
          <MatchLineupSidePanel side={data.home} label={t('common.home')} />
          <MatchLineupSidePanel side={data.away} label={t('common.away')} />
        </div>
      )}

      {(matchId || data) && (
        <Link
          to={resolveMatchHref({ id: data?.matchId ?? matchId!, slug: data?.slug ?? matchId })}
          className="inline-block text-pressing"
        >
          {t('lineups.back')}
        </Link>
      )}
    </div>
  );
}
