// ─── Tests for validators ────────────────────────────────
// Per security reviewer: corrupted localStorage data must not break the game

import { describe, it, expect } from 'vitest';
import {
  normalizeSettings,
  normalizeBestScores,
  normalizeStats,
  normalizeAchievements,
  normalizeLeaderboard,
} from '../lib/validators';

const DEFAULT_SETTINGS = {
  pathCount: 3,
  speed: 'normal' as const,
  soundEnabled: true,
  lang: 'ru' as const,
  theme: 'classic' as const,
  soundPack: 'classic' as const,
  customTimerSec: 10,
};

const DEFAULT_STATS = {
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

describe('normalizeSettings', () => {
  it('returns defaults for null input', () => {
    expect(normalizeSettings(null, DEFAULT_SETTINGS)).toEqual(DEFAULT_SETTINGS);
  });

  it('returns defaults for undefined input', () => {
    expect(normalizeSettings(undefined, DEFAULT_SETTINGS)).toEqual(DEFAULT_SETTINGS);
  });

  it('returns defaults for non-object input', () => {
    expect(normalizeSettings('string', DEFAULT_SETTINGS)).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings(42, DEFAULT_SETTINGS)).toEqual(DEFAULT_SETTINGS);
  });

  it('valid settings pass through', () => {
    const valid = { pathCount: 5, speed: 'fast', soundEnabled: false, lang: 'en', theme: 'neon', soundPack: '8bit', customTimerSec: 20 };
    expect(normalizeSettings(valid, DEFAULT_SETTINGS)).toEqual(valid);
  });

  it('invalid pathCount falls back', () => {
    expect(normalizeSettings({ pathCount: 999 }, DEFAULT_SETTINGS).pathCount).toBe(3);
    expect(normalizeSettings({ pathCount: 'four' }, DEFAULT_SETTINGS).pathCount).toBe(3);
    expect(normalizeSettings({ pathCount: 2 }, DEFAULT_SETTINGS).pathCount).toBe(3);
  });

  it('invalid speed falls back', () => {
    expect(normalizeSettings({ speed: 'turbo' }, DEFAULT_SETTINGS).speed).toBe('normal');
    expect(normalizeSettings({ speed: 123 }, DEFAULT_SETTINGS).speed).toBe('normal');
  });

  it('invalid lang falls back', () => {
    expect(normalizeSettings({ lang: 'de' }, DEFAULT_SETTINGS).lang).toBe('ru');
    expect(normalizeSettings({ lang: 42 }, DEFAULT_SETTINGS).lang).toBe('ru');
  });

  it('invalid theme falls back', () => {
    expect(normalizeSettings({ theme: 'dark' }, DEFAULT_SETTINGS).theme).toBe('classic');
  });

  it('invalid soundPack falls back', () => {
    expect(normalizeSettings({ soundPack: 'metal' }, DEFAULT_SETTINGS).soundPack).toBe('classic');
  });

  it('invalid customTimerSec falls back', () => {
    expect(normalizeSettings({ customTimerSec: 100 }, DEFAULT_SETTINGS).customTimerSec).toBe(10);
    expect(normalizeSettings({ customTimerSec: 0 }, DEFAULT_SETTINGS).customTimerSec).toBe(10);
    expect(normalizeSettings({ customTimerSec: 'ten' }, DEFAULT_SETTINGS).customTimerSec).toBe(10);
  });

  it('partial valid object keeps valid fields, falls back invalid ones', () => {
    const input = { pathCount: 5, speed: 'turbo', soundEnabled: false };
    const result = normalizeSettings(input, DEFAULT_SETTINGS);
    expect(result.pathCount).toBe(5);
    expect(result.speed).toBe('normal'); // fallback
    expect(result.soundEnabled).toBe(false);
    expect(result.lang).toBe('ru'); // fallback
  });
});

describe('normalizeBestScores', () => {
  it('returns defaults for null', () => {
    expect(normalizeBestScores(null, {})).toEqual({});
  });

  it('valid scores pass through', () => {
    const scores = { '2026-W10_p3': 42, '2026-W10_p4': 15 };
    expect(normalizeBestScores(scores, {})).toEqual(scores);
  });

  it('negative scores are filtered out', () => {
    const result = normalizeBestScores({ a: 10, b: -5 }, {});
    expect(result).toEqual({ a: 10 });
  });

  it('non-numeric values are filtered out', () => {
    const result = normalizeBestScores({ a: 10, b: 'high' }, {});
    expect(result).toEqual({ a: 10 });
  });

  it('Infinity is filtered out', () => {
    const result = normalizeBestScores({ a: Infinity }, {});
    expect(result).toEqual({});
  });
});

describe('normalizeStats', () => {
  it('returns defaults for null', () => {
    expect(normalizeStats(null, DEFAULT_STATS)).toEqual(DEFAULT_STATS);
  });

  it('valid stats pass through', () => {
    const stats = { ...DEFAULT_STATS, bestScore: 100, gamesPlayed: 5 };
    expect(normalizeStats(stats, DEFAULT_STATS)).toEqual(stats);
  });

  it('negative values fall back to defaults', () => {
    const result = normalizeStats({ bestScore: -10 }, DEFAULT_STATS);
    expect(result.bestScore).toBe(0);
  });

  it('non-numeric values fall back', () => {
    const result = normalizeStats({ bestScore: 'high' }, DEFAULT_STATS);
    expect(result.bestScore).toBe(0);
  });
});

describe('normalizeAchievements', () => {
  it('returns defaults for null', () => {
    expect(normalizeAchievements(null, [])).toEqual([]);
  });

  it('valid string array passes through', () => {
    expect(normalizeAchievements(['a', 'b'], [])).toEqual(['a', 'b']);
  });

  it('non-string items are filtered', () => {
    expect(normalizeAchievements(['a', 42, 'b'], [])).toEqual(['a', 'b']);
  });

  it('empty strings are filtered', () => {
    expect(normalizeAchievements(['a', '', 'b'], [])).toEqual(['a', 'b']);
  });

  it('all invalid returns defaults', () => {
    expect(normalizeAchievements([42, true], ['default'])).toEqual(['default']);
  });
});

describe('normalizeLeaderboard', () => {
  it('returns defaults for null', () => {
    expect(normalizeLeaderboard(null, [])).toEqual([]);
  });

  it('valid entries pass through', () => {
    const entries = [{ name: 'Alice', score: 100, mode: 'regular', pathCount: 3, speed: 'normal', date: '2026-01-01' }];
    expect(normalizeLeaderboard(entries, [])).toEqual(entries);
  });

  it('name is truncated to 20 chars', () => {
    const entries = [{ name: 'A'.repeat(50), score: 100, mode: 'regular', pathCount: 3, speed: 'normal', date: '2026-01-01' }];
    const result = normalizeLeaderboard(entries, []);
    expect(result[0].name).toHaveLength(20);
  });

  it('entries with missing fields are filtered', () => {
    const entries = [
      { name: 'Alice', score: 100 }, // missing fields
      { name: 'Bob', score: 50, mode: 'regular', pathCount: 3, speed: 'normal', date: '2026-01-01' },
    ];
    const result = normalizeLeaderboard(entries, []);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Bob');
  });

  it('negative scores are filtered', () => {
    const entries = [{ name: 'Hacker', score: -999, mode: 'regular', pathCount: 3, speed: 'normal', date: '2026-01-01' }];
    expect(normalizeLeaderboard(entries, [])).toEqual([]);
  });
});
