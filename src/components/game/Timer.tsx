import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { GameTheme } from '../../lib/themes';

// ─── Timer Bar (countdown for each step) ──────────────
// Self-contained: uses rAF + direct DOM manipulation via ref.
// Does NOT trigger React re-renders on each animation frame.
export function TimerBar({ currentStep, speedMs, isRunning, feedback, onTimeout, theme }: {
  currentStep: number;
  speedMs: number;
  isRunning: boolean;
  feedback: 'correct' | 'wrong' | null;
  onTimeout: () => void;
  theme: GameTheme;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const stepStartRef = useRef<number>(0);
  const onTimeoutRef = useRef(onTimeout);
  useEffect(() => { onTimeoutRef.current = onTimeout; });

  // Theme colors for timer
  const okColor = theme.timerOk;
  const warnColor = theme.timerWarn;
  const dangerColor = theme.timerDanger;

  useEffect(() => {
    if (!isRunning || feedback !== null) {
      if (barRef.current) {
        barRef.current.style.width = '100%';
        barRef.current.style.background = `linear-gradient(90deg, ${okColor}, ${okColor}dd)`;
        barRef.current.style.boxShadow = `0 0 6px ${okColor}40`;
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
          barRef.current.style.background = `linear-gradient(90deg, ${okColor}, ${okColor}dd)`;
          barRef.current.style.boxShadow = `0 0 6px ${okColor}40`;
        } else if (remaining > 0.25) {
          barRef.current.style.background = `linear-gradient(90deg, ${warnColor}, ${warnColor}dd)`;
          barRef.current.style.boxShadow = `0 0 8px ${warnColor}60`;
        } else {
          barRef.current.style.background = `linear-gradient(90deg, ${dangerColor}, ${dangerColor}dd)`;
          barRef.current.style.boxShadow = `0 0 12px ${dangerColor}80`;
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
  }, [currentStep, isRunning, feedback, speedMs, okColor, warnColor, dangerColor]);

  return (
    <div className="absolute top-0 left-0 right-0 z-40 h-1.5 bg-black/30">
      <div
        ref={barRef}
        className="h-full rounded-full"
        style={{
          width: '100%',
          background: `linear-gradient(90deg, ${okColor}, ${okColor}dd)`,
          boxShadow: `0 0 6px ${okColor}40`,
          transition: 'width 0.05s linear, background 0.3s ease',
        }}
      />
    </div>
  );
}

// ─── Speed Indicator (shows current speed level) ──────
export function SpeedIndicator({ currentMs, baseMs, theme }: { currentMs: number; baseMs: number; theme: GameTheme }) {
  const ratio = baseMs / currentMs; // >1 means faster
  if (ratio < 1.05) return null;

  const label = ratio >= 2 ? '>>' : ratio >= 1.5 ? '>' : '~';
  return (
    <motion.div
      className="absolute top-14 right-3 z-40 pointer-events-none"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="bg-black/40 backdrop-blur-md rounded-xl px-2 py-1 border border-white/15"
        style={{ borderColor: `${theme.speedAccent}30` }}>
        <span className="text-xs font-bold" style={{ color: theme.speedAccent }}>{label}</span>
        <span className="text-[10px] text-white/50 ml-1">{Math.round(ratio * 100)}%</span>
      </div>
    </motion.div>
  );
}
