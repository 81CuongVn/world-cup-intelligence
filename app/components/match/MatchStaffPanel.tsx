import { useEffect, useState } from 'react';
import { api, type MatchStaffPayload } from '../../lib/api';
import { useI18n } from '../../lib/i18n/I18nContext';
import { SectionLabel } from '../tactical/SectionLabel';

type Props = {
  matchId: string;
  homeLabel: string;
  awayLabel: string;
};

function CoachCard({
  label,
  coach,
}: {
  label: string;
  coach: NonNullable<MatchStaffPayload['homeCoach']>;
}) {
  const { t } = useI18n();
  return (
    <div className="rounded-card border border-border/50 bg-panel2/30 p-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 font-medium text-foreground">{coach.name}</p>
      <dl className="mt-2 space-y-1 font-mono-data text-[11px] text-muted">
        {coach.nationality && (
          <div className="flex justify-between gap-2">
            <dt>{t('staff.nationality')}</dt>
            <dd className="text-foreground/85">{coach.nationality}</dd>
          </div>
        )}
        <div className="flex justify-between gap-2">
          <dt>{t('staff.wcApps')}</dt>
          <dd className="text-foreground/85">{coach.wcAppearances}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>{t('staff.tenure')}</dt>
          <dd className="text-foreground/85">{coach.tenureYears.toFixed(1)} {t('staff.years')}</dd>
        </div>
      </dl>
    </div>
  );
}

export function MatchStaffPanel({ matchId, homeLabel, awayLabel }: Props) {
  const { t } = useI18n();
  const [staff, setStaff] = useState<MatchStaffPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .matchStaff(matchId)
      .then((r) => setStaff(r.data))
      .catch(() => setStaff(null))
      .finally(() => setLoading(false));
  }, [matchId]);

  if (loading) {
    return <p className="text-sm text-muted">{t('staff.loading')}</p>;
  }
  if (!staff || (!staff.homeCoach && !staff.awayCoach && staff.officials.length === 0)) {
    return null;
  }

  const assistants = staff.officials.filter((o) => o.role.startsWith('assistant'));
  const others = staff.officials.filter(
    (o) => o.role !== 'referee' && !o.role.startsWith('assistant'),
  );

  return (
    <section className="panel-dense space-y-4 border-border/60">
      <SectionLabel title={t('staff.title')} subtitle={t('staff.subtitle')} accent="cyan" />

      {(staff.homeCoach || staff.awayCoach) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {staff.homeCoach && <CoachCard label={homeLabel} coach={staff.homeCoach} />}
          {staff.awayCoach && <CoachCard label={awayLabel} coach={staff.awayCoach} />}
        </div>
      )}

      {staff.referee && (
        <div className="rounded-card border border-yellow/25 bg-yellow/5 px-3 py-3">
          <p className="label-tactical text-yellow">{t('staff.referee')}</p>
          <p className="mt-1 font-medium">{staff.referee.name}</p>
          <p className="mt-1 font-mono-data text-xs text-muted">
            {staff.referee.nationality}
            {staff.referee.fifaCategory ? ` · ${staff.referee.fifaCategory}` : ''}
            {staff.referee.strictness != null && (
              <span className="ml-2 text-foreground/80">
                · {t('staff.strictness')}{' '}
                {Math.round(staff.referee.strictness * 100)}%
              </span>
            )}
          </p>
          {assistants.length > 0 && (
            <p className="mt-2 text-xs text-muted">
              {t('staff.assistants')}:{' '}
              {assistants.map((a) => `${a.name} (${a.nationality ?? '—'})`).join(' · ')}
            </p>
          )}
          {others.map((o) => (
            <p key={o.role} className="mt-1 text-xs text-muted">
              {t(`staff.role.${o.role}` as 'staff.role.fourth_official')}: {o.name}
            </p>
          ))}
        </div>
      )}

      <p className="text-[11px] text-muted">{t('staff.modelNote')}</p>
    </section>
  );
}
