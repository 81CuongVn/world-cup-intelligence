import type { MatchScenarioContext, ScenarioCandidate, ScenarioModelOutput, ScenarioType } from './types';
import { SCENARIO_TYPE_LABELS } from './types';
import { runScenarioProbabilityModel } from './scenarioEngine';
import { selectScenarioFeatures } from './scenarioFeatureSelector';

type ScoredScenario = ScenarioCandidate & {
  featureSelection: ReturnType<typeof selectScenarioFeatures>;
  output: ScenarioModelOutput;
};

export function buildCandidateScenarios(context: MatchScenarioContext): ScenarioCandidate[] {
  const candidates: ScenarioCandidate[] = [
    {
      scenarioType: 'baseline_expected_flow',
      scenarioName: SCENARIO_TYPE_LABELS.baseline_expected_flow,
      isBaseline: true,
      weight: 1,
    },
  ];

  const xgTotal = context.probability.expectedHomeGoals + context.probability.expectedAwayGoals;
  const isKnockout = /Round|Final|Quarter|Semi/i.test(context.stage);

  const add = (type: ScenarioType, weight: number) => {
    candidates.push({
      scenarioType: type,
      scenarioName: SCENARIO_TYPE_LABELS[type],
      isBaseline: false,
      weight,
    });
  };

  if (context.awaySystem.transitionScore > 0.55 || context.homeSystem.transitionScore > 0.55) {
    add('transition_dominance', 0.85 + Math.abs(context.awaySystem.transitionScore - context.homeSystem.transitionScore));
  }
  if ((context.homeSystem.tempoScore + context.awaySystem.tempoScore) / 2 > 0.52) {
    add('early_goal_swing', 0.75);
  }
  if (context.homeSystem.pressingScore > 0.58 || context.awaySystem.pressingScore > 0.58) {
    add('pressing_breakthrough', 0.7);
  }
  if (context.awaySystem.defensiveCompactnessScore > 0.58) {
    add('low_block_frustration', 0.68);
  }
  if (context.homeSystem.setPieceScore > 0.55 || context.awaySystem.setPieceScore > 0.55) {
    add('set_piece_decider', 0.62);
  }
  if (xgTotal > 2.8) add('high_event_open_match', 0.66);
  if (xgTotal < 2.2) add('low_event_controlled_match', 0.64);
  if (context.homeSystem.benchDepthScore > 0.58 || context.awaySystem.benchDepthScore > 0.58) {
    add('late_bench_impact', 0.55);
  }
  if (isKnockout) {
    add('extra_time_path', 0.5 + context.probability.drawProb * 0.4);
    add('penalty_shootout_path', 0.35 + context.probability.drawProb * 0.2);
  }
  if (context.homeLineupSource === 'projected' || context.awayLineupSource === 'projected') {
    add('lineup_surprise', 0.45);
  }

  return candidates;
}

export function ensureAtLeastTwoScenarios(
  scored: ScoredScenario[],
  context: MatchScenarioContext,
): ScoredScenario[] {
  const baseline = scored.find((s) => s.scenarioType === 'baseline_expected_flow');
  const others = scored.filter((s) => s.scenarioType !== 'baseline_expected_flow');
  const picked: ScoredScenario[] = baseline ? [baseline] : [];
  for (const alt of others.sort((a, b) => b.output.scenarioProbability - a.output.scenarioProbability)) {
    if (picked.length >= 3) break;
    if (alt.output.scenarioConfidence >= 0.35) picked.push(alt);
  }

  if (picked.length >= 2) return picked;

  const fallbackType: ScenarioType =
    context.awaySystem.transitionScore >= context.homeSystem.transitionScore
      ? 'transition_dominance'
      : 'early_goal_swing';

  if (!picked.some((s) => s.scenarioType === fallbackType)) {
    const featureSelection = selectScenarioFeatures(fallbackType, context);
    picked.push({
      scenarioType: fallbackType,
      scenarioName: SCENARIO_TYPE_LABELS[fallbackType],
      isBaseline: false,
      weight: 0.5,
      featureSelection,
      output: runScenarioProbabilityModel(fallbackType, context, featureSelection),
    });
  }

  return picked.length >= 2 ? picked : scored.slice(0, 2);
}
