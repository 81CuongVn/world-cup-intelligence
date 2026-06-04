export type ProbabilityHint = {
  id: string;
  type: 'favorite' | 'score' | 'draw' | 'xg' | 'confidence' | 'h2h';
  priority: number;
  vi: string;
  en: string;
};

type HintInput = {
  homeName: string;
  awayName: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  xgHome: number;
  xgAway: number;
  mostLikelyScore?: string;
  confidence?: number;
  h2h?: { homeWins: number; awayWins: number; draws: number; total: number };
};

export function buildProbabilityHints(input: HintInput): ProbabilityHint[] {
  const hints: ProbabilityHint[] = [];
  const max = Math.max(input.homeWin, input.draw, input.awayWin);

  if (input.homeWin === max && input.homeWin >= 0.38) {
    hints.push({
      id: 'fav-home',
      type: 'favorite',
      priority: 1,
      vi: `${input.homeName} được mô hình đánh giá cao hơn (${(input.homeWin * 100).toFixed(1)}% thắng).`,
      en: `${input.homeName} is the model favourite (${(input.homeWin * 100).toFixed(1)}% win).`,
    });
  } else if (input.awayWin === max && input.awayWin >= 0.38) {
    hints.push({
      id: 'fav-away',
      type: 'favorite',
      priority: 1,
      vi: `${input.awayName} được mô hình đánh giá cao hơn (${(input.awayWin * 100).toFixed(1)}% thắng).`,
      en: `${input.awayName} is the model favourite (${(input.awayWin * 100).toFixed(1)}% win).`,
    });
  } else if (input.draw === max) {
    hints.push({
      id: 'fav-draw',
      type: 'draw',
      priority: 1,
      vi: `Khả năng hòa cao nhất (${(input.draw * 100).toFixed(1)}%) — trận có thể cân bằng.`,
      en: `Draw is the most likely outcome (${(input.draw * 100).toFixed(1)}%) — expect a tight match.`,
    });
  }

  if (input.mostLikelyScore) {
    hints.push({
      id: 'score',
      type: 'score',
      priority: 2,
      vi: `Tỷ số có khả năng cao nhất: ${input.mostLikelyScore.replace('-', '–')}.`,
      en: `Most likely scoreline: ${input.mostLikelyScore.replace('-', '–')}.`,
    });
  }

  hints.push({
    id: 'xg',
    type: 'xg',
    priority: 3,
    vi: `Kỳ vọng bàn thắng (xG): ${input.homeName} ${input.xgHome.toFixed(2)} – ${input.awayName} ${input.xgAway.toFixed(2)}.`,
    en: `Expected goals (xG): ${input.homeName} ${input.xgHome.toFixed(2)} – ${input.awayName} ${input.xgAway.toFixed(2)}.`,
  });

  if (input.confidence != null) {
    const level =
      input.confidence >= 0.8 ? { vi: 'cao', en: 'high' } : input.confidence >= 0.65 ? { vi: 'trung bình', en: 'medium' } : { vi: 'thấp', en: 'low' };
    hints.push({
      id: 'conf',
      type: 'confidence',
      priority: 4,
      vi: `Độ tin cậy mô hình ${level.vi} (${(input.confidence * 100).toFixed(0)}%) — cân nhắc thêm tin lineup/chấn thương.`,
      en: `Model confidence is ${level.en} (${(input.confidence * 100).toFixed(0)}%) — lineup/injury news may shift this.`,
    });
  }

  if (input.h2h && input.h2h.total > 0) {
    hints.push({
      id: 'h2h',
      type: 'h2h',
      priority: 5,
      vi: `Lịch sử đối đầu: ${input.homeName} ${input.h2h.homeWins} thắng – Hòa ${input.h2h.draws} – ${input.awayName} ${input.h2h.awayWins} thắng (${input.h2h.total} trận).`,
      en: `Head-to-head: ${input.homeName} ${input.h2h.homeWins}W – ${input.h2h.draws}D – ${input.awayName} ${input.h2h.awayWins}W (${input.h2h.total} matches).`,
    });
  }

  return hints.sort((a, b) => a.priority - b.priority);
}
