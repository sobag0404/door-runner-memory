'use client';

import { motion, type Variants } from 'framer-motion';
import { Play, Zap, Gauge, Trophy, Calendar } from 'lucide-react';
import { useGameStore, SpeedLevel } from '@/store/gameStore';

// ─── Constants ──────────────────────────────────────────
const PATH_OPTIONS = [3, 4, 5, 6] as const;

const SPEED_OPTIONS: { value: SpeedLevel; label: string; icon: typeof Zap }[] = [
  { value: 'slow', label: 'Slow', icon: Gauge },
  { value: 'normal', label: 'Normal', icon: Zap },
  { value: 'fast', label: 'Fast', icon: Zap },
];

// ─── Animation Variants ────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const playButtonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20, delay: 0.45 },
  },
};

// ─── Component ──────────────────────────────────────────
export default function HomeScreen() {
  const { settings, setPathCount, setSpeed, startGame, bestScores, seasonId } =
    useGameStore();

  const bestScoreKey = `${seasonId}_p${settings.pathCount}`;
  const currentBest = bestScores[bestScoreKey] ?? 0;

  // Season display: "2026-24" → "Week 24 · 2026"
  const seasonDisplay = (() => {
    const match = seasonId.match(/^(\d{4})-(\d{2})$/);
    if (match) return `Week ${parseInt(match[2], 10)} · ${match[1]}`;
    return seasonId;
  })();

  return (
    <motion.div
      className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 px-5 py-8 selection:bg-orange-200"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Title ─────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="mb-10 text-center">
        <h1
          className="bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 bg-clip-text text-5xl font-extrabold leading-tight tracking-tight text-transparent sm:text-6xl"
        >
          Door Runner
        </h1>
        <h2
          className="mt-1 bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-2xl font-bold tracking-wide text-transparent sm:text-3xl"
        >
          Memory
        </h2>
        <p className="mt-3 text-sm text-orange-900/50">
          Remember the path. Trust your memory.
        </p>
      </motion.div>

      {/* ── Lane Count Selector ───────────────────────── */}
      <motion.section variants={itemVariants} className="mb-6 w-full max-w-xs">
        <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-orange-900/70">
          <Gauge className="h-4 w-4" />
          Lanes
        </label>
        <div className="grid grid-cols-4 gap-2">
          {PATH_OPTIONS.map((n) => {
            const isActive = settings.pathCount === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setPathCount(n)}
                className={`
                  flex h-12 items-center justify-center rounded-xl text-lg font-bold
                  transition-all duration-150 active:scale-95
                  ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-white/70 text-orange-900/60 shadow-sm hover:bg-orange-100/80'
                  }
                `}
                aria-pressed={isActive}
                aria-label={`${n} lanes`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* ── Speed Selector ────────────────────────────── */}
      <motion.section variants={itemVariants} className="mb-8 w-full max-w-xs">
        <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-orange-900/70">
          <Zap className="h-4 w-4" />
          Speed
        </label>
        <div className="grid grid-cols-3 gap-2">
          {SPEED_OPTIONS.map(({ value, label, icon: Icon }) => {
            const isActive = settings.speed === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setSpeed(value)}
                className={`
                  flex h-12 items-center justify-center gap-1.5 rounded-xl text-sm font-bold
                  transition-all duration-150 active:scale-95
                  ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                      : 'bg-white/70 text-orange-900/60 shadow-sm hover:bg-rose-50'
                  }
                `}
                aria-pressed={isActive}
                aria-label={`${label} speed`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* ── Season & Best Score ───────────────────────── */}
      <motion.section
        variants={itemVariants}
        className="mb-8 flex w-full max-w-xs items-center justify-between gap-4 rounded-2xl bg-white/60 px-5 py-4 shadow-sm backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 text-sm text-orange-900/60">
          <Calendar className="h-4 w-4 shrink-0 text-amber-500" />
          <span className="truncate">{seasonDisplay}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-orange-900/80">
          <Trophy className="h-4 w-4 shrink-0 text-amber-500" />
          <span>{currentBest > 0 ? currentBest : '—'}</span>
        </div>
      </motion.section>

      {/* ── Play Button ───────────────────────────────── */}
      <motion.div variants={playButtonVariants}>
        <button
          type="button"
          onClick={startGame}
          className="
            group flex h-16 w-56 items-center justify-center gap-3
            rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500
            text-xl font-extrabold text-white shadow-xl shadow-orange-500/30
            transition-all duration-150
            hover:shadow-2xl hover:shadow-orange-500/40
            active:scale-95
          "
          aria-label="Start game"
        >
          <Play className="h-6 w-6 transition-transform group-hover:translate-x-0.5" fill="currentColor" />
          Play
        </button>
      </motion.div>
    </motion.div>
  );
}
