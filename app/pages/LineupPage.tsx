import { useParams, Link } from 'react-router-dom';

export function LineupPage() {
  const { matchId } = useParams();
  return (
    <div className="panel">
      <h1 className="text-xl font-bold">Lineups</h1>
      <p className="text-muted">Match {matchId}</p>
      <Link to={`/matches/${matchId}`} className="mt-4 inline-block text-pressing">
        ← Back to match
      </Link>
    </div>
  );
}
