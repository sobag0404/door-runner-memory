import { useState, useEffect } from 'react';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { Play, Zap, Gauge, Trophy, Calendar, Award, Target, Clock, Download, Volume2, VolumeX, HelpCircle, Palette, Globe, Music, SlidersHorizontal, Timer } from 'lucide-react';
import { useGameStore, type SpeedLevel } from '../store/gameStore';
import { ACHIEVEMENTS } from '../lib/achievements';
import { getDailyId, secondsUntilNextDaily, formatCountdown, getDailyDayName } from '../lib/daily';
import { usePWAInstall } from '../lib/usePWAInstall';
import { initAudioOnInteraction } from '../lib/sounds';
import { LANE_COLORS } from '../lib/constants';
import { localStore } from '../lib/localStore';
import { t, type Lang } from '../lib/i18n';
import { THEMES, type ThemeId } from '../lib/themes';
import { type SoundPack } from '../lib/sounds';
import AchievementsPanel from './AchievementsPanel';
import TutorialOverlay from './TutorialOverlay';
import BackgroundParticles from './BackgroundParticles';

// ─── Constants ──────────────────────────────────────────
const PATH_OPTIONS = [3, 4, 5, 6] as const;

const SPEED_OPTIONS: { value: SpeedLevel; labelKey: string; icon: typeof Zap }[] = [
  { value: 'slow', labelKey: 'home.slow', icon: Gauge },
  { value: 'normal', labelKey: 'home.normal', icon: Zap },
  { value: 'fast', labelKey: 'home.fast', icon: Zap },
  { value: 'custom', labelKey: 'home.custom', icon: SlidersHorizontal },
];

const THEME_OPTIONS: { value: ThemeId; labelKey: string; emoji: string }[] = [
  { value: 'classic', labelKey: 'theme.classic', emoji: '🟠' },
  { value: 'neon', labelKey: 'theme.neon', emoji: '💜' },
  { value: 'retro', labelKey: 'theme.retro', emoji: '🟢' },
];

const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: 'ru', label: 'RU' },
  { value: 'en', label: 'EN' },
];

const SOUND_PACK_OPTIONS: { value: SoundPack; labelKey: string; emoji: string }[] = [
  { value: 'classic', labelKey: 'sound.classic', emoji: '🔔' },
  { value: '8bit', labelKey: 'sound.8bit', emoji: '👾' },
  { value: 'soft', labelKey: 'sound.soft', emoji: '🎵' },
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
  const { settings, setPathCount, setSpeed, setSoundEnabled, setLang, setTheme, setSoundPack, setCustomTimerSec, startGame, bestScores, seasonId,
    gameMode, setGameMode, setScreen, unlockedAchievements, stats } =
    useGameStore();

  const [showAchievements, setShowAchievements] = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => !localStore.get<boolean>('tutorialSeen', false));
  const [showSettings, setShowSettings] = useState(false);
  const { isInstallable, install } = usePWAInstall();

  const lang = settings.lang;
  const themeId = settings.theme;
  const theme = THEMES[themeId];

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

  // Determine if the theme is dark (neon/retro have dark backgrounds)
  const isDarkTheme = themeId === 'neon' || themeId === 'retro';
  const textOnBg = isDarkTheme ? 'text-white/90' : 'text-[#5C3D2E]';
  const textOnBgSub = isDarkTheme ? 'text-white/60' : 'text-[#7B4A2A]/70';
  const bgButton = isDarkTheme ? 'bg-white/10 border-white/15' : 'bg-white/50 border-white/30';
  const bgButtonActive = isDarkTheme ? 'bg-white/20' : 'bg-white/60';

  return (
    <motion.div
      className="relative flex min-h-dvh flex-col items-center justify-center px-5 py-6 selection:bg-orange-200"
      style={{ background: theme.homeBg }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <BackgroundParticles theme={theme} />
      <FloatingDecor />

      {/* ── Title ─────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="mb-5 text-center relative z-10">
        <h1
          className="text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl"
          style={{ textShadow: theme.titleShadow }}
        >
          Door Runner
        </h1>
        <h2
          className="mt-1 text-3xl font-black tracking-wide text-white sm:text-4xl"
          style={{ textShadow: theme.subtitleShadow }}
        >
          Memory
        </h2>
        <p className={`mt-2 text-sm font-medium ${textOnBgSub}`}>
          {t('home.subtitle', lang)}
        </p>
      </motion.div>

      {/* ── Quick Stats Bar ──────────────────────────── */}
      <motion.div variants={itemVariants}
        className="mb-3 flex w-full max-w-xs items-center justify-between gap-2 relative z-10"
      >
        <button
          onClick={() => setShowAchievements(true)}
          className={`flex items-center gap-1.5 rounded-2xl ${bgButton} px-3 py-2 shadow-sm backdrop-blur-sm border active:scale-95 transition-all`}
        >
          <Award className="h-4 w-4" style={{ color: theme.accent }} />
          <span className={`text-xs font-bold ${textOnBg}`}>{unlockedAchievements.length}/{ACHIEVEMENTS.length}</span>
        </button>

        <button
          onClick={() => setScreen('leaderboard')}
          className={`flex items-center gap-1.5 rounded-2xl ${bgButton} px-3 py-2 shadow-sm backdrop-blur-sm border active:scale-95 transition-all`}
        >
          <Trophy className="h-4 w-4" style={{ color: theme.accent2 }} />
          <span className={`text-xs font-bold ${textOnBg}`}>{stats.bestScore}</span>
        </button>

        <div className={`flex items-center gap-1.5 rounded-2xl ${bgButton} px-3 py-2 shadow-sm backdrop-blur-sm border`}>
          <Calendar className="h-4 w-4" style={{ color: theme.accent }} />
          <span className={`text-xs font-medium truncate ${textOnBgSub}`}>{seasonDisplay}</span>
        </div>

        <button
          onClick={() => setSoundEnabled(!settings.soundEnabled)}
          className={`flex items-center justify-center rounded-2xl ${bgButton} px-2.5 py-2 shadow-sm backdrop-blur-sm border active:scale-95 transition-all`}
          aria-label={settings.soundEnabled ? t('home.mute', lang) : t('home.unmute', lang)}
        >
          {settings.soundEnabled
            ? <Volume2 className={`h-4 w-4 ${textOnBg}`} />
            : <VolumeX className={`h-4 w-4 ${textOnBgSub}`} />
          }
        </button>
      </motion.div>

      {/* ── Settings Bar (theme, lang, help) ────────── */}
      <motion.div variants={itemVariants}
        className="mb-4 flex w-full max-w-xs items-center justify-center gap-2 relative z-10"
      >
        {isInstallable && (
          <motion.button
            onClick={install}
            className="flex items-center gap-1.5 rounded-2xl px-3 py-2 shadow-sm backdrop-blur-sm border active:scale-95 transition-all"
            style={{ background: `${theme.accent2}80`, borderColor: `${theme.accent2}40` }}
            whileTap={{ scale: 0.9 }}
          >
            <Download className="h-4 w-4 text-white" />
            <span className="text-xs font-bold text-white">{t('home.install', lang)}</span>
          </motion.button>
        )}

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`flex items-center gap-1.5 rounded-2xl ${bgButton} px-3 py-2 shadow-sm backdrop-blur-sm border active:scale-95 transition-all`}
          aria-label="Settings"
        >
          <Palette className={`h-4 w-4 ${textOnBg}`} />
          <span className={`text-xs font-bold ${textOnBg}`}>{showSettings ? '✕' : ''}</span>
        </button>

        <button
          onClick={() => setShowTutorial(true)}
          className={`flex items-center gap-1.5 rounded-2xl ${bgButton} px-3 py-2 shadow-sm backdrop-blur-sm border active:scale-95 transition-all`}
          aria-label={t('home.howToPlay', lang)}
        >
          <HelpCircle className={`h-4 w-4 ${textOnBg}`} />
        </button>
      </motion.div>

      {/* ── Settings Panel (Theme + Lang) ────────────────── */}
      <AnimatePresence>
        {showSettings && (
          <motion.section
            className="mb-4 w-full max-w-xs relative z-10 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`rounded-2xl ${bgButton} backdrop-blur-sm p-4 space-y-3`}>
              {/* Theme selector */}
              <div>
                <label className={`mb-1.5 flex items-center gap-1.5 text-sm font-bold ${textOnBg}`}>
                  <Palette className="h-4 w-4" />
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {THEME_OPTIONS.map(({ value, labelKey, emoji }) => {
                    const isActive = settings.theme === value;
                    return (
                      <button
                        key={value}
                        onClick={() => setTheme(value)}
                        className={`flex items-center justify-center gap-1.5 h-10 rounded-2xl text-sm font-bold transition-all active:scale-90 ${
                          isActive
                            ? 'text-white shadow-lg scale-105'
                            : `${bgButtonActive} ${textOnBgSub} hover:bg-white/30`
                        }`}
                        style={isActive ? {
                          background: THEMES[value].accent,
                          boxShadow: `0 4px 12px ${THEMES[value].accent}60`,
                        } : undefined}
                      >
                        <span>{emoji}</span>
                        <span className="text-xs">{t(labelKey, lang)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Language selector */}
              <div>
                <label className={`mb-1.5 flex items-center gap-1.5 text-sm font-bold ${textOnBg}`}>
                  <Globe className="h-4 w-4" />
                  Language
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LANG_OPTIONS.map(({ value, label }) => {
                    const isActive = settings.lang === value;
                    return (
                      <button
                        key={value}
                        onClick={() => setLang(value)}
                        className={`flex items-center justify-center h-10 rounded-2xl text-sm font-bold transition-all active:scale-90 ${
                          isActive
                            ? 'text-white shadow-lg scale-105'
                            : `${bgButtonActive} ${textOnBgSub} hover:bg-white/30`
                        }`}
                        style={isActive ? {
                          background: theme.accent,
                          boxShadow: `0 4px 12px ${theme.accent}60`,
                        } : undefined}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sound pack selector */}
              <div>
                <label className={`mb-1.5 flex items-center gap-1.5 text-sm font-bold ${textOnBg}`}>
                  <Music className="h-4 w-4" />
                  {t('sound.pack', lang)}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SOUND_PACK_OPTIONS.map(({ value, labelKey, emoji }) => {
                    const isActive = settings.soundPack === value;
                    return (
                      <button
                        key={value}
                        onClick={() => setSoundPack(value)}
                        className={`flex items-center justify-center gap-1 h-10 rounded-2xl text-sm font-bold transition-all active:scale-90 ${
                          isActive
                            ? 'text-white shadow-lg scale-105'
                            : `${bgButtonActive} ${textOnBgSub} hover:bg-white/30`
                        }`}
                        style={isActive ? {
                          background: theme.accent2,
                          boxShadow: `0 4px 12px ${theme.accent2}60`,
                        } : undefined}
                      >
                        <span>{emoji}</span>
                        <span className="text-xs">{t(labelKey, lang)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Game Mode Selector ───────────────────────── */}
      <motion.section variants={itemVariants} className="mb-4 w-full max-w-xs relative z-10">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setGameMode('regular')}
            className={`flex items-center justify-center gap-2 h-11 rounded-2xl text-sm font-bold transition-all ${
              gameMode === 'regular'
                ? 'text-white shadow-lg'
                : `${bgButtonActive} ${textOnBgSub} hover:bg-white/30`
            }`}
            style={gameMode === 'regular' ? {
              background: theme.accent2,
              boxShadow: `0 4px 12px ${theme.accent2}40`,
            } : undefined}
          >
            <Play className="h-4 w-4" />
            {t('home.regular', lang)}
          </button>
          <button
            onClick={() => setGameMode('daily')}
            className={`flex items-center justify-center gap-2 h-11 rounded-2xl text-sm font-bold transition-all ${
              gameMode === 'daily'
                ? 'text-white shadow-lg'
                : `${bgButtonActive} ${textOnBgSub} hover:bg-white/30`
            }`}
            style={gameMode === 'daily' ? {
              background: '#8338EC',
              boxShadow: '0 4px 12px rgba(131,56,236,0.4)',
            } : undefined}
          >
            <Target className="h-4 w-4" />
            {t('home.dailyMode', lang)}
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
                <span className={`text-sm font-bold ${textOnBg}`}>📅 {dayName} {t('daily.challenge', lang)}</span>
                <div className={`flex items-center gap-1 text-xs ${textOnBgSub}`}>
                  <Clock className="h-3 w-3" />
                  <DailyCountdown />
                </div>
              </div>
              <p className={`text-xs ${textOnBgSub}`}>
                {t('daily.sameSequence', lang)}{dailyBest > 0 ? dailyBest : t('daily.noBest', lang)}
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Lane Count Selector ───────────────────────── */}
      <motion.section variants={itemVariants} className="mb-4 w-full max-w-xs relative z-10">
        <label className={`mb-1.5 flex items-center gap-1.5 text-sm font-bold ${textOnBg}`}>
          <Gauge className="h-4 w-4" />
          {t('home.lanes', lang)}
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
                  ${isActive ? 'text-white shadow-lg scale-105' : `${bgButtonActive} ${textOnBgSub} shadow-sm hover:bg-white/30`}
                `}
                style={isActive ? {
                  background: `linear-gradient(180deg, ${LANE_COLORS[idx]}dd, ${color})`,
                  boxShadow: `0 4px 12px ${color}60`,
                } : undefined}
                aria-pressed={isActive}
                aria-label={`${n} ${t('home.lanes', lang)}`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* ── Speed Selector ────────────────────────────── */}
      <motion.section variants={itemVariants} className="mb-2 w-full max-w-xs relative z-10">
        <label className={`mb-1.5 flex items-center gap-1.5 text-sm font-bold ${textOnBg}`}>
          <Zap className="h-4 w-4" />
          {t('home.speed', lang)}
        </label>
        <div className="grid grid-cols-4 gap-2">
          {SPEED_OPTIONS.map(({ value, labelKey, icon: Icon }) => {
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
                    ? 'text-white shadow-lg'
                    : `${bgButtonActive} ${textOnBgSub} shadow-sm hover:bg-white/30`}
                `}
                style={isActive ? {
                  background: '#EF476F',
                  boxShadow: '0 4px 12px rgba(239,71,111,0.4)',
                } : undefined}
                aria-pressed={isActive}
                aria-label={t(labelKey, lang)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{t(labelKey, lang)}</span>
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* ── Custom Timer Slider ────────────────────────────── */}
      <AnimatePresence>
        {settings.speed === 'custom' && (
          <motion.section
            variants={itemVariants}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-5 w-full max-w-xs relative z-10 overflow-hidden"
          >
            <div className={`rounded-2xl ${bgButton} backdrop-blur-sm p-4 space-y-3`}>
              <div className="flex items-center justify-between">
                <label className={`flex items-center gap-1.5 text-sm font-bold ${textOnBg}`}>
                  <Timer className="h-4 w-4" />
                  {t('home.timer', lang)}
                </label>
                <span className="text-sm font-black text-[#EF476F]">{settings.customTimerSec}{t('home.sec', lang)}</span>
              </div>
              <input
                type="range"
                min={3}
                max={30}
                step={1}
                value={settings.customTimerSec}
                onChange={(e) => setCustomTimerSec(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #06D6A0 0%, #FFD23F 50%, #EF476F 100%)`,
                  accentColor: '#EF476F',
                }}
                aria-label={t('home.timer', lang)}
              />
              <div className={`flex justify-between text-xs ${textOnBgSub}`}>
                <span>3{t('home.sec', lang)}</span>
                <span>30{t('home.sec', lang)}</span>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Speed description ────────────────────────────── */}
      {settings.speed !== 'custom' && <div className="mb-5" />}

      {/* ── Best Score ──────────────────────────────── */}
      <motion.section
        variants={itemVariants}
        className={`mb-5 flex w-full max-w-xs items-center justify-between gap-4 rounded-2xl ${bgButton} px-5 py-3 shadow-md backdrop-blur-sm relative z-10 border`}
      >
        <span className={`text-sm font-bold ${textOnBg}`}>
          {gameMode === 'daily' ? t('home.dailyBest', lang) : t('home.seasonBest', lang)}
        </span>
        <div className={`flex items-center gap-2 text-sm font-bold ${textOnBg}`}>
          <Trophy className="h-4 w-4" style={{ color: theme.accent2 }} />
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
              : `linear-gradient(180deg, ${theme.accent} 0%, ${theme.accent}cc 100%)`,
            boxShadow: gameMode === 'daily'
              ? '0 6px 0 #5B21B6, 0 8px 20px rgba(131,56,236,0.4)'
              : `0 6px 0 ${theme.accent}99, 0 8px 20px ${theme.accent}66`,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
          aria-label={t('home.play', lang)}
        >
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-3xl" />
          {gameMode === 'daily' ? <Target className="h-6 w-6 relative" /> : <Play className="h-6 w-6 relative" fill="currentColor" />}
          <span className="relative">{gameMode === 'daily' ? t('home.daily', lang) : t('home.play', lang)}</span>
        </button>
      </motion.div>

      {/* ── Achievements Panel ──────────────────────────── */}
      <AnimatePresence>
        {showAchievements && <AchievementsPanel onClose={() => setShowAchievements(false)} />}
      </AnimatePresence>

      {/* ── Tutorial Overlay ──────────────────────────── */}
      <AnimatePresence>
        {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}
