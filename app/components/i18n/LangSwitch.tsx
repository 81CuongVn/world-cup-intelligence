import { useI18n, type DisplayMode } from '../../lib/i18n/I18nContext';

const MODES: { id: DisplayMode; label: string }[] = [
  { id: 'vi', label: 'VI' },
  { id: 'en', label: 'EN' },
];

export function LangSwitch() {
  const { mode, setMode, t } = useI18n();

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg border border-border/80 bg-panel2/80 p-0.5"
      role="group"
      aria-label={t('lang.label')}
    >
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => setMode(m.id)}
          className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
            mode === m.id
              ? 'bg-pressing/20 text-pressing shadow-sm'
              : 'text-muted hover:text-foreground'
          }`}
          title={m.id === 'vi' ? 'Tiếng Việt' : 'English'}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
