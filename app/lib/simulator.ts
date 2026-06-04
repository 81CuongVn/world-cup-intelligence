/** Client-side scenario adjustment for analyst simulator (display only). */
export type SimulatorScenario = {
  homeBoost: number;
  awayBoost: number;
  tempo: number;
};

export function adjustProbabilities(
  base: { homeWin: number; draw: number; awayWin: number; xgHome: number; xgAway: number },
  scenario: SimulatorScenario,
) {
  const h = Math.max(0.02, base.homeWin + scenario.homeBoost * 0.12 - scenario.awayBoost * 0.06);
  const a = Math.max(0.02, base.awayWin + scenario.awayBoost * 0.12 - scenario.homeBoost * 0.06);
  const d = Math.max(0.05, 1 - h - a);
  const sum = h + d + a;
  const homeWin = h / sum;
  const draw = d / sum;
  const awayWin = a / sum;
  const xgHome = Math.max(0.1, base.xgHome + scenario.homeBoost * 0.35 + scenario.tempo * 0.1);
  const xgAway = Math.max(0.1, base.xgAway + scenario.awayBoost * 0.35 + scenario.tempo * 0.08);
  return { homeWin, draw, awayWin, xgHome, xgAway };
}
