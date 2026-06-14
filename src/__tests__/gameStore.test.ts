// ─── Tests for gameReducer logic (via Zustand store) ────
// Per security reviewer: game transitions must be testable without React

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore, getSpeedMs, getProgressiveSpeedMs } from '../store/gameStore';

describe('getSpeedMs', () => {
  it('slow = 20000ms', () => {
    expect(getSpeedMs('slow')).toBe(20000);
  });

  it('normal = 12000ms', () => {
    expect(getSpeedMs('normal')).toBe(12000);
  });

  it('fast = 7000ms', () => {
    expect(getSpeedMs('fast')).toBe(7000);
  });

  it('custom = customTimerSec * 1000', () => {
    expect(getSpeedMs('custom', 10)).toBe(10000);
    expect(getSpeedMs('custom', 3)).toBe(3000);
    expect(getSpeedMs('custom', 30)).toBe(30000);
  });

  it('custom defaults to 10s when no param', () => {
    expect(getSpeedMs('custom')).toBe(10000);
  });
});

describe('getProgressiveSpeedMs', () => {
  it('step 0 = base speed', () => {
    expect(getProgressiveSpeedMs('normal', 0)).toBe(12000);
  });

  it('speed decreases (gets faster) as step increases', () => {
    const base = getProgressiveSpeedMs('normal', 0);
    const step20 = getProgressiveSpeedMs('normal', 20);
    expect(step20).toBeLessThan(base);
  });

  it('never goes below 40% of base', () => {
    const base = getSpeedMs('normal');
    const min = base * 0.4;
    const step500 = getProgressiveSpeedMs('normal', 500);
    expect(step500).toBeGreaterThanOrEqual(min);
  });
});

describe('gameStore — chooseLane', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useGameStore.getState();
    store.resetGame();
    store.startGame();
  });

  it('correct answer increases score', () => {
    const store = useGameStore.getState();
    const correctLane = store.correctLane();
    store.chooseLane(correctLane);
    expect(useGameStore.getState().score).toBe(1);
  });

  it('correct answer increases combo', () => {
    const store = useGameStore.getState();
    const correctLane = store.correctLane();
    store.chooseLane(correctLane);
    expect(useGameStore.getState().combo).toBe(1);
  });

  it('correct answer advances step', () => {
    const store = useGameStore.getState();
    const correctLane = store.correctLane();
    store.chooseLane(correctLane);
    expect(useGameStore.getState().currentStep).toBe(1);
  });

  it('wrong answer resets step to 0', () => {
    const store = useGameStore.getState();
    const correctLane = store.correctLane();
    // Answer correctly once
    store.chooseLane(correctLane);
    expect(useGameStore.getState().currentStep).toBe(1);

    useGameStore.setState({ feedback: null });
    const currentState = useGameStore.getState();
    const wrongLane = (currentState.correctLane() + 1) % currentState.settings.pathCount;
    useGameStore.getState().chooseLane(wrongLane);
    expect(useGameStore.getState().currentStep).toBe(0);
  });

  it('wrong answer resets combo to 0', () => {
    const store = useGameStore.getState();
    const pathCount = store.settings.pathCount;
    // Answer correctly 3 times
    for (let i = 0; i < 3; i++) {
      const lane = useGameStore.getState().correctLane();
      useGameStore.getState().chooseLane(lane);
      useGameStore.setState({ feedback: null });
    }
    expect(useGameStore.getState().combo).toBe(3);
    // Answer wrong
    const correctLane = useGameStore.getState().correctLane();
    const wrongLane = (correctLane + 1) % pathCount;
    useGameStore.setState({ feedback: null });
    useGameStore.getState().chooseLane(wrongLane);
    expect(useGameStore.getState().combo).toBe(0);
  });

  it('choice during feedback is ignored', () => {
    const store = useGameStore.getState();
    const correctLane = store.correctLane();
    store.chooseLane(correctLane);
    // feedback is now 'correct'
    expect(useGameStore.getState().feedback).toBe('correct');
    const scoreBefore = useGameStore.getState().score;
    // Try to choose again during feedback
    useGameStore.getState().chooseLane(0);
    expect(useGameStore.getState().score).toBe(scoreBefore);
  });

  it('choice when not running is ignored', () => {
    useGameStore.getState().resetGame();
    const scoreBefore = useGameStore.getState().score;
    useGameStore.getState().chooseLane(0);
    expect(useGameStore.getState().score).toBe(scoreBefore);
  });
});

describe('gameStore — startGame', () => {
  it('starts with score 0', () => {
    useGameStore.getState().startGame();
    expect(useGameStore.getState().score).toBe(0);
  });

  it('starts with combo 0', () => {
    useGameStore.getState().startGame();
    expect(useGameStore.getState().combo).toBe(0);
  });

  it('starts with isRunning true', () => {
    useGameStore.getState().startGame();
    expect(useGameStore.getState().isRunning).toBe(true);
  });

  it('starts with currentStep 0', () => {
    useGameStore.getState().startGame();
    expect(useGameStore.getState().currentStep).toBe(0);
  });

  it('generates sequence', () => {
    useGameStore.getState().startGame();
    expect(useGameStore.getState().sequence.length).toBeGreaterThan(0);
  });
});

describe('gameStore — resetGame', () => {
  it('resets to home screen', () => {
    useGameStore.getState().startGame();
    useGameStore.getState().resetGame();
    expect(useGameStore.getState().screen).toBe('home');
  });

  it('sets isRunning false', () => {
    useGameStore.getState().startGame();
    useGameStore.getState().resetGame();
    expect(useGameStore.getState().isRunning).toBe(false);
  });
});
