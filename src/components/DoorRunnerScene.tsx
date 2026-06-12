import { useMemo, useCallback, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, getProgressiveSpeedMs } from '../store/gameStore';
import { LANE_COLORS, LANE_LIGHT, getLanePercent } from '../lib/constants';
import { t } from '../lib/i18n';
import { prefersReducedMotion } from '../lib/a11y';
import { getExpectedPath } from '../lib/season';
import { SpeedLines, ParticleBurst, CoinEffect } from './game/VFX';
import { HUD } from './game/HUD';
import { LaneButtons } from './game/LaneButtons';
import { AchievementToast } from './game/AchievementToast';

// ─── Re-export for sub-components ──
export { LANE_COLORS, LANE_LIGHT, getLanePercent };
// Extracted components imported from ./game/

// ─── Combo Badge ──────────────────────────────────────
function ComboBadge({ combo, lang }: { combo: number; lang: string }) {
  if (combo < 3) return null;
  const labelKey = combo >= 10 ? 'combo.insane' : combo >= 7 ? 'combo.super' : combo >= 5 ? 'combo.great' : 'combo.nice';
  const color = combo >= 10 ? '#EF476F' : combo >= 7 ? '#8338EC' : combo >= 5 ? '#FF6B35' : '#06D6A0';
  const reducedMotion = prefersReducedMotion();
  return (
    <motion.div
      className="absolute top-16 left-1/2 z-50 pointer-events-none font-black text-base px-3 py-1 rounded-full"
      style={{ color, x: '-50%', animation: reducedMotion ? 'none' : 'comboGlow 0.8s ease-in-out infinite' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.5, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      aria-live="polite"
    >
      {t(labelKey, lang as 'ru' | 'en')}
    </motion.div>
  );
}

// ─── Timer Bar (countdown for each step) ──────────────
// Self-contained: uses rAF + direct DOM manipulation via ref.
// Does NOT trigger React re-renders on each animation frame.
function TimerBar({ currentStep, speedMs, isRunning, feedback, onTimeout }: {
  currentStep: number;
  speedMs: number;
  isRunning: boolean;
  feedback: 'correct' | 'wrong' | null;
  onTimeout: () => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const stepStartRef = useRef<number>(0);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  useEffect(() => {
    if (!isRunning || feedback !== null) {
      // Reset bar to full when not running or during feedback
      if (barRef.current) {
        barRef.current.style.width = '100%';
        barRef.current.style.background = 'linear-gradient(90deg, #06D6A0, #06D6A0dd)';
        barRef.current.style.boxShadow = '0 0 6px #06D6A040';
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      return;
    }

    stepStartRef.current = performance.now();
    if (barRef.current) {
      barRef.current.style.width = '100%';
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const tick = (now: number) => {
      const elapsed = now - stepStartRef.current;
      const remaining = Math.max(0, 1 - elapsed / speedMs);

      if (barRef.current) {
        const pct = remaining * 100;
        barRef.current.style.width = `${pct}%`;

        if (remaining > 0.5) {
          barRef.current.style.background = 'linear-gradient(90deg, #06D6A0, #06D6A0dd)';
          barRef.current.style.boxShadow = '0 0 6px #06D6A040';
        } else if (remaining > 0.25) {
          barRef.current.style.background = 'linear-gradient(90deg, #FFD23F, #FFD23Fdd)';
          barRef.current.style.boxShadow = '0 0 8px #FFD23F60';
        } else {
          barRef.current.style.background = 'linear-gradient(90deg, #EF476F, #EF476Fdd)';
          barRef.current.style.boxShadow = '0 0 12px #EF476F80';
        }
      }

      if (remaining <= 0) {
        rafRef.current = 0;
        onTimeoutRef.current();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, [currentStep, isRunning, feedback, speedMs]);

  return (
    <div className="absolute top-0 left-0 right-0 z-40 h-1.5 bg-black/30">
      <div
        ref={barRef}
        className="h-full rounded-full"
        style={{
          width: '100%',
          background: 'linear-gradient(90deg, #06D6A0, #06D6A0dd)',
          boxShadow: '0 0 6px #06D6A040',
          transition: 'width 0.05s linear, background 0.3s ease',
        }}
      />
    </div>
  );
}

// ─── Speed Indicator (shows current speed level) ──────
function SpeedIndicator({ currentMs, baseMs }: { currentMs: number; baseMs: number }) {
  const ratio = baseMs / currentMs; // >1 means faster
  if (ratio < 1.05) return null; // no speed boost yet

  const label = ratio >= 2 ? '>>' : ratio >= 1.5 ? '>' : '~';
  return (
    <motion.div
      className="absolute top-14 right-3 z-40 pointer-events-none"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="bg-black/40 backdrop-blur-md rounded-xl px-2 py-1 border border-[#FFD23F]/30">
        <span className="text-xs font-bold text-[#FFD23F]">{label}</span>
        <span className="text-[10px] text-white/50 ml-1">{Math.round(ratio * 100)}%</span>
      </div>
    </motion.div>
  );
}

// ─── Runner (Subway Surfers style character) ──────────
function Runner({ pathCount, currentLane, feedback }: {
  pathCount: number;
  currentLane: number;
  feedback: 'correct' | 'wrong' | null;
}) {
  const leftPercent = getLanePercent(currentLane, pathCount);

  return (
    <motion.div
      className="absolute bottom-[22%] z-20"
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
      <div className="relative flex flex-col items-center">
        {/* Shadow on ground */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-3 bg-black/25 rounded-full blur-sm" />

        {/* ── Head ── */}
        <div className="relative w-10 h-10 rounded-full bg-[#FFDBB5] border-2 border-[#F5C49C] shadow-lg">
          {/* Hair — spiky */}
          <div className="absolute -top-2 left-1 right-1 h-4">
            <div className="absolute bottom-0 left-1 w-2 h-4 bg-[#5C3D2E] rounded-t-full rotate-[-12deg]" />
            <div className="absolute bottom-0 left-3 w-2.5 h-5 bg-[#5C3D2E] rounded-t-full rotate-[-4deg]" />
            <div className="absolute bottom-0 right-3 w-2.5 h-5 bg-[#5C3D2E] rounded-t-full rotate-[4deg]" />
            <div className="absolute bottom-0 right-1 w-2 h-4 bg-[#5C3D2E] rounded-t-full rotate-[12deg]" />
          </div>

          {/* Eyes */}
          <motion.div
            className="absolute top-3 left-1.5 flex gap-2.5"
            animate={{ scaleY: feedback === 'wrong' ? 0.15 : 1 }}
            transition={{ duration: 0.12 }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white relative">
              <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#2D1B0E]" />
              <div className="absolute top-0 right-0 w-0.5 h-0.5 rounded-full bg-white" />
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-white relative">
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-[#2D1B0E]" />
              <div className="absolute top-0 right-0 w-0.5 h-0.5 rounded-full bg-white" />
            </div>
          </motion.div>

          {/* Eyebrows */}
          <motion.div
            className="absolute top-1.5 left-1.5 right-1.5 flex justify-between"
            animate={{ y: feedback === 'wrong' ? 3 : 0 }}
          >
            <div className="w-3 h-[3px] bg-[#5C3D2E] rounded-full rotate-[-10deg]" />
            <div className="w-3 h-[3px] bg-[#5C3D2E] rounded-full rotate-[10deg]" />
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
            <div className="w-full h-full bg-[#2D1B0E] rounded-full" />
          </motion.div>

          {/* Blush cheeks */}
          <div className="absolute bottom-2 left-0 w-2.5 h-1.5 rounded-full bg-[#FF9F9F]/50" />
          <div className="absolute bottom-2 right-0 w-2.5 h-1.5 rounded-full bg-[#FF9F9F]/50" />
        </div>

        {/* ── Body / Hoodie ── */}
        <div className="relative w-8 h-9 -mt-1 rounded-lg bg-[#FF6B35] shadow-md">
          <div className="absolute bottom-1 left-1 right-1 h-2 bg-[#E55A25] rounded-sm" />
          <div className="absolute top-2 left-0 right-0 h-1 bg-[#FFD23F] rounded-full" />
          <div className="absolute top-0 left-2 w-[2px] h-2 bg-white/60" />
          <div className="absolute top-0 right-2 w-[2px] h-2 bg-white/60" />
        </div>

        {/* ── Arms ── */}
        <div className="absolute top-[38px] -left-3.5 w-3 h-7 rounded-full bg-[#FFDBB5] origin-top shadow-sm"
          style={{ animation: 'armSwing 0.4s ease-in-out infinite alternate' }} />
        <div className="absolute top-[38px] -right-3.5 w-3 h-7 rounded-full bg-[#FFDBB5] origin-top shadow-sm"
          style={{ animation: 'armSwing 0.4s ease-in-out infinite alternate-reverse' }} />

        {/* ── Legs ── */}
        <div className="flex gap-1 -mt-0.5">
          <div className="w-2.5 h-7 rounded-full bg-[#2B4C7E] origin-top shadow-sm"
            style={{ animation: 'legSwing 0.35s ease-in-out infinite alternate' }} />
          <div className="w-2.5 h-7 rounded-full bg-[#2B4C7E] origin-top shadow-sm"
            style={{ animation: 'legSwing 0.35s ease-in-out infinite alternate-reverse' }} />
        </div>

        {/* ── Shoes ── */}
        <div className="flex gap-0.5 -mt-0.5">
          <div className="w-3.5 h-2.5 rounded-md bg-[#EF476F] shadow-sm" />
          <div className="w-3.5 h-2.5 rounded-md bg-[#EF476F] shadow-sm" />
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
                    background: ['#FFD23F', '#FF6B35', '#06D6A0', '#EF476F'][i % 4],
                    transform: `translate(-50%,-50%) rotate(${angle}deg) translateY(-16px)`,
                    animation: 'sparkle 0.4s ease-in-out infinite',
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
              style={{ color: '#EF476F' }}
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

// ─── Door Portal ──────────────────────────────────────
function Door({
  laneIdx,
  isCorrect,
  isCurrent,
  feedback,
  pathCount,
  onChoose,
}: {
  laneIdx: number;
  isCorrect: boolean;
  isCurrent: boolean;
  feedback: 'correct' | 'wrong' | null;
  pathCount: number;
  onChoose: (lane: number) => void;
}) {
  const color = LANE_COLORS[laneIdx % LANE_COLORS.length];
  const light = LANE_LIGHT[laneIdx % LANE_LIGHT.length];

  const isFeedbackCorrect = isCurrent && feedback === 'correct' && isCorrect;
  const isFeedbackWrong = isCurrent && feedback === 'wrong' && !isCorrect;
  const isHint = isCurrent && feedback === 'wrong' && isCorrect;

  let doorBg: React.CSSProperties = {
    background: `linear-gradient(180deg, ${light} 0%, ${color} 100%)`,
  };
  let frameBorder = isCurrent ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)';
  let shadowStr = `0 4px 16px ${color}50, inset 0 1px 0 rgba(255,255,255,0.3)`;
  let glowStr = 'none';

  if (isFeedbackCorrect) {
    doorBg = { background: 'linear-gradient(180deg, #5EEFC0 0%, #06D6A0 100%)' };
    frameBorder = '#06D6A0';
    shadowStr = '0 0 20px #06D6A080, 0 0 40px #06D6A040';
    glowStr = '0 0 12px #06D6A0';
  } else if (isFeedbackWrong) {
    doorBg = { background: 'linear-gradient(180deg, #F47A9E 0%, #EF476F 100%)' };
    frameBorder = '#EF476F';
    shadowStr = '0 0 20px #EF476F80, 0 0 40px #EF476F40';
    glowStr = '0 0 12px #EF476F';
  } else if (isHint) {
    frameBorder = '#FFD23F';
    shadowStr = '0 0 15px #FFD23F60';
    glowStr = '0 0 10px #FFD23F';
  }

  return (
    <motion.button
      onClick={() => isCurrent && onChoose(laneIdx)}
      disabled={!isCurrent || feedback !== null}
      className="relative flex-1 flex items-center justify-center"
      style={{
        maxWidth: `${85 / pathCount}%`,
        height: '80px',
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
      {/* Door frame (outer) - dark wood look */}
      <div className="absolute inset-0 rounded-t-[40%] rounded-b-lg"
        style={{
          background: 'linear-gradient(180deg, #8B6B4A 0%, #5C3D2E 100%)',
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
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-white/20 rounded-b-full" />
        </div>

        {/* Door panel (main body) */}
        <div className="absolute inset-x-[3px] top-[30%] bottom-[3px] rounded-b-md"
          style={doorBg}
        >
          {/* Panel inset top */}
          <div className="absolute inset-x-1 top-1 bottom-[45%] border-2 border-white/15 rounded-md" />
          {/* Panel inset bottom */}
          <div className="absolute inset-x-1 top-[58%] bottom-1 border-2 border-white/15 rounded-md" />

          {/* Door handle */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="w-2.5 h-4 rounded-full bg-[#FFD23F] border border-[#E5B82E] shadow-sm"
              style={{ boxShadow: glowStr !== 'none' ? glowStr : '0 1px 3px rgba(0,0,0,0.3)' }} />
          </div>
        </div>

        {/* Glow overlay for current door */}
        {isCurrent && !feedback && (
          <div className="absolute inset-0 rounded-t-[40%] rounded-b-lg border-2 border-[#FFD23F]/40"
            style={{ animation: 'portalPulse 1.5s ease-in-out infinite' }} />
        )}
      </div>

      {/* Door number - centered on the door */}
      <span className="relative text-white font-black text-xl drop-shadow-md z-10 select-none mt-2"
        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
        {laneIdx + 1}
      </span>

      <AnimatePresence>
        {isFeedbackCorrect && (
          <motion.div className="absolute inset-0 flex items-center justify-center bg-[#06D6A0]/50 rounded-t-[40%] rounded-b-lg z-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <span className="text-white text-2xl font-black drop-shadow-lg">OK</span>
          </motion.div>
        )}
        {isFeedbackWrong && (
          <motion.div className="absolute inset-0 flex items-center justify-center bg-[#EF476F]/50 rounded-t-[40%] rounded-b-lg z-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <span className="text-white text-2xl font-black drop-shadow-lg">X</span>
          </motion.div>
        )}
        {isHint && (
          <motion.div className="absolute inset-0 flex items-center justify-center bg-[#FFD23F]/30 rounded-t-[40%] rounded-b-lg z-20"
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
function DoorRow({
  doorIndex, pathCount, correctLane, isCurrent, feedback, onChoose,
}: {
  doorIndex: number; pathCount: number; correctLane: number;
  isCurrent: boolean; feedback: 'correct' | 'wrong' | null;
  onChoose: (lane: number) => void;
}) {
  const bottomPercent = 22 + doorIndex * 16;
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
          isCurrent={isCurrent} feedback={feedback} pathCount={pathCount} onChoose={onChoose} />
      ))}
    </motion.div>
  );
}

// ─── Sky & Road Background ────────────────────────────
function SkyBackground() {
  const clouds = useMemo(() => [
    { id: 1, left: '10%', top: '6%', w: 80, h: 28, speed: 35 },
    { id: 2, left: '55%', top: '3%', w: 100, h: 32, speed: 45 },
    { id: 3, left: '80%', top: '10%', w: 60, h: 22, speed: 30 },
    { id: 4, left: '30%', top: '14%', w: 70, h: 24, speed: 40 },
  ], []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#FF8C42] via-[#FFC857] to-[#FFE4A0]" />
      <div className="absolute top-[4%] left-1/2 -translate-x-1/2 w-24 h-24 rounded-full"
        style={{
          background: 'radial-gradient(circle, #FFF8E1 0%, #FFD54F 40%, #FF9800 80%, transparent 100%)',
          boxShadow: '0 0 60px #FF980060, 0 0 120px #FF980030',
        }}
      >
        <div className="absolute inset-0" style={{ animation: 'sunRotate 20s linear infinite' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="absolute left-1/2 top-1/2 w-1 h-8 bg-[#FFD54F]/40 rounded-full origin-bottom"
              style={{ transform: `translate(-50%, -100%) rotate(${i * 45}deg) translateY(-14px)` }} />
          ))}
        </div>
      </div>
      {clouds.map(c => (
        <div key={c.id} className="absolute rounded-full bg-white/80"
          style={{ left: c.left, top: c.top, width: c.w, height: c.h, animation: `cloudDrift ${c.speed}s linear infinite`, filter: 'blur(1px)' }}>
          <div className="absolute -top-2 left-1/4 w-3/5 h-3/4 bg-white/80 rounded-full" />
          <div className="absolute -top-1 right-1/4 w-2/5 h-2/3 bg-white/70 rounded-full" />
        </div>
      ))}
      <div className="absolute bottom-[28%] left-0 right-0 h-[12%]">
        <svg viewBox="0 0 400 50" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,50 L0,35 L15,35 L15,20 L25,20 L25,30 L40,30 L40,15 L50,15 L50,25 L65,25 L65,35 L80,35 L80,10 L90,10 L90,30 L105,30 L105,20 L120,20 L120,35 L140,35 L140,25 L155,25 L155,40 L170,40 L170,15 L185,15 L185,30 L200,30 L200,22 L215,22 L215,38 L230,38 L230,12 L245,12 L245,28 L260,28 L260,35 L280,35 L280,18 L295,18 L295,32 L310,32 L310,25 L325,25 L325,40 L340,40 L340,20 L360,20 L360,35 L380,35 L380,28 L400,28 L400,50 Z"
            fill="#7B5B3A" opacity="0.3" />
        </svg>
      </div>
    </div>
  );
}

// ─── Road ─────────────────────────────────────────────
function RoadVisual({ pathCount }: { pathCount: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <SkyBackground />
      <div className="absolute left-[4%] right-[4%] bottom-0"
        style={{
          height: '78%',
          background: `linear-gradient(to bottom, #5C3D2E 0%, #7B5B3A 20%, #8B6B4A 50%, #6B4B2A 100%)`,
          borderLeft: '3px solid #FFD23F80',
          borderRight: '3px solid #FFD23F80',
        }}
      >
        {Array.from({ length: pathCount + 1 }).map((_, i) => (
          <div key={i} className="absolute top-0 bottom-0"
            style={{ left: `${(i / pathCount) * 100}%`, width: '2px', background: 'linear-gradient(to bottom, transparent 0%, #FFD23F30 30%, #FFD23F60 100%)' }} />
        ))}
        {Array.from({ length: pathCount }).map((_, i) => (
          <div key={`ls-${i}`} className="absolute bottom-0"
            style={{ left: `${(i / pathCount) * 100 + 0.5}%`, width: `${100 / pathCount - 1}%`, height: '8px', background: `linear-gradient(to top, ${LANE_COLORS[i % LANE_COLORS.length]}90, transparent)` }} />
        ))}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 overflow-hidden">
          <div className="w-full h-[200%] flex flex-col gap-3 pt-0" style={{ animation: 'dashScroll 0.6s linear infinite' }}>
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="w-full h-3 bg-[#FFD23F]/40 rounded-full shrink-0" />
            ))}
          </div>
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-2 rounded-r"
          style={{ background: 'linear-gradient(to bottom, transparent, #FF6B3560, #FF6B3580)', boxShadow: '2px 0 10px #FF6B3540' }} />
        <div className="absolute right-0 top-0 bottom-0 w-2 rounded-l"
          style={{ background: 'linear-gradient(to bottom, transparent, #FF6B3560, #FF6B3580)', boxShadow: '-2px 0 10px #FF6B3540' }} />
        <div className="absolute left-1/2 -translate-x-1/2 w-24 h-24 rounded-full"
          style={{ top: '3%', background: 'radial-gradient(circle, #FFD23F40 0%, transparent 70%)' }} />
      </div>
    </div>
  );
}

// ─── Main Scene Component ─────────────────────────────
export default function DoorRunnerScene() {
  const settings = useGameStore((s) => s.settings);
  const sequence = useGameStore((s) => s.sequence);
  const currentStep = useGameStore((s) => s.currentStep);
  const feedback = useGameStore((s) => s.feedback);
  const isRunning = useGameStore((s) => s.isRunning);
  const combo = useGameStore((s) => s.combo);
  const chooseLane = useGameStore((s) => s.chooseLane);
  const handleTimeout = useGameStore((s) => s.handleTimeout);
  const score = useGameStore((s) => s.score);
  const seasonId = useGameStore((s) => s.seasonId);
  const pathCount = settings.pathCount;
  const lang = settings.lang;
  const correctLane = getExpectedPath(sequence, seasonId, pathCount, currentStep);

  // ─── Timer speed calculations (TimerBar now manages its own rAF) ───
  const currentSpeedMs = getProgressiveSpeedMs(settings.speed, currentStep, settings.customTimerSec);
  const baseSpeedMs = getProgressiveSpeedMs(settings.speed, 0, settings.customTimerSec);

  // ─── Track last correct lane for coin effect ───
  const [lastCorrectLane, setLastCorrectLane] = useState<number | null>(null);
  useEffect(() => {
    if (feedback === 'correct') {
      setLastCorrectLane(correctLane);
    }
  }, [feedback, correctLane]);

  // ─── Keyboard support (1-6, arrows, A/D, Space/Enter) ───
  const activeLaneRef = useRef(0);

  useEffect(() => {
    if (!isRunning) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useGameStore.getState();
      if (!state.isRunning || state.feedback !== null) return;

      // Number keys 1-6: direct lane selection
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= pathCount) {
        activeLaneRef.current = num - 1;
        chooseLane(num - 1);
        return;
      }

      // Arrow keys & A/D: relative lane movement
      let direction = 0;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') direction = -1;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') direction = 1;

      if (direction !== 0) {
        e.preventDefault(); // prevent page scroll on arrow keys
        const newLane = Math.max(0, Math.min(pathCount - 1, activeLaneRef.current + direction));
        if (newLane !== activeLaneRef.current) {
          activeLaneRef.current = newLane;
          chooseLane(newLane);
        }
      }

      // Enter / Space: confirm current lane
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        chooseLane(activeLaneRef.current);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, pathCount, chooseLane]);

  // ─── Swipe gesture support ───
  const swipeStateRef = useRef({
    activeLane: 0,
    touchStartX: 0,
    touchStartY: 0,
    isSwiping: false,
  });

  useEffect(() => {
    if (isRunning && feedback === null) {
      swipeStateRef.current.activeLane = correctLane;
    }
  }, [currentStep, isRunning, feedback, correctLane]);

  const handleChoose = useCallback(
    (lane: number) => {
      if (!isRunning || feedback !== null) return;
      swipeStateRef.current.activeLane = lane;
      chooseLane(lane);
    },
    [isRunning, feedback, chooseLane]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isRunning || feedback !== null) return;
    const touch = e.touches[0];
    swipeStateRef.current.touchStartX = touch.clientX;
    swipeStateRef.current.touchStartY = touch.clientY;
    swipeStateRef.current.isSwiping = false;
  }, [isRunning, feedback]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isRunning || feedback !== null) return;
    const touch = e.touches[0];
    const dx = touch.clientX - swipeStateRef.current.touchStartX;
    const dy = touch.clientY - swipeStateRef.current.touchStartY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30 && !swipeStateRef.current.isSwiping) {
      swipeStateRef.current.isSwiping = true;
      const currentLane = swipeStateRef.current.activeLane;
      const direction = dx > 0 ? 1 : -1;
      const newLane = Math.max(0, Math.min(pathCount - 1, currentLane + direction));

      if (newLane !== currentLane) {
        swipeStateRef.current.activeLane = newLane;
        chooseLane(newLane);
      }
    }
  }, [isRunning, feedback, pathCount, chooseLane]);

  const handleTouchEnd = useCallback(() => {
    swipeStateRef.current.isSwiping = false;
  }, []);

  // ─── Door rows ───
  const doorRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < 4; i++) {
      const stepIdx = currentStep + i;
      rows.push({ doorIndex: i, correctLane: getExpectedPath(sequence, seasonId, pathCount, stepIdx), isCurrent: i === 0 });
    }
    return rows;
  }, [currentStep, sequence, seasonId, pathCount]);

  return (
    <motion.div
      className="relative w-full h-full select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      animate={feedback === 'wrong' && !prefersReducedMotion() ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <RoadVisual pathCount={pathCount} />
      {isRunning && <SpeedLines />}

      {/* Timer bar — self-contained, no re-renders on each frame */}
      {isRunning && <TimerBar currentStep={currentStep} speedMs={currentSpeedMs} isRunning={isRunning} feedback={feedback} onTimeout={handleTimeout} />}

      {/* Speed indicator */}
      {isRunning && <SpeedIndicator currentMs={currentSpeedMs} baseMs={baseSpeedMs} />}

      {doorRows.map((row) => (
        <DoorRow key={`row-${row.doorIndex}`}
          doorIndex={row.doorIndex} pathCount={pathCount} correctLane={row.correctLane}
          isCurrent={row.isCurrent} feedback={row.isCurrent ? feedback : null} onChoose={handleChoose} />
      ))}

      {isRunning && <Runner pathCount={pathCount} currentLane={correctLane} feedback={feedback} />}

      <AnimatePresence>
        {feedback === 'correct' && <ParticleBurst type="correct" key="vfx-correct" />}
        {feedback === 'wrong' && <ParticleBurst type="wrong" key="vfx-wrong" />}
      </AnimatePresence>

      <AnimatePresence>
        {feedback === 'correct' && lastCorrectLane !== null && (
          <CoinEffect key={`coin-${score}`} laneX={getLanePercent(lastCorrectLane, pathCount)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        <ComboBadge combo={combo} lang={lang} key={`combo-${combo}`} />
      </AnimatePresence>

      <HUD combo={combo} lang={lang} />

      {/* Achievement toast */}
      <AnimatePresence>
        <AchievementToast />
      </AnimatePresence>

      {/* Swipe hint */}
      <SwipeHint pathCount={pathCount} />

      <LaneButtons />
    </motion.div>
  );
}

// ─── Swipe Hint Overlay ────────────────────────────────
function SwipeHint({ pathCount }: { pathCount: number }) {
  const [visible, setVisible] = useState(true);
  const isRunning = useGameStore((s) => s.isRunning);
  const lang = useGameStore((s) => s.settings.lang);
  const [isTouchDevice] = useState(
    () => typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isRunning || !visible || pathCount < 2) return null;

  const touchHint = (
    <>
      <motion.span
        className="text-white/80 text-sm font-bold"
        animate={{ x: [-4, 4, -4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {'< >'}
      </motion.span>
      <span className="text-white/60 text-xs font-medium">{t('hint.swipe', lang)}</span>
    </>
  );

  const keyboardHint = (
    <>
      <kbd className="inline-flex items-center justify-center w-6 h-6 rounded bg-white/15 border border-white/20 text-white/80 text-xs font-bold">←</kbd>
      <kbd className="inline-flex items-center justify-center w-6 h-6 rounded bg-white/15 border border-white/20 text-white/80 text-xs font-bold">→</kbd>
      <span className="text-white/40 text-xs">/</span>
      <kbd className="inline-flex items-center justify-center w-6 h-6 rounded bg-white/15 border border-white/20 text-white/80 text-xs font-bold">A</kbd>
      <kbd className="inline-flex items-center justify-center w-6 h-6 rounded bg-white/15 border border-white/20 text-white/80 text-xs font-bold">D</kbd>
      <span className="text-white/40 text-xs">•</span>
      <kbd className="inline-flex items-center justify-center px-1.5 h-6 rounded bg-white/15 border border-white/20 text-white/80 text-[10px] font-bold">{t('hint.space', lang)}</kbd>
    </>
  );

  return (
    <motion.div
      className="absolute bottom-28 left-0 right-0 z-30 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="flex items-center gap-2 rounded-2xl bg-black/40 backdrop-blur-sm px-4 py-2 border border-white/15">
        {isTouchDevice ? touchHint : keyboardHint}
      </div>
    </motion.div>
  );
}
