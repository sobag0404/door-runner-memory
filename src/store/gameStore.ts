import { create } from 'zustand';
import { localStore } from '../lib/localStore';
import { getCurrentSeasonId, createSeasonSequence } from '../lib/season';
import { getDailyId } from '../lib/daily';
import { ACHIEVEMENTS } from '../lib/achievements';
import type { PlayerStats } from '../lib/achievements';

// ─── Types ─────────────────────────────────────────────
export type GameScreen = 'home' | 'game' | 'leaderboard';

export type SpeedLevel = 'slow' | 'normal' | 'fast';

export type GameMode = 'regular' | 'daily';

export interface GameSettings {
  pathCount: number; // 3, 4, 5, 6
  speed: SpeedLevel;
}

// ─── Defaults ──────────────────────────────────────────
const DEFAULT_SETTINGS: GameSettings = {
  pathCount: 3,
  speed: 'normal',
};

export function getSpeedMs(speed: SpeedLevel): number {
  switch (speed) {
    case 'slow': return 2500;
    case 'normal': return 1800;
    case 'fast': return 1200;
  }
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
  setScreen: (s: GameScreen) => void;

  // Settings
  settings: GameSettings;
  setPathCount: (n: number) => void;
  setSpeed: (s: SpeedLevel) => void;

  // Game mode
  gameMode: GameMode;
  setGameMode: (m: GameMode) => void;

  // Game state
  seasonId: string;
  sequence: number[];
  currentStep: number;
  score: number;
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
  checkAchievements: () => string[]; // returns newly unlocked IDs

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

const DEFAULT_STATS: PlayerStats = {
  totalCorrect: 0,
  bestScore: 0,
  bestCombo: 0,
  gamesPlayed: 0,
  fastBestScore: 0,
  dailyBestScore: 0,
  totalDailyCompleted: 0,
  lane3Best: 0,
  lane4Best: 0,
  lane5Best: 0,
  lane6Best: 0,
};

function loadStats(): PlayerStats {
  return localStore.get<PlayerStats>('stats', DEFAULT_STATS);
}

function saveStats(stats: PlayerStats): void {
  localStore.set('stats', stats);
}

function loadUnlockedAchievements(): string[] {
  return localStore.get<string[]>('unlockedAchievements', []);
}

function loadLeaderboard(): LeaderboardEntry[] {
  return localStore.get<LeaderboardEntry[]>('leaderboard', []);
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

  // Game mode
  gameMode: 'regular',
  setGameMode: (m) => set({ gameMode: m }),

  // Game state
  seasonId: getCurrentSeasonId(),
  sequence: [],
  currentStep: 0,
  score: 0,
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
  checkAchievements: () => {
    // Import dynamically to avoid circular deps at module level
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
      localStore.set('unlockedAchievements', updated);
      set({ unlockedAchievements: updated });
    }

    return newlyUnlocked;
  },

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
    localStore.set('leaderboard', lb);
    set({ leaderboard: lb });
  },

  // Actions
  startGame: () => {
    const { settings, gameMode } = get();
    const seasonId = gameMode === 'daily' ? getDailyId() : getCurrentSeasonId();
    const sequence = createSeasonSequence(seasonId, settings.pathCount);
    set({
      seasonId,
      sequence,
      currentStep: 0,
      score: 0,
      isRunning: true,
      feedback: null,
      timeLeft: 1,
      screen: 'game',
    });
  },

  chooseLane: (laneIndex: number) => {
    const state = get();
    if (!state.isRunning || state.feedback !== null) return;

    const correct = state.sequence[state.currentStep];
    if (laneIndex === correct) {
      const newScore = state.score + 1;
      const newStep = state.currentStep + 1;

      const key = bestScoreKey(state.seasonId, state.settings.pathCount);
      saveBestScore(key, newScore);

      set({
        score: newScore,
        currentStep: newStep,
        feedback: 'correct',
        timeLeft: 1,
        bestScores: loadBestScores(),
      });
      setTimeout(() => {
        set({ feedback: null });
      }, 350);
    } else {
      const seasonId = state.gameMode === 'daily' ? getDailyId() : getCurrentSeasonId();
      const sequence = createSeasonSequence(seasonId, state.settings.pathCount);
      set({
        currentStep: 0,
        sequence,
        feedback: 'wrong',
        timeLeft: 1,
      });
      setTimeout(() => {
        set({ feedback: null });
      }, 600);
    }
  },

  handleTimeout: () => {
    const state = get();
    if (!state.isRunning || state.feedback !== null) return;

    const seasonId = state.gameMode === 'daily' ? getDailyId() : getCurrentSeasonId();
    const sequence = createSeasonSequence(seasonId, state.settings.pathCount);
    set({
      currentStep: 0,
      sequence,
      feedback: 'wrong',
      timeLeft: 1,
    });
    setTimeout(() => {
      set({ feedback: null });
    }, 600);
  },

  resetGame: () => {
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
      timeLeft: 1,
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
