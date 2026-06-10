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

const LANE_COLORS = ['#FF6B35', '#FFD23F', '#06D6A0', '#EF476F', '#118AB2', '#8338EC'];

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

// ─── Decorative floating shapes ───
function FloatingDecor() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large circle */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#FF6B35]/10 blur-2xl" />
      {/* Medium circle */}
      <div className="absolute top-1/3 -left-16 w-48 h-48 rounded-full bg-[#06D6A0]/10 blur-2xl" />
      {/* Small circle */}
      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-[#FFD23F]/15 blur-xl" />

      {/* Floating emoji decorations */}
      <motion.div
        className="absolute top-[8%] right-[12%] text-3xl"
        animate={{ y: [0, -12, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        🚪
      </motion.div>
      <motion.div
        className="absolute top-[18%] left-[8%] text-2xl"
        animate={{ y: [0, -10, 0], rotate: [0, -15, 15, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        🏃
      </motion.div>
      <motion.div
        className="absolute bottom-[25%] right-[15%] text-2xl"
        animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        🪙
      </motion.div>
      <motion.div
        className="absolute bottom-[30%] left-[12%] text-xl"
        animate={{ y: [0, -6, 0], rotate: [0, 20, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      >
        ⭐
      </motion.div>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────
export default function HomeScreen() {
  const { settings, setPathCount, setSpeed, startGame, bestScores, seasonId } =
    useGameStore();

  const bestScoreKey = `${seasonId}_p${settings.pathCount}`;
  const currentBest = bestScores[bestScoreKey] ?? 0;

  const seasonDisplay = (() => {
    const match = seasonId.match(/^(\d{4})-(\d{2})$/);
    if (match) return `Week ${parseInt(match[2], 10)} · ${match[1]}`;
    return seasonId;
  })();

  return (
    <motion.div
      className="relative flex min-h-dvh flex-col items-center justify-center px-5 py-8 selection:bg-orange-200"
      style={{ background: 'linear-gradient(160deg, #FF8C42 0%, #FFC857 35%, #FFE4A0 70%, #FFF8E1 100%)' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Decorative background */}
      <FloatingDecor />

      {/* ── Title ─────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="mb-8 text-center relative z-10">
        <h1
          className="text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl"
          style={{
            textShadow: '0 3px 0 #E55A25, 0 6px 0 #CC4A15, 0 8px 12px rgba(0,0,0,0.2)',
          }}
        >
          Door Runner
        </h1>
        <h2
          className="mt-1 text-3xl font-black tracking-wide text-white sm:text-4xl"
          style={{
            textShadow: '0 2px 0 #CC8400, 0 4px 8px rgba(0,0,0,0.15)',
          }}
        >
          Memory
        </h2>
        <p className="mt-3 text-sm font-medium text-[#7B4A2A]/70">
          Remember the path. Trust your memory. 🧠
        </p>
      </motion.div>

      {/* ── Lane Count Selector ───────────────────────── */}
      <motion.section variants={itemVariants} className="mb-5 w-full max-w-xs relative z-10">
        <label className="mb-2 flex items-center gap-1.5 text-sm font-bold text-[#7B4A2A]/80">
          <Gauge className="h-4 w-4" />
          Lanes
        </label>
        <div className="grid grid-cols-4 gap-2">
          {PATH_OPTIONS.map((n, idx) => {
            const isActive = settings.pathCount === n;
            const color = LANE_COLORS[idx % LANE_COLORS.length];
            return (
              <button
                key={n}
                type="button"
                onClick={() => setPathCount(n)}
                className={`
                  flex h-12 items-center justify-center rounded-2xl text-lg font-black
                  transition-all duration-150 active:scale-90
                  ${
                    isActive
                      ? 'text-white shadow-lg scale-105'
                      : 'bg-white/60 text-[#5C3D2E]/60 shadow-sm hover:bg-white/80 active:scale-95'
                  }
                `}
                style={isActive ? {
                  background: `linear-gradient(180deg, ${LANE_COLORS[idx]}dd, ${color})`,
                  boxShadow: `0 4px 12px ${color}60`,
                } : undefined}
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
      <motion.section variants={itemVariants} className="mb-6 w-full max-w-xs relative z-10">
        <label className="mb-2 flex items-center gap-1.5 text-sm font-bold text-[#7B4A2A]/80">
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
                  flex h-12 items-center justify-center gap-1.5 rounded-2xl text-sm font-bold
                  transition-all duration-150 active:scale-90
                  ${
                    isActive
                      ? 'bg-[#EF476F] text-white shadow-lg shadow-[#EF476F]/40'
                      : 'bg-white/60 text-[#5C3D2E]/60 shadow-sm hover:bg-white/80 active:scale-95'
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
        className="mb-8 flex w-full max-w-xs items-center justify-between gap-4 rounded-2xl bg-white/50 px-5 py-4 shadow-md backdrop-blur-sm relative z-10 border border-white/30"
      >
        <div className="flex items-center gap-2 text-sm text-[#7B4A2A]/70 font-medium">
          <Calendar className="h-4 w-4 shrink-0 text-[#FF6B35]" />
          <span className="truncate">{seasonDisplay}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-[#5C3D2E]">
          <Trophy className="h-4 w-4 shrink-0 text-[#FFD23F]" />
          <span>{currentBest > 0 ? currentBest : '—'}</span>
        </div>
      </motion.section>

      {/* ── Play Button ───────────────────────────────── */}
      <motion.div variants={playButtonVariants} className="relative z-10">
        <button
          type="button"
          onClick={startGame}
          className="
            group relative flex h-16 w-56 items-center justify-center gap-3
            rounded-3xl text-xl font-black text-white shadow-xl
            transition-all duration-150
            hover:shadow-2xl
            active:scale-90
            overflow-hidden
          "
          style={{
            background: 'linear-gradient(180deg, #FF6B35 0%, #E55A25 100%)',
            boxShadow: '0 6px 0 #CC4A15, 0 8px 20px rgba(229,90,37,0.4)',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
          aria-label="Start game"
        >
          {/* Top gloss */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-3xl" />

          <Play className="h-6 w-6 transition-transform group-hover:translate-x-0.5 relative" fill="currentColor" />
          <span className="relative">PLAY!</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
