import { SectionLabel } from '../tactical/SectionLabel';
import { useI18n } from '../../lib/i18n/I18nContext';
import { DataKindBadge, DataKindMark } from '../ui/DataKindBadge';

type Insight = {
  variable: string;
  impact: string;
  direction: string;
  explanation: string;
};

type Analysis = {
  executiveSummary: string;
  variableInsights: Insight[];
  tacticalRecommendations: string[];
  riskFactors: string[];
  confidence: number;
  modelsUsed?: string[];
};

type Props = {
  analysis: Analysis | null;
  loading?: boolean;
};

const impactColor: Record<string, string> = {
  high: 'text-magenta',
  medium: 'text-cyan',
  low: 'text-muted',
};

export function MultiVariablePanel({ analysis, loading }: Props) {
  const { t } = useI18n();

  if (loading) {
    return <div className="panel-dense text-sm text-muted">{t('multiVar.loading')}</div>;
  }
  if (!analysis) {
    return null;
  }

  return (
    <section className="panel-dense space-y-4 border-magenta/15">
      <div className="flex items-center justify-between">
        <SectionLabel title={t('multiVar.title')} subtitle={t('multiVar.subtitle')} accent="magenta" dataKind="predicted" />
        <span className="font-mono-data text-xs text-cyan">
          <DataKindMark kind="predicted" /> {(analysis.confidence * 100).toFixed(0)}%
        </span>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90">{analysis.executiveSummary}</p>
      <ul className="space-y-2">
        {analysis.variableInsights.slice(0, 5).map((ins, i) => (
          <li key={i} className="rounded-lg border border-border/50 bg-panel2/30 px-3 py-2 text-xs">
            <span className={`font-semibold uppercase ${impactColor[ins.impact] ?? 'text-muted'}`}>
              {ins.variable}
            </span>
            <p className="mt-1 text-muted">{ins.explanation}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
