import type { MatchPredictionScenario } from './types';

const PROHIBITED = [
  'bet recommendation',
  'sure bet',
  'kèo thơm',
  'nên cược',
  'đánh cửa',
  'all-in',
  'guaranteed',
];

export function validateScenarioSet(scenarios: MatchPredictionScenario[]): string[] {
  const errors: string[] = [];
  if (scenarios.length < 2) errors.push('At least two scenarios required.');
  if (!scenarios.some((s) => s.isBaseline)) errors.push('Baseline scenario missing.');
  for (const s of scenarios) {
    if (!s.modelVersion) errors.push(`Scenario ${s.id} missing modelVersion.`);
    if (!s.inputHash) errors.push(`Scenario ${s.id} missing inputHash.`);
    if (s.scenarioProbability < 0 || s.scenarioProbability > 1) {
      errors.push(`Scenario ${s.id} probability out of range.`);
    }
    const text = JSON.stringify(s).toLowerCase();
    for (const phrase of PROHIBITED) {
      if (text.includes(phrase)) errors.push(`Prohibited phrase in scenario ${s.id}: ${phrase}`);
    }
  }
  return errors;
}

export function assertValidScenarioSet(scenarios: MatchPredictionScenario[]): void {
  const errors = validateScenarioSet(scenarios);
  if (errors.length) throw new Error(errors.join('; '));
}
