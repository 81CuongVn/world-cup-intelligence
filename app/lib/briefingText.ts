import type { DisplayMode } from './i18n/I18nContext';

export type LocalizedString = string | { vi: string; en: string };

export function normalizeLocalized(value: LocalizedString, fallbackEn?: string): { vi: string; en: string } {
  if (typeof value === 'string') {
    return { vi: value, en: fallbackEn ?? value };
  }
  return { vi: value.vi, en: value.en };
}

export function pickLocalized(
  value: LocalizedString,
  mode: DisplayMode,
  fallbackEn?: string,
): string {
  const { vi, en } = normalizeLocalized(value, fallbackEn);
  if (mode === 'en') return en;
  return vi;
}
