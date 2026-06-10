import { create } from 'zustand';
import { localStore } from '@/lib/localStore';
import { getCurrentSeasonId, createSeasonSequence } from '@/lib/season';

// ─── Types ─────────────────────────────────────────────
export type GameScreen = 'home' | 'game' | 'gameOver';

export type SpeedLevel = 'slow' | 'normal' | 'fast';

export interface GameSettings {
  pathCount: number; // 3, 4, 5, 6
  speed: SpeedLevel;
}

export interface BestScoreKey {
  seasonId: string;
  pathCount: number;
}

// ─── Defaults ──────────────────────────────────────────
const DEFAULT_SETTINGS: GameSettings = {
  pathCount: 3,
  speed: 'normal',
};

function getSpeedMs(speed: SpeedLevel): number {
  switch (speed) {
    case 'slow': return 1800;
    case 'normal': return 1200;
    case 'fast': return 800;
  }
}

// ─── Store Interface ───────────────────────────────────
interface GameStore {
  // Screen
  screen: GameScreen;
  setScreen: (s: GameScreen) => void;

  // Settings
  settings: GameSettings;
  setPathCount: (n: number) => void;
  setSpeed: (s: SpeedLevel) => void;

  // Game state
  seasonId: string;
  sequence: number[];
  currentStep: number;
  score: number;
  isRunning: boolean;
  feedback: 'correct' | 'wrong' | null;

  // Best scores
  bestScores: Record<string, number>;

  // Actions
  startGame: () => void;
  chooseLane: (laneIndex: number) => void;
  resetGame: () => void;

  // Derived
  getSpeedMs: () => number;
  correctLane: () => number;
}

// ─── Helpers ───────────────────────────────────────────
function bestScoreKey(seasonId: string, pathCount: number): string {
  return `${seasonId}_p${pathCount}`;
}

function loadBestScores(): Record<string, number> {
  return localStore.get<Record<string, number>>('bestScores', {});
}

function saveBestScore(key: string, score: number): void {
  const scores = loadBestScores();
  if (!scores[key] || score > scores[key]) {
    scores[key] = score;
    localStore.set('bestScores', scores);
  }
}

function loadSettings(): GameSettings {
  return localStore.get<GameSettings>('settings', DEFAULT_SETTINGS);
}

// ─── Store ─────────────────────────────────────────────
export const useGameStore = create<GameStore>((set, get) => ({
  // Screen
  screen: 'home',
  setScreen: (s) => set({ screen: s }),

  // Settings
  settings: loadSettings(),
  setPathCount: (n) => {
    const settings = { ...get().settings, pathCount: n };
    localStore.set('settings', settings);
    set({ settings });
  },
  setSpeed: (s) => {
    const settings = { ...get().settings, speed: s };
    localStore.set('settings', settings);
    set({ settings });
  },

  // Game state
  seasonId: getCurrentSeasonId(),
  sequence: [],
  currentStep: 0,
  score: 0,
  isRunning: false,
  feedback: null,

  // Best scores
  bestScores: loadBestScores(),

  // Actions
  startGame: () => {
    const { settings } = get();
    const seasonId = getCurrentSeasonId();
    const sequence = createSeasonSequence(seasonId, settings.pathCount);
    set({
      seasonId,
      sequence,
      currentStep: 0,
      score: 0,
      isRunning: true,
      feedback: null,
      screen: 'game',
    });
  },

  chooseLane: (laneIndex: number) => {
    const state = get();
    if (!state.isRunning || state.feedback !== null) return;

    const correct = state.sequence[state.currentStep];
    if (laneIndex === correct) {
      // Correct
      const newScore = state.score + 1;
      const newStep = state.currentStep + 1;
      set({
        score: newScore,
        currentStep: newStep,
        feedback: 'correct',
      });
      // Clear feedback after brief delay
      setTimeout(() => {
        set({ feedback: null });
      }, 400);
    } else {
      // Wrong — infinite lives, just reset sequence
      const seasonId = getCurrentSeasonId();
      const sequence = createSeasonSequence(seasonId, state.settings.pathCount);
      set({
        currentStep: 0,
        sequence,
        feedback: 'wrong',
      });
      setTimeout(() => {
        set({ feedback: null });
      }, 600);
    }
  },

  resetGame: () => {
    // Save best score before leaving
    const state = get();
    if (state.score > 0) {
      const key = bestScoreKey(state.seasonId, state.settings.pathCount);
      saveBestScore(key, state.score);
    }
    set({
      screen: 'home',
      isRunning: false,
      currentStep: 0,
      score: 0,
      feedback: null,
      sequence: [],
      bestScores: loadBestScores(),
    });
  },

  // Derived
  getSpeedMs: () => getSpeedMs(get().settings.speed),
  correctLane: () => {
    const s = get();
    return s.sequence[s.currentStep] ?? 0;
  },
}));
