import { useEffect, useState } from 'react';

export function AdminPage() {
  const [sources, setSources] = useState<unknown[]>([]);

  useEffect(() => {
    fetch('/api/admin/sources')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((j) => setSources((j as { data: unknown[] }).data ?? []))
      .catch(() => setSources([{ error: 'Failed to load sources' }]));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Admin</h1>
      <div className="panel">
        <h2 className="text-sm text-muted">Source registry</h2>
        <pre className="mt-2 overflow-auto text-xs">{JSON.stringify(sources, null, 2)}</pre>
      </div>
    </div>
  );
}
