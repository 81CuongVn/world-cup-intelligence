import type { ProbabilityData, ProbabilityHint } from '../../lib/api';
import { useI18n } from '../../lib/i18n/I18nContext';
import { pct, xg } from '../../lib/format';
import { SectionLabel } from '../tactical/SectionLabel';
import { PredictedActualScores } from './PredictedActualScores';
import { DataKindLegend, DataKindMark } from '../ui/DataKindBadge';

type Props = {
  prob: ProbabilityData | null;
  homeLabel: string;
  awayLabel: string;
  hints?: ProbabilityHint[];
  homeScore?: number;
  awayScore?: number;
  status?: string;
};

export function MatchPredictionSummary({
  prob,
  homeLabel,
  awayLabel,
  hints = [],
  homeScore,
  awayScore,
  status,
}: Props) {
  const { t, mode } = useI18n();

  if (!prob) {
    return (
      <section className="panel-dense border-dashed border-border/60">
        <SectionLabel title={t('prediction.summaryTitle')} subtitle={t('prediction.loading')} />
      </section>
    );
  }

  const topScores =
    prob.topScorelines ??
    (prob.scorelineDistribution
      ? Object.entries(prob.scorelineDistribution)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([score, p]) => ({ score, prob: p }))
      : []);

  const drivers = prob.drivers ?? hints.slice(0, 3).map((h) => (mode === 'en' ? h.en : h.vi));

  return (
    <section className="panel-dense border-cyan/15">
      <SectionLabel
        title={t('prediction.summaryTitle')}
        subtitle={t('prediction.summarySubtitle')}
        accent="cyan"
        dataKind="predicted"
      />
      <DataKindLegend className="mb-3" />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border/50 bg-panel2/30 p-3">
          <PredictedActualScores
            predicted={prob.mostLikelyScore}
            homeScore={homeScore}
            awayScore={awayScore}
            status={status}
          />
          {topScores.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-muted">
              {topScores.map((s) => (
                <li key={s.score} className="flex justify-between font-mono-data">
                  <span>
                    <DataKindMark />
                    {s.score}
                  </span>
                  <span>
                    <DataKindMark />
                    {pct(s.prob)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-2 rounded-lg border border-border/50 bg-panel2/30 p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">{t('prediction.homeWin')}</span>
            <span className="font-mono-data text-cyan">
              <DataKindMark />
              {pct(prob.homeWinProb)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">{t('prediction.draw')}</span>
            <span className="font-mono-data">
              <DataKindMark />
              {pct(prob.drawProb)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">{t('prediction.awayWin')}</span>
            <span className="font-mono-data text-magenta">
              <DataKindMark />
              {pct(prob.awayWinProb)}
            </span>
          </div>
          <div className="border-t border-border/40 pt-2 text-xs text-muted">
            <DataKindMark />
            xG {homeLabel}: {xg(prob.expectedHomeGoals)} · {awayLabel}: {xg(prob.expectedAwayGoals)}
          </div>
          <p className="text-[11px] text-muted">{t('prediction.xgNote')}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
        {prob.confidence != null && (
          <span>
            {t('prediction.modelConfidence')}:{' '}
            <strong className="text-cyan">
              <DataKindMark />
              {pct(prob.confidence)}
            </strong>
          </span>
        )}
        {prob.modelVersion && (
          <span>
            {t('prediction.modelVersion')}: {prob.modelVersion}
          </span>
        )}
        {prob.updatedAt && (
          <span>
            {t('common.lastUpdated')}: {new Date(prob.updatedAt).toLocaleString('vi-VN')}
          </span>
        )}
      </div>
      {drivers.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-muted">{t('prediction.drivers')}</p>
          <ul className="mt-1 list-inside list-disc text-sm text-foreground/90">
            {drivers.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
