import { DataKindBadge, type DataKind } from '../ui/DataKindBadge';

type Props = {
  title: string;
  subtitle?: string;
  accent?: 'cyan' | 'magenta' | 'yellow' | 'green' | 'lime' | 'purple';
  dataKind?: DataKind;
  className?: string;
};

const accentClass = {
  cyan: 'text-cyan',
  magenta: 'text-magenta',
  yellow: 'text-yellow',
  green: 'text-green',
  lime: 'text-yellow',
  purple: 'text-magenta',
};

export function SectionLabel({ title, subtitle, accent = 'cyan', dataKind, className = '' }: Props) {
  return (
    <div className={`mb-3 ${className}`.trim()}>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className={`label-tactical ${accentClass[accent]}`}>{title}</h3>
        {dataKind && <DataKindBadge kind={dataKind} compact />}
      </div>
      {subtitle && <p className="mt-1 text-sm leading-relaxed text-foreground/80">{subtitle}</p>}
    </div>
  );
}
