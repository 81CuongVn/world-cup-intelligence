import { useCallback, useEffect, useState } from 'react';
import { api, type MatchSummary, type ProbabilityData } from './api';

const REFRESH_MS = 30_000;
const LIVE_REFRESH_MS = 15_000;

/** Polls match status/scores and model probabilities for live UI updates. */
export function useMatchLiveData(matchId: string | undefined) {
  const [match, setMatch] = useState<MatchSummary | null>(null);
  const [prob, setProb] = useState<ProbabilityData | null>(null);
  const [loadError, setLoadError] = useState(false);

  const refresh = useCallback(async () => {
    if (!matchId) return;
    try {
      const [mRes, pRes] = await Promise.all([
        api.match(matchId),
        api.matchProbability(matchId).catch(() => null),
      ]);
      setMatch(mRes.data);
      setLoadError(false);
      if (pRes) setProb(pRes.data);
    } catch {
      setLoadError(true);
    }
  }, [matchId]);

  useEffect(() => {
    if (!matchId) {
      setMatch(null);
      setProb(null);
      setLoadError(false);
      return;
    }
    setLoadError(false);
    refresh();
  }, [matchId, refresh]);

  useEffect(() => {
    if (!matchId) return;
    const ms = match?.status === 'live' ? LIVE_REFRESH_MS : REFRESH_MS;
    const timer = setInterval(refresh, ms);
    return () => clearInterval(timer);
  }, [matchId, match?.status, refresh]);

  return { match, prob, loadError, refresh };
}
