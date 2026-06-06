import { describe, expect, it } from 'vitest';
import { MARKET_DISCLAIMER } from '../src/market/types';

const FORBIDDEN = [
  'kèo thơm',
  'nên cược',
  'đánh cửa',
  'sure bet',
  'bet recommendation',
  'guaranteed win',
  'vào tiền',
  'all-in',
];

const UI_SNIPPETS = [
  'app/components/market/MarketSignalPanel.tsx',
  'app/components/market/MarketDisclaimer.tsx',
  'app/components/market/ModelVsMarketChart.tsx',
  'app/components/team/TeamSystemPanel.tsx',
  'app/components/scenarios/ScenarioLikelihoodPanel.tsx',
  'app/components/scenarios/ScenarioPredictionPanel.tsx',
  'app/components/tactical/AnalystSimulatorPanel.tsx',
  'app/pages/MatchPage.tsx',
  'app/lib/i18n/locales.ts',
];

describe('safety copy', () => {
  it('market disclaimer constant matches policy', () => {
    expect(MARKET_DISCLAIMER).toBe(
      'Market signals are shown for analytical context only and are not betting advice.',
    );
  });

  it('forbidden phrases are not in key UI files', async () => {
    const { readFile } = await import('node:fs/promises');
    const { join } = await import('node:path');
    const root = join(import.meta.dirname, '..');
    const hits: string[] = [];
    for (const rel of UI_SNIPPETS) {
      const text = (await readFile(join(root, rel), 'utf8')).toLowerCase();
      for (const phrase of FORBIDDEN) {
        if (text.includes(phrase.toLowerCase())) hits.push(`${rel}: ${phrase}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
