import type { PitchEvent } from './EventTrajectoryLayer';
import { EventTrajectoryLayer } from './EventTrajectoryLayer';
import { SectionLabel } from './SectionLabel';
import { useI18n } from '../../lib/i18n/I18nContext';

type Props = {
  events: PitchEvent[];
  homeLabel?: string;
  awayLabel?: string;
};

export function PitchMap({ events, homeLabel, awayLabel }: Props) {
  const { t } = useI18n();
  const home = homeLabel ?? t('pitch.home');
  const away = awayLabel ?? t('pitch.away');

  return (
    <div className="panel hero-glow overflow-hidden">
      <SectionLabel title={t('pitch.title')} subtitle={t('pitch.subtitle')} accent="lime" />
      <div className="relative">
        <div className="pointer-events-none absolute left-2 top-2 font-display text-[10px] tracking-widest text-cyan/50">
          {home}
        </div>
        <div className="pointer-events-none absolute right-2 top-2 font-display text-[10px] tracking-widest text-magenta/50">
          {away}
        </div>
        <svg viewBox="0 0 100 65" className="w-full rounded-card bg-pitch" aria-label={t('pitch.title')}>
          <rect x="1" y="1" width="98" height="63" fill="#0B1118" rx="1" />
          <rect x="2" y="2" width="96" height="61" fill="none" stroke="#253244" strokeWidth="0.4" />
          <line x1="50" y1="2" x2="50" y2="63" stroke="#253244" strokeWidth="0.35" />
          <circle cx="50" cy="32.5" r="9" fill="none" stroke="#253244" strokeWidth="0.35" />
          <rect x="2" y="22" width="12" height="21" fill="none" stroke="#253244" strokeWidth="0.3" />
          <rect x="86" y="22" width="12" height="21" fill="none" stroke="#253244" strokeWidth="0.3" />
          <EventTrajectoryLayer events={events} />
        </svg>
      </div>
    </div>
  );
}
