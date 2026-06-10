'use client';

import { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

// ─── Constants ─────────────────────────────────────────
const LANE_COLORS = [
  '#ff6b6b', // coral
  '#ffa502', // amber
  '#2ed573', // green
  '#ff4757', // red-coral
  '#eccc68', // gold
  '#a4b0be', // silver
];

const LANE_GLOW = [
  '#ff6b6b40',
  '#ffa50240',
  '#2ed57340',
  '#ff475740',
  '#eccc6840',
  '#a4b0be40',
];

// ─── Helper: lane position percent ─────────────────────
function getLanePercent(laneIndex: number, pathCount: number): number {
  return ((laneIndex + 0.5) / pathCount) * 100;
}

// ─── Runner Component (enhanced) ───────────────────────
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
        y: feedback === 'wrong' ? [0, -8, 4, -2, 0] : 0,
      }}
      transition={{
        left: { type: 'spring', stiffness: 300, damping: 25 },
        y: { duration: 0.4, ease: 'easeOut' },
      }}
      style={{ transform: 'translateX(-50%)' }}
    >
      <div className="relative flex flex-col items-center">
        {/* Shadow under runner */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/30 rounded-full blur-sm" />

        {/* Head */}
        <div className="w-8 h-8 rounded-full bg-amber-200 border-2 border-amber-300 relative shadow-md">
          {/* Hair */}
          <div className="absolute -top-1 left-1 right-1 h-3 rounded-t-full bg-orange-600" />

          {/* Eyes - animate on feedback */}
          <motion.div
            className="absolute top-2 left-1.5 flex gap-2"
            animate={{
              scaleY: feedback === 'wrong' ? 0.3 : 1,
            }}
            transition={{ duration: 0.15 }}
          >
            <div className="w-2 h-2 rounded-full bg-gray-800 relative">
              {/* Pupil */}
              <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-white" />
            </div>
            <div className="w-2 h-2 rounded-full bg-gray-800 relative">
              <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-white" />
            </div>
          </motion.div>

          {/* Eyebrows */}
          <motion.div
            className="absolute top-0.5 left-1 right-1 flex justify-between"
            animate={{
              y: feedback === 'wrong' ? 2 : 0,
            }}
          >
            <div className="w-2.5 h-0.5 bg-gray-800 rounded-full rotate-[-8deg]" />
            <div className="w-2.5 h-0.5 bg-gray-800 rounded-full rotate-[8deg]" />
          </motion.div>

          {/* Mouth */}
          <motion.div
            className="absolute bottom-1 left-1/2 -translate-x-1/2"
            animate={{
              borderRadius: feedback === 'correct' ? '50%' : '2px',
              width: feedback === 'correct' ? '3px' : '6px',
              height: feedback === 'correct' ? '3px' : '2px',
            }}
          >
            <div className="w-2 h-1 bg-gray-800 rounded-full" />
          </motion.div>
        </div>

        {/* Body */}
        <div className="w-6 h-8 rounded-md bg-orange-500 -mt-1 shadow-sm relative">
          {/* Shirt stripe */}
          <div className="absolute top-2 left-1 right-1 h-1 bg-orange-400 rounded-full" />
        </div>

        {/* Arms - with running swing */}
        <div className="absolute top-9 -left-3 w-2.5 h-6 rounded-full bg-orange-400 origin-top animate-[armSwing_0.4s_ease-in-out_infinite_alternate] shadow-sm" />
        <div className="absolute top-9 -right-3 w-2.5 h-6 rounded-full bg-orange-400 origin-top animate-[armSwing_0.4s_ease-in-out_infinite_alternate_reverse] shadow-sm" />

        {/* Legs - with running swing */}
        <div className="flex gap-1.5 -mt-1">
          <div className="w-2 h-6 rounded-full bg-gray-700 origin-top animate-[legSwing_0.3s_ease-in-out_infinite_alternate]" />
          <div className="w-2 h-6 rounded-full bg-gray-700 origin-top animate-[legSwing_0.3s_ease-in-out_infinite_alternate_reverse]" />
        </div>

        {/* Shoes */}
        <div className="flex gap-1 -mt-1">
          <div className="w-3 h-2 rounded-sm bg-red-500 shadow-sm" />
          <div className="w-3 h-2 rounded-sm bg-red-500 shadow-sm" />
        </div>

        {/* Correct feedback glow */}
        <AnimatePresence>
          {feedback === 'correct' && (
            <motion.div
              className="absolute inset-0 rounded-full bg-green-400/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: [0.5, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Door Component (single door) ──────────────────────
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
  const isFeedbackCorrect = isCurrent && feedback === 'correct' && isCorrect;
  const isFeedbackWrong = isCurrent && feedback === 'wrong' && !isCorrect;
  const isHint = isCurrent && feedback === 'wrong' && isCorrect;

  let bgColor = `linear-gradient(135deg, ${LANE_COLORS[laneIdx % LANE_COLORS.length]}cc, ${LANE_COLORS[laneIdx % LANE_COLORS.length]}88)`;
  let borderColor = 'rgba(255,255,255,0.15)';
  let shadowStr = `0 2px 8px ${LANE_GLOW[laneIdx % LANE_GLOW.length]}`;

  if (isFeedbackCorrect) {
    bgColor = 'linear-gradient(135deg, #2ed573, #20bf6b)';
    borderColor = '#2ed573';
    shadowStr = '0 0 25px #2ed57380, 0 0 50px #2ed57340';
  } else if (isFeedbackWrong) {
    bgColor = 'linear-gradient(135deg, #ff4757, #e74c3c)';
    borderColor = '#ff4757';
    shadowStr = '0 0 25px #ff475780, 0 0 50px #ff475740';
  } else if (isHint) {
    bgColor = 'linear-gradient(135deg, #ffa502, #ff9f1a)';
    borderColor = '#ffa502';
    shadowStr = '0 0 15px #ffa50260';
  }

  return (
    <motion.button
      onClick={() => isCurrent && onChoose(laneIdx)}
      disabled={!isCurrent || feedback !== null}
      className="relative flex-1 rounded-xl overflow-hidden"
      style={{
        maxWidth: `${90 / pathCount}%`,
        height: '56px',
        background: bgColor,
        border: `2px solid ${borderColor}`,
        boxShadow: shadowStr,
      }}
      whileHover={isCurrent ? { scale: 1.05, y: -2 } : {}}
      whileTap={isCurrent ? { scale: 0.95 } : {}}
      animate={
        isFeedbackWrong
          ? { x: [0, -6, 6, -4, 4, 0] }
          : isFeedbackCorrect
            ? { scale: [1, 1.1, 1] }
            : {}
      }
      transition={{ duration: 0.4 }}
    >
      {/* Door frame arch */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl" />

      {/* Door panel lines */}
      <div className="absolute inset-x-2 top-3 bottom-3 border border-white/10 rounded-lg" />

      {/* Door number */}
      <span className="relative text-white font-extrabold text-xl drop-shadow-md z-10">
        {laneIdx + 1}
      </span>

      {/* Door handle */}
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white/30 border border-white/20 shadow-sm" />

      {/* Feedback icon overlay */}
      <AnimatePresence>
        {isFeedbackCorrect && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-green-500/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="text-white text-2xl font-bold">✓</span>
          </motion.div>
        )}
        {isFeedbackWrong && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-red-500/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="text-white text-2xl font-bold">✗</span>
          </motion.div>
        )}
        {isHint && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-amber-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-white text-xl font-bold">→</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Door Row Component ────────────────────────────────
function DoorRow({
  doorIndex,
  pathCount,
  correctLane,
  isCurrent,
  feedback,
  onChoose,
}: {
  doorIndex: number;
  pathCount: number;
  correctLane: number;
  isCurrent: boolean;
  feedback: 'correct' | 'wrong' | null;
  onChoose: (lane: number) => void;
}) {
  const bottomPercent = 20 + doorIndex * 18;
  const scale = 1 - doorIndex * 0.12;
  const opacity = Math.max(0.3, 1 - doorIndex * 0.18);

  return (
    <motion.div
      className="absolute left-0 right-0 flex justify-center gap-1.5 px-4"
      style={{
        bottom: `${bottomPercent}%`,
        transformOrigin: 'center bottom',
      }}
      animate={{
        scale,
        opacity,
        rotateX: doorIndex * 3,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {Array.from({ length: pathCount }).map((_, laneIdx) => (
        <Door
          key={laneIdx}
          laneIdx={laneIdx}
          isCorrect={laneIdx === correctLane}
          isCurrent={isCurrent}
          feedback={feedback}
          pathCount={pathCount}
          onChoose={onChoose}
        />
      ))}
    </motion.div>
  );
}

// ─── Road Visual (enhanced) ────────────────────────────
function RoadVisual({ pathCount }: { pathCount: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#12122e] to-[#1a1a3e]" />

      {/* Stars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute rounded-full bg-white animate-[twinkle_2s_ease-in-out_infinite]"
          style={{
            width: 1 + Math.random() * 2,
            height: 1 + Math.random() * 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 30}%`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: 0.3 + Math.random() * 0.5,
          }}
        />
      ))}

      {/* Road surface with perspective */}
      <div
        className="absolute left-[5%] right-[5%] bottom-0"
        style={{
          height: '82%',
          background: `linear-gradient(to bottom, #1a1a2e 0%, #252540 50%, #2a2a45 100%)`,
          transform: 'perspective(800px) rotateX(5deg)',
          transformOrigin: 'center bottom',
        }}
      >
        {/* Lane dividers with glow */}
        {Array.from({ length: pathCount + 1 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0"
            style={{
              left: `${(i / pathCount) * 100}%`,
              width: '2px',
              background: 'linear-gradient(to bottom, transparent 0%, #ffa50240 30%, #ffa50280 100%)',
              boxShadow: '0 0 4px #ffa50240',
            }}
          />
        ))}

        {/* Lane color strips (bottom glow) */}
        {Array.from({ length: pathCount }).map((_, i) => (
          <div
            key={`lane-strip-${i}`}
            className="absolute bottom-0"
            style={{
              left: `${(i / pathCount) * 100 + 0.5}%`,
              width: `${100 / pathCount - 1}%`,
              height: '6px',
              background: `linear-gradient(to top, ${LANE_COLORS[i % LANE_COLORS.length]}80, transparent)`,
            }}
          />
        ))}

        {/* Road marks (dashes) */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`mark-${i}`}
            className="absolute left-1/2 -translate-x-1/2 w-1 h-4 rounded-full"
            style={{
              bottom: `${i * 6 + 2}%`,
              background: `linear-gradient(to top, #ffa50250, #ffa50220)`,
            }}
          />
        ))}

        {/* Side barriers with glow */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-r"
          style={{
            background: 'linear-gradient(to bottom, transparent, #ffa50260, #ffa50280)',
            boxShadow: '2px 0 8px #ffa50240',
          }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-1.5 rounded-l"
          style={{
            background: 'linear-gradient(to bottom, transparent, #ffa50260, #ffa50280)',
            boxShadow: '-2px 0 8px #ffa50240',
          }}
        />

        {/* Vanishing point glow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-20 h-20 rounded-full"
          style={{
            top: '5%',
            background: 'radial-gradient(circle, #ffa50230 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
}

// ─── HUD ───────────────────────────────────────────────
function HUD() {
  const score = useGameStore((s) => s.score);
  const feedback = useGameStore((s) => s.feedback);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* Top bar */}
      <div className="flex justify-end items-start p-4">
        {/* Score */}
        <div className="bg-black/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
          <motion.span
            key={score}
            className="text-white font-bold text-xl tabular-nums"
            initial={{ scale: 1.5, color: '#ffa502' }}
            animate={{ scale: 1, color: '#ffffff' }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
          >
            {score}
          </motion.span>
        </div>
      </div>

      {/* Feedback overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`text-3xl font-black px-10 py-5 rounded-2xl backdrop-blur-sm ${
                feedback === 'correct'
                  ? 'bg-green-500/80 text-white shadow-2xl shadow-green-500/30 border border-green-400/30'
                  : 'bg-red-500/80 text-white shadow-2xl shadow-red-500/30 border border-red-400/30'
              }`}
              initial={{ scale: 0.3, opacity: 0, y: 20 }}
              animate={{ scale: [0.3, 1.15, 1], opacity: 1, y: 0 }}
              exit={{ scale: 1.3, opacity: 0, y: -20 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
            >
              {feedback === 'correct' ? '✓ Верно!' : '✗ Ошибка!'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Lane Buttons ──────────────────────────────────────
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
      <div
        className="grid gap-2.5 max-w-lg mx-auto"
        style={{ gridTemplateColumns: `repeat(${pathCount}, 1fr)` }}
      >
        {Array.from({ length: pathCount }).map((_, i) => (
          <motion.button
            key={i}
            onClick={() => handleLane(i)}
            disabled={!isRunning || feedback !== null}
            className="h-14 rounded-xl font-bold text-xl text-white relative overflow-hidden disabled:opacity-40"
            style={{
              background: `linear-gradient(135deg, ${LANE_COLORS[i % LANE_COLORS.length]}, ${LANE_COLORS[i % LANE_COLORS.length]}cc)`,
              boxShadow: `0 4px 15px ${LANE_GLOW[i % LANE_GLOW.length]}, inset 0 1px 0 rgba(255,255,255,0.2)`,
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-xl" />
            <span className="relative drop-shadow-md">{i + 1}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── VFX Particles (enhanced) ──────────────────────────
function VFXParticles({ type }: { type: 'correct' | 'wrong' }) {
  const isCorrect = type === 'correct';
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        x: 30 + Math.random() * 40,
        delay: Math.random() * 0.3,
        duration: 0.6 + Math.random() * 0.6,
        size: 3 + Math.random() * 8,
        angle: -30 + Math.random() * 60,
        color: isCorrect
          ? ['#2ed573', '#7bed9f', '#a3e635'][i % 3]
          : ['#ff4757', '#ff6b81', '#ff9f43'][i % 3],
      })),
    [isCorrect]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 25 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: '35%',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          animate={{
            opacity: 0,
            y: -150 - Math.random() * 100,
            x: p.angle * 2,
            scale: 0,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────
export default function DoorRunnerScene() {
  const settings = useGameStore((s) => s.settings);
  const sequence = useGameStore((s) => s.sequence);
  const currentStep = useGameStore((s) => s.currentStep);
  const feedback = useGameStore((s) => s.feedback);
  const isRunning = useGameStore((s) => s.isRunning);
  const chooseLane = useGameStore((s) => s.chooseLane);
  const pathCount = settings.pathCount;
  const correctLane = sequence[currentStep] ?? 0;

  // Show 4 door rows
  const doorRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < 4; i++) {
      const stepIdx = currentStep + i;
      rows.push({
        doorIndex: i,
        correctLane: sequence[stepIdx] ?? 0,
        isCurrent: i === 0,
      });
    }
    return rows;
  }, [currentStep, sequence]);

  const handleChoose = useCallback(
    (lane: number) => {
      if (!isRunning || feedback !== null) return;
      chooseLane(lane);
    },
    [isRunning, feedback, chooseLane]
  );

  return (
    <div className="relative w-full h-full select-none">
      {/* Road background */}
      <RoadVisual pathCount={pathCount} />

      {/* Door rows */}
      {doorRows.map((row) => (
        <DoorRow
          key={`row-${currentStep}-${row.doorIndex}`}
          doorIndex={row.doorIndex}
          pathCount={pathCount}
          correctLane={row.correctLane}
          isCurrent={row.isCurrent}
          feedback={row.isCurrent ? feedback : null}
          onChoose={handleChoose}
        />
      ))}

      {/* Runner */}
      {isRunning && (
        <Runner
          pathCount={pathCount}
          currentLane={correctLane}
          feedback={feedback}
        />
      )}

      {/* VFX */}
      <AnimatePresence>
        {feedback === 'correct' && <VFXParticles type="correct" key="vfx-correct" />}
        {feedback === 'wrong' && <VFXParticles type="wrong" key="vfx-wrong" />}
      </AnimatePresence>

      {/* HUD */}
      <HUD />

      {/* Lane buttons */}
      <LaneButtons />
    </div>
  );
}
