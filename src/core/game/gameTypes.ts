// ─── Game Types ─────────────────────────────────────────
// Pure game logic types — no React, no storage, no side effects

export type GamePhase = 'ready' | 'running' | 'feedback' | 'gameOver';
export type Feedback = 'correct' | 'wrong' | null;

export interface GameState {
  /** Current step in the sequence */
  currentStep: number;
  /** Player score */
  score: number;
  /** Consecutive correct answers */
  combo: number;
  /** Whether game is active */
  isRunning: boolean;
  /** Current feedback state */
  feedback: Feedback;
  /** Timer fraction remaining (0..1) */
  timeLeft: number;
}

export const INITIAL_GAME_STATE: GameState = {
  currentStep: 0,
  score: 0,
  combo: 0,
  isRunning: false,
  feedback: null,
  timeLeft: 1,
};
