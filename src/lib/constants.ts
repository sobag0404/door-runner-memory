// ─── Shared Constants ───────────────────────────────────

export const LANE_COLORS = [
  '#FF6B35', // vivid orange
  '#FFD23F', // golden yellow
  '#06D6A0', // mint green
  '#EF476F', // hot pink
  '#118AB2', // ocean blue
  '#8338EC', // electric purple
];

export const LANE_LIGHT = [
  '#FF9F6B',
  '#FFE680',
  '#5EEFC0',
  '#F47A9E',
  '#4DB8D9',
  '#A86FF0',
];

/** Calculate lane X position as percentage */
export function getLanePercent(laneIndex: number, pathCount: number): number {
  return ((laneIndex + 0.5) / pathCount) * 100;
}

/** Trigger haptic feedback on supported devices */
export function hapticFeedback(style: 'light' | 'medium' | 'heavy' = 'medium') {
  try {
    if ('vibrate' in navigator) {
      const ms = style === 'light' ? 10 : style === 'medium' ? 25 : 50;
      navigator.vibrate(ms);
    }
  } catch { /* not supported */ }
}
