import type { CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LANE_COLORS, LANE_LIGHT } from '../../lib/constants';
import { prefersReducedMotion } from '../../lib/a11y';
import type { GameTheme } from '../../lib/themes';

// ─── Door Portal ──────────────────────────────────────
function Door({
  laneIdx,
  isCorrect,
  isCurrent,
  feedback,
  pathCount,
  onChoose,
  theme,
}: {
  laneIdx: number;
  isCorrect: boolean;
  isCurrent: boolean;
  feedback: 'correct' | 'wrong' | null;
  pathCount: number;
  onChoose: (lane: number) => void;
  theme: GameTheme;
}) {
  const color = LANE_COLORS[laneIdx % LANE_COLORS.length];
  const light = LANE_LIGHT[laneIdx % LANE_LIGHT.length];
  const isNeon = theme.id === 'neon';

  const isFeedbackCorrect = isCurrent && feedback === 'correct' && isCorrect;
  const isFeedbackWrong = isCurrent && feedback === 'wrong' && !isCorrect;
  const isHint = isCurrent && feedback === 'wrong' && isCorrect;

  let doorBg: CSSProperties = {
    background: `linear-gradient(180deg, ${light} 0%, ${color} 100%)`,
  };
  let frameBorder = isCurrent ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)';
  let shadowStr = `0 4px 16px ${color}50, inset 0 1px 0 rgba(255,255,255,0.3)`;
  let glowStr = 'none';

  if (isFeedbackCorrect) {
    doorBg = { background: `linear-gradient(180deg, ${theme.accent2}dd 0%, ${theme.accent2} 100%)` };
    frameBorder = theme.accent2;
    shadowStr = `0 0 20px ${theme.accent2}80, 0 0 40px ${theme.accent2}40`;
    glowStr = `0 0 12px ${theme.accent2}`;
  } else if (isFeedbackWrong) {
    doorBg = { background: `linear-gradient(180deg, ${theme.timerDanger}cc 0%, ${theme.timerDanger} 100%)` };
    frameBorder = theme.timerDanger;
    shadowStr = `0 0 20px ${theme.timerDanger}80, 0 0 40px ${theme.timerDanger}40`;
    glowStr = `0 0 12px ${theme.timerDanger}`;
  } else if (isHint) {
    frameBorder = theme.hudScoreAccent;
    shadowStr = `0 0 15px ${theme.hudScoreAccent}60`;
    glowStr = `0 0 10px ${theme.hudScoreAccent}`;
  }

  return (
    <motion.button
      onClick={() => isCurrent && onChoose(laneIdx)}
      disabled={!isCurrent || feedback !== null}
      className="door-hit-target relative flex-1 flex items-center justify-center"
      style={{
        maxWidth: `${85 / pathCount}%`,
        height: 'clamp(68px, 9.5vh, 88px)',
      }}
      whileHover={!prefersReducedMotion() && isCurrent ? { scale: 1.06, y: -2 } : undefined}
      whileTap={isCurrent ? { scale: 0.93 } : undefined}
      animate={
        prefersReducedMotion()
          ? undefined
          : isFeedbackWrong
            ? { x: [0, -6, 6, -4, 4, 0] }
            : isFeedbackCorrect
              ? { scale: [1, 1.1, 1] }
              : undefined
      }
      transition={{ duration: 0.4 }}
      aria-label={`Door ${laneIdx + 1}${isCurrent ? ' (choose this lane)' : ''}`}
      aria-pressed={isCurrent}
    >
      <div className="absolute -bottom-3 left-[12%] right-[12%] h-4 rounded-full blur-sm"
        style={{
          background: isCurrent ? `${color}80` : 'rgba(0,0,0,0.22)',
          opacity: isCurrent ? 0.75 : 0.35,
        }} />

      {/* Door frame (outer) - themed frame */}
      <div className="absolute inset-0 rounded-t-[40%] rounded-b-lg"
        style={{
          background: theme.doorFrame,
          border: `3px solid ${frameBorder}`,
          boxShadow: shadowStr,
        }}
      >
        {/* Door arch (top semicircle) */}
        <div className="absolute inset-x-[3px] top-[3px] h-[35%] rounded-t-[40%]"
          style={{
            background: `linear-gradient(180deg, ${light}dd 0%, ${color}aa 100%)`,
          }}
        >
          {/* Arch keystone detail */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-1.5 rounded-b-full"
            style={{ backgroundColor: isNeon ? `${theme.accent}30` : 'rgba(255,255,255,0.2)' }} />

          {/* Neon: circuit line on arch */}
          {isNeon && (
            <div className="absolute inset-x-2 top-1 bottom-0 border border-dashed"
              style={{ borderColor: `${theme.accent}30`, borderRadius: '50% 50% 0 0' }} />
          )}
        </div>

        {/* Door panel (main body) */}
        <div className="absolute inset-x-[3px] top-[30%] bottom-[3px] rounded-b-md"
          style={doorBg}
        >
          <div className="absolute inset-x-1 top-1 h-1/4 rounded-md bg-white/20" />
          {/* Panel inset top */}
          <div className="absolute inset-x-1 top-1 bottom-[45%] border-2 rounded-md"
            style={{ borderColor: theme.doorPanelBorder }} />
          {/* Panel inset bottom */}
          <div className="absolute inset-x-1 top-[58%] bottom-1 border-2 rounded-md"
            style={{ borderColor: theme.doorPanelBorder }} />

          {/* Retro: wood grain lines */}
          {theme.id === 'retro' && (
            <>
              <div className="absolute inset-x-2 top-[20%] h-[1px] bg-black/5" />
              <div className="absolute inset-x-3 top-[35%] h-[1px] bg-black/5" />
              <div className="absolute inset-x-2 top-[70%] h-[1px] bg-black/5" />
            </>
          )}

          {/* Door handle */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="w-2.5 h-4 rounded-full border shadow-sm"
              style={{
                backgroundColor: theme.doorHandle,
                borderColor: theme.doorHandleBorder,
                boxShadow: glowStr !== 'none' ? glowStr : isNeon ? `0 0 6px ${theme.doorHandle}60` : '0 1px 3px rgba(0,0,0,0.3)',
              }} />
          </div>
        </div>

        {/* Glow overlay for current door */}
        {isCurrent && !feedback && (
          <div className="absolute inset-0 rounded-t-[40%] rounded-b-lg border-2"
            style={{
              borderColor: theme.doorPulseBorder,
              animation: prefersReducedMotion() ? 'none' : 'portalPulse 1.5s ease-in-out infinite',
            }} />
        )}
      </div>

      {/* Door number - centered on the door */}
      <span className="relative text-white font-black text-xl drop-shadow-md z-10 select-none mt-2"
        style={{
          textShadow: isNeon
            ? `0 0 8px ${theme.accent}, 0 2px 4px rgba(0,0,0,0.4)`
            : '0 2px 4px rgba(0,0,0,0.55), 0 0 10px rgba(0,0,0,0.22)',
        }}>
        {laneIdx + 1}
      </span>

      <AnimatePresence>
        {isFeedbackCorrect && (
          <motion.div className="absolute inset-0 flex items-center justify-center rounded-t-[40%] rounded-b-lg z-20"
            style={{ backgroundColor: theme.feedbackCorrectBg }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <span className="text-white text-2xl font-black drop-shadow-lg">OK</span>
          </motion.div>
        )}
        {isFeedbackWrong && (
          <motion.div className="absolute inset-0 flex items-center justify-center rounded-t-[40%] rounded-b-lg z-20"
            style={{ backgroundColor: theme.feedbackWrongBg }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <span className="text-white text-2xl font-black drop-shadow-lg">X</span>
          </motion.div>
        )}
        {isHint && (
          <motion.div className="absolute inset-0 flex items-center justify-center rounded-t-[40%] rounded-b-lg z-20"
            style={{ backgroundColor: theme.feedbackHintBg }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ delay: 0.15 }}>
            <span className="text-white text-xl font-black drop-shadow-lg">{'>>'}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Door Row ─────────────────────────────────────────
export function DoorRow({
  doorIndex, pathCount, correctLane, isCurrent, feedback, onChoose, theme,
}: {
  doorIndex: number; pathCount: number; correctLane: number;
  isCurrent: boolean; feedback: 'correct' | 'wrong' | null;
  onChoose: (lane: number) => void;
  theme: GameTheme;
}) {
  const bottomPercent = 26 + doorIndex * 15.5;
  const scale = 1 - doorIndex * 0.08;
  const opacity = Math.max(0.35, 1 - doorIndex * 0.18);

  return (
    <motion.div
      className="absolute left-0 right-0 flex justify-center gap-2 px-5 z-[15]"
      style={{ bottom: `${bottomPercent}%`, transformOrigin: 'center bottom' }}
      initial={false}
      animate={{ scale, opacity }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {Array.from({ length: pathCount }).map((_, laneIdx) => (
        <Door key={laneIdx} laneIdx={laneIdx} isCorrect={laneIdx === correctLane}
          isCurrent={isCurrent} feedback={feedback} pathCount={pathCount} onChoose={onChoose} theme={theme} />
      ))}
    </motion.div>
  );
}
