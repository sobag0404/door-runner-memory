import { useMemo, useCallback, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, getSpeedMs, getCurrentCombo } from '../store/gameStore';

// ─── Palette (Subway Surfers inspired — vibrant, warm, colorful) ──
const LANE_COLORS = [
  '#FF6B35', // vivid orange
  '#FFD23F', // golden yellow
  '#06D6A0', // mint green
  '#EF476F', // hot pink
  '#118AB2', // ocean blue
  '#8338EC', // electric purple
];

const LANE_LIGHT = [
  '#FF9F6B',
  '#FFE680',
  '#5EEFC0',
  '#F47A9E',
  '#4DB8D9',
  '#A86FF0',
];

// ─── Helper: lane X position ──────────────────────────
function getLanePercent(laneIndex: number, pathCount: number): number {
  return ((laneIndex + 0.5) / pathCount) * 100;
}

// ─── Combo Badge ──────────────────────────────────────
function ComboBadge({ combo }: { combo: number }) {
  if (combo < 3) return null;
  const label = combo >= 10 ? '🔥 INSANE!' : combo >= 7 ? '⚡ SUPER!' : combo >= 5 ? '✨ GREAT!' : '👍 NICE!';
  const color = combo >= 10 ? '#EF476F' : combo >= 7 ? '#8338EC' : combo >= 5 ? '#FF6B35' : '#06D6A0';
  return (
    <motion.div
      className="absolute top-16 left-1/2 z-50 pointer-events-none font-black text-base px-3 py-1 rounded-full"
      style={{ color, x: '-50%', animation: 'comboGlow 0.8s ease-in-out infinite' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.5, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      {label}
    </motion.div>
  );
}

// ─── Timer Bar (countdown for each step) ──────────────
function TimerBar({ timeLeft }: { timeLeft: number }) {
  const barColor = timeLeft > 0.5
    ? '#06D6A0'
    : timeLeft > 0.25
      ? '#FFD23F'
      : '#EF476F';

  const barGlow = timeLeft <= 0.25
    ? `0 0 12px #EF476F80`
    : timeLeft <= 0.5
      ? `0 0 8px #FFD23F60`
      : `0 0 6px #06D6A040`;

  return (
    <div className="absolute top-0 left-0 right-0 z-40 h-1.5 bg-black/30">
      <div
        className="h-full rounded-full"
        style={{
          width: `${timeLeft * 100}%`,
          background: `linear-gradient(90deg, ${barColor}, ${barColor}dd)`,
          boxShadow: barGlow,
          transition: 'width 0.05s linear, background 0.3s ease',
        }}
      />
    </div>
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
      className="absolute bottom-[20%] z-20"
      animate={{
        left: `${leftPercent}%`,
        y: feedback === 'wrong' ? [0, -12, 6, -4, 0] : 0,
      }}
      transition={{
        left: { type: 'spring', stiffness: 320, damping: 22 },
        y: { duration: 0.5, ease: 'easeOut' },
      }}
      style={{ transform: 'translateX(-50%)' }}
    >
      <div
        className="relative flex flex-col items-center"
        style={{ animation: feedback !== 'wrong' ? 'runnerBounce 0.35s ease-in-out infinite' : undefined }}
      >
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
          style={{ animation: 'armSwing 0.3s ease-in-out infinite alternate' }} />
        <div className="absolute top-[38px] -right-3.5 w-3 h-7 rounded-full bg-[#FFDBB5] origin-top shadow-sm"
          style={{ animation: 'armSwing 0.3s ease-in-out infinite alternate-reverse' }} />

        {/* ── Legs ── */}
        <div className="flex gap-1 -mt-0.5">
          <div className="w-2.5 h-7 rounded-full bg-[#2B4C7E] origin-top shadow-sm"
            style={{ animation: 'legSwing 0.25s ease-in-out infinite alternate' }} />
          <div className="w-2.5 h-7 rounded-full bg-[#2B4C7E] origin-top shadow-sm"
            style={{ animation: 'legSwing 0.25s ease-in-out infinite alternate-reverse' }} />
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
              ✗
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

  let bgStyle: React.CSSProperties = {
    background: `linear-gradient(180deg, ${light} 0%, ${color} 100%)`,
    borderColor: isCurrent ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
  };
  let shadowStr = `0 4px 12px ${color}60, inset 0 2px 0 rgba(255,255,255,0.3)`;

  if (isFeedbackCorrect) {
    bgStyle = { background: 'linear-gradient(180deg, #5EEFC0 0%, #06D6A0 100%)', borderColor: '#06D6A0' };
    shadowStr = '0 0 20px #06D6A080, 0 0 40px #06D6A040, inset 0 2px 0 rgba(255,255,255,0.4)';
  } else if (isFeedbackWrong) {
    bgStyle = { background: 'linear-gradient(180deg, #F47A9E 0%, #EF476F 100%)', borderColor: '#EF476F' };
    shadowStr = '0 0 20px #EF476F80, 0 0 40px #EF476F40, inset 0 2px 0 rgba(255,255,255,0.3)';
  } else if (isHint) {
    bgStyle = { background: `linear-gradient(180deg, ${light} 0%, ${color} 100%)`, borderColor: '#FFD23F' };
    shadowStr = '0 0 15px #FFD23F60, inset 0 2px 0 rgba(255,255,255,0.4)';
  }

  return (
    <motion.button
      onClick={() => isCurrent && onChoose(laneIdx)}
      disabled={!isCurrent || feedback !== null}
      className="relative flex-1 rounded-2xl overflow-hidden"
      style={{
        maxWidth: `${88 / pathCount}%`,
        height: '62px',
        ...bgStyle,
        border: `3px solid ${bgStyle.borderColor}`,
        boxShadow: shadowStr,
      }}
      whileHover={isCurrent ? { scale: 1.08, y: -3 } : undefined}
      whileTap={isCurrent ? { scale: 0.92 } : undefined}
      animate={
        isFeedbackWrong
          ? { x: [0, -8, 8, -5, 5, 0] }
          : isFeedbackCorrect
            ? { scale: [1, 1.12, 1] }
            : isCurrent
              ? { scale: [1, 1.03, 1] }
              : undefined
      }
      transition={{ duration: 0.4 }}
    >
      <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-white/35 to-transparent rounded-t-2xl" />
      <div className="absolute inset-x-1.5 top-1 bottom-1 border-2 border-white/15 rounded-xl" />
      <span className="relative text-white font-black text-2xl drop-shadow-md z-10"
        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
        {laneIdx + 1}
      </span>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/30 border border-white/25 shadow-sm" />
      <div className="absolute inset-x-1 bottom-1 h-1.5 bg-white/15 rounded-full" />

      <AnimatePresence>
        {isFeedbackCorrect && (
          <motion.div className="absolute inset-0 flex items-center justify-center bg-[#06D6A0]/40 rounded-2xl"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <span className="text-white text-3xl font-black drop-shadow-lg">✓</span>
          </motion.div>
        )}
        {isFeedbackWrong && (
          <motion.div className="absolute inset-0 flex items-center justify-center bg-[#EF476F]/40 rounded-2xl"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <span className="text-white text-3xl font-black drop-shadow-lg">✗</span>
          </motion.div>
        )}
        {isHint && (
          <motion.div className="absolute inset-0 flex items-center justify-center bg-[#FFD23F]/30 rounded-2xl"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ delay: 0.15 }}>
            <span className="text-white text-2xl font-black drop-shadow-lg">⇨</span>
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
  const bottomPercent = 20 + doorIndex * 18;
  const scale = 1 - doorIndex * 0.11;
  const opacity = Math.max(0.25, 1 - doorIndex * 0.2);

  return (
    <motion.div
      className="absolute left-0 right-0 flex justify-center gap-2 px-5"
      style={{ bottom: `${bottomPercent}%`, transformOrigin: 'center bottom' }}
      animate={{ scale, opacity, rotateX: doorIndex * 3 }}
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
          transform: 'perspective(600px) rotateX(4deg)',
          transformOrigin: 'center bottom',
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

// ─── Speed Lines VFX ──────────────────────────────────
function SpeedLines() {
  const lines = useMemo(() =>
    Array.from({ length: 8 }).map((_, i) => ({
      id: i, left: 5 + Math.random() * 90, width: 1 + Math.random() * 2,
      duration: 0.4 + Math.random() * 0.4, delay: Math.random() * 1, opacity: 0.15 + Math.random() * 0.2,
    })), []
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {lines.map(l => (
        <div key={l.id} className="absolute top-0 rounded-full bg-white"
          style={{ left: `${l.left}%`, width: l.width, height: '30%', opacity: l.opacity, animation: `speedLine ${l.duration}s linear ${l.delay}s infinite` }} />
      ))}
    </div>
  );
}

// ─── Particle Burst VFX ──────────────────────────────
function ParticleBurst({ type }: { type: 'correct' | 'wrong' }) {
  const isCorrect = type === 'correct';
  const particles = useMemo(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      id: i, x: 25 + Math.random() * 50, delay: Math.random() * 0.25,
      duration: 0.5 + Math.random() * 0.5, size: 4 + Math.random() * 8,
      angle: -40 + Math.random() * 80,
      color: isCorrect ? ['#FFD23F', '#FF6B35', '#06D6A0', '#FFF'][i % 4] : ['#EF476F', '#FF6B6B', '#FF9F43', '#FFF'][i % 4],
      isStar: Math.random() > 0.5,
    })), [isCorrect]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 25 }}>
      {particles.map(p => (
        <motion.div key={p.id} className="absolute"
          style={{ left: `${p.x}%`, bottom: '30%', width: p.size, height: p.size }}
          initial={{ opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 }}
          animate={{ opacity: 0, y: -120 - Math.random() * 80, x: p.angle * 2.5, scale: 0, rotate: 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
        >
          {p.isStar ? (
            <div style={{ color: p.color, fontSize: p.size, lineHeight: 1 }}>★</div>
          ) : (
            <div className="w-full h-full rounded-full" style={{ backgroundColor: p.color }} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Coin effect ──────────────────────────────────────
function CoinEffect({ laneX }: { laneX: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 26 }}>
      <motion.div className="absolute font-black text-xl text-[#FFD23F]"
        style={{ left: `${laneX}%`, bottom: '38%', textShadow: '0 2px 8px #FF6B3580' }}
        initial={{ opacity: 1, y: 0, scale: 0.5 }}
        animate={{ opacity: 0, y: -70, scale: 1.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        +1 🪙
      </motion.div>
    </div>
  );
}

// ─── HUD ──────────────────────────────────────────────
function HUD({ combo }: { combo: number }) {
  const score = useGameStore((s) => s.score);
  const feedback = useGameStore((s) => s.feedback);

  return (
    <div className="absolute inset-0 pointer-events-none z-30"
      style={feedback === 'wrong' ? { animation: 'screenShake 0.4s ease-out' } : undefined}
    >
      <div className="flex justify-between items-start p-3 pt-5">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/15 shadow-lg">
          <span className="text-[#FFD23F] text-sm">🪙</span>
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
              {feedback === 'correct' ? '✓ Верно!' : '✗ Ошибка!'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Lane Buttons ─────────────────────────────────────
function LaneButtons() {
  const pathCount = useGameStore((s) => s.settings.pathCount);
  const chooseLane = useGameStore((s) => s.chooseLane);
  const isRunning = useGameStore((s) => s.isRunning);
  const feedback = useGameStore((s) => s.feedback);

  const handleLane = useCallback(
    (lane: number) => {
      if (!isRunning || feedback !== null) return;
      chooseLane(lane);
    },
    [isRunning, feedback, chooseLane]
  );

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 p-3 pb-5">
      <div className="grid gap-3 max-w-lg mx-auto"
        style={{ gridTemplateColumns: `repeat(${pathCount}, 1fr)` }}>
        {Array.from({ length: pathCount }).map((_, i) => {
          const color = LANE_COLORS[i % LANE_COLORS.length];
          const light = LANE_LIGHT[i % LANE_LIGHT.length];
          return (
            <motion.button key={i} onClick={() => handleLane(i)}
              disabled={!isRunning || feedback !== null}
              className="h-16 rounded-2xl font-black text-2xl text-white relative overflow-hidden disabled:opacity-40"
              style={{
                background: `linear-gradient(180deg, ${light} 0%, ${color} 100%)`,
                boxShadow: `0 4px 15px ${color}50, inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.15)`,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-white/25 to-transparent rounded-t-2xl" />
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/15 to-transparent rounded-b-2xl" />
              <span className="relative">{i + 1}</span>
            </motion.button>
          );
        })}
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
  const chooseLane = useGameStore((s) => s.chooseLane);
  const handleTimeout = useGameStore((s) => s.handleTimeout);
  const score = useGameStore((s) => s.score);
  const pathCount = settings.pathCount;
  const correctLane = sequence[currentStep] ?? 0;

  // ─── Timer logic (fixed: stable ref for handleTimeout) ───
  const [timeLeft, setTimeLeft] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepStartRef = useRef<number>(0);
  const speedMs = getSpeedMs(settings.speed);

  // Use ref for handleTimeout to avoid re-creating interval on every render
  const handleTimeoutRef = useRef(handleTimeout);
  handleTimeoutRef.current = handleTimeout;

  // Start/reset timer when step changes
  useEffect(() => {
    if (!isRunning || feedback !== null) return;

    stepStartRef.current = Date.now();
    setTimeLeft(1);

    if (timerRef.current) clearInterval(timerRef.current);

    const interval = 50;
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - stepStartRef.current;
      const remaining = Math.max(0, 1 - elapsed / speedMs);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        handleTimeoutRef.current();
      }
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentStep, isRunning, feedback, speedMs]);

  // Clear timer when feedback is active
  useEffect(() => {
    if (feedback !== null && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [feedback]);

  // ─── Combo tracking (from store) ───
  const [combo, setCombo] = useState(0);
  const [lastCorrectLane, setLastCorrectLane] = useState<number | null>(null);

  useEffect(() => {
    if (feedback === 'correct') {
      const newCombo = getCurrentCombo();
      setCombo(newCombo);
      setLastCorrectLane(correctLane);
    } else if (feedback === 'wrong') {
      setCombo(0);
      setLastCorrectLane(null);
    }
  }, [feedback, correctLane]);

  // ─── Swipe gesture support ───
  const swipeStateRef = useRef({
    activeLane: 0,
    touchStartX: 0,
    touchStartY: 0,
    isSwiping: false,
  });

  // Initialize activeLane when step changes
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

  // Touch handlers for swipe
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

    // Only detect horizontal swipes (must be more horizontal than vertical)
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30 && !swipeStateRef.current.isSwiping) {
      swipeStateRef.current.isSwiping = true;
      const currentLane = swipeStateRef.current.activeLane;
      const direction = dx > 0 ? 1 : -1; // right = +1, left = -1
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
      rows.push({ doorIndex: i, correctLane: sequence[stepIdx] ?? 0, isCurrent: i === 0 });
    }
    return rows;
  }, [currentStep, sequence]);

  return (
    <div
      className="relative w-full h-full select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <RoadVisual pathCount={pathCount} />
      {isRunning && <SpeedLines />}

      {/* Timer bar */}
      {isRunning && <TimerBar timeLeft={timeLeft} />}

      {doorRows.map((row) => (
        <DoorRow key={`row-${currentStep}-${row.doorIndex}`}
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
        <ComboBadge combo={combo} key={`combo-${combo}`} />
      </AnimatePresence>

      <HUD combo={combo} />

      {/* Swipe hint (shows briefly at game start) */}
      <SwipeHint pathCount={pathCount} />

      <LaneButtons />
    </div>
  );
}

// ─── Swipe Hint Overlay ────────────────────────────────
function SwipeHint({ pathCount }: { pathCount: number }) {
  const [visible, setVisible] = useState(true);
  const isRunning = useGameStore((s) => s.isRunning);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isRunning || !visible || pathCount < 2) return null;

  return (
    <motion.div
      className="absolute bottom-28 left-0 right-0 z-30 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="flex items-center gap-2 rounded-2xl bg-black/40 backdrop-blur-sm px-4 py-2 border border-white/15">
        <motion.span
          className="text-white/80 text-sm font-bold"
          animate={{ x: [-4, 4, -4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          👈 👉
        </motion.span>
        <span className="text-white/60 text-xs font-medium">Swipe or tap to choose</span>
      </div>
    </motion.div>
  );
}
