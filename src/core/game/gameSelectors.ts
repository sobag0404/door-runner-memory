// ─── Game Selectors ─────────────────────────────────────
// Pure selector functions — derive values from game state

/** Get the current speed in ms, accounting for progressive speed */
export function selectProgressiveSpeedMs(
  baseSpeedMs: number,
  currentStep: number,
  reductionFactor: number = 0.97,
  reductionInterval: number = 5,
  minFraction: number = 0.4
): number {
  const reduction = Math.pow(reductionFactor, Math.floor(currentStep / reductionInterval));
  const minMs = baseSpeedMs * minFraction;
  return Math.max(minMs, Math.round(baseSpeedMs * reduction));
}

/** Check if combo is high enough for badge */
export function selectIsComboBadge(combo: number, threshold: number = 3): boolean {
  return combo >= threshold;
}

/** Get combo label key based on combo level */
export function selectComboLabelKey(combo: number): string {
  if (combo >= 10) return 'combo.insane';
  if (combo >= 7) return 'combo.super';
  if (combo >= 5) return 'combo.great';
  if (combo >= 3) return 'combo.nice';
  return '';
}
