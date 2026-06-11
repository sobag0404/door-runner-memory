// Сезонная система: seasonId = YYYY-WW, createSeasonSequence

/** Получить текущий seasonId в формате YYYY-WW */
export function getCurrentSeasonId(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 604800000;
  const week = Math.ceil((diff / oneWeek) + start.getDay() / 7);
  const ww = String(week).padStart(2, '0');
  const yyyy = String(now.getFullYear());
  return `${yyyy}-${ww}`;
}

/** Простой seedable PRNG (mulberry32) */
function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Превратить seasonId строку в числовой seed */
function seasonSeed(seasonId: string): number {
  let hash = 0;
  for (let i = 0; i < seasonId.length; i++) {
    hash = (hash << 5) - hash + seasonId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Создать недельную последовательность дверей.
 * Возвращает массив индексов (0..pathCount-1) — какой lane правильный на каждом шаге.
 */
export function createSeasonSequence(
  seasonId: string,
  pathCount: number,
  length: number = 100
): number[] {
  const rng = mulberry32(seasonSeed(seasonId));
  const sequence: number[] = [];
  for (let i = 0; i < length; i++) {
    sequence.push(Math.floor(rng() * pathCount));
  }
  return sequence;
}
