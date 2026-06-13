import { localStore } from '../lib/localStore';
import { normalizeSettings, normalizeBestScores, normalizeStats, normalizeAchievements, normalizeLeaderboard } from '../lib/validators';
import type { PlayerStats } from '../lib/achievements';
import { setSoundPack as applySoundPack, type SoundPack, detectSoundPack, saveSoundPack } from '../lib/sounds';
import { type Lang, detectLang, saveLang } from '../lib/i18n';
import { type ThemeId, detectTheme, saveTheme } from '../lib/themes';
import type { GameSettings, LeaderboardEntry } from './gameStore';

export const DEFAULT_SETTINGS: GameSettings = {
  pathCount: 3,
  speed: 'normal',
  soundEnabled: true,
  lang: detectLang(),
  theme: detectTheme(),
  soundPack: detectSoundPack(),
  customTimerSec: 10,
};

export const DEFAULT_STATS: PlayerStats = {
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

export function bestScoreKey(seasonId: string, pathCount: number): string {
  return `${seasonId}_p${pathCount}`;
}

export function loadBestScores(): Record<string, number> {
  const raw = localStore.get<unknown>('bestScores', null);
  return normalizeBestScores(raw, {});
}

export function saveBestScore(scores: Record<string, number>, key: string, score: number): Record<string, number> {
  if (!scores[key] || score > scores[key]) {
    const updated = { ...scores, [key]: score };
    localStore.set('bestScores', updated);
    return updated;
  }
  return scores;
}

export function loadSettings(): GameSettings {
  const raw = localStore.get<unknown>('settings', null);
  const saved = normalizeSettings(raw, DEFAULT_SETTINGS);
  applySoundPack(saved.soundPack);
  return saved;
}

export function saveSettings(settings: GameSettings): GameSettings {
  localStore.set('settings', settings);
  return settings;
}

export function saveLangSettings(current: GameSettings, lang: Lang): GameSettings {
  const settings = { ...current, lang };
  saveLang(lang);
  return saveSettings(settings);
}

export function saveThemeSettings(current: GameSettings, theme: ThemeId): GameSettings {
  const settings = { ...current, theme };
  saveTheme(theme);
  return saveSettings(settings);
}

export function saveSoundPackSettings(current: GameSettings, soundPack: SoundPack): GameSettings {
  const settings = { ...current, soundPack };
  saveSoundPack(soundPack);
  applySoundPack(soundPack);
  return saveSettings(settings);
}

export function loadStats(): PlayerStats {
  const raw = localStore.get<unknown>('stats', null);
  return normalizeStats(raw, DEFAULT_STATS);
}

export function saveStats(stats: PlayerStats): void {
  localStore.set('stats', stats);
}

export function loadUnlockedAchievements(): string[] {
  const raw = localStore.get<unknown>('unlockedAchievements', null);
  return normalizeAchievements(raw, []);
}

export function saveUnlockedAchievements(achievementIds: string[]): void {
  localStore.set('unlockedAchievements', achievementIds);
}

export function loadLeaderboard(): LeaderboardEntry[] {
  const raw = localStore.get<unknown>('leaderboard', null);
  return normalizeLeaderboard(raw, []);
}

export function saveLeaderboard(leaderboard: LeaderboardEntry[]): void {
  localStore.set('leaderboard', leaderboard);
}
