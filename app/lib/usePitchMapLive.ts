import { useCallback, useEffect, useState } from 'react';
import { api, type PitchMapPayload } from './api';

const PITCH_LIVE_REFRESH_MS = 15_000;

export function usePitchMapLive(matchId: string | undefined, live: boolean) {
  const [data, setData] = useState<PitchMapPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    if (!matchId) return Promise.resolve();
    return api
      .matchPitchMap(matchId)
      .then((r) => {
        setData(r.data);
        setError(false);
      })
      .catch(() => {
        setData(null);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [matchId]);

  useEffect(() => {
    if (!matchId) return;
    setLoading(true);
    load();
  }, [matchId, load]);

  useEffect(() => {
    if (!matchId || !live) return;
    const timer = setInterval(load, PITCH_LIVE_REFRESH_MS);
    return () => clearInterval(timer);
  }, [matchId, live, load]);

  return { data, loading, error, reload: load };
};
