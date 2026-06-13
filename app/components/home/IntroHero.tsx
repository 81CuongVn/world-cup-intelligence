import { useEffect, useState } from 'react';
import { Bilingual } from '../i18n/Bilingual';
import { useI18n } from '../../lib/i18n/I18nContext';

type WorldCupThumbnail = {
  year: number;
  country: string;
  emoji: string;
  winner: string;
};

const WORLD_CUPS: WorldCupThumbnail[] = [
  { year: 2014, country: 'Brazil', emoji: '🇧🇷', winner: 'Germany' },
  { year: 2018, country: 'Russia', emoji: '🇷🇺', winner: 'France' },
  { year: 2022, country: 'Qatar', emoji: '🇶🇦', winner: 'Argentina' },
];

const UPCOMING_CUPS: WorldCupThumbnail[] = [
  { year: 2026, country: 'USA/Canada/Mexico', emoji: '🇺🇸', winner: 'TBD' },
  { year: 2030, country: 'Uruguay/Argentina/Paraguay', emoji: '🇺🇾', winner: 'TBD' },
];

export function IntroHero() {
  const { t } = useI18n();
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((p) => (p + 1) % 3);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // World Cup background images - rotating through iconic stadium/player photos
  const backgroundImages = [
    'https://i.ytimg.com/vi/U1-DCmhMhzk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBd-qKOGBKADPffyhY1nQG8o_rK_g', // Soccer stadium
    'https://i.ytimg.com/vi/HB1h-xv4_L8/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAN3ZCR2HmIfqh40tHi6kqdIHe8vw', // Players celebration
    'https://static-images.vnncdn.net/files/vps_images_publish/000001/000003/2026/4/1/world-cup-2026-co-gi-dac-biet-to-chuc-khi-nao-va-o-dau-2178.jpg', // Soccer match action
  ];

  const currentBgImage = backgroundImages[animationPhase];
  return (
    <div className="relative overflow-hidden rounded-panel border border-border/50 shadow-lg" style={{
      backgroundImage: `url('${currentBgImage}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      {/* Dark overlay for readability - darker in center, fades to sides */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/60 to-black/40" />
      
      {/* Additional dark overlay for bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />

      {/* Animated accent overlay */}
      <div className="absolute inset-0 opacity-30">
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            animationPhase === 0 ? 'opacity-40' : 'opacity-0'
          }`}
          style={{
            background:
              'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(0, 229, 255, 0.08), transparent)',
          }}
        />
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            animationPhase === 1 ? 'opacity-40' : 'opacity-0'
          }`}
          style={{
            background:
              'radial-gradient(ellipse 80% 100% at 100% 50%, rgba(255, 45, 142, 0.06), transparent)',
          }}
        />
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            animationPhase === 2 ? 'opacity-40' : 'opacity-0'
          }`}
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 0% 50%, rgba(34, 212, 107, 0.05), transparent)',
          }}
        />
      </div>

      {/* Left side thumbnails */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="flex flex-col gap-4 px-6">
          {WORLD_CUPS.slice(0, 3).map((wc, i) => (
            <div
              key={wc.year}
              className="animate-fade-in-left"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <WorldCupCard wc={wc} side="left" />
            </div>
          ))}
        </div>
      </div>

      {/* Right side thumbnails */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="flex flex-col gap-4 px-6">
          {UPCOMING_CUPS.map((wc, i) => (
            <div
              key={wc.year}
              className="animate-fade-in-right"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <WorldCupCard wc={wc} side="right" />
            </div>
          ))}
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-10 px-8 py-16 md:px-12 md:py-20 lg:px-24">
        <div className="mx-auto max-w-2xl text-center">
          {/* Trophy icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative inline-block">
              <div className="absolute inset-0 animate-pulse rounded-full bg-yellow/20 blur-2xl" />
              <div className="relative rounded-full bg-gradient-to-b from-yellow to-yellow/80 p-4 shadow-lg">
                <span className="text-5xl md:text-6xl" role="img" aria-label="World Cup Trophy">
                  🏆
                </span>
              </div>
            </div>
          </div>

          {/* Main heading */}
          <Bilingual
            k="home.calendarTitle"
            as="h1"
            className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl"
          />

          {/* Subtitle */}
          <Bilingual
            k="home.calendarSubtitle"
            as="p"
            className="mt-4 text-base text-foreground/80 md:mt-5 md:text-lg"
          />

          {/* Accent line */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-cyan to-transparent" />
            <span className="text-sm font-semibold uppercase tracking-widest text-cyan">
              {t('common.live')}
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-cyan to-transparent" />
          </div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-cyan/10 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-magenta/10 blur-3xl" />
    </div>
  );
}

interface WorldCupCardProps {
  wc: WorldCupThumbnail;
  side: 'left' | 'right';
}

function WorldCupCard({ wc, side }: WorldCupCardProps) {
  const isUpcoming = wc.year >= 2026;

  return (
    <div
      className={`group relative overflow-hidden rounded-card border border-border/60 bg-panel/80 p-4 shadow-lg backdrop-blur-sm transition-all hover:border-cyan/50 hover:shadow-lg hover:shadow-cyan/20 ${
        side === 'left' ? '-translate-x-2 hover:translate-x-0' : 'translate-x-2 hover:translate-x-0'
      }`}
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 via-transparent to-magenta/10 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative z-10">
        {/* Year and emoji */}
        <div className="mb-2 flex items-center justify-between">
          <span className="font-heading text-2xl font-bold text-foreground">{wc.year}</span>
          <span className="text-3xl" role="img" aria-hidden>
            {wc.emoji}
          </span>
        </div>

        {/* Country */}
        <p className="text-sm font-medium text-foreground/90">{wc.country}</p>

        {/* Winner or status */}
        <p className="mt-2 text-xs text-muted-dim">
          {isUpcoming ? (
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-yellow animate-pulse" />
              Upcoming
            </span>
          ) : (
            <span>Winner: {wc.winner}</span>
          )}
        </p>
      </div>

      {/* Hover glow effect */}
      <div className="absolute -inset-0.5 rounded-card bg-gradient-to-r from-cyan to-magenta opacity-0 blur transition-opacity group-hover:opacity-20" />
    </div>
  );
}
