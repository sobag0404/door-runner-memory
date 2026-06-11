import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { ArrowLeft, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DoorRunnerScene from './DoorRunnerScene';

// ─── Name Input Modal ───
function NameModal({ onSubmit, onSkip }: { onSubmit: (name: string) => void; onSkip: () => void }) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onSkip} />
      <motion.div
        className="relative w-full max-w-sm rounded-3xl p-6 shadow-2xl"
        style={{ background: 'linear-gradient(160deg, #2B1D0E 0%, #5C3D2E 40%, #8B6B4A 100%)' }}
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }}
      >
        <h3 className="text-xl font-black text-white mb-1 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-[#FFD23F]" />
          Save Your Score!
        </h3>
        <p className="text-white/50 text-sm mb-4">Enter your name for the leaderboard</p>
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 20))}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit(name)}
          placeholder="Your name..."
          maxLength={20}
          className="w-full h-12 rounded-2xl bg-white/10 border border-white/15 px-4 text-white placeholder-white/30 text-sm font-medium outline-none focus:border-[#FFD23F]/50 focus:bg-white/15 transition-all mb-3"
        />
        <div className="flex gap-2">
          <button
            onClick={onSkip}
            className="flex-1 h-11 rounded-2xl bg-white/10 text-white/60 font-bold text-sm hover:bg-white/20 transition-all"
          >
            Skip
          </button>
          <button
            onClick={() => onSubmit(name)}
            className="flex-1 h-11 rounded-2xl bg-[#FF6B35] text-white font-bold text-sm shadow-lg active:scale-95 transition-all"
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GameScreen() {
  const resetGame = useGameStore((s) => s.resetGame);
  const score = useGameStore((s) => s.score);
  const submitToLeaderboard = useGameStore((s) => s.submitToLeaderboard);
  const addStatsFromGame = useGameStore((s) => s.addStatsFromGame);
  const checkAchievements = useGameStore((s) => s.checkAchievements);
  const gameMode = useGameStore((s) => s.gameMode);
  const combo = useGameStore((s) => s.combo);

  const [showNameModal, setShowNameModal] = useState(false);
  const hasSubmittedRef = useRef(false);

  // Track combo from scene via a simple effect
  // We read it from the scene indirectly — store updates already track score
  // For combo tracking, we'll use a simple approach: read it from DoorRunnerScene's local state
  // Actually, we need combo in the store for achievements. Let me handle this differently.

  const handleBack = () => {
    if (score > 0 && !hasSubmittedRef.current) {
      // Save stats and check achievements
      addStatsFromGame(score, combo, gameMode);
      checkAchievements();
      // Show name modal for leaderboard
      setShowNameModal(true);
      hasSubmittedRef.current = true;
    } else {
      resetGame();
    }
  };

  const handleSubmitName = (name: string) => {
    submitToLeaderboard(name);
    setShowNameModal(false);
    resetGame();
  };

  const handleSkipName = () => {
    // Still submit as Anonymous
    submitToLeaderboard('Anonymous');
    setShowNameModal(false);
    resetGame();
  };

  // Reset submission flag when game starts
  useEffect(() => {
    hasSubmittedRef.current = false;
  }, [score === 0]);

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-[#5C3D2E]">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="absolute top-3 left-3 z-50 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white/90 hover:text-white hover:bg-white/30 active:scale-90 transition-all shadow-md border border-white/15"
        aria-label="Back"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Game Scene */}
      <DoorRunnerScene />

      {/* Name Modal */}
      <AnimatePresence>
        {showNameModal && (
          <NameModal onSubmit={handleSubmitName} onSkip={handleSkipName} />
        )}
      </AnimatePresence>
    </div>
  );
}
