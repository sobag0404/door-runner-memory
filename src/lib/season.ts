// Сезонная система: seasonId = YYYY-WW, createSeasonSequence, getSeasonPathAt

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

// ─── Infinite Deterministic Generator ────────────────────
// Per-reviewer recommendation: no fallback to door 0 after sequence length.
// Uses per-index seeded PRNG: seed = hash(seasonId + pathCount + index)
// Guarantees same result for any index without pre-generating the whole array.

/** Комбинированный seed для конкретного индекса */
function indexSeed(seasonId: string, pathCount: number, index: number): number {
  const str = `${seasonId}:${pathCount}:${index}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Получить правильную дверь для любого индекса.
 * Детерминированно: одинаковый seasonId + pathCount + index = одинаковый результат.
 * Бесконечный: работает для любого index >= 0.
 * Не требует предгенерации массива.
 *
 * @throws Error если index < 0 или pathCount < 1
 */
export function getSeasonPathAt(
  seasonId: string,
  pathCount: number,
  index: number
): number {
  if (!Number.isInteger(index) || index < 0) {
    throw new Error(`Invalid sequence index: ${index}`);
  }
  if (!Number.isInteger(pathCount) || pathCount < 1) {
    throw new Error(`Invalid pathCount: ${pathCount}`);
  }

  const rng = mulberry32(indexSeed(seasonId, pathCount, index));
  return Math.floor(rng() * pathCount);
}

/**
 * Безопасно получить путь из sequence array с fallback на getSeasonPathAt.
 * Если индекс в пределах массива — берёт из массива (быстро).
 * Если индекс за пределами — вычисляет детерминированно через getSeasonPathAt.
 *
 * @param sequence Предгенерированный массив
 * @param seasonId Идентификатор сезона
 * @param pathCount Количество дорожек
 * @param index Индекс шага
 */
export function getExpectedPath(
  sequence: readonly number[],
  seasonId: string,
  pathCount: number,
  index: number
): number {
  if (index >= 0 && index < sequence.length) {
    return sequence[index];
  }
  return getSeasonPathAt(seasonId, pathCount, index);
}
