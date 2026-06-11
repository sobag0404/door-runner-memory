// achievements.ts — Система достижений с прогрессом

export interface Achievement {
  id: string;
  title: string;
  titleKey: string; // i18n key
  description: string;
  descriptionKey: string; // i18n key
  icon: string;
  condition: (stats: PlayerStats) => boolean;
  /** Returns { current, target } for progress bar */
  progress: (stats: PlayerStats) => { current: number; target: number };
}

export interface PlayerStats {
  totalCorrect: number;       // всего правильных ответов за всё время
  bestScore: number;          // лучший счёт за сессию (всех времён)
  bestCombo: number;          // лучший комбо
  gamesPlayed: number;        // кол-во игр
  fastBestScore: number;      // лучший на fast скорости
  dailyBestScore: number;     // лучший в daily challenge
  totalDailyCompleted: number; // кол-во пройденных daily
  lane3Best: number;          // лучший на 3 lanes
  lane4Best: number;          // лучший на 4 lanes
  lane5Best: number;          // лучший на 5 lanes
  lane6Best: number;          // лучший на 6 lanes
}

export const ACHIEVEMENTS: Achievement[] = [
  // ─── Счёт ───
  {
    id: 'first_10',
    title: 'First Steps',
    titleKey: 'ach.first10',
    description: 'Score 10 in a single game',
    descriptionKey: 'ach.first10Desc',
    icon: '🎯',
    condition: (s) => s.bestScore >= 10,
    progress: (s) => ({ current: Math.min(s.bestScore, 10), target: 10 }),
  },
  {
    id: 'score_25',
    title: 'Getting Good',
    titleKey: 'ach.score25',
    description: 'Score 25 in a single game',
    descriptionKey: 'ach.score25Desc',
    icon: '🌟',
    condition: (s) => s.bestScore >= 25,
    progress: (s) => ({ current: Math.min(s.bestScore, 25), target: 25 }),
  },
  {
    id: 'score_50',
    title: 'Memory Master',
    titleKey: 'ach.score50',
    description: 'Score 50 in a single game',
    descriptionKey: 'ach.score50Desc',
    icon: '🧠',
    condition: (s) => s.bestScore >= 50,
    progress: (s) => ({ current: Math.min(s.bestScore, 50), target: 50 }),
  },
  {
    id: 'score_100',
    title: 'Legendary',
    titleKey: 'ach.score100',
    description: 'Score 100 in a single game',
    descriptionKey: 'ach.score100Desc',
    icon: '👑',
    condition: (s) => s.bestScore >= 100,
    progress: (s) => ({ current: Math.min(s.bestScore, 100), target: 100 }),
  },

  // ─── Combo ───
  {
    id: 'combo_5',
    title: 'On Fire!',
    titleKey: 'ach.combo5',
    description: 'Reach a 5x combo',
    descriptionKey: 'ach.combo5Desc',
    icon: '🔥',
    condition: (s) => s.bestCombo >= 5,
    progress: (s) => ({ current: Math.min(s.bestCombo, 5), target: 5 }),
  },
  {
    id: 'combo_10',
    title: 'Unstoppable',
    titleKey: 'ach.combo10',
    description: 'Reach a 10x combo',
    descriptionKey: 'ach.combo10Desc',
    icon: '⚡',
    condition: (s) => s.bestCombo >= 10,
    progress: (s) => ({ current: Math.min(s.bestCombo, 10), target: 10 }),
  },
  {
    id: 'combo_20',
    title: 'Superhuman',
    titleKey: 'ach.combo20',
    description: 'Reach a 20x combo',
    descriptionKey: 'ach.combo20Desc',
    icon: '💎',
    condition: (s) => s.bestCombo >= 20,
    progress: (s) => ({ current: Math.min(s.bestCombo, 20), target: 20 }),
  },

  // ─── Всего ответов ───
  {
    id: 'total_100',
    title: 'Persistent',
    titleKey: 'ach.total100',
    description: 'Answer 100 correct total',
    descriptionKey: 'ach.total100Desc',
    icon: '💪',
    condition: (s) => s.totalCorrect >= 100,
    progress: (s) => ({ current: Math.min(s.totalCorrect, 100), target: 100 }),
  },
  {
    id: 'total_500',
    title: 'Dedicated',
    titleKey: 'ach.total500',
    description: 'Answer 500 correct total',
    descriptionKey: 'ach.total500Desc',
    icon: '🏋️',
    condition: (s) => s.totalCorrect >= 500,
    progress: (s) => ({ current: Math.min(s.totalCorrect, 500), target: 500 }),
  },
  {
    id: 'total_1000',
    title: 'Obsessed',
    titleKey: 'ach.total1000',
    description: 'Answer 1000 correct total',
    descriptionKey: 'ach.total1000Desc',
    icon: '🏅',
    condition: (s) => s.totalCorrect >= 1000,
    progress: (s) => ({ current: Math.min(s.totalCorrect, 1000), target: 1000 }),
  },

  // ─── Игры ───
  {
    id: 'games_10',
    title: 'Warming Up',
    titleKey: 'ach.games10',
    description: 'Play 10 games',
    descriptionKey: 'ach.games10Desc',
    icon: '🎮',
    condition: (s) => s.gamesPlayed >= 10,
    progress: (s) => ({ current: Math.min(s.gamesPlayed, 10), target: 10 }),
  },
  {
    id: 'games_50',
    title: 'Veteran',
    titleKey: 'ach.games50',
    description: 'Play 50 games',
    descriptionKey: 'ach.games50Desc',
    icon: '🎖️',
    condition: (s) => s.gamesPlayed >= 50,
    progress: (s) => ({ current: Math.min(s.gamesPlayed, 50), target: 50 }),
  },

  // ─── Скорость ───
  {
    id: 'fast_10',
    title: 'Speed Demon',
    titleKey: 'ach.fast10',
    description: 'Score 10 on Fast speed',
    descriptionKey: 'ach.fast10Desc',
    icon: '⚡',
    condition: (s) => s.fastBestScore >= 10,
    progress: (s) => ({ current: Math.min(s.fastBestScore, 10), target: 10 }),
  },
  {
    id: 'fast_25',
    title: 'Lightning Reflexes',
    titleKey: 'ach.fast25',
    description: 'Score 25 on Fast speed',
    descriptionKey: 'ach.fast25Desc',
    icon: '🌩️',
    condition: (s) => s.fastBestScore >= 25,
    progress: (s) => ({ current: Math.min(s.fastBestScore, 25), target: 25 }),
  },

  // ─── Lanes ───
  {
    id: 'lane4_20',
    title: 'Multitasker',
    titleKey: 'ach.lane4',
    description: 'Score 20 with 4 lanes',
    descriptionKey: 'ach.lane4Desc',
    icon: '🛤️',
    condition: (s) => s.lane4Best >= 20,
    progress: (s) => ({ current: Math.min(s.lane4Best, 20), target: 20 }),
  },
  {
    id: 'lane5_15',
    title: 'Path Finder',
    titleKey: 'ach.lane5',
    description: 'Score 15 with 5 lanes',
    descriptionKey: 'ach.lane5Desc',
    icon: '🗺️',
    condition: (s) => s.lane5Best >= 15,
    progress: (s) => ({ current: Math.min(s.lane5Best, 15), target: 15 }),
  },
  {
    id: 'lane6_10',
    title: 'Chaos Navigator',
    titleKey: 'ach.lane6',
    description: 'Score 10 with 6 lanes',
    descriptionKey: 'ach.lane6Desc',
    icon: '🌀',
    condition: (s) => s.lane6Best >= 10,
    progress: (s) => ({ current: Math.min(s.lane6Best, 10), target: 10 }),
  },

  // ─── Daily ───
  {
    id: 'daily_first',
    title: 'Daily Player',
    titleKey: 'ach.daily1',
    description: 'Complete your first Daily Challenge',
    descriptionKey: 'ach.daily1Desc',
    icon: '📅',
    condition: (s) => s.totalDailyCompleted >= 1,
    progress: (s) => ({ current: Math.min(s.totalDailyCompleted, 1), target: 1 }),
  },
  {
    id: 'daily_7',
    title: 'Week Warrior',
    titleKey: 'ach.daily7',
    description: 'Complete 7 Daily Challenges',
    descriptionKey: 'ach.daily7Desc',
    icon: '📆',
    condition: (s) => s.totalDailyCompleted >= 7,
    progress: (s) => ({ current: Math.min(s.totalDailyCompleted, 7), target: 7 }),
  },
  {
    id: 'daily_best10',
    title: 'Daily Champion',
    titleKey: 'ach.dailyBest',
    description: 'Score 10 in a Daily Challenge',
    descriptionKey: 'ach.dailyBestDesc',
    icon: '🏆',
    condition: (s) => s.dailyBestScore >= 10,
    progress: (s) => ({ current: Math.min(s.dailyBestScore, 10), target: 10 }),
  },
];
