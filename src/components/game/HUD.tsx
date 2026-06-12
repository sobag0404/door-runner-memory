// ─── HUD Component ──────────────────────────────────────
// Score display, combo display, feedback overlay — fully theme-aware

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { t } from '../../lib/i18n';
import type { GameTheme } from '../../lib/themes';

export function HUD({ combo, lang, theme }: { combo: number; lang: string; theme: GameTheme }) {
  const score = useGameStore((s) => s.score);
  const feedback = useGameStore((s) => s.feedback);
  const isNeon = theme.id === 'neon';

  return (
    <div className="absolute inset-0 pointer-events-none z-30"
      style={feedback === 'wrong' ? { animation: 'screenShake 0.4s ease-out' } : undefined}
    >
      <div className="flex justify-between items-start p-3 pt-5">
        <div className="flex items-center gap-2 backdrop-blur-md rounded-2xl px-4 py-2 border shadow-lg"
          style={{
            background: theme.hudBg,
            borderColor: 'rgba(255,255,255,0.15)',
          }}>
          <span style={{ color: theme.hudScoreAccent }} className="text-sm">$</span>
          <motion.span
            key={score}
            className="font-black text-2xl tabular-nums"
            style={{ color: theme.textLight }}
            initial={{ scale: 1.6, color: theme.hudScoreAccent }}
            animate={{ scale: 1, color: theme.textLight }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
          >
            {score}
          </motion.span>
        </div>
        {combo >= 3 && (
          <motion.div
            className="flex items-center gap-1 backdrop-blur-md rounded-2xl px-3 py-2 border"
            style={{
              background: theme.hudBg,
              borderColor: theme.hudComboBorder,
              animation: isNeon ? 'comboGlow 0.6s ease-in-out infinite' : undefined,
            }}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          >
            <span className="font-black text-lg"
              style={{
                color: theme.hudScoreAccent,
                animation: !isNeon ? 'comboGlow 0.6s ease-in-out infinite' : undefined,
                textShadow: isNeon ? `0 0 10px ${theme.hudScoreAccent}60` : undefined,
              }}>
              ×{combo}
            </span>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="px-8 py-4 rounded-3xl font-black text-2xl backdrop-blur-md border-2 shadow-2xl"
              style={{
                backgroundColor: feedback === 'correct' ? theme.feedbackCorrectBg : theme.feedbackWrongBg,
                color: theme.textLight,
                borderColor: feedback === 'correct' ? theme.accent2 : theme.timerDanger,
                boxShadow: feedback === 'correct'
                  ? `0 0 20px ${theme.accent2}40`
                  : `0 0 20px ${theme.timerDanger}40`,
              }}
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
