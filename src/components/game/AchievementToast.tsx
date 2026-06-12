// ─── Achievement Toast Component ─────────────────────────
// Popup notification when achievement is unlocked

import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { ACHIEVEMENTS } from '../../lib/achievements';

export function AchievementToast() {
  const newlyUnlockedIds = useGameStore((s) => s.newlyUnlockedIds);
  const clearNewlyUnlocked = useGameStore((s) => s.clearNewlyUnlocked);

  if (newlyUnlockedIds.length === 0) return null;

  const achievement = ACHIEVEMENTS.find(a => a.id === newlyUnlockedIds[0]);
  if (!achievement) return null;

  return (
    <motion.div
      className="absolute top-3 left-1/2 z-[60] pointer-events-none"
      style={{ x: '-50%' }}
      initial={{ y: -60, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -40, opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onAnimationComplete={() => {
        setTimeout(clearNewlyUnlocked, 2500);
      }}
    >
      <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-[#FFD23F]/40 shadow-xl">
        <span className="text-2xl">{achievement.icon}</span>
        <div>
          <div className="text-[#FFD23F] text-xs font-black uppercase tracking-wide">Achievement!</div>
          <div className="text-white text-sm font-bold">{achievement.title}</div>
        </div>
      </div>
    </motion.div>
  );
}
