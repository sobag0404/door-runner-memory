import { motion, AnimatePresence } from 'framer-motion';
import { getLanePercent } from '../../lib/constants';
import { prefersReducedMotion } from '../../lib/a11y';
import type { GameTheme } from '../../lib/themes';

// ─── Runner Dust Particles ────────────────────────────
export function RunnerDust({ pathCount, currentLane, feedback, theme }: {
  pathCount: number; currentLane: number; feedback: 'correct' | 'wrong' | null; theme: GameTheme;
}) {
  const reducedMotion = prefersReducedMotion();
  if (reducedMotion || feedback === 'wrong') return null;

  const leftPercent = getLanePercent(currentLane, pathCount);

  return (
    <div className="absolute bottom-[20%] z-19 pointer-events-none" style={{ left: `${leftPercent}%`, transform: 'translateX(-50%)' }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ backgroundColor: theme.runnerDust, width: 3 + i * 2, height: 3 + i * 2 }}
          animate={{
            x: [0, (i - 1) * 12],
            y: [0, -8 - i * 4],
            opacity: [0.6, 0],
            scale: [1, 1.5],
          }}
          transition={{
            duration: 0.4 + i * 0.1,
            repeat: Infinity,
            repeatDelay: 0.2,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// Original arcade runner character.
export function Runner({ pathCount, currentLane, feedback, theme }: {
  pathCount: number;
  currentLane: number;
  feedback: 'correct' | 'wrong' | null;
  theme: GameTheme;
}) {
  const leftPercent = getLanePercent(currentLane, pathCount);
  const reducedMotion = prefersReducedMotion();

  // Neon theme has a glowing outline
  const isNeon = theme.id === 'neon';
  const runnerGlow = isNeon ? `0 0 15px ${theme.accent}40, 0 0 30px ${theme.accent}20` : 'none';

  return (
    <motion.div
      className="absolute bottom-[22%] z-20 pointer-events-none"
      animate={{
        left: `${leftPercent}%`,
        y: feedback === 'wrong' ? [0, -12, 6, -4, 0] : [0, -3, 0],
      }}
      transition={{
        left: { type: 'spring', stiffness: 320, damping: 22 },
        y: feedback === 'wrong'
          ? { duration: 0.5, ease: 'easeOut' }
          : { duration: 0.5, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{ transform: 'translateX(-50%)', willChange: 'left' }}
    >
      <div className="relative flex flex-col items-center" style={{ filter: isNeon ? `drop-shadow(0 0 6px ${theme.accent}60)` : 'none' }}>
        {/* Shadow on ground */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-3 bg-black/25 rounded-full blur-sm" />

        {/* ── Head ── */}
        <div className="relative w-10 h-10 rounded-full border-2 shadow-lg"
          style={{ backgroundColor: theme.runnerSkin, borderColor: theme.runnerSkinBorder, boxShadow: runnerGlow }}>
          {/* Hair — spiky */}
          <div className="absolute -top-2 left-1 right-1 h-4">
            <div className="absolute bottom-0 left-1 w-2 h-4 rounded-t-full rotate-[-12deg]"
              style={{ backgroundColor: theme.runnerHair }} />
            <div className="absolute bottom-0 left-3 w-2.5 h-5 rounded-t-full rotate-[-4deg]"
              style={{ backgroundColor: theme.runnerHair }} />
            <div className="absolute bottom-0 right-3 w-2.5 h-5 rounded-t-full rotate-[4deg]"
              style={{ backgroundColor: theme.runnerHair }} />
            <div className="absolute bottom-0 right-1 w-2 h-4 rounded-t-full rotate-[12deg]"
              style={{ backgroundColor: theme.runnerHair }} />
          </div>

          {/* Neon visor/helmet accent */}
          {isNeon && (
            <div className="absolute -top-1 left-0 right-0 h-2 rounded-t-full"
              style={{ backgroundColor: theme.accent, opacity: 0.3, boxShadow: `0 0 8px ${theme.accent}` }} />
          )}

          {/* Eyes */}
          <motion.div
            className="absolute top-3 left-1.5 flex gap-2.5"
            animate={{ scaleY: feedback === 'wrong' ? 0.15 : 1 }}
            transition={{ duration: 0.12 }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white relative">
              <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: isNeon ? theme.accent : '#2D1B0E' }} />
              <div className="absolute top-0 right-0 w-0.5 h-0.5 rounded-full bg-white" />
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-white relative">
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: isNeon ? theme.accent : '#2D1B0E' }} />
              <div className="absolute top-0 right-0 w-0.5 h-0.5 rounded-full bg-white" />
            </div>
          </motion.div>

          {/* Eyebrows */}
          <motion.div
            className="absolute top-1.5 left-1.5 right-1.5 flex justify-between"
            animate={{ y: feedback === 'wrong' ? 3 : 0 }}
          >
            <div className="w-3 h-[3px] rounded-full rotate-[-10deg]"
              style={{ backgroundColor: theme.runnerHair }} />
            <div className="w-3 h-[3px] rounded-full rotate-[10deg]"
              style={{ backgroundColor: theme.runnerHair }} />
          </motion.div>

          {/* Mouth */}
          <motion.div
            className="absolute bottom-1.5 left-1/2 -translate-x-1/2"
            animate={{
              width: feedback === 'correct' ? '8px' : feedback === 'wrong' ? '10px' : '6px',
              height: feedback === 'correct' ? '8px' : feedback === 'wrong' ? '5px' : '4px',
              borderRadius: feedback === 'correct' ? '50%' : '0 0 6px 6px',
            }}
          >
            <div className="w-full h-full rounded-full"
              style={{ backgroundColor: isNeon ? theme.accent2 : '#2D1B0E' }} />
          </motion.div>

          {/* Blush cheeks */}
          <div className="absolute bottom-2 left-0 w-2.5 h-1.5 rounded-full"
            style={{ backgroundColor: isNeon ? `${theme.accent2}40` : '#FF9F9F50' }} />
          <div className="absolute bottom-2 right-0 w-2.5 h-1.5 rounded-full"
            style={{ backgroundColor: isNeon ? `${theme.accent2}40` : '#FF9F9F50' }} />
        </div>

        {/* ── Body / Hoodie ── */}
        <div className="relative w-8 h-9 -mt-1 rounded-lg shadow-md"
          style={{
            backgroundColor: theme.runnerOutfit,
            boxShadow: isNeon ? `0 0 10px ${theme.accent}30` : undefined,
          }}>
          <div className="absolute bottom-1 left-1 right-1 h-2 rounded-sm"
            style={{ backgroundColor: theme.runnerOutfitAccent }} />
          <div className="absolute top-2 left-0 right-0 h-1 rounded-full"
            style={{ backgroundColor: theme.runnerOutfitZip }} />
          <div className="absolute top-0 left-2 w-[2px] h-2 bg-white/60" />
          <div className="absolute top-0 right-2 w-[2px] h-2 bg-white/60" />

          {/* Neon chest glow */}
          {isNeon && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
              style={{ backgroundColor: theme.accent, opacity: 0.2, boxShadow: `0 0 8px ${theme.accent}` }} />
          )}
        </div>

        {/* ── Arms ── */}
        <div className="absolute top-[38px] -left-3.5 w-3 h-7 rounded-full origin-top shadow-sm"
          style={{
            backgroundColor: theme.runnerSkin,
            animation: reducedMotion ? 'none' : 'armSwing 0.4s ease-in-out infinite alternate',
          }} />
        <div className="absolute top-[38px] -right-3.5 w-3 h-7 rounded-full origin-top shadow-sm"
          style={{
            backgroundColor: theme.runnerSkin,
            animation: reducedMotion ? 'none' : 'armSwing 0.4s ease-in-out infinite alternate-reverse',
          }} />

        {/* ── Legs ── */}
        <div className="flex gap-1 -mt-0.5">
          <div className="w-2.5 h-7 rounded-full origin-top shadow-sm"
            style={{
              backgroundColor: theme.runnerPants,
              animation: reducedMotion ? 'none' : 'legSwing 0.35s ease-in-out infinite alternate',
            }} />
          <div className="w-2.5 h-7 rounded-full origin-top shadow-sm"
            style={{
              backgroundColor: theme.runnerPants,
              animation: reducedMotion ? 'none' : 'legSwing 0.35s ease-in-out infinite alternate-reverse',
            }} />
        </div>

        {/* ── Shoes ── */}
        <div className="flex gap-0.5 -mt-0.5">
          <div className="w-3.5 h-2.5 rounded-md shadow-sm"
            style={{ backgroundColor: theme.runnerShoes, boxShadow: isNeon ? `0 0 6px ${theme.runnerShoes}60` : undefined }} />
          <div className="w-3.5 h-2.5 rounded-md shadow-sm"
            style={{ backgroundColor: theme.runnerShoes, boxShadow: isNeon ? `0 0 6px ${theme.runnerShoes}60` : undefined }} />
        </div>

        {/* ── Correct feedback: star burst ── */}
        <AnimatePresence>
          {feedback === 'correct' && (
            <motion.div
              className="absolute -inset-4 pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.8 }}
              exit={{ opacity: 0, scale: 2.2 }}
              transition={{ duration: 0.5 }}
            >
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 w-1 h-3 rounded-full"
                  style={{
                    background: [theme.accent, theme.runnerOutfit, theme.accent2, theme.runnerShoes][i % 4],
                    transform: `translate(-50%,-50%) rotate(${angle}deg) translateY(-16px)`,
                    animation: reducedMotion ? 'none' : 'sparkle 0.4s ease-in-out infinite',
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Wrong feedback: X mark ── */}
        <AnimatePresence>
          {feedback === 'wrong' && (
            <motion.div
              className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl font-black"
              style={{ color: theme.timerDanger }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              X
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
