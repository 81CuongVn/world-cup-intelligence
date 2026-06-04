import { useI18n, type DisplayMode } from '../../lib/i18n/I18nContext';
import type { LocaleKey } from '../../lib/i18n/locales';

type BaseProps = {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'div';
  className?: string;
};

type Props =
  | (BaseProps & { k: LocaleKey; vi?: never; en?: never })
  | (BaseProps & { vi: string; en: string; k?: never });

/** Renders UI copy in the active language (VI or EN only). */
export function Bilingual(props: Props) {
  const { as: Tag = 'span', className } = props;
  const { mode, pair, t } = useI18n();
  if ('k' in props && props.k) {
    return <Tag className={className}>{t(props.k)}</Tag>;
  }
  return <BilingualText mode={mode} vi={props.vi!} en={props.en!} as={Tag} className={className} />;
}

export function BilingualText({
  vi,
  en,
  mode,
  as: Tag = 'span',
  className = '',
}: {
  vi: string;
  en: string;
  mode: DisplayMode;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'div';
  className?: string;
}) {
  return <Tag className={className}>{mode === 'en' ? en : vi}</Tag>;
}

export function BiHint({ vi, en }: { vi: string; en: string }) {
  const { mode } = useI18n();
  return (
    <li className="rounded-lg border border-border/50 bg-panel2/40 px-3 py-2 text-sm">
      <BilingualText mode={mode} vi={vi} en={en} as="div" />
    </li>
  );
}
