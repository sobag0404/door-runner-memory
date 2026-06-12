// ─── Pure Game Reducer ───────────────────────────────────
// Per security reviewer: game logic must be testable without React.
// This reducer is PURE: no side effects, no haptics, no sounds, no timers.
// Side effects live in the Zustand adapter layer.

import type { GameState, Feedback } from './gameTypes';
import { INITIAL_GAME_STATE } from './gameTypes';

// ─── Actions ───────────────────────────────────────────
export type GameAction =
  | { type: 'START' }
  | { type: 'CHOOSE_CORRECT' }
  | { type: 'CHOOSE_WRONG' }
  | { type: 'CLEAR_FEEDBACK' }
  | { type: 'TIMEOUT' }
  | { type: 'STOP' };

// ─── Reducer ───────────────────────────────────────────
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START':
      return {
        ...INITIAL_GAME_STATE,
        isRunning: true,
      };

    case 'CHOOSE_CORRECT': {
      if (!state.isRunning || state.feedback !== null) return state;
      const newScore = state.score + 1;
      const newStep = state.currentStep + 1;
      const newCombo = state.combo + 1;
      return {
        ...state,
        score: newScore,
        currentStep: newStep,
        combo: newCombo,
        feedback: 'correct',
        timeLeft: 1,
      };
    }

    case 'CHOOSE_WRONG': {
      if (!state.isRunning || state.feedback !== null) return state;
      return {
        ...state,
        currentStep: 0,
        combo: 0,
        feedback: 'wrong',
        timeLeft: 1,
      };
    }

    case 'CLEAR_FEEDBACK': {
      return {
        ...state,
        feedback: null,
      };
    }

    case 'TIMEOUT': {
      if (!state.isRunning || state.feedback !== null) return state;
      return {
        ...state,
        currentStep: 0,
        combo: 0,
        feedback: 'wrong',
        timeLeft: 1,
      };
    }

    case 'STOP':
      return {
        ...state,
        isRunning: false,
      };

    default:
      return state;
  }
}

// ─── Selectors ─────────────────────────────────────────
export function isFeedbackActive(state: GameState): boolean {
  return state.feedback !== null;
}

export function getFeedbackType(state: GameState): Feedback {
  return state.feedback;
}

export function isGameOver(state: GameState): boolean {
  // In our game model, there's no explicit gameOver —
  // the player can keep trying after wrong answers.
  // This exists for future extension (lives system).
  return !state.isRunning && state.score > 0;
}
