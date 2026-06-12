// ─── Game Constants ─────────────────────────────────────
// Pure game constants — no imports from UI/storage/sound

/** Duration of correct feedback in ms */
export const CORRECT_FEEDBACK_MS = 350;

/** Duration of wrong feedback in ms */
export const WRONG_FEEDBACK_MS = 600;

/** Minimum combo for badge display */
export const COMBO_THRESHOLD = 3;

/** Progressive speed: reduction factor per 5 steps */
export const SPEED_REDUCTION_FACTOR = 0.97;

/** Progressive speed: minimum fraction of base speed */
export const MIN_SPEED_FRACTION = 0.4;

/** Progressive speed: steps between reductions */
export const SPEED_REDUCTION_INTERVAL = 5;
