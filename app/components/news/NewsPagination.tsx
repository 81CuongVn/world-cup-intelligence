import { useI18n } from '../../lib/i18n/I18nContext';

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
};

export function NewsPagination({ page, totalPages, onPageChange, loading }: Props) {
  const { t } = useI18n();

  if (totalPages <= 1) return null;

  const pageLabel = t('common.pageOf')
    .replace('{page}', String(page))
    .replace('{total}', String(totalPages));

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4"
      aria-label={t('news.pagination')}
    >
      <button
        type="button"
        disabled={page <= 1 || loading}
        onClick={() => onPageChange(page - 1)}
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition enabled:hover:border-pressing enabled:hover:text-pressing disabled:opacity-40"
      >
        ← {t('common.prev')}
      </button>
      <span className="text-sm text-muted">{pageLabel}</span>
      <button
        type="button"
        disabled={page >= totalPages || loading}
        onClick={() => onPageChange(page + 1)}
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition enabled:hover:border-pressing enabled:hover:text-pressing disabled:opacity-40"
      >
        {t('common.next')} →
      </button>
    </nav>
  );
}
