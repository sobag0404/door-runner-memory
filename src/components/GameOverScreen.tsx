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
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 py-10 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FF8C42 0%, #FFC857 35%, #FFE4A0 100%)' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#EF476F]/15 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-[#06D6A0]/15 blur-3xl" />

      {/* ── Title ── */}
      <motion.h1
        variants={itemVariants}
        className="mb-8 text-center text-4xl font-black tracking-tight text-white sm:text-5xl"
        style={{
          textShadow: '0 3px 0 #CC4A15, 0 6px 12px rgba(0,0,0,0.15)',
        }}
      >
        Game Over!
      </motion.h1>

      {/* ── Score Card ── */}
      <motion.div
        variants={scorePopVariants}
        className="relative mb-6 flex w-full max-w-xs flex-col items-center rounded-3xl bg-white/40 p-8 shadow-xl backdrop-blur-md border border-white/30"
      >
        {/* New Best Badge */}
        {isNewBest && (
          <motion.div
            variants={badgeVariants}
            className="absolute -top-4 right-4 flex items-center gap-1 rounded-full bg-[#FFD23F] px-3 py-1 text-xs font-black text-[#7B4A2A] shadow-lg"
          >
            <Zap className="h-3.5 w-3.5" />
            New Best!
          </motion.div>
        )}

        <span className="mb-2 text-sm font-bold uppercase tracking-widest text-[#7B4A2A]/50">
          Final Score
        </span>

        <motion.span
          className="text-7xl font-black tabular-nums text-[#5C3D2E]"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          {score}
        </motion.span>

        {/* Coin emoji */}
        <span className="mt-2 text-3xl">🪙</span>
      </motion.div>

      {/* ── Best Score Row ── */}
      <motion.div
        variants={itemVariants}
        className="mb-10 flex items-center gap-2 rounded-2xl bg-white/30 px-5 py-3 border border-white/20"
      >
        <Trophy className="h-5 w-5 text-[#FFD23F]" />
        <span className="text-sm font-bold text-[#7B4A2A]/60">Best</span>
        <span className="text-lg font-black text-[#5C3D2E]">{bestScore}</span>
      </motion.div>

      {/* ── Play Again Button ── */}
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.92 }}
        onClick={resetGame}
        className="relative flex w-full max-w-xs items-center justify-center gap-3 rounded-3xl px-8 py-4 text-lg font-black text-white shadow-xl transition-colors overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #06D6A0 0%, #05B589 100%)',
          boxShadow: '0 5px 0 #049A73, 0 7px 16px rgba(6,214,160,0.3)',
          textShadow: '0 2px 4px rgba(0,0,0,0.15)',
        }}
        aria-label="Play Again"
      >
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-3xl" />
        <RotateCcw className="h-5 w-5 relative" />
        <span className="relative">Play Again</span>
      </motion.button>
    </motion.div>
  );
}
