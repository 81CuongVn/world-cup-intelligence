import { DurableObject } from 'cloudflare:workers';

type LiveState = {
  matchId: string;
  minute: number;
  homeScore: number;
  awayScore: number;
  subscribers: number;
};

export class MatchRoom extends DurableObject {
  private state: LiveState = { matchId: '', minute: 0, homeScore: 0, awayScore: 0, subscribers: 0 };

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (request.headers.get('Upgrade')?.toLowerCase() === 'websocket') {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      this.ctx.acceptWebSocket(server);
      this.state.subscribers++;
      server.send(
        JSON.stringify({
          type: 'state',
          data: this.state,
        }),
      );
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
        for (const peer of this.ctx.getWebSockets()) {
          peer.send(JSON.stringify({ type: 'update', data: this.state }));
        }
      }
    } catch {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message' }));
    }
  }

  async webSocketClose(): Promise<void> {
    this.state.subscribers = Math.max(0, this.state.subscribers - 1);
  }
}
