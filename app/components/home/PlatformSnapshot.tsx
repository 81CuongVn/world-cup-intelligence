import type { DashboardData } from '../../lib/api';
import { useI18n } from '../../lib/i18n/I18nContext';

type Props = {
  dashboard: DashboardData | null;
};

export function PlatformSnapshot({ dashboard }: Props) {
  const { mode, t } = useI18n();
  const locale = mode === 'en' ? 'en' : 'vi-VN';

  if (!dashboard) return null;

  const scheduled = dashboard.statusCounts?.scheduled ?? 0;
  const live = dashboard.statusCounts?.live ?? 0;
  const done =
    (dashboard.statusCounts?.completed ?? 0) + (dashboard.statusCounts?.finished ?? 0);
  const hosts = dashboard.hostCountries?.join(mode === 'en' ? ', ' : ' · ') ?? '—';

  const stats = [
    {
      label: t('home.matches'),
      value: `${dashboard.matchCount}/${dashboard.expectedMatches ?? 104}`,
    },
    { label: t('home.groups'), value: String(dashboard.groupCount ?? 12) },
    { label: t('home.teams'), value: String(dashboard.teamsCount ?? 48) },
    { label: t('home.scheduled'), value: String(scheduled) },
    { label: t('common.liveLabel'), value: String(live) },
    { label: t('home.played'), value: String(done) },
  ];

  return (
    <section className="panel-dense grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto] lg:items-center">
      <div>
        <p className="label-tactical text-cyan">{t('home.snapshot')}</p>
        <p className="mt-1 text-sm text-muted">
          {t('home.cohosts')}
          <span className="text-foreground">{hosts}</span>
        </p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {stats.map((s) => (
          <li
            key={s.label}
            className="rounded-lg border border-border/60 bg-panel2/50 px-3 py-2 text-center"
          >
            <p className="font-mono-data text-xl font-semibold text-foreground">{s.value}</p>
            <p className="text-sm font-medium text-foreground/75">{s.label}</p>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-dim sm:col-span-2">
        {dashboard.lastDataRefresh
          ? `${t('common.data')}: ${new Date(dashboard.lastDataRefresh).toLocaleString(locale)}`
          : ''}
        {dashboard.lastNewsCrawl
          ? ` · ${t('common.news')}: ${new Date(dashboard.lastNewsCrawl).toLocaleString(locale)}`
          : ''}
      </p>
    </section>
  );
}
