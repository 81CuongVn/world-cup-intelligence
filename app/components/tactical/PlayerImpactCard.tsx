import { xg } from '../../lib/format';
import { SectionLabel } from './SectionLabel';
import { useI18n } from '../../lib/i18n/I18nContext';

export type PlayerImpact = {
  id: string;
  name: string;
  role: string;
  team: 'home' | 'away';
  xg?: number;
  impact: number;
  tag?: string;
};

type Props = {
  players: PlayerImpact[];
};

const teamBorder = {
  home: 'border-cyan/30',
  away: 'border-magenta/30',
};

export function PlayerImpactCard({ players }: Props) {
  const { t } = useI18n();
  if (!players.length) return null;

  return (
    <div className="panel-dense">
      <SectionLabel title={t('player.title')} subtitle={t('player.subtitle')} accent="cyan" />
      <ul className="space-y-2">
        {players.map((p) => (
          <li
            key={p.id}
            className={`flex items-center gap-3 rounded-lg border bg-panel2/40 px-3 py-2 ${teamBorder[p.team]}`}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background2 font-display text-lg text-foreground"
              aria-hidden
            >
              {p.name.slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-sm text-foreground">{p.name}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted">{p.role}</p>
            </div>
            <div className="text-right">
              {p.xg != null && (
                <p className="font-mono-data text-xs text-cyan">xG {xg(p.xg)}</p>
              )}
              <p className="font-mono-data text-sm text-lime">{(p.impact * 100).toFixed(0)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
