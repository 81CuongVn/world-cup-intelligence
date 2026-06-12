import { describe, it, expect } from 'vitest';
import { sha256Hex, hmacSha256Hex, generateApiKey } from '../src/services/publicApi/crypto';
import { PUBLIC_API_EVENT_TYPES } from '../src/services/publicApi/types';

describe('publicApi crypto', () => {
  it('generates pi_live_ API keys', () => {
    const key = generateApiKey();
    expect(key.startsWith('pi_live_')).toBe(true);
    expect(key.length).toBeGreaterThan(20);
  });

  it('hashes and signs consistently', async () => {
    const hash = await sha256Hex('test-key');
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    const sig = await hmacSha256Hex('secret', '{"a":1}');
    expect(sig).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe('publicApi event types', () => {
  it('defines match update events', () => {
    expect(PUBLIC_API_EVENT_TYPES).toContain('match.score_updated');
    expect(PUBLIC_API_EVENT_TYPES).toContain('match.commentary_updated');
    expect(PUBLIC_API_EVENT_TYPES.length).toBeGreaterThanOrEqual(6);
  });
});
