import { DurableObject } from 'cloudflare:workers';
import type { MatchScenarioSet } from '../models/scenarios/types';

type LiveState = {
  matchId: string;
  minute: number;
  homeScore: number;
  awayScore: number;
  subscribers: number;
};

export type MatchRoomMessage =
  | { type: 'MATCH_STATE_UPDATE'; payload: LiveState }
  | { type: 'PROBABILITY_UPDATE'; payload: unknown }
  | { type: 'SCENARIO_UPDATE'; payload: MatchScenarioSet }
  | { type: 'SCENARIO_RANK_CHANGE'; payload: { matchId: string; order: string[] } }
  | { type: 'SCENARIO_INVALIDATED'; payload: { matchId: string; scenarioIds: string[] } };

export class MatchRoom extends DurableObject {
  private state: LiveState = { matchId: '', minute: 0, homeScore: 0, awayScore: 0, subscribers: 0 };

  private broadcast(message: MatchRoomMessage | { type: 'state' | 'update' | 'error'; data?: unknown; message?: string }) {
    for (const peer of this.ctx.getWebSockets()) {
      peer.send(JSON.stringify(message));
    }
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname.endsWith('/scenario')) {
      const body = (await request.json()) as MatchRoomMessage;
      if (body.type === 'SCENARIO_UPDATE') {
        this.broadcast(body);
        return Response.json({ ok: true });
      }
      return Response.json({ error: 'Unsupported message' }, { status: 400 });
    }

    if (request.headers.get('Upgrade')?.toLowerCase() === 'websocket') {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      this.ctx.acceptWebSocket(server);
      this.state.subscribers++;
      server.send(JSON.stringify({ type: 'MATCH_STATE_UPDATE', payload: this.state }));
      return new Response(null, { status: 101, webSocket: client });
    }
    if (url.pathname.endsWith('/state')) {
      return Response.json(this.state);
    }
    return new Response('MatchRoom', { status: 200 });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    if (typeof message !== 'string') return;
    try {
      const payload = JSON.parse(message) as { type: string; data?: Partial<LiveState> };
      if (payload.type === 'update' && payload.data) {
        this.state = { ...this.state, ...payload.data };
        this.broadcast({ type: 'MATCH_STATE_UPDATE', payload: this.state });
      }
    } catch {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message' }));
    }
  }

  async webSocketClose(): Promise<void> {
    this.state.subscribers = Math.max(0, this.state.subscribers - 1);
  }
}
