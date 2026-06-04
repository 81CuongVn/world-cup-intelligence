import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { getCachedAnalysis, runMultiVariableAnalysis } from '../ai/multiVariableAnalysis';
import { isGatewayConfigured } from '../ai/gatewayClient';
import { listRoutingTable } from '../ai/modelRouter';

export const analysisRoutes = new Hono<{ Bindings: AppEnv }>();

analysisRoutes.get('/config', (c) => {
  return c.json({
    data: {
      gatewayEnabled: isGatewayConfigured(c.env),
      viewOnly: true,
      routing: listRoutingTable(),
      note: 'Probabilities from statistical engine. AI explains via Cloudflare AI Gateway + GPT-5.5 Thinking.',
    },
  });
});

analysisRoutes.get('/:matchId', async (c) => {
  const matchId = c.req.param('matchId');
  let analysis = await getCachedAnalysis(c.env, matchId);
  if (!analysis && isGatewayConfigured(c.env)) {
    analysis = await runMultiVariableAnalysis(c.env, matchId);
  }
  if (!analysis) {
    return c.json({
      data: null,
      meta: { gatewayConfigured: isGatewayConfigured(c.env), status: 'pending_or_unconfigured' },
    });
  }
  return c.json({ data: analysis });
});
