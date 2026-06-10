'use client';

import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Zap } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

// ─── Helpers ──────────────────────────────────────────────

function bestScoreKey(seasonId: string, pathCount: number): string {
  return `${seasonId}_p${pathCount}`;
}

// ─── Animation Variants ───────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 20 },
  },
};

const scorePopVariants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 18, delay: 0.15 },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -30 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: 'spring' as const, stiffness: 400, damping: 15, delay: 0.4 },
  },
};

// ─── Component ────────────────────────────────────────────

export default function GameOverScreen() {
  const score = useGameStore((s) => s.score);
  const seasonId = useGameStore((s) => s.seasonId);
  const pathCount = useGameStore((s) => s.settings.pathCount);
  const bestScores = useGameStore((s) => s.bestScores);
  const resetGame = useGameStore((s) => s.resetGame);

  const key = bestScoreKey(seasonId, pathCount);
  const bestScore = bestScores[key] ?? 0;
  const isNewBest = score > 0 && score >= bestScore;

  return (
    <motion.div
      className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-10"
      style={{ background: 'linear-gradient(160deg, #1a0a0a 0%, #2d1014 40%, #1a0a0a 100%)' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Title ── */}
      <motion.h1
        variants={itemVariants}
        className="mb-8 text-center text-4xl font-extrabold tracking-tight sm:text-5xl"
        style={{
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #ff6b6b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Game Over
      </motion.h1>

      {/* ── Score Card ── */}
      <motion.div
        variants={scorePopVariants}
        className="relative mb-6 flex w-full max-w-xs flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm"
      >
        {/* New Best Badge */}
        {isNewBest && (
          <motion.div
            variants={badgeVariants}
            className="absolute -top-4 right-4 flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-amber-950 shadow-lg"
          >
            <Zap className="h-3.5 w-3.5" />
            New Best!
          </motion.div>
        )}

        <span className="mb-2 text-sm font-medium uppercase tracking-widest text-white/50">
          Final Score
        </span>

        <motion.span
          className="text-7xl font-black tabular-nums"
          style={{
            background: 'linear-gradient(180deg, #ffffff 30%, #ff8a65 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {score}
        </motion.span>
      </motion.div>

      {/* ── Best Score Row ── */}
      <motion.div
        variants={itemVariants}
        className="mb-10 flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-5 py-3"
      >
        <Trophy className="h-5 w-5 text-amber-400" />
        <span className="text-sm font-medium text-white/60">Best</span>
        <span className="text-lg font-bold text-amber-300">{bestScore}</span>
      </motion.div>

      {/* ── Play Again Button ── */}
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={resetGame}
        className="flex w-full max-w-xs items-center justify-center gap-3 rounded-2xl px-8 py-4 text-lg font-bold text-white shadow-xl transition-colors active:brightness-110"
        style={{
          background: 'linear-gradient(135deg, #ee5a24 0%, #ff6b6b 100%)',
        }}
        aria-label="Play Again"
      >
        <RotateCcw className="h-5 w-5" />
        Play Again
      </motion.button>
    </motion.div>
  );
}
