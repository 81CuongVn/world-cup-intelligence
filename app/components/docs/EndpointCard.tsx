import type { ApiEndpoint } from '../../lib/apiDocsContent';
import { MethodBadge } from './MethodBadge';
import { CodeBlock } from './CodeBlock';

const AUTH_LABELS = {
  none: { text: 'Public', className: 'text-green' },
  optional: { text: 'Key optional', className: 'text-muted' },
  'api-key': { text: 'API key', className: 'text-cyan' },
  admin: { text: 'Admin', className: 'text-magenta' },
} as const;

type Props = {
  endpoint: ApiEndpoint;
  origin: string;
};

function fillOrigin(text: string, origin: string) {
  return text.replaceAll('{origin}', origin);
}

export function EndpointCard({ endpoint, origin }: Props) {
  const auth = AUTH_LABELS[endpoint.auth ?? 'none'];

  return (
    <article className="api-endpoint-card rounded-xl border border-border/60 bg-panel/40 p-5 transition hover:border-cyan/25">
      <div className="flex flex-wrap items-start gap-3">
        <MethodBadge method={endpoint.method} />
        <code className="flex-1 break-all font-mono text-sm text-foreground">{endpoint.path}</code>
        <span className={`text-xs font-medium ${auth.className}`}>{auth.text}</span>
      </div>
      <h4 className="mt-3 font-heading text-lg text-foreground">{endpoint.title}</h4>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{endpoint.description}</p>

      {endpoint.params?.length ? (
        <div className="mt-4 overflow-x-auto rounded-lg border border-border/40">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-panel2/50 text-xs uppercase tracking-wider text-muted">
                <th className="px-3 py-2 font-medium">Parameter</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {endpoint.params.map((p) => (
                <tr key={p.name} className="border-b border-border/20 last:border-0">
                  <td className="px-3 py-2 font-mono text-cyan">{p.name}</td>
                  <td className="px-3 py-2 font-mono text-xs text-muted">{p.type}</td>
                  <td className="px-3 py-2 text-muted">{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {endpoint.example ? (
        <div className="mt-4">
          <CodeBlock code={fillOrigin(endpoint.example, origin)} language="javascript" />
        </div>
      ) : null}
    </article>
  );
}
