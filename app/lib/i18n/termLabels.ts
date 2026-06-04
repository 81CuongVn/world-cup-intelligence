import type { DisplayMode } from './I18nContext';

function pick(mode: DisplayMode, vi: string, en: string) {
  return mode === 'en' ? en : vi;
}

const SCENARIO_LABELS: Record<string, { vi: string; en: string }> = {
  early_goal_0_15: { vi: 'Bàn sớm (0–15 phút)', en: 'Early goal (0–15 min)' },
  first_half_goal: { vi: 'Bàn trong hiệp 1', en: 'First-half goal' },
  late_goal_75_90: { vi: 'Bàn muộn (75–90 phút)', en: 'Late goal (75–90 min)' },
  both_teams_score: { vi: 'Hai đội đều ghi bàn', en: 'Both teams score' },
  low_event_match: { vi: 'Trận ít bàn', en: 'Low-event match' },
  high_event_match: { vi: 'Trận nhiều bàn', en: 'High-event match' },
  set_piece_goal: { vi: 'Bàn từ tình huống cố định', en: 'Set-piece goal' },
  red_card_swing: { vi: 'Thẻ đỏ làm lệch thế trận', en: 'Red-card swing' },
  extra_time_tendency: { vi: 'Khả năng hiệp phụ', en: 'Extra-time tendency' },
  penalty_shootout_tendency: { vi: 'Khả năng loạt penalty', en: 'Penalty shootout tendency' },
};

const TACTICAL_IDENTITY: Record<string, { vi: string; en: string }> = {
  high_press_collective: { vi: 'Ép sân tập thể', en: 'High press collective' },
  possession_control: { vi: 'Kiểm soát bóng', en: 'Possession control' },
  transition_focused: { vi: 'Tập trung phản công', en: 'Transition focused' },
  balanced_block: { vi: 'Khối phòng ngự cân bằng', en: 'Balanced block' },
};

const METRIC_LABELS: Record<string, { vi: string; en: string }> = {
  Collective: { vi: 'Sức mạnh tập thể', en: 'Collective' },
  Pressing: { vi: 'Ép sân', en: 'Pressing' },
  Compactness: { vi: 'Khoảng cách phòng ngự', en: 'Compactness' },
  Transition: { vi: 'Phản công', en: 'Transition' },
  'Set piece': { vi: 'Tình huống cố định', en: 'Set piece' },
  Bench: { vi: 'Chiều sâu băng ghế', en: 'Bench' },
  Cohesion: { vi: 'Đồng bộ đội hình', en: 'Cohesion' },
  Possession: { vi: 'Kiểm soát bóng', en: 'Possession' },
  Tempo: { vi: 'Nhịp độ', en: 'Tempo' },
};

export function scenarioTypeLabel(type: string, mode: DisplayMode): string {
  const row = SCENARIO_LABELS[type];
  if (row) return pick(mode, row.vi, row.en);
  return type.replace(/_/g, ' ');
}

export function tacticalIdentityLabel(id: string, mode: DisplayMode): string {
  const row = TACTICAL_IDENTITY[id];
  if (row) return pick(mode, row.vi, row.en);
  return id.replace(/_/g, ' ');
}

export function metricLabel(key: string, mode: DisplayMode): string {
  const row = METRIC_LABELS[key];
  if (row) return pick(mode, row.vi, row.en);
  return key;
}
