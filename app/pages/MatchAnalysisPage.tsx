import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  api,
  type MatchSummary,
  type ProbabilityData,
  type TeamSystemPayload,
  type ScenariosPayload,
  type MarketSignalsPayload,
  type MatchPreviewAnalysis,
} from '../lib/api';
import { TeamSystemPanel } from '../components/team/TeamSystemPanel';
import { ScenarioLikelihoodPanel } from '../components/scenarios/ScenarioLikelihoodPanel';
import { MarketSignalPanel } from '../components/market/MarketSignalPanel';
import { MatchPreviewAnalysisPanel } from '../components/match/MatchPreviewAnalysisPanel';
import { ProbabilityStrip } from '../components/tactical/ProbabilityStrip';
import { TacticalBriefingPanel } from '../components/tactical/TacticalBriefingPanel';
import { pct } from '../lib/format';
import { useI18n } from '../lib/i18n/I18nContext';

export function MatchAnalysisPage() {
  const { matchId } = useParams();
  const { t } = useI18n();
  const [match, setMatch] = useState<MatchSummary | null>(null);
  const [prob, setProb] = useState<ProbabilityData | null>(null);
  const [preview, setPreview] = useState<MatchPreviewAnalysis | null>(null);
  const [teamSystem, setTeamSystem] = useState<TeamSystemPayload | null>(null);
  const [scenarios, setScenarios] = useState<ScenariosPayload | null>(null);
  const [market, setMarket] = useState<MarketSignalsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;
    setLoading(true);
    Promise.all([
      api.match(matchId).then((r) => setMatch(r.data)),
      api.matchProbability(matchId).then((r) => setProb(r.data)).catch(() => setProb(null)),
      api.matchPreview(matchId).then((r) => setPreview(r.data)).catch(() => setPreview(null)),
      api.matchTeamSystem(matchId).then((r) => setTeamSystem(r.data)).catch(() => setTeamSystem(null)),
      api.matchScenarios(matchId).then((r) => setScenarios(r.data)).catch(() => setScenarios(null)),
      api.matchMarketSignals(matchId).then((r) => setMarket(r.data)).catch(() => setMarket(null)),
    ]).finally(() => setLoading(false));
  }, [matchId]);

  if (!match && !loading) {
    return (
      <div className="panel text-center text-muted">
        {t('matchAnalysis.notFound')}{' '}
        <Link to="/" className="text-cyan hover:underline">
          {t('matchAnalysis.notFoundBack')}
        </Link>
      </div>
    );
  }

  const title = match ? `${match.home_team_id} vs ${match.away_team_id}` : t('matchAnalysis.title');

  const scorelineLine =
    prob &&
    t('matchAnalysis.scoreline')
      .replace('{score}', prob.mostLikelyScore ?? '—')
      .replace('{h}', t('common.abbrHome'))
      .replace('{hp}', pct(prob.homeWinProb))
      .replace('{d}', t('common.abbrDraw'))
      .replace('{dp}', pct(prob.drawProb))
      .replace('{a}', t('common.abbrAway'))
      .replace('{ap}', pct(prob.awayWinProb));

  return (
    <article className="mx-auto max-w-[860px] space-y-8 pb-12">
      <header className="space-y-2">
        <Link to={`/matches/${matchId}`} className="text-sm text-muted hover:text-cyan">
          ← {t('matchAnalysis.back')}
        </Link>
        <h1 className="font-heading text-3xl tracking-tight text-foreground">{title}</h1>
        <p className="text-lg leading-relaxed text-muted">{t('matchAnalysis.articleSubtitle')}</p>
      </header>

      {prob && (
        <section className="space-y-2">
          <h2 className="label-tactical text-cyan">{t('matchAnalysis.modelProb')}</h2>
          <ProbabilityStrip
            homeWin={prob.homeWinProb}
            draw={prob.drawProb}
            awayWin={prob.awayWinProb}
            xgHome={prob.expectedHomeGoals}
            xgAway={prob.expectedAwayGoals}
            confidence={prob.confidence}
          />
          {scorelineLine && <p className="text-base leading-relaxed text-foreground/90">{scorelineLine}</p>}
        </section>
      )}

      <TeamSystemPanel home={teamSystem?.home ?? null} away={teamSystem?.away ?? null} loading={loading} />
      <MatchPreviewAnalysisPanel preview={preview} loading={loading} />
      <ScenarioLikelihoodPanel data={scenarios} loading={loading} />
      <MarketSignalPanel payload={market} loading={loading} />
      <TacticalBriefingPanel briefing={null} />
    </article>
  );
}
