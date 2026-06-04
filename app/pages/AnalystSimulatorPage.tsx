import { useState } from 'react';

export function AnalystSimulatorPage() {
  const [matchId, setMatchId] = useState('m-usa-mex-2026');
  return (
    <div className="panel max-w-lg space-y-4">
      <h1 className="text-xl font-bold">Analyst simulator</h1>
      <p className="text-sm text-muted">Modify scenarios and recompute via admin API.</p>
      <label className="block text-sm">
        Match ID
        <input
          className="mt-1 w-full rounded border border-border bg-panel2 px-3 py-2"
          value={matchId}
          onChange={(e) => setMatchId(e.target.value)}
        />
      </label>
      <button
        type="button"
        className="rounded-lg bg-pressing px-4 py-2 text-sm font-medium text-background"
        onClick={async () => {
          const res = await fetch(`/api/admin/recompute/${matchId}`, { method: 'POST' });
          if (res.status === 401) {
            alert('Admin token required. Set X-Admin-Token header or wrangler secret ADMIN_TOKEN.');
            return;
          }
          if (!res.ok) alert(`Recompute failed: ${res.status}`);
        }}
      >
        Queue recompute
      </button>
    </div>
  );
}
