// ─── Validators for localStorage data ────────────────────
// Per security reviewer P1-5: corrupted localStorage data must not break the game.
// All stored settings must be validated before use.

import type { SpeedLevel, GameMode } from '../store/gameStore';
import type { Lang } from './i18n';
import type { ThemeId } from './themes';
import type { SoundPack } from './sounds';

// ─── Valid value sets ──────────────────────────────────
const VALID_PATH_COUNTS = new Set([3, 4, 5, 6]);
const VALID_SPEEDS = new Set<SpeedLevel>(['slow', 'normal', 'fast', 'custom']);
const VALID_LANGS = new Set<Lang>(['ru', 'en']);
const VALID_THEMES = new Set<ThemeId>(['classic', 'neon', 'retro']);
const VALID_SOUND_PACKS = new Set<SoundPack>(['classic', '8bit', 'soft']);
const VALID_MODES = new Set<GameMode>(['regular', 'daily']);
const MAX_LEADERBOARD_SIZE = 50;
const MAX_NAME_LENGTH = 20;

// ─── Regex for ISO date validation ─────────────────────
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

// ─── Control character regex (strip from names) ────────
// eslint-disable-next-line no-control-regex -- intentionally matching control characters for sanitization
const CONTROL_CHARS_RE = /[\x00-\x1F\x7F]/g;

/** Validate that a value is a finite non-negative integer within [min, max] */
function validateIntInRange(value: unknown, min: number, max: number, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value) && value >= min && value <= max
    ? value
    : fallback;
}

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
    totalCorrect: validateIntInRange(value.totalCorrect, 0, 1_000_000, defaults.totalCorrect),
    bestScore: validateIntInRange(value.bestScore, 0, 1_000_000, defaults.bestScore),
    bestCombo: validateIntInRange(value.bestCombo, 0, 1_000_000, defaults.bestCombo),
    gamesPlayed: validateIntInRange(value.gamesPlayed, 0, 1_000_000, defaults.gamesPlayed),
    fastBestScore: validateIntInRange(value.fastBestScore, 0, 1_000_000, defaults.fastBestScore),
    dailyBestScore: validateIntInRange(value.dailyBestScore, 0, 1_000_000, defaults.dailyBestScore),
    totalDailyCompleted: validateIntInRange(value.totalDailyCompleted, 0, 1_000_000, defaults.totalDailyCompleted),
    lane3Best: validateIntInRange(value.lane3Best, 0, 1_000_000, defaults.lane3Best),
    lane4Best: validateIntInRange(value.lane4Best, 0, 1_000_000, defaults.lane4Best),
    lane5Best: validateIntInRange(value.lane5Best, 0, 1_000_000, defaults.lane5Best),
    lane6Best: validateIntInRange(value.lane6Best, 0, 1_000_000, defaults.lane6Best),
  };
}

// ─── Leaderboard validation ────────────────────────────
// Per security reviewer: strict validation of mode, speed, pathCount,
// score (integer), ISO date, name (sanitize + length), sort + limit.
export interface ValidatedLeaderboardEntry {
  name: string;
  score: number;
  mode: GameMode;
  pathCount: number;
  speed: SpeedLevel;
  date: string;
}

/** Sanitize a player name: strip control chars, trim, limit length */
function sanitizeName(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const cleaned = raw.replace(CONTROL_CHARS_RE, '').trim();
  if (cleaned.length === 0 || cleaned.length > MAX_NAME_LENGTH) return null;
  return cleaned;
}

export function normalizeLeaderboard(input: unknown, defaults: ValidatedLeaderboardEntry[]): ValidatedLeaderboardEntry[] {
  if (!Array.isArray(input)) return defaults;

  const result: ValidatedLeaderboardEntry[] = [];

  for (const entry of input) {
    if (!entry || typeof entry !== 'object') continue;
    const e = entry as Record<string, unknown>;

    // Validate name: must be string, no control chars, 1-20 chars
    const name = sanitizeName(e.name);
    if (name === null) continue;

    // Validate score: finite, non-negative integer
    if (typeof e.score !== 'number' || !Number.isFinite(e.score) || e.score < 0 || !Number.isInteger(e.score)) continue;

    // Validate mode: must be a known game mode
    if (!VALID_MODES.has(e.mode as GameMode)) continue;

    // Validate pathCount: must be a valid lane count
    if (!VALID_PATH_COUNTS.has(e.pathCount as number)) continue;

    // Validate speed: must be a known speed level
    if (!VALID_SPEEDS.has(e.speed as SpeedLevel)) continue;

    // Validate date: must look like an ISO date string
    if (typeof e.date !== 'string' || !ISO_DATE_RE.test(e.date)) continue;

    result.push({
      name,
      score: e.score,
      mode: e.mode as GameMode,
      pathCount: e.pathCount as number,
      speed: e.speed as SpeedLevel,
      date: e.date,
    });
  }

  // Sort by score descending, limit to top N
  result.sort((a, b) => b.score - a.score);
  const trimmed = result.slice(0, MAX_LEADERBOARD_SIZE);

  return trimmed.length > 0 ? trimmed : defaults;
}

// ─── Achievements validation ───────────────────────────
export function normalizeAchievements(input: unknown, defaults: string[]): string[] {
  if (!Array.isArray(input)) return defaults;

  const result = input.filter(
    (item): item is string => typeof item === 'string' && item.length > 0
  );

  return result.length > 0 ? result : defaults;
}
