import { z } from 'zod';
import type { AppEnv } from '../env';
import { gatewayChatJson, isGatewayConfigured } from './gatewayClient';
import { SYSTEM_NO_INVENT_NUMBERS, entityExtractPrompt } from './prompts';

const EntitySchema = z.object({
  teams: z.array(z.string()).default([]),
  players: z.array(z.string()).default([]),
  injuries: z.array(z.string()).default([]),
  tacticalNotes: z.array(z.string()).default([]),
  formations: z.array(z.string()).default([]),
});

export type ExtractedEntities = z.infer<typeof EntitySchema>;

export async function extractEntitiesFromArticle(
  env: AppEnv,
  articleText: string,
): Promise<ExtractedEntities | null> {
  if (!isGatewayConfigured(env)) return null;

  const raw = await gatewayChatJson<ExtractedEntities>(env, 'entity_extract', [
    { role: 'system', content: SYSTEM_NO_INVENT_NUMBERS },
    { role: 'user', content: entityExtractPrompt(articleText) },
  ]);

  if (!raw) return null;
  return EntitySchema.parse(raw);
}
