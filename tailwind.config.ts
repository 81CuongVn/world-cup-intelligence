import type { Config } from 'tailwindcss';
import { brandTheme } from './app/lib/brand/brandTheme';

const c = brandTheme.colors;

export default {
  content: ['./app/**/*.{tsx,ts,html}', './index.html'],
  theme: {
    extend: {
      colors: {
        background: c.background,
        background2: c.backgroundSoft,
        panel: c.panel,
        panel2: c.panelElevated,
        border: c.border,
        foreground: c.textPrimary,
        muted: c.textSecondary,
        'muted-dim': c.textMuted,
        cyan: c.cyan,
        magenta: c.magenta,
        green: c.green,
        yellow: c.yellow,
        slate: c.slate,
        danger: c.danger,
        lime: c.yellow,
        amber: c.yellow,
        purple: c.magenta,
        pitch: c.backgroundSoft,
        pitchLine: c.border,
        passing: c.danger,
        dribbling: c.yellow,
        receiving: c.magenta,
        defending: c.green,
        shooting: c.magenta,
        fouling: c.cyan,
        pressing: c.cyan,
        carrying: '#f97316',
        live: c.cyan,
      },
      fontFamily: {
        sans: brandTheme.fonts.body,
        heading: brandTheme.fonts.heading,
        display: brandTheme.fonts.heading,
        mono: brandTheme.fonts.mono,
      },
      borderRadius: {
        card: brandTheme.radius.card,
        panel: brandTheme.radius.panel,
      },
      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.5' }],
        sm: ['0.9375rem', { lineHeight: '1.55' }],
        base: ['1rem', { lineHeight: '1.65' }],
        lg: ['1.125rem', { lineHeight: '1.55' }],
        xl: ['1.25rem', { lineHeight: '1.45' }],
        editorial: ['1.125rem', { lineHeight: '1.75' }],
      },
      maxWidth: {
        editorial: '860px',
        'editorial-narrow': '720px',
      },
      boxShadow: {
        tactical: '0 0 40px rgb(0 229 255 / 0.06), inset 0 1px 0 rgb(255 255 255 / 0.04)',
        'glow-cyan': '0 0 24px rgb(0 229 255 / 0.2)',
        'glow-magenta': '0 0 20px rgb(255 45 142 / 0.15)',
        elevated: '0 12px 40px rgb(0 0 0 / 0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config;
