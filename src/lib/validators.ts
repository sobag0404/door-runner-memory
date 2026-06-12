// ─── Validators for localStorage data ────────────────────
// Per security reviewer P1-5: corrupted localStorage data must not break the game.
// All stored settings must be validated before use.

import type { SpeedLevel } from '../store/gameStore';
import type { Lang } from './i18n';
import type { ThemeId } from './themes';
import type { SoundPack } from './sounds';

// ─── Valid value sets ──────────────────────────────────
const VALID_PATH_COUNTS = new Set([3, 4, 5, 6]);
const VALID_SPEEDS = new Set<SpeedLevel>(['slow', 'normal', 'fast', 'custom']);
const VALID_LANGS = new Set<Lang>(['ru', 'en']);
const VALID_THEMES = new Set<ThemeId>(['classic', 'neon', 'retro']);
const VALID_SOUND_PACKS = new Set<SoundPack>(['classic', '8bit', 'soft']);

// ─── Generic helpers ───────────────────────────────────
function validateNumber(value: unknown, validSet: Set<number>, fallback: number): number {
  return typeof value === 'number' && validSet.has(value) ? value : fallback;
}

function validateString<T extends string>(value: unknown, validSet: Set<T>, fallback: T): T {
  return typeof value === 'string' && validSet.has(value as T) ? (value as T) : fallback;
}

function validateBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function validateNumberInRange(value: unknown, min: number, max: number, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max
    ? value
    : fallback;
}

// ─── Settings validation ───────────────────────────────
export interface ValidatedSettings {
  pathCount: number;
  speed: SpeedLevel;
  soundEnabled: boolean;
  lang: Lang;
  theme: ThemeId;
  soundPack: SoundPack;
  customTimerSec: number;
}

export function normalizeSettings(
  input: unknown,
  defaults: ValidatedSettings
): ValidatedSettings {
  if (!input || typeof input !== 'object') return defaults;

  const value = input as Record<string, unknown>;

  return {
    pathCount: validateNumber(value.pathCount, VALID_PATH_COUNTS, defaults.pathCount),
    speed: validateString<SpeedLevel>(value.speed, VALID_SPEEDS, defaults.speed),
    soundEnabled: validateBoolean(value.soundEnabled, defaults.soundEnabled),
    lang: validateString<Lang>(value.lang, VALID_LANGS, defaults.lang),
    theme: validateString<ThemeId>(value.theme, VALID_THEMES, defaults.theme),
    soundPack: validateString<SoundPack>(value.soundPack, VALID_SOUND_PACKS, defaults.soundPack),
    customTimerSec: validateNumberInRange(value.customTimerSec, 3, 30, defaults.customTimerSec),
  };
}

// ─── Best scores validation ────────────────────────────
export function normalizeBestScores(input: unknown, defaults: Record<string, number>): Record<string, number> {
  if (!input || typeof input !== 'object') return defaults;

  const result: Record<string, number> = {};
  const value = input as Record<string, unknown>;

  for (const [key, val] of Object.entries(value)) {
    if (typeof val === 'number' && Number.isFinite(val) && val >= 0) {
      result[key] = val;
    }
  }

  return Object.keys(result).length > 0 ? result : defaults;
}

// ─── Stats validation ─────────────────────────────────
export interface ValidatedStats {
  totalCorrect: number;
  bestScore: number;
  bestCombo: number;
  gamesPlayed: number;
  fastBestScore: number;
  dailyBestScore: number;
  totalDailyCompleted: number;
  lane3Best: number;
  lane4Best: number;
  lane5Best: number;
  lane6Best: number;
}

export function normalizeStats(input: unknown, defaults: ValidatedStats): ValidatedStats {
  if (!input || typeof input !== 'object') return defaults;

  const value = input as Record<string, unknown>;

  return {
    totalCorrect: validateNumberInRange(value.totalCorrect, 0, Infinity, defaults.totalCorrect),
    bestScore: validateNumberInRange(value.bestScore, 0, Infinity, defaults.bestScore),
    bestCombo: validateNumberInRange(value.bestCombo, 0, Infinity, defaults.bestCombo),
    gamesPlayed: validateNumberInRange(value.gamesPlayed, 0, Infinity, defaults.gamesPlayed),
    fastBestScore: validateNumberInRange(value.fastBestScore, 0, Infinity, defaults.fastBestScore),
    dailyBestScore: validateNumberInRange(value.dailyBestScore, 0, Infinity, defaults.dailyBestScore),
    totalDailyCompleted: validateNumberInRange(value.totalDailyCompleted, 0, Infinity, defaults.totalDailyCompleted),
    lane3Best: validateNumberInRange(value.lane3Best, 0, Infinity, defaults.lane3Best),
    lane4Best: validateNumberInRange(value.lane4Best, 0, Infinity, defaults.lane4Best),
    lane5Best: validateNumberInRange(value.lane5Best, 0, Infinity, defaults.lane5Best),
    lane6Best: validateNumberInRange(value.lane6Best, 0, Infinity, defaults.lane6Best),
  };
}

// ─── Leaderboard validation ────────────────────────────
export interface ValidatedLeaderboardEntry {
  name: string;
  score: number;
  mode: string;
  pathCount: number;
  speed: string;
  date: string;
}

export function normalizeLeaderboard(input: unknown, defaults: ValidatedLeaderboardEntry[]): ValidatedLeaderboardEntry[] {
  if (!Array.isArray(input)) return defaults;

  const result: ValidatedLeaderboardEntry[] = [];

  for (const entry of input) {
    if (!entry || typeof entry !== 'object') continue;
    const e = entry as Record<string, unknown>;

    if (
      typeof e.name === 'string' &&
      typeof e.score === 'number' && Number.isFinite(e.score) && e.score >= 0 &&
      typeof e.mode === 'string' &&
      typeof e.pathCount === 'number' &&
      typeof e.speed === 'string' &&
      typeof e.date === 'string'
    ) {
      result.push({
        name: e.name.slice(0, 20),
        score: e.score,
        mode: e.mode,
        pathCount: e.pathCount,
        speed: e.speed,
        date: e.date,
      });
    }
  }

  return result.length > 0 ? result : defaults;
}

// ─── Achievements validation ───────────────────────────
export function normalizeAchievements(input: unknown, defaults: string[]): string[] {
  if (!Array.isArray(input)) return defaults;

  const result = input.filter(
    (item): item is string => typeof item === 'string' && item.length > 0
  );

  return result.length > 0 ? result : defaults;
}
