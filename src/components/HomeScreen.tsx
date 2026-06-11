import { useState, useEffect } from 'react';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { Play, Zap, Gauge, Trophy, Calendar, Award, Target, Clock, Download, Volume2, VolumeX } from 'lucide-react';
import { useGameStore, type SpeedLevel } from '../store/gameStore';
import { ACHIEVEMENTS } from '../lib/achievements';
import { getDailyId, secondsUntilNextDaily, formatCountdown, getDailyDayName } from '../lib/daily';
import { usePWAInstall } from '../lib/usePWAInstall';
import { initAudioOnInteraction } from '../lib/sounds';
import { LANE_COLORS } from '../lib/constants';
import AchievementsPanel from './AchievementsPanel';

// ─── Constants ──────────────────────────────────────────
const PATH_OPTIONS = [3, 4, 5, 6] as const;

const SPEED_OPTIONS: { value: SpeedLevel; label: string; icon: typeof Zap }[] = [
  { value: 'slow', label: 'Slow', icon: Gauge },
  { value: 'normal', label: 'Normal', icon: Zap },
  { value: 'fast', label: 'Fast', icon: Zap },
];

// ─── Animation Variants ────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const playButtonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20, delay: 0.3 },
  },
};

// ─── Decorative floating shapes ───
function FloatingDecor() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#FF6B35]/10 blur-2xl" />
      <div className="absolute top-1/3 -left-16 w-48 h-48 rounded-full bg-[#06D6A0]/10 blur-2xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-[#FFD23F]/15 blur-xl" />
      <motion.div
        className="absolute top-[8%] right-[12%] text-3xl"
        animate={{ y: [0, -12, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        🚪
      </motion.div>
      <motion.div
        className="absolute top-[18%] left-[8%] text-2xl"
        animate={{ y: [0, -10, 0], rotate: [0, -15, 15, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        🏃
      </motion.div>
      <motion.div
        className="absolute bottom-[25%] right-[15%] text-2xl"
        animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        🪙
      </motion.div>
    </div>
  );
}

// ─── Daily Countdown ───
function DailyCountdown() {
  const [countdown, setCountdown] = useState(secondsUntilNextDaily());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(secondsUntilNextDaily());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-white/70 text-xs font-mono">{formatCountdown(countdown)}</span>
  );
}

// ─── Component ──────────────────────────────────────────
export default function HomeScreen() {
  const { settings, setPathCount, setSpeed, setSoundEnabled, startGame, bestScores, seasonId,
    gameMode, setGameMode, setScreen, unlockedAchievements, stats } =
    useGameStore();

  const [showAchievements, setShowAchievements] = useState(false);
  const { isInstallable, install } = usePWAInstall();

  // Initialize audio on first user interaction
  useEffect(() => {
    initAudioOnInteraction();
  }, []);

  const bestScoreKey = `${seasonId}_p${settings.pathCount}`;
  const currentBest = bestScores[bestScoreKey] ?? 0;

  const dailyId = getDailyId();
  const dailyBest = bestScores[`${dailyId}_p${settings.pathCount}`] ?? 0;
  const dayName = getDailyDayName();

  const seasonDisplay = (() => {
    const match = seasonId.match(/^(\d{4})-(\d{2})$/);
    if (match) return `Week ${parseInt(match[2], 10)} · ${match[1]}`;
    return seasonId;
  })();

  const handlePlay = () => {
    // Update stats and check achievements
    const store = useGameStore.getState();
    if (store.score > 0) {
      store.addStatsFromGame(store.score, store.combo, gameMode);
    }
    startGame();
  };

  return (
    <motion.div
      className="relative flex min-h-dvh flex-col items-center justify-center px-5 py-6 selection:bg-orange-200"
      style={{ background: 'linear-gradient(160deg, #FF8C42 0%, #FFC857 35%, #FFE4A0 70%, #FFF8E1 100%)' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <FloatingDecor />

      {/* ── Title ─────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="mb-5 text-center relative z-10">
        <h1
          className="text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl"
          style={{
            textShadow: '0 3px 0 #E55A25, 0 6px 0 #CC4A15, 0 8px 12px rgba(0,0,0,0.2)',
          }}
        >
          Door Runner
        </h1>
        <h2
          className="mt-1 text-3xl font-black tracking-wide text-white sm:text-4xl"
          style={{
            textShadow: '0 2px 0 #CC8400, 0 4px 8px rgba(0,0,0,0.15)',
          }}
        >
          Memory
        </h2>
        <p className="mt-2 text-sm font-medium text-[#7B4A2A]/70">
          Remember the path. Trust your memory. 🧠
        </p>
      </motion.div>

      {/* ── Quick Stats Bar ──────────────────────────── */}
      <motion.div variants={itemVariants}
        className="mb-4 flex w-full max-w-xs items-center justify-between gap-2 relative z-10"
      >
        <button
          onClick={() => setShowAchievements(true)}
          className="flex items-center gap-1.5 rounded-2xl bg-white/50 px-3 py-2 shadow-sm backdrop-blur-sm border border-white/30 active:scale-95 transition-all"
        >
          <Award className="h-4 w-4 text-[#FF6B35]" />
          <span className="text-xs font-bold text-[#5C3D2E]">{unlockedAchievements.length}/{ACHIEVEMENTS.length}</span>
        </button>

        <button
          onClick={() => setScreen('leaderboard')}
          className="flex items-center gap-1.5 rounded-2xl bg-white/50 px-3 py-2 shadow-sm backdrop-blur-sm border border-white/30 active:scale-95 transition-all"
        >
          <Trophy className="h-4 w-4 text-[#FFD23F]" />
          <span className="text-xs font-bold text-[#5C3D2E]">{stats.bestScore}</span>
        </button>

        <div className="flex items-center gap-1.5 rounded-2xl bg-white/50 px-3 py-2 shadow-sm backdrop-blur-sm border border-white/30">
          <Calendar className="h-4 w-4 text-[#FF6B35]" />
          <span className="text-xs font-medium text-[#7B4A2A]/70 truncate">{seasonDisplay}</span>
        </div>

        {isInstallable && (
          <motion.button
            onClick={install}
            className="flex items-center gap-1.5 rounded-2xl bg-[#06D6A0]/80 px-3 py-2 shadow-sm backdrop-blur-sm border border-[#06D6A0]/40 active:scale-95 transition-all"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Download className="h-4 w-4 text-white" />
            <span className="text-xs font-bold text-white">Install</span>
          </motion.button>
        )}

        <button
          onClick={() => setSoundEnabled(!settings.soundEnabled)}
          className="flex items-center justify-center rounded-2xl bg-white/50 px-2.5 py-2 shadow-sm backdrop-blur-sm border border-white/30 active:scale-95 transition-all"
          aria-label={settings.soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          {settings.soundEnabled
            ? <Volume2 className="h-4 w-4 text-[#5C3D2E]" />
            : <VolumeX className="h-4 w-4 text-[#5C3D2E]/40" />
          }
        </button>
      </motion.div>

      {/* ── Game Mode Selector ───────────────────────── */}
      <motion.section variants={itemVariants} className="mb-4 w-full max-w-xs relative z-10">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setGameMode('regular')}
            className={`flex items-center justify-center gap-2 h-11 rounded-2xl text-sm font-bold transition-all ${
              gameMode === 'regular'
                ? 'bg-[#06D6A0] text-white shadow-lg shadow-[#06D6A0]/40'
                : 'bg-white/60 text-[#5C3D2E]/60 hover:bg-white/80'
            }`}
          >
            <Play className="h-4 w-4" />
            Regular
          </button>
          <button
            onClick={() => setGameMode('daily')}
            className={`flex items-center justify-center gap-2 h-11 rounded-2xl text-sm font-bold transition-all ${
              gameMode === 'daily'
                ? 'bg-[#8338EC] text-white shadow-lg shadow-[#8338EC]/40'
                : 'bg-white/60 text-[#5C3D2E]/60 hover:bg-white/80'
            }`}
          >
            <Target className="h-4 w-4" />
            Daily
          </button>
        </div>
      </motion.section>

      {/* ── Daily Info ──────────────────────────────── */}
      <AnimatePresence>
        {gameMode === 'daily' && (
          <motion.section
            variants={itemVariants}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 w-full max-w-xs relative z-10 overflow-hidden"
          >
            <div className="rounded-2xl bg-[#8338EC]/20 px-4 py-3 border border-[#8338EC]/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-[#5C3D2E]">📅 {dayName} Challenge</span>
                <div className="flex items-center gap-1 text-xs text-[#5C3D2E]/60">
                  <Clock className="h-3 w-3" />
                  <DailyCountdown />
                </div>
              </div>
              <p className="text-xs text-[#5C3D2E]/60">
                Same sequence for everyone today! Best: {dailyBest > 0 ? dailyBest : '—'}
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Lane Count Selector ───────────────────────── */}
      <motion.section variants={itemVariants} className="mb-4 w-full max-w-xs relative z-10">
        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-[#7B4A2A]/80">
          <Gauge className="h-4 w-4" />
          Lanes
        </label>
        <div className="grid grid-cols-4 gap-2">
          {PATH_OPTIONS.map((n, idx) => {
            const isActive = settings.pathCount === n;
            const color = LANE_COLORS[idx % LANE_COLORS.length];
            return (
              <button
                key={n}
                type="button"
                onClick={() => setPathCount(n)}
                className={`
                  flex h-11 items-center justify-center rounded-2xl text-lg font-black
                  transition-all duration-150 active:scale-90
                  ${isActive ? 'text-white shadow-lg scale-105' : 'bg-white/60 text-[#5C3D2E]/60 shadow-sm hover:bg-white/80'}
                `}
                style={isActive ? {
                  background: `linear-gradient(180deg, ${LANE_COLORS[idx]}dd, ${color})`,
                  boxShadow: `0 4px 12px ${color}60`,
                } : undefined}
                aria-pressed={isActive}
                aria-label={`${n} lanes`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* ── Speed Selector ────────────────────────────── */}
      <motion.section variants={itemVariants} className="mb-5 w-full max-w-xs relative z-10">
        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-[#7B4A2A]/80">
          <Zap className="h-4 w-4" />
          Speed
        </label>
        <div className="grid grid-cols-3 gap-2">
          {SPEED_OPTIONS.map(({ value, label, icon: Icon }) => {
            const isActive = settings.speed === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setSpeed(value)}
                className={`
                  flex h-11 items-center justify-center gap-1.5 rounded-2xl text-sm font-bold
                  transition-all duration-150 active:scale-90
                  ${isActive
                    ? 'bg-[#EF476F] text-white shadow-lg shadow-[#EF476F]/40'
                    : 'bg-white/60 text-[#5C3D2E]/60 shadow-sm hover:bg-white/80'}
                `}
                aria-pressed={isActive}
                aria-label={`${label} speed`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* ── Best Score ──────────────────────────────── */}
      <motion.section
        variants={itemVariants}
        className="mb-5 flex w-full max-w-xs items-center justify-between gap-4 rounded-2xl bg-white/50 px-5 py-3 shadow-md backdrop-blur-sm relative z-10 border border-white/30"
      >
        <span className="text-sm font-bold text-[#5C3D2E]">
          {gameMode === 'daily' ? 'Daily' : 'Season'} Best
        </span>
        <div className="flex items-center gap-2 text-sm font-bold text-[#5C3D2E]">
          <Trophy className="h-4 w-4 text-[#FFD23F]" />
          <span>{currentBest > 0 ? currentBest : '—'}</span>
        </div>
      </motion.section>

      {/* ── Play Button ───────────────────────────────── */}
      <motion.div variants={playButtonVariants} className="relative z-10">
        <button
          type="button"
          onClick={handlePlay}
          className="group relative flex h-16 w-56 items-center justify-center gap-3 rounded-3xl text-xl font-black text-white shadow-xl transition-all duration-150 hover:shadow-2xl active:scale-90 overflow-hidden"
          style={{
            background: gameMode === 'daily'
              ? 'linear-gradient(180deg, #8338EC 0%, #6B21E8 100%)'
              : 'linear-gradient(180deg, #FF6B35 0%, #E55A25 100%)',
            boxShadow: gameMode === 'daily'
              ? '0 6px 0 #5B21B6, 0 8px 20px rgba(131,56,236,0.4)'
              : '0 6px 0 #CC4A15, 0 8px 20px rgba(229,90,37,0.4)',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
          aria-label="Start game"
        >
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-3xl" />
          {gameMode === 'daily' ? <Target className="h-6 w-6 relative" /> : <Play className="h-6 w-6 relative" fill="currentColor" />}
          <span className="relative">{gameMode === 'daily' ? 'DAILY!' : 'PLAY!'}</span>
        </button>
      </motion.div>

      {/* ── Achievements Panel ──────────────────────────── */}
      <AnimatePresence>
        {showAchievements && <AchievementsPanel onClose={() => setShowAchievements(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}
