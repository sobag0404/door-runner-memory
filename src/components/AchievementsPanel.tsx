import { motion } from 'framer-motion';
import { Award, X } from 'lucide-react';
import { ACHIEVEMENTS } from '../lib/achievements';
import { useGameStore } from '../store/gameStore';

export default function AchievementsPanel({ onClose }: { onClose: () => void }) {
  const unlocked = useGameStore((s) => s.unlockedAchievements);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <motion.div
        className="relative w-full max-w-md max-h-[80dvh] rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(160deg, #2B1D0E 0%, #5C3D2E 40%, #8B6B4A 100%)' }}
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-[#FFD23F]" />
            Achievements
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Progress */}
        <div className="px-5 pb-3">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
            <span>{unlocked.length} / {ACHIEVEMENTS.length} unlocked</span>
            <span>{Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #FF6B35, #FFD23F)' }}
              initial={{ width: 0 }}
              animate={{ width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* List */}
        <div className="px-5 pb-5 overflow-y-auto max-h-[55dvh] space-y-2 custom-scrollbar">
          {ACHIEVEMENTS.map(a => {
            const isUnlocked = unlocked.includes(a.id);
            return (
              <motion.div
                key={a.id}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                  isUnlocked
                    ? 'bg-white/15 border border-[#FFD23F]/20'
                    : 'bg-white/5 opacity-50'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl text-xl shrink-0 ${
                  isUnlocked ? 'bg-[#FFD23F]/20' : 'bg-white/5 grayscale'
                }`}>
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-bold truncate ${isUnlocked ? 'text-white' : 'text-white/40'}`}>
                    {a.title}
                  </div>
                  <div className={`text-xs truncate ${isUnlocked ? 'text-white/60' : 'text-white/25'}`}>
                    {a.description}
                  </div>
                </div>
                {isUnlocked && (
                  <div className="text-[#FFD23F] text-xs font-bold shrink-0">✓</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
