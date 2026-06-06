import type { MatchScenarioContext, ScenarioModelOutput, ScenarioType } from './types';
import type { ScenarioFeatureSelection } from './types';

function clamp01(v: number): number {
  return Math.max(0.02, Math.min(0.98, v));
}

function normalizeTriplet(h: number, d: number, a: number): { h: number; d: number; a: number } {
  const sum = h + d + a || 1;
  return { h: h / sum, d: d / sum, a: a / sum };
}

function topScoreline(dist: Record<string, number>): string {
  const entries = Object.entries(dist);
  if (!entries.length) return '1-1';
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

function buildIntervalDistribution(
  homeWin: number,
  draw: number,
  awayWin: number,
  dist: Record<string, number>,
): ScenarioModelOutput['intervalDistribution'] {
  const keys = ['15', '30', '45', '60', '75', '90'] as const;
  const top = Object.entries(dist)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([score, probability]) => ({ score, probability }));

  return Object.fromEntries(
    keys.map((k, i) => {
      const drift = i * 0.012;
      const n = normalizeTriplet(
        homeWin + drift * 0.4,
        draw - drift * 0.15,
        awayWin - drift * 0.25,
      );
      return [
        k,
        {
          homeWinProb: n.h,
          drawProb: n.d,
          awayWinProb: n.a,
          topScorelines: top,
        },
      ];
    }),
  ) as ScenarioModelOutput['intervalDistribution'];
}

function baselineOutput(context: MatchScenarioContext, selection: ScenarioFeatureSelection): ScenarioModelOutput {
  const p = context.probability;
  const homeCtrl =
    context.homeSystem.possessionControlScore >= context.awaySystem.possessionControlScore;
  return {
    scenarioProbability: clamp01(0.48 + context.probability.confidence * 0.12),
    scenarioConfidence: clamp01(p.confidence * selection.inputQualityScore - selection.confidencePenalty),
    homeWinProb: p.homeWinProb,
    drawProb: p.drawProb,
    awayWinProb: p.awayWinProb,
    expectedHomeGoals: p.expectedHomeGoals,
    expectedAwayGoals: p.expectedAwayGoals,
    mostLikelyScore: p.mostLikelyScore,
    scorelineDistribution: p.scorelineDistribution,
    intervalDistribution: buildIntervalDistribution(
      p.homeWinProb,
      p.drawProb,
      p.awayWinProb,
      p.scorelineDistribution,
    ),
    initialConditions: [
      {
        condition: 'Home team uses strongest available XI',
        value: context.homeLineupSource === 'official' || context.homeLineupSource === 'squad',
        confidence: context.homeLineupSource === 'official' ? 0.9 : 0.65,
        source: context.homeLineupSource,
      },
      {
        condition: 'Away team defends in mid/low block',
        value: context.awaySystem.defensiveCompactnessScore > 0.52,
        confidence: 0.72,
      },
      {
        condition: 'Match tempo remains medium',
        value: (context.homeSystem.tempoScore + context.awaySystem.tempoScore) / 2,
        confidence: 0.68,
      },
      {
        condition: 'Possession advantage side',
        value: homeCtrl ? context.homeTeamName : context.awayTeamName,
        confidence: 0.7,
      },
    ],
    triggerConditions: [
      {
        condition: 'Home possession share',
        threshold: '> 56%',
        currentValue: `${Math.round(context.homeSystem.possessionControlScore * 100)}% proxy`,
        status: context.homeSystem.possessionControlScore > 0.56 ? 'partially_triggered' : 'not_triggered',
      },
      {
        condition: 'Away xG after 30 minutes',
        threshold: '< 0.35',
        currentValue: context.minute >= 30 ? context.probability.expectedAwayGoals : 'pending',
        status: context.minute >= 30 && context.probability.expectedAwayGoals < 0.35 ? 'triggered' : 'not_triggered',
      },
    ],
    invalidationConditions: [
      {
        condition: 'Early red card',
        threshold: 'before 60',
        currentValue: context.minute,
        status: 'valid',
      },
    ],
    keyDrivers: [
      `${context.homeTeamName} collective strength ${(context.homeSystem.collectiveStrengthScore * 100).toFixed(0)}%`,
      `${context.awayTeamName} defensive compactness ${(context.awaySystem.defensiveCompactnessScore * 100).toFixed(0)}%`,
      `Engine xG ${p.expectedHomeGoals.toFixed(2)}–${p.expectedAwayGoals.toFixed(2)}`,
    ],
    riskFactors: selection.missingInputs.length
      ? [`Missing inputs: ${selection.missingInputs.join(', ')}`]
      : ['Lineups may still be projected rather than confirmed.'],
  };
}

function alternativeOutput(
  scenarioType: ScenarioType,
  context: MatchScenarioContext,
  selection: ScenarioFeatureSelection,
): ScenarioModelOutput {
  const p = context.probability;
  const awayTransitionEdge =
    context.awaySystem.transitionScore - context.homeSystem.transitionScore;
  const homePressEdge = context.homeSystem.pressingScore - context.awaySystem.pressingScore;
  let shiftHome = 0;
  let shiftAway = 0;
  let shiftDraw = 0;
  let xgHome = p.expectedHomeGoals;
  let xgAway = p.expectedAwayGoals;
  let scenarioProb = 0.28;

  switch (scenarioType) {
    case 'early_goal_swing':
      shiftAway = 0.08;
      shiftHome = -0.06;
      xgAway += 0.25;
      scenarioProb = clamp01(0.22 + (context.homeSystem.tempoScore + context.awaySystem.tempoScore) * 0.12);
      break;
    case 'transition_dominance':
      shiftAway += awayTransitionEdge > 0 ? 0.1 : -0.1;
      shiftHome += awayTransitionEdge > 0 ? -0.08 : 0.08;
      xgAway += awayTransitionEdge > 0 ? 0.3 : -0.15;
      scenarioProb = clamp01(0.25 + Math.abs(awayTransitionEdge) * 0.35);
      break;
    case 'pressing_breakthrough':
      shiftHome += homePressEdge > 0 ? 0.09 : -0.07;
      shiftAway += homePressEdge > 0 ? -0.06 : 0.07;
      xgHome += homePressEdge > 0 ? 0.22 : -0.1;
      scenarioProb = clamp01(0.24 + Math.abs(homePressEdge) * 0.3);
      break;
    case 'low_block_frustration':
      shiftDraw += 0.06;
      shiftHome -= 0.03;
      shiftAway -= 0.03;
      scenarioProb = clamp01(0.26 + context.awaySystem.defensiveCompactnessScore * 0.15);
      break;
    case 'set_piece_decider':
      shiftDraw += 0.04;
      xgHome += context.homeSystem.setPieceScore * 0.12;
      xgAway += context.awaySystem.setPieceScore * 0.12;
      scenarioProb = clamp01(
        (context.homeSystem.setPieceScore + context.awaySystem.setPieceScore) / 2 + 0.12,
      );
      break;
    case 'high_event_open_match':
      shiftDraw -= 0.04;
      xgHome += 0.18;
      xgAway += 0.18;
      scenarioProb = clamp01((p.expectedHomeGoals + p.expectedAwayGoals) / 3.5);
      break;
    case 'low_event_controlled_match':
      shiftDraw += 0.08;
      xgHome -= 0.12;
      xgAway -= 0.12;
      scenarioProb = clamp01(1 - (p.expectedHomeGoals + p.expectedAwayGoals) / 4);
      break;
    case 'red_card_disruption':
      shiftDraw += 0.05;
      scenarioProb = clamp01(0.1 + (p.expectedHomeGoals + p.expectedAwayGoals) * 0.04);
      break;
    case 'late_bench_impact':
      shiftHome += (context.homeSystem.benchDepthScore - context.awaySystem.benchDepthScore) * 0.08;
      scenarioProb = clamp01(0.2 + (context.homeSystem.benchDepthScore + context.awaySystem.benchDepthScore) * 0.1);
      break;
    case 'extra_time_path':
      shiftDraw += 0.12;
      scenarioProb = clamp01(p.drawProb * 0.75);
      break;
    case 'penalty_shootout_path':
      shiftDraw += 0.08;
      scenarioProb = clamp01(p.drawProb * 0.35);
      break;
    default:
      shiftAway = 0.05;
      scenarioProb = 0.25;
  }

  if (context.minute > 0 && context.homeScore + context.awayScore > 0 && scenarioType === 'early_goal_swing') {
    scenarioProb = clamp01(scenarioProb + 0.12);
    if (context.homeScore > context.awayScore) {
      shiftHome += 0.05;
      shiftAway -= 0.05;
    } else if (context.awayScore > context.homeScore) {
      shiftAway += 0.05;
      shiftHome -= 0.05;
    }
  }

  const triplet = normalizeTriplet(
    p.homeWinProb + shiftHome,
    p.drawProb + shiftDraw,
    p.awayWinProb + shiftAway,
  );
  const dist = { ...p.scorelineDistribution };
  const ml = topScoreline(dist);

  return {
    scenarioProbability: scenarioProb,
    scenarioConfidence: clamp01(
      p.confidence * selection.inputQualityScore - selection.confidencePenalty - 0.04,
    ),
    homeWinProb: triplet.h,
    drawProb: triplet.d,
    awayWinProb: triplet.a,
    expectedHomeGoals: Math.max(0.15, xgHome),
    expectedAwayGoals: Math.max(0.15, xgAway),
    mostLikelyScore: ml,
    scorelineDistribution: dist,
    intervalDistribution: buildIntervalDistribution(triplet.h, triplet.d, triplet.a, dist),
    initialConditions: [
      {
        condition: 'Transition chances created',
        value: scenarioType.includes('transition') || scenarioType === 'early_goal_swing',
        confidence: 0.7,
      },
      {
        condition: 'Central possession volatility',
        value: Math.abs(context.homeSystem.possessionControlScore - context.awaySystem.possessionControlScore),
        confidence: 0.66,
      },
      {
        condition: 'First goal before minute 30',
        value: context.minute > 0 && context.minute <= 30 && context.homeScore + context.awayScore > 0,
        confidence: context.minute > 0 ? 0.85 : 0.55,
      },
    ],
    triggerConditions: [
      {
        condition: 'High-value transition sequence',
        threshold: 'xG swing >= 0.25',
        status:
          context.awaySystem.transitionScore > 0.58 || context.homeSystem.transitionScore > 0.58
            ? 'partially_triggered'
            : 'not_triggered',
      },
      {
        condition: 'Match tempo increase',
        threshold: 'tempo > baseline',
        status:
          (context.homeSystem.tempoScore + context.awaySystem.tempoScore) / 2 > 0.55
            ? 'partially_triggered'
            : 'not_triggered',
      },
    ],
    invalidationConditions: [
      {
        condition: 'Early red card for transition side',
        threshold: 'invalidates open shape',
        status: 'valid',
      },
    ],
    keyDrivers: selection.reason,
    riskFactors: ['Alternative path depends on early-phase game-state shifts.'],
  };
}

export function runScenarioProbabilityModel(
  scenarioType: ScenarioType,
  context: MatchScenarioContext,
  selection: ScenarioFeatureSelection,
): ScenarioModelOutput {
  if (scenarioType === 'baseline_expected_flow') {
    return baselineOutput(context, selection);
  }
  return alternativeOutput(scenarioType, context, selection);
}
