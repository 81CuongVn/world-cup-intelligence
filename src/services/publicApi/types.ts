/** Public API v1 event types emitted to feed + webhooks. */
export type PublicApiEventType =
  | 'match.score_updated'
  | 'match.status_changed'
  | 'match.completed'
  | 'match.stats_updated'
  | 'match.commentary_updated'
  | 'match.events_updated';

export const PUBLIC_API_EVENT_TYPES: PublicApiEventType[] = [
  'match.score_updated',
  'match.status_changed',
  'match.completed',
  'match.stats_updated',
  'match.commentary_updated',
  'match.events_updated',
];

export type MatchScorePayload = {
  matchId: string;
  slug?: string;
  status: string;
  minute: number | null;
  homeScore: number;
  awayScore: number;
  updatedAt: string;
};

export type PublicApiFeedEvent = {
  id: number;
  type: PublicApiEventType;
  matchId: string | null;
  createdAt: string;
  data: unknown;
};

export type PublicApiClient = {
  id: string;
  name: string;
  enabled: boolean;
  createdAt: string;
};

export type WebhookSubscription = {
  id: string;
  clientId: string;
  url: string;
  events: string[];
  enabled: boolean;
  createdAt: string;
};
