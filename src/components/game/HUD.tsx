// ─── HUD Component ──────────────────────────────────────
// Score display, combo display, feedback overlay

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { t } from '../../lib/i18n';

export function HUD({ combo, lang }: { combo: number; lang: string }) {
  const score = useGameStore((s) => s.score);
  const feedback = useGameStore((s) => s.feedback);

  return (
    <div className="absolute inset-0 pointer-events-none z-30"
      style={feedback === 'wrong' ? { animation: 'screenShake 0.4s ease-out' } : undefined}
    >
      <div className="flex justify-between items-start p-3 pt-5">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/15 shadow-lg">
          <span className="text-[#FFD23F] text-sm">$</span>
          <motion.span
            key={score}
            className="text-white font-black text-2xl tabular-nums"
            initial={{ scale: 1.6, color: '#FFD23F' }}
            animate={{ scale: 1, color: '#ffffff' }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
          >
            {score}
          </motion.span>
        </div>
        {combo >= 3 && (
          <motion.div
            className="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-2xl px-3 py-2 border border-[#FFD23F]/30"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ animation: 'comboGlow 0.6s ease-in-out infinite' }}
          >
            <span className="text-[#FFD23F] font-black text-lg">×{combo}</span>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className={`px-8 py-4 rounded-3xl font-black text-2xl backdrop-blur-md border-2 shadow-2xl ${
                feedback === 'correct'
                  ? 'bg-[#06D6A0]/80 text-white border-[#06D6A0] shadow-[#06D6A0]/30'
                  : 'bg-[#EF476F]/80 text-white border-[#EF476F] shadow-[#EF476F]/30'
              }`}
              initial={{ scale: 0.2, opacity: 0, y: 20 }}
              animate={{ scale: [0.2, 1.2, 1], opacity: 1, y: 0 }}
              exit={{ scale: 1.4, opacity: 0, y: -20 }}
              transition={{ duration: 0.35, type: 'spring', stiffness: 250 }}
            >
              {feedback === 'correct' ? t('game.correct', lang as 'ru' | 'en') : t('game.wrong', lang as 'ru' | 'en')}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
