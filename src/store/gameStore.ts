import { create } from 'zustand';
import { getCurrentSeasonId, createSeasonSequence, getExpectedPath } from '../lib/season';
import { getDailyId } from '../lib/daily';
import { ACHIEVEMENTS } from '../lib/achievements';
import type { PlayerStats } from '../lib/achievements';
import type { SoundPack } from '../lib/sounds';
import type { Lang } from '../lib/i18n';
import type { ThemeId } from '../lib/themes';
import { gameReducer } from '../core/game/gameReducer';
import { INITIAL_GAME_STATE } from '../core/game/gameTypes';
import { runCorrectChoiceEffects, runStartEffects, runTimeoutEffects, runWrongChoiceEffects } from './gameEffects';
import { clearFeedbackTimers, scheduleFeedbackTimer } from './feedbackTimers';
import {
  bestScoreKey,
  loadBestScores,
  loadLeaderboard,
  loadSettings,
  loadStats,
  loadUnlockedAchievements,
  saveBestScore,
  saveLangSettings,
  saveLeaderboard,
  saveSettings,
  saveSoundPackSettings,
  saveStats,
  saveThemeSettings,
  saveUnlockedAchievements,
} from './gamePersistence';

// ─── Types ─────────────────────────────────────────────
export type GameScreen = 'home' | 'game' | 'leaderboard';

export type SpeedLevel = 'slow' | 'normal' | 'fast' | 'custom';

export type GameMode = 'regular' | 'daily';

export interface GameSettings {
  pathCount: number; // 3, 4, 5, 6
  speed: SpeedLevel;
  soundEnabled: boolean;
  lang: Lang;
  theme: ThemeId;
  soundPack: SoundPack;
  customTimerSec: number; // 3..30 seconds (only used when speed='custom')
}

/** Base speed in ms for each speed level */
export function getSpeedMs(speed: SpeedLevel, customTimerSec?: number): number {
  switch (speed) {
    case 'slow': return 20000;
    case 'normal': return 12000;
    case 'fast': return 7000;
    case 'custom': return (customTimerSec ?? 10) * 1000;
  }
}

/**
 * Calculate progressive speed for a given step.
 * Speed increases by ~3% every 5 correct answers, with a floor of 40% of base speed.
 * This makes the game gradually harder as you play longer.
 */
export function getProgressiveSpeedMs(baseSpeed: SpeedLevel, currentStep: number, customTimerSec?: number): number {
  const baseMs = getSpeedMs(baseSpeed, customTimerSec);
  // Every 5 steps, reduce by 3%, minimum 40% of base
  const reduction = Math.pow(0.97, Math.floor(currentStep / 5));
  const minMs = baseMs * 0.4;
  return Math.max(minMs, Math.round(baseMs * reduction));
}

// ─── Leaderboard entry ───
export interface LeaderboardEntry {
  name: string;
  score: number;
  mode: GameMode;
  pathCount: number;
  speed: SpeedLevel;
  date: string; // ISO
}

// ─── Store Interface ───────────────────────────────────
interface GameStore {
  // Screen
  screen: GameScreen;
  prevScreen: GameScreen | null;
  setScreen: (s: GameScreen) => void;

  // Settings
  settings: GameSettings;
  setPathCount: (n: number) => void;
  setSpeed: (s: SpeedLevel) => void;
  setSoundEnabled: (v: boolean) => void;
  setLang: (l: Lang) => void;
  setTheme: (t: ThemeId) => void;
  setSoundPack: (p: SoundPack) => void;
  setCustomTimerSec: (s: number) => void;

  // Game mode
  gameMode: GameMode;
  setGameMode: (m: GameMode) => void;

  // Game state
  seasonId: string;
  sequence: number[];
  currentStep: number;
  score: number;
  combo: number; // ← now in store state!
  isRunning: boolean;
  feedback: 'correct' | 'wrong' | null;

  // Timer
  timeLeft: number; // 0..1 fraction remaining
  setTimeLeft: (t: number) => void;

  // Best scores
  bestScores: Record<string, number>;

  // Stats
  stats: PlayerStats;
  addStatsFromGame: (score: number, combo: number, mode: GameMode) => void;

  // Unlocked achievements
  unlockedAchievements: string[];
  newlyUnlockedIds: string[]; // IDs just unlocked (for toast)
  checkAchievements: () => string[]; // returns newly unlocked IDs
  clearNewlyUnlocked: () => void;

  // Leaderboard
  leaderboard: LeaderboardEntry[];
  submitToLeaderboard: (name: string) => void;

  // Actions
  startGame: () => void;
  chooseLane: (laneIndex: number) => void;
  handleTimeout: () => void;
  resetGame: () => void;

  // Derived
  getSpeedMs: () => number;
  correctLane: () => number;
}

// ─── Store ─────────────────────────────────────────────
export const useGameStore = create<GameStore>((set, get) => {
  // Expose store to window for DEV-only debugging
  // In production builds, window.__gameStore must NOT be available
  // to prevent score/state manipulation from the console.
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dev-only debug hook
    (window as any).__gameStore = { getState: get, setState: set };
  }
  return {
  // Screen
  screen: 'home',
  prevScreen: null,
  setScreen: (s) => set((state) => ({ screen: s, prevScreen: state.screen })),

  // Settings
  settings: loadSettings(),
  setPathCount: (n) => {
    const settings = { ...get().settings, pathCount: n };
    saveSettings(settings);
    set({ settings });
  },
  setSpeed: (s) => {
    const settings = { ...get().settings, speed: s };
    saveSettings(settings);
    set({ settings });
  },
  setSoundEnabled: (v) => {
    const settings = { ...get().settings, soundEnabled: v };
    saveSettings(settings);
    set({ settings });
  },
  setLang: (l) => {
    const settings = saveLangSettings(get().settings, l);
    set({ settings });
  },
  setTheme: (t) => {
    const settings = saveThemeSettings(get().settings, t);
    set({ settings });
  },
  setSoundPack: (p) => {
    const settings = saveSoundPackSettings(get().settings, p);
    set({ settings });
  },
  setCustomTimerSec: (s) => {
    const settings = { ...get().settings, customTimerSec: s };
    saveSettings(settings);
    set({ settings });
  },

  // Game mode
  gameMode: 'regular',
  setGameMode: (m) => set({ gameMode: m }),

  // Game state
  seasonId: getCurrentSeasonId(),
  sequence: [],
  currentStep: 0,
  score: 0,
  combo: 0,
  isRunning: false,
  feedback: null,

  // Timer
  timeLeft: 1,
  setTimeLeft: (t) => set({ timeLeft: t }),

  // Best scores
  bestScores: loadBestScores(),

  // Stats
  stats: loadStats(),
  addStatsFromGame: (score, combo, mode) => {
    const prev = get().stats;
    const s = get().settings;

    const newStats: PlayerStats = {
      ...prev,
      totalCorrect: prev.totalCorrect + score,
      bestScore: Math.max(prev.bestScore, score),
      bestCombo: Math.max(prev.bestCombo, combo),
      gamesPlayed: prev.gamesPlayed + 1,
      fastBestScore: s.speed === 'fast' ? Math.max(prev.fastBestScore, score) : prev.fastBestScore,
      dailyBestScore: mode === 'daily' ? Math.max(prev.dailyBestScore, score) : prev.dailyBestScore,
      totalDailyCompleted: mode === 'daily' ? prev.totalDailyCompleted + 1 : prev.totalDailyCompleted,
      lane3Best: s.pathCount === 3 ? Math.max(prev.lane3Best, score) : prev.lane3Best,
      lane4Best: s.pathCount === 4 ? Math.max(prev.lane4Best, score) : prev.lane4Best,
      lane5Best: s.pathCount === 5 ? Math.max(prev.lane5Best, score) : prev.lane5Best,
      lane6Best: s.pathCount === 6 ? Math.max(prev.lane6Best, score) : prev.lane6Best,
    };
    saveStats(newStats);
    set({ stats: newStats });
  },

  // Achievements
  unlockedAchievements: loadUnlockedAchievements(),
  newlyUnlockedIds: [],
  checkAchievements: () => {
    const achList = ACHIEVEMENTS;
    const stats = get().stats;
    const unlocked = get().unlockedAchievements;
    const newlyUnlocked: string[] = [];

    for (const a of achList) {
      if (!unlocked.includes(a.id) && a.condition(stats)) {
        newlyUnlocked.push(a.id);
      }
    }

    if (newlyUnlocked.length > 0) {
      const updated = [...unlocked, ...newlyUnlocked];
      saveUnlockedAchievements(updated);
      set({ unlockedAchievements: updated, newlyUnlockedIds: newlyUnlocked });
    }

    return newlyUnlocked;
  },
  clearNewlyUnlocked: () => set({ newlyUnlockedIds: [] }),

  // Leaderboard
  leaderboard: loadLeaderboard(),
  submitToLeaderboard: (name: string) => {
    const state = get();
    const entry: LeaderboardEntry = {
      name: name.trim() || 'Anonymous',
      score: state.score,
      mode: state.gameMode,
      pathCount: state.settings.pathCount,
      speed: state.settings.speed,
      date: new Date().toISOString(),
    };
    const lb = [...state.leaderboard, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 50); // top 50
    saveLeaderboard(lb);
    set({ leaderboard: lb });
  },

  // Actions
  startGame: () => {
    const { settings, gameMode } = get();
    const seasonId = gameMode === 'daily' ? getDailyId() : getCurrentSeasonId();
    const sequence = createSeasonSequence(seasonId, settings.pathCount);
    clearFeedbackTimers();
    runStartEffects(settings);

    // Delegate pure state transition to reducer
    const next = gameReducer(INITIAL_GAME_STATE, { type: 'START' });
    set({
      seasonId,
      sequence,
      ...next,
      screen: 'game',
    });
  },

  chooseLane: (laneIndex: number) => {
    const state = get();
    if (!state.isRunning || state.feedback !== null) return;

    const correct = getExpectedPath(state.sequence, state.seasonId, state.settings.pathCount, state.currentStep);
    const soundOn = state.settings.soundEnabled;

    // Build current game state for reducer
    const currentGameState = {
      currentStep: state.currentStep,
      score: state.score,
      combo: state.combo,
      isRunning: state.isRunning,
      feedback: state.feedback,
      timeLeft: state.timeLeft,
    };

    if (laneIndex === correct) {
      const next = gameReducer(currentGameState, { type: 'CHOOSE_CORRECT' });

      const key = bestScoreKey(state.seasonId, state.settings.pathCount);
      const updatedBestScores = saveBestScore(state.bestScores, key, next.score);

      runCorrectChoiceEffects({ ...state.settings, soundEnabled: soundOn }, next.score, next.combo);

      set({
        ...next,
        bestScores: updatedBestScores,
      });

      scheduleFeedbackTimer('correct', () => {
        const s = get();
        const cleared = gameReducer({ currentStep: s.currentStep, score: s.score, combo: s.combo, isRunning: s.isRunning, feedback: s.feedback, timeLeft: s.timeLeft }, { type: 'CLEAR_FEEDBACK' });
        set({ feedback: cleared.feedback });
      });
    } else {
      const next = gameReducer(currentGameState, { type: 'CHOOSE_WRONG' });
      const seasonId = state.gameMode === 'daily' ? getDailyId() : getCurrentSeasonId();
      const sequence = createSeasonSequence(seasonId, state.settings.pathCount);
      runWrongChoiceEffects({ ...state.settings, soundEnabled: soundOn });

      set({
        ...next,
        sequence,
      });

      scheduleFeedbackTimer('wrong', () => {
        const s = get();
        const cleared = gameReducer({ currentStep: s.currentStep, score: s.score, combo: s.combo, isRunning: s.isRunning, feedback: s.feedback, timeLeft: s.timeLeft }, { type: 'CLEAR_FEEDBACK' });
        set({ feedback: cleared.feedback });
      });
    }
  },

  handleTimeout: () => {
    const state = get();
    if (!state.isRunning || state.feedback !== null) return;

    const currentGameState = {
      currentStep: state.currentStep,
      score: state.score,
      combo: state.combo,
      isRunning: state.isRunning,
      feedback: state.feedback,
      timeLeft: state.timeLeft,
    };

    const next = gameReducer(currentGameState, { type: 'TIMEOUT' });
    const seasonId = state.gameMode === 'daily' ? getDailyId() : getCurrentSeasonId();
    const sequence = createSeasonSequence(seasonId, state.settings.pathCount);
    runTimeoutEffects(state.settings);

    set({
      ...next,
      sequence,
    });

    scheduleFeedbackTimer('wrong', () => {
      const s = get();
      const cleared = gameReducer({ currentStep: s.currentStep, score: s.score, combo: s.combo, isRunning: s.isRunning, feedback: s.feedback, timeLeft: s.timeLeft }, { type: 'CLEAR_FEEDBACK' });
      set({ feedback: cleared.feedback });
    });
  },

  resetGame: () => {
    const state = get();
    clearFeedbackTimers();

    const currentGameState = {
      currentStep: state.currentStep,
      score: state.score,
      combo: state.combo,
      isRunning: state.isRunning,
      feedback: state.feedback,
      timeLeft: state.timeLeft,
    };

    const next = gameReducer(currentGameState, { type: 'STOP' });

    if (state.score > 0) {
      const key = bestScoreKey(state.seasonId, state.settings.pathCount);
      const updatedBestScores = saveBestScore(state.bestScores, key, state.score);
      set({
        screen: 'home',
        ...next,
        currentStep: 0,
        score: 0,
        combo: 0,
        feedback: null,
        sequence: [],
        timeLeft: 1,
        bestScores: updatedBestScores,
      });
    } else {
      set({
        screen: 'home',
        ...next,
        currentStep: 0,
        score: 0,
        combo: 0,
        feedback: null,
        sequence: [],
        timeLeft: 1,
      });
    }
  },

  // Derived
  getSpeedMs: () => getProgressiveSpeedMs(get().settings.speed, get().currentStep, get().settings.customTimerSec),
  correctLane: () => {
    const s = get();
    return getExpectedPath(s.sequence, s.seasonId, s.settings.pathCount, s.currentStep);
  },
}});
