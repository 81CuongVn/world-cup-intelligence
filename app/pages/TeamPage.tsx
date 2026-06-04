import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, type TeamSummary } from '../lib/api';

export function TeamPage() {
  const { teamId } = useParams();
  const [team, setTeam] = useState<TeamSummary | null>(null);

  useEffect(() => {
    if (teamId) api.team(teamId).then((r) => setTeam(r.data));
  }, [teamId]);

  if (!team) return <div className="text-muted">Loading…</div>;

  return (
    <div className="panel max-w-xl">
      <h1 className="text-2xl font-bold">{team.name}</h1>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <dt className="text-muted">FIFA rank</dt>
        <dd>{team.fifa_ranking ?? '—'}</dd>
        <dt className="text-muted">Elo</dt>
        <dd>{team.elo_rating?.toFixed(0) ?? '—'}</dd>
      </dl>
    </div>
  );
}
