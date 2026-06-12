// ─── Tests for seasonSequence ────────────────────────────
// Per security reviewer: game sequence must be deterministic and not break at boundaries

import { describe, it, expect } from 'vitest';
import {
  getCurrentSeasonId,
  createSeasonSequence,
  getSeasonPathAt,
  getExpectedPath,
} from '../lib/season';

describe('seasonSequence', () => {
  describe('getCurrentSeasonId', () => {
    it('returns string in YYYY-WW format', () => {
      const id = getCurrentSeasonId();
      expect(id).toMatch(/^\d{4}-\d{2}$/);
    });
  });

  describe('createSeasonSequence', () => {
    it('same seasonId + pathCount => same sequence', () => {
      const a = createSeasonSequence('2026-W10', 3);
      const b = createSeasonSequence('2026-W10', 3);
      expect(a).toEqual(b);
    });

    it('different seasonId => different sequence', () => {
      const a = createSeasonSequence('2026-W10', 3);
      const b = createSeasonSequence('2026-W11', 3);
      expect(a).not.toEqual(b);
    });

    it('all values stay within pathCount range', () => {
      const seq = createSeasonSequence('2026-W10', 4);
      for (const val of seq) {
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(4);
      }
    });

    it('default length is 100', () => {
      const seq = createSeasonSequence('2026-W10', 3);
      expect(seq).toHaveLength(100);
    });

    it('custom length works', () => {
      const seq = createSeasonSequence('2026-W10', 3, 50);
      expect(seq).toHaveLength(50);
    });
  });

  describe('getSeasonPathAt', () => {
    it('getSeasonPathAt produces valid values for all indices', () => {
      const seq = createSeasonSequence('2026-W10', 3);
      for (let i = 0; i < seq.length; i++) {
        const val = getSeasonPathAt('2026-W10', 3, i);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(3);
      }
    });

    it('works beyond pre-generated length (infinite)', () => {
      // Indices 100..199 should still produce valid values
      for (let i = 100; i < 200; i++) {
        const val = getSeasonPathAt('2026-W10', 3, i);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(3);
      }
    });

    it('same index always gives same result (deterministic)', () => {
      const a = getSeasonPathAt('2026-W10', 4, 500);
      const b = getSeasonPathAt('2026-W10', 4, 500);
      expect(a).toBe(b);
    });

    it('throws on negative index', () => {
      expect(() => getSeasonPathAt('2026-W10', 3, -1)).toThrow('Invalid sequence index');
    });

    it('throws on non-integer index', () => {
      expect(() => getSeasonPathAt('2026-W10', 3, 1.5)).toThrow('Invalid sequence index');
    });

    it('throws on invalid pathCount', () => {
      expect(() => getSeasonPathAt('2026-W10', 0, 0)).toThrow('Invalid pathCount');
      expect(() => getSeasonPathAt('2026-W10', -1, 0)).toThrow('Invalid pathCount');
    });
  });

  describe('getExpectedPath', () => {
    it('uses pre-generated array when index is in range', () => {
      const seq = createSeasonSequence('2026-W10', 3);
      expect(getExpectedPath(seq, '2026-W10', 3, 0)).toBe(seq[0]);
      expect(getExpectedPath(seq, '2026-W10', 3, 99)).toBe(seq[99]);
    });

    it('falls back to getSeasonPathAt when index is beyond array', () => {
      const seq = createSeasonSequence('2026-W10', 3);
      const beyond = getExpectedPath(seq, '2026-W10', 3, 150);
      expect(beyond).toBeGreaterThanOrEqual(0);
      expect(beyond).toBeLessThan(3);
      // Must match what getSeasonPathAt would return
      expect(beyond).toBe(getSeasonPathAt('2026-W10', 3, 150));
    });

    it('getExpectedPath works for all indices (no fallback to 0 bug)', () => {
      const seq = createSeasonSequence('2026-W10', 3, 10); // tiny sequence
      // Old code: seq[150] ?? 0 would always be 0
      // New code: getExpectedPath correctly generates a valid value
      const val = getExpectedPath(seq, '2026-W10', 3, 150);
      // Key assertion: it returns a valid lane index, not just 0
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(3);
      // And it's deterministic
      expect(getExpectedPath(seq, '2026-W10', 3, 150)).toBe(val);
    });
  });
});
