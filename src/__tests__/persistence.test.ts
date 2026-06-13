import { afterEach, describe, expect, it, vi } from 'vitest';

function createStorage(initial: Record<string, string> = {}): Storage {
  const store = new Map(Object.entries(initial));

  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

function stubBrowserStorage(initial: Record<string, string> = {}): Storage {
  const storage = createStorage(initial);
  vi.stubGlobal('window', { localStorage: storage });
  vi.stubGlobal('navigator', { language: 'en-US' });
  vi.stubGlobal('localStorage', storage);
  return storage;
}

async function importFreshGameStore(initial: Record<string, string> = {}) {
  const storage = stubBrowserStorage(initial);
  vi.resetModules();
  const [{ useGameStore }, { getSoundPack }] = await Promise.all([
    import('../store/gameStore'),
    import('../lib/sounds'),
  ]);
  return { storage, useGameStore, getSoundPack };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('localStore persistence adapter', () => {
  it('uses drm_ prefix, JSON serialization, and remove behavior', async () => {
    const storage = stubBrowserStorage();
    const { localStore } = await import('../lib/localStore');

    localStore.set('settings', { pathCount: 4 });

    expect(storage.getItem('settings')).toBeNull();
    expect(JSON.parse(storage.getItem('drm_settings') ?? '{}')).toEqual({ pathCount: 4 });
    expect(localStore.get('settings', { pathCount: 3 })).toEqual({ pathCount: 4 });

    localStore.remove('settings');
    expect(storage.getItem('drm_settings')).toBeNull();
  });

  it('returns fallback for missing storage, malformed JSON, and server context', async () => {
    const storage = stubBrowserStorage({ drm_settings: '{bad json' });
    const { localStore } = await import('../lib/localStore');

    expect(localStore.get('settings', 'fallback')).toBe('fallback');

    storage.removeItem('drm_settings');
    expect(localStore.get('settings', 'fallback')).toBe('fallback');

    vi.unstubAllGlobals();
    expect(localStore.get('settings', 'server fallback')).toBe('server fallback');
  });

  it('swallows storage write failures', async () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      removeItem: () => undefined,
      setItem: () => {
        throw new Error('quota exceeded');
      },
    });
    const { localStore } = await import('../lib/localStore');

    expect(() => localStore.set('settings', { pathCount: 4 })).not.toThrow();
  });
});

describe('scalar preference keys', () => {
  it('stores language, theme, and sound pack outside drm_settings', async () => {
    const storage = stubBrowserStorage({
      drm_settings: JSON.stringify({
        pathCount: 6,
        speed: 'fast',
        soundEnabled: false,
        lang: 'en',
        theme: 'retro',
        soundPack: '8bit',
        customTimerSec: 7,
      }),
    });
    const [
      { detectLang, saveLang },
      { detectTheme, saveTheme },
      { detectSoundPack, saveSoundPack, getSoundPack },
    ] = await Promise.all([
      import('../lib/i18n'),
      import('../lib/themes'),
      import('../lib/sounds'),
    ]);

    saveLang('ru');
    saveTheme('neon');
    saveSoundPack('soft');

    expect(storage.getItem('drm_lang')).toBe('ru');
    expect(storage.getItem('drm_theme')).toBe('neon');
    expect(storage.getItem('drm_soundPack')).toBe('soft');
    expect(JSON.parse(storage.getItem('drm_settings') ?? '{}')).toMatchObject({
      lang: 'en',
      theme: 'retro',
      soundPack: '8bit',
    });
    expect(detectLang()).toBe('ru');
    expect(detectTheme()).toBe('neon');
    expect(detectSoundPack()).toBe('soft');
    expect(getSoundPack()).toBe('soft');
  });
});

describe('gameStore initialization from persisted data', () => {
  it('lets valid drm_settings override scalar preference defaults without rewriting scalar keys', async () => {
    const { storage, useGameStore, getSoundPack } = await importFreshGameStore({
      drm_lang: 'ru',
      drm_theme: 'neon',
      drm_soundPack: 'soft',
      drm_settings: JSON.stringify({
        pathCount: 5,
        speed: 'fast',
        soundEnabled: false,
        lang: 'en',
        theme: 'retro',
        soundPack: '8bit',
        customTimerSec: 12,
      }),
    });

    expect(useGameStore.getState().settings).toEqual({
      pathCount: 5,
      speed: 'fast',
      soundEnabled: false,
      lang: 'en',
      theme: 'retro',
      soundPack: '8bit',
      customTimerSec: 12,
    });
    expect(storage.getItem('drm_lang')).toBe('ru');
    expect(storage.getItem('drm_theme')).toBe('neon');
    expect(storage.getItem('drm_soundPack')).toBe('soft');
    expect(getSoundPack()).toBe('8bit');
  });

  it('normalizes persisted settings, scores, stats, achievements, and leaderboard', async () => {
    const { useGameStore } = await importFreshGameStore({
      drm_lang: 'en',
      drm_theme: 'neon',
      drm_soundPack: 'soft',
      drm_settings: JSON.stringify({
        pathCount: 99,
        speed: 'turbo',
        soundEnabled: false,
        lang: 'de',
        theme: 'missing',
        soundPack: 'loud',
        customTimerSec: 100,
      }),
      drm_bestScores: JSON.stringify({
        valid: 12,
        negative: -1,
        text: 'bad',
      }),
      drm_stats: JSON.stringify({
        totalCorrect: 5,
        bestScore: 'bad',
        bestCombo: 2,
        gamesPlayed: -1,
        fastBestScore: 7,
      }),
      drm_unlockedAchievements: JSON.stringify(['first_10', '', 42, 'combo_5']),
      drm_leaderboard: JSON.stringify([
        { name: 'Low', score: 1, mode: 'regular', pathCount: 3, speed: 'normal', date: '2026-01-01T00:00:00.000Z' },
        { name: 'Invalid', score: -1, mode: 'regular', pathCount: 3, speed: 'normal', date: '2026-01-01T00:00:00.000Z' },
        { name: 'High', score: 10, mode: 'daily', pathCount: 4, speed: 'fast', date: '2026-01-02T00:00:00.000Z' },
      ]),
    });
    const state = useGameStore.getState();

    expect(state.settings).toEqual({
      pathCount: 3,
      speed: 'normal',
      soundEnabled: false,
      lang: 'en',
      theme: 'neon',
      soundPack: 'soft',
      customTimerSec: 10,
    });
    expect(state.bestScores).toEqual({ valid: 12 });
    expect(state.stats).toMatchObject({
      totalCorrect: 5,
      bestScore: 0,
      bestCombo: 2,
      gamesPlayed: 0,
      fastBestScore: 7,
    });
    expect(state.unlockedAchievements).toEqual(['first_10', 'combo_5']);
    expect(state.leaderboard.map((entry) => entry.name)).toEqual(['High', 'Low']);
  });

  it('mirrors setting setters to drm_settings and scalar keys where applicable', async () => {
    const { storage, useGameStore } = await importFreshGameStore();
    const store = useGameStore.getState();

    store.setLang('ru');
    store.setTheme('retro');
    store.setSoundPack('soft');
    store.setPathCount(6);

    const settings = JSON.parse(storage.getItem('drm_settings') ?? '{}');
    expect(settings).toMatchObject({
      lang: 'ru',
      theme: 'retro',
      soundPack: 'soft',
      pathCount: 6,
    });
    expect(storage.getItem('drm_lang')).toBe('ru');
    expect(storage.getItem('drm_theme')).toBe('retro');
    expect(storage.getItem('drm_soundPack')).toBe('soft');
  });
});
