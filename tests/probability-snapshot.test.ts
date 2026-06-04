import { describe, it, expect } from 'vitest';

function parseDistributionJson(json: string | null): Record<string, number> | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json) as Record<string, number>;
    if (!parsed || typeof parsed !== 'object' || Object.keys(parsed).length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

describe('snapshot completeness', () => {
  it('treats empty scoreline json as incomplete', () => {
    expect(parseDistributionJson('{}')).toBeNull();
  });

  it('accepts non-empty scoreline json', () => {
    expect(parseDistributionJson('{"1-0":0.1}')).toEqual({ '1-0': 0.1 });
  });
});
