import { afterEach, describe, expect, it, vi } from 'vitest';
import { detectLang } from '../lib/i18n';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('detectLang', () => {
  it('falls back to English when navigator.language is missing', () => {
    vi.stubGlobal('navigator', {});

    expect(detectLang()).toBe('en');
  });

  it('detects Russian browser language', () => {
    vi.stubGlobal('navigator', { language: 'ru-RU' });

    expect(detectLang()).toBe('ru');
  });

  it('uses saved language before browser language', () => {
    const storage = new Map<string, string>([['drm_lang', 'ru']]);
    vi.stubGlobal('window', {});
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
    });
    vi.stubGlobal('navigator', { language: 'en-US' });

    expect(detectLang()).toBe('ru');
  });
});
