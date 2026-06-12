import type { HttpMethod } from '../../lib/apiDocsContent';

const STYLES: Record<HttpMethod, string> = {
  GET: 'bg-green/15 text-green border-green/30',
  POST: 'bg-cyan/15 text-cyan border-cyan/30',
  DELETE: 'bg-danger/15 text-danger border-danger/30',
  PATCH: 'bg-yellow/15 text-yellow border-yellow/30',
};

export function MethodBadge({ method }: { method: HttpMethod }) {
  return (
    <span
      className={`inline-flex min-w-[3.25rem] justify-center rounded-md border px-2 py-0.5 font-mono text-xs font-semibold tracking-wide ${STYLES[method]}`}
    >
      {method}
    </span>
  );
}
