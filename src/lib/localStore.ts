// localStore — абстракция над localStorage для хранения game state

const PREFIX = 'drm_';

function getKey(key: string): string {
  return `${PREFIX}${key}`;
}

export const localStore = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const raw = localStorage.getItem(getKey(key));
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getKey(key), JSON.stringify(value));
    } catch {
      // quota exceeded — ignore
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(getKey(key));
  },
};
