import { FIFA_CXM_API_BASE, FIFA_GAMEDAY_API_BASE } from './constants';
import {
  parseGamedayTeamsPayload,
  type FifaGamedayTeamStats,
} from './parseFifaGamedayStats';

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'wc-tactical-platform/1.0 (FIFA Match Centre sync)',
};

let cachedToken: { token: string; expiresAt: number } | null = null;

/** Anonymous Gameday JWT issued by FIFA CMS (same as Match Centre). */
export async function fetchFifaGamedayToken(): Promise<string | null> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const res = await fetch(`${FIFA_CXM_API_BASE}/external/gameDay/token`, {
    headers: DEFAULT_HEADERS,
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) return null;

  const body = (await res.json()) as { token?: string; expiresAt?: string };
  if (!body.token) return null;

  const expiresAt = body.expiresAt ? new Date(body.expiresAt).getTime() : Date.now() + 86_400_000;
  cachedToken = { token: body.token, expiresAt };
  return body.token;
}

/** Official team match statistics from FIFA Gameday (Match Centre STATS tab). */
export async function fetchFifaGamedayTeamMatchStats(
  idIfes: string,
): Promise<FifaGamedayTeamStats[] | null> {
  const token = await fetchFifaGamedayToken();
  if (!token) return null;

  const res = await fetch(`${FIFA_GAMEDAY_API_BASE}/stats/match/${idIfes}/teams.json`, {
    headers: {
      ...DEFAULT_HEADERS,
      Authorization: `Bearer ${token}`,
      'Accept-Encoding': 'gzip',
      Origin: 'https://www.fifa.com',
      Referer: 'https://www.fifa.com/',
    },
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) return null;

  const data = (await res.json()) as Record<string, [string, number, boolean][]>;
  if (!data || typeof data !== 'object') return null;
  return parseGamedayTeamsPayload(data);
}

/** @internal */
export function resetFifaGamedayTokenCache(): void {
  cachedToken = null;
}
