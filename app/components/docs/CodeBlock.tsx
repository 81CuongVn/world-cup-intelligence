import { useState } from 'react';

type Props = {
  code: string;
  language?: string;
};

export function CodeBlock({ code, language = 'bash' }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="api-code-block group relative overflow-hidden rounded-xl border border-border/80 bg-[#050a0e]">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2">
        <span className="font-mono text-xs uppercase tracking-wider text-muted">{language}</span>
        <button
          type="button"
          onClick={copy}
          className="rounded-md px-2.5 py-1 text-xs font-medium text-muted transition hover:bg-panel2 hover:text-cyan"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[0.8125rem] leading-relaxed text-foreground/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}
