// ─── Tests for pure gameReducer ─────────────────────────
// Per security reviewer: game transitions must be testable without React

import { describe, it, expect } from 'vitest';
import { gameReducer, isFeedbackActive } from '../core/game/gameReducer';
import type { GameState } from '../core/game/gameTypes';
import { INITIAL_GAME_STATE } from '../core/game/gameTypes';
import { selectProgressiveSpeedMs, selectComboLabelKey } from '../core/game/gameSelectors';

const runningState: GameState = {
  currentStep: 0,
  score: 0,
  combo: 0,
  isRunning: true,
  feedback: null,
  timeLeft: 1,
};

describe('gameReducer', () => {
  describe('START', () => {
    it('transitions from ready to running', () => {
      const result = gameReducer(INITIAL_GAME_STATE, { type: 'START' });
      expect(result.isRunning).toBe(true);
    });

    it('resets all game state', () => {
      const midGame: GameState = {
        currentStep: 50,
        score: 50,
        combo: 10,
        isRunning: true,
        feedback: 'correct',
        timeLeft: 0.3,
      };
      const result = gameReducer(midGame, { type: 'START' });
      expect(result.currentStep).toBe(0);
      expect(result.score).toBe(0);
      expect(result.combo).toBe(0);
      expect(result.feedback).toBeNull();
      expect(result.timeLeft).toBe(1);
    });
  });

  describe('CHOOSE_CORRECT', () => {
    it('increases score', () => {
      const result = gameReducer(runningState, { type: 'CHOOSE_CORRECT' });
      expect(result.score).toBe(1);
    });

    it('increases currentStep', () => {
      const result = gameReducer(runningState, { type: 'CHOOSE_CORRECT' });
      expect(result.currentStep).toBe(1);
    });

    it('increases combo', () => {
      const result = gameReducer(runningState, { type: 'CHOOSE_CORRECT' });
      expect(result.combo).toBe(1);
    });

    it('sets feedback to correct', () => {
      const result = gameReducer(runningState, { type: 'CHOOSE_CORRECT' });
      expect(result.feedback).toBe('correct');
    });

    it('resets timeLeft to 1', () => {
      const lowTime: GameState = { ...runningState, timeLeft: 0.1 };
      const result = gameReducer(lowTime, { type: 'CHOOSE_CORRECT' });
      expect(result.timeLeft).toBe(1);
    });

    it('ignored during feedback', () => {
      const feedbackState: GameState = { ...runningState, feedback: 'correct' };
      const result = gameReducer(feedbackState, { type: 'CHOOSE_CORRECT' });
      expect(result.score).toBe(0); // unchanged
    });

    it('ignored when not running', () => {
      const result = gameReducer(INITIAL_GAME_STATE, { type: 'CHOOSE_CORRECT' });
      expect(result.score).toBe(0); // unchanged
    });
  });

  describe('CHOOSE_WRONG', () => {
    it('resets currentStep to 0', () => {
      const step5: GameState = { ...runningState, currentStep: 5 };
      const result = gameReducer(step5, { type: 'CHOOSE_WRONG' });
      expect(result.currentStep).toBe(0);
    });

    it('resets combo to 0', () => {
      const highCombo: GameState = { ...runningState, combo: 10 };
      const result = gameReducer(highCombo, { type: 'CHOOSE_WRONG' });
      expect(result.combo).toBe(0);
    });

    it('sets feedback to wrong', () => {
      const result = gameReducer(runningState, { type: 'CHOOSE_WRONG' });
      expect(result.feedback).toBe('wrong');
    });

    it('does NOT change score (score persists)', () => {
      const scored: GameState = { ...runningState, score: 15 };
      const result = gameReducer(scored, { type: 'CHOOSE_WRONG' });
      expect(result.score).toBe(15);
    });

    it('ignored during feedback', () => {
      const feedbackState: GameState = { ...runningState, feedback: 'correct' };
      const result = gameReducer(feedbackState, { type: 'CHOOSE_WRONG' });
      expect(result.combo).toBe(0); // unchanged from initial
    });

    it('ignored when not running', () => {
      const result = gameReducer(INITIAL_GAME_STATE, { type: 'CHOOSE_WRONG' });
      expect(result.feedback).toBeNull(); // unchanged
    });
  });

  describe('CLEAR_FEEDBACK', () => {
    it('clears correct feedback', () => {
      const correctState: GameState = { ...runningState, feedback: 'correct' };
      const result = gameReducer(correctState, { type: 'CLEAR_FEEDBACK' });
      expect(result.feedback).toBeNull();
    });

    it('clears wrong feedback', () => {
      const wrongState: GameState = { ...runningState, feedback: 'wrong' };
      const result = gameReducer(wrongState, { type: 'CLEAR_FEEDBACK' });
      expect(result.feedback).toBeNull();
    });

    it('no-op when feedback is already null', () => {
      const result = gameReducer(runningState, { type: 'CLEAR_FEEDBACK' });
      expect(result.feedback).toBeNull();
    });
  });

  describe('TIMEOUT', () => {
    it('resets currentStep to 0', () => {
      const step10: GameState = { ...runningState, currentStep: 10 };
      const result = gameReducer(step10, { type: 'TIMEOUT' });
      expect(result.currentStep).toBe(0);
    });

    it('resets combo to 0', () => {
      const combo5: GameState = { ...runningState, combo: 5 };
      const result = gameReducer(combo5, { type: 'TIMEOUT' });
      expect(result.combo).toBe(0);
    });

    it('sets feedback to wrong', () => {
      const result = gameReducer(runningState, { type: 'TIMEOUT' });
      expect(result.feedback).toBe('wrong');
    });

    it('ignored during feedback', () => {
      const feedbackState: GameState = { ...runningState, feedback: 'correct' };
      const result = gameReducer(feedbackState, { type: 'TIMEOUT' });
      expect(result.currentStep).toBe(0); // unchanged
    });
  });

  describe('STOP', () => {
    it('sets isRunning to false', () => {
      const result = gameReducer(runningState, { type: 'STOP' });
      expect(result.isRunning).toBe(false);
    });
  });
});

describe('isFeedbackActive', () => {
  it('true when feedback is correct', () => {
    expect(isFeedbackActive({ ...runningState, feedback: 'correct' })).toBe(true);
  });

  it('true when feedback is wrong', () => {
    expect(isFeedbackActive({ ...runningState, feedback: 'wrong' })).toBe(true);
  });

  it('false when feedback is null', () => {
    expect(isFeedbackActive(runningState)).toBe(false);
  });
});

describe('selectProgressiveSpeedMs', () => {
  it('step 0 = base speed', () => {
    expect(selectProgressiveSpeedMs(12000, 0)).toBe(12000);
  });

  it('speed decreases as step increases', () => {
    const base = selectProgressiveSpeedMs(12000, 0);
    const step20 = selectProgressiveSpeedMs(12000, 20);
    expect(step20).toBeLessThan(base);
  });

  it('never goes below 40% of base', () => {
    const min = 12000 * 0.4;
    const step500 = selectProgressiveSpeedMs(12000, 500);
    expect(step500).toBeGreaterThanOrEqual(min);
  });
});

describe('selectComboLabelKey', () => {
  it('empty for combo < 3', () => {
    expect(selectComboLabelKey(0)).toBe('');
    expect(selectComboLabelKey(2)).toBe('');
  });

  it('nice for combo 3-4', () => {
    expect(selectComboLabelKey(3)).toBe('combo.nice');
    expect(selectComboLabelKey(4)).toBe('combo.nice');
  });

  it('great for combo 5-6', () => {
    expect(selectComboLabelKey(5)).toBe('combo.great');
  });

  it('super for combo 7-9', () => {
    expect(selectComboLabelKey(7)).toBe('combo.super');
  });

  it('insane for combo 10+', () => {
    expect(selectComboLabelKey(10)).toBe('combo.insane');
    expect(selectComboLabelKey(20)).toBe('combo.insane');
  });
});
