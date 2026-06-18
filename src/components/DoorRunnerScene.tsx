import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, getProgressiveSpeedMs } from '../store/gameStore';
import { getLanePercent } from '../lib/constants';
import { t } from '../lib/i18n';
import { prefersReducedMotion } from '../lib/a11y';
import { getExpectedPath } from '../lib/season';
import { getTheme, type GameTheme } from '../lib/themes';
import { SpeedLines, ParticleBurst, CoinEffect, ScreenFlash } from './game/VFX';
import { HUD } from './game/HUD';
import { LaneButtons } from './game/LaneButtons';
import { AchievementToast } from './game/AchievementToast';
import { TimerBar, SpeedIndicator } from './game/Timer';
import { DoorRow } from './game/Doors';
import { RoadVisual } from './game/SceneBackground';
import { Runner3DScene } from './game/Runner3DScene';
import { SwipeHint } from './game/SwipeHint';
import { useDoorRunnerInput } from './game/useDoorRunnerInput';

// ─── Combo Badge ──────────────────────────────────────
function ComboBadge({ combo, lang, theme }: { combo: number; lang: string; theme: GameTheme }) {
  if (combo < 3) return null;
  const labelKey = combo >= 10 ? 'combo.insane' : combo >= 7 ? 'combo.super' : combo >= 5 ? 'combo.great' : 'combo.nice';
  const color = combo >= 10 ? theme.timerDanger : combo >= 7 ? '#8338EC' : combo >= 5 ? theme.accent : theme.accent2;
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

  // ─── Get active theme ───
  const theme = getTheme(settings.theme);

  // ─── Timer speed calculations (TimerBar now manages its own rAF) ───
  const currentSpeedMs = getProgressiveSpeedMs(settings.speed, currentStep, settings.customTimerSec);
  const baseSpeedMs = getProgressiveSpeedMs(settings.speed, 0, settings.customTimerSec);

  const coinLane = feedback === 'correct' ? correctLane : null;

  const { handleChoose, handleTouchStart, handleTouchMove, handleTouchEnd } = useDoorRunnerInput({
    isRunning,
    feedback,
    pathCount,
    correctLane,
    currentStep,
    chooseLane,
  });

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
      data-testid="game-root"
      data-correct-lane={correctLane + 1}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      animate={feedback === 'wrong' && !prefersReducedMotion() ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <RoadVisual pathCount={pathCount} theme={theme} />
      <Runner3DScene pathCount={pathCount} currentLane={correctLane} feedback={feedback} theme={theme} />
      {isRunning && <SpeedLines theme={theme} />}

      {/* Screen flash on feedback */}
      <AnimatePresence>
        {feedback === 'correct' && <ScreenFlash key="flash-correct" color={theme.flashCorrect} />}
        {feedback === 'wrong' && <ScreenFlash key="flash-wrong" color={theme.flashWrong} />}
      </AnimatePresence>

      {/* Timer bar — self-contained, no re-renders on each frame */}
      {isRunning && <TimerBar currentStep={currentStep} speedMs={currentSpeedMs} isRunning={isRunning} feedback={feedback} onTimeout={handleTimeout} theme={theme} />}

      {/* Speed indicator */}
      {isRunning && <SpeedIndicator currentMs={currentSpeedMs} baseMs={baseSpeedMs} theme={theme} />}

      {doorRows.map((row) => (
        <DoorRow key={`row-${row.doorIndex}`}
          doorIndex={row.doorIndex} pathCount={pathCount} correctLane={row.correctLane}
          isCurrent={row.isCurrent} feedback={row.isCurrent ? feedback : null} onChoose={handleChoose} theme={theme} />
      ))}

      <AnimatePresence>
        {feedback === 'correct' && <ParticleBurst type="correct" key="vfx-correct" theme={theme} />}
        {feedback === 'wrong' && <ParticleBurst type="wrong" key="vfx-wrong" theme={theme} />}
      </AnimatePresence>

      <AnimatePresence>
        {coinLane !== null && (
          <CoinEffect key={`coin-${score}`} laneX={getLanePercent(coinLane, pathCount)} theme={theme} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        <ComboBadge combo={combo} lang={lang} key={`combo-${combo}`} theme={theme} />
      </AnimatePresence>

      <HUD combo={combo} lang={lang} theme={theme} />

      {/* Achievement toast */}
      <AnimatePresence>
        <AchievementToast />
      </AnimatePresence>

      {/* Swipe hint */}
      <SwipeHint pathCount={pathCount} theme={theme} />

      <LaneButtons theme={theme} />
    </motion.div>
  );
}
