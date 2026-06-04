import { describe, it, expect } from 'vitest';
import { SOURCE_IDS } from '../src/ingestion/sourceRegistry';

describe('source registry', () => {
  it('defines mock source', () => {
    expect(SOURCE_IDS.mock).toBe('src-mock');
  });
});
