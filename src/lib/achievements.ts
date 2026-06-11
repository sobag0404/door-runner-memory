// achievements.ts — Система достижений

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: PlayerStats) => boolean;
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
    description: 'Score 10 in a single game',
    icon: '🎯',
    condition: (s) => s.bestScore >= 10,
  },
  {
    id: 'score_25',
    title: 'Getting Good',
    description: 'Score 25 in a single game',
    icon: '🌟',
    condition: (s) => s.bestScore >= 25,
  },
  {
    id: 'score_50',
    title: 'Memory Master',
    description: 'Score 50 in a single game',
    icon: '🧠',
    condition: (s) => s.bestScore >= 50,
  },
  {
    id: 'score_100',
    title: 'Legendary',
    description: 'Score 100 in a single game',
    icon: '👑',
    condition: (s) => s.bestScore >= 100,
  },

  // ─── Combo ───
  {
    id: 'combo_5',
    title: 'On Fire!',
    description: 'Reach a 5x combo',
    icon: '🔥',
    condition: (s) => s.bestCombo >= 5,
  },
  {
    id: 'combo_10',
    title: 'Unstoppable',
    description: 'Reach a 10x combo',
    icon: '⚡',
    condition: (s) => s.bestCombo >= 10,
  },
  {
    id: 'combo_20',
    title: 'Superhuman',
    description: 'Reach a 20x combo',
    icon: '💎',
    condition: (s) => s.bestCombo >= 20,
  },

  // ─── Всего ответов ───
  {
    id: 'total_100',
    title: 'Persistent',
    description: 'Answer 100 correct total',
    icon: '💪',
    condition: (s) => s.totalCorrect >= 100,
  },
  {
    id: 'total_500',
    title: 'Dedicated',
    description: 'Answer 500 correct total',
    icon: '🏋️',
    condition: (s) => s.totalCorrect >= 500,
  },
  {
    id: 'total_1000',
    title: 'Obsessed',
    description: 'Answer 1000 correct total',
    icon: '🏅',
    condition: (s) => s.totalCorrect >= 1000,
  },

  // ─── Игры ───
  {
    id: 'games_10',
    title: 'Warming Up',
    description: 'Play 10 games',
    icon: '🎮',
    condition: (s) => s.gamesPlayed >= 10,
  },
  {
    id: 'games_50',
    title: 'Veteran',
    description: 'Play 50 games',
    icon: '🎖️',
    condition: (s) => s.gamesPlayed >= 50,
  },

  // ─── Скорость ───
  {
    id: 'fast_10',
    title: 'Speed Demon',
    description: 'Score 10 on Fast speed',
    icon: '⚡',
    condition: (s) => s.fastBestScore >= 10,
  },
  {
    id: 'fast_25',
    title: 'Lightning Reflexes',
    description: 'Score 25 on Fast speed',
    icon: '🌩️',
    condition: (s) => s.fastBestScore >= 25,
  },

  // ─── Lanes ───
  {
    id: 'lane4_20',
    title: 'Multitasker',
    description: 'Score 20 with 4 lanes',
    icon: '🛤️',
    condition: (s) => s.lane4Best >= 20,
  },
  {
    id: 'lane5_15',
    title: 'Path Finder',
    description: 'Score 15 with 5 lanes',
    icon: '🗺️',
    condition: (s) => s.lane5Best >= 15,
  },
  {
    id: 'lane6_10',
    title: 'Chaos Navigator',
    description: 'Score 10 with 6 lanes',
    icon: '🌀',
    condition: (s) => s.lane6Best >= 10,
  },

  // ─── Daily ───
  {
    id: 'daily_first',
    title: 'Daily Player',
    description: 'Complete your first Daily Challenge',
    icon: '📅',
    condition: (s) => s.totalDailyCompleted >= 1,
  },
  {
    id: 'daily_7',
    title: 'Week Warrior',
    description: 'Complete 7 Daily Challenges',
    icon: '📆',
    condition: (s) => s.totalDailyCompleted >= 7,
  },
  {
    id: 'daily_best10',
    title: 'Daily Champion',
    description: 'Score 10 in a Daily Challenge',
    icon: '🏆',
    condition: (s) => s.dailyBestScore >= 10,
  },
];
