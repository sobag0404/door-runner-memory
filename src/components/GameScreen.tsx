import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { ArrowLeft, Trophy, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DoorRunnerScene from './DoorRunnerScene';
import { t } from '../lib/i18n';
import { trapFocus } from '../lib/a11y';

// ─── Web Share helper ───
async function shareScore(score: number, combo: number, mode: string): Promise<void> {
  const text = `🚪 Door Runner Memory\n${mode === 'daily' ? '📅 Daily' : '🎮 Regular'} mode\n🏆 Score: ${score}${combo >= 3 ? `\n🔥 Best combo: ${combo}` : ''}\n\nCan you beat me? 👇`;

  const shareData: ShareData = {
    title: 'Door Runner Memory',
    text,
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch {
      // User cancelled or not supported — fall back to clipboard
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Silently fail
  }
}

// ─── Name Input Modal ───
function NameModal({ onSubmit, onSkip, score, combo, gameMode }: {
  onSubmit: (name: string) => void;
  onSkip: () => void;
  score: number;
  combo: number;
  gameMode: string;
}) {
  const [name, setName] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const lang = useGameStore((s) => s.settings.lang);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Focus trap
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (modalRef.current) trapFocus(e.nativeEvent, modalRef.current);
    if (e.key === 'Escape') onSkip();
  };

  const handleShare = async () => {
    await shareScore(score, combo, gameMode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onSkip} />
      <motion.div
        ref={modalRef}
        className="relative w-full max-w-sm rounded-3xl p-6 shadow-2xl"
        style={{ background: 'linear-gradient(160deg, #2B1D0E 0%, #5C3D2E 40%, #8B6B4A 100%)' }}
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label={t('game.saveScore', lang)}
      >
        <h3 className="text-xl font-black text-white mb-1 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-[#FFD23F]" />
          {t('game.saveScore', lang)}
        </h3>

        {/* Score display */}
        <div className="flex items-center justify-center gap-4 my-4 py-3 rounded-2xl bg-black/20">
          <div className="text-center">
            <div className="text-3xl font-black text-[#FFD23F]">{score}</div>
            <div className="text-white/40 text-xs font-medium">{t('game.score', lang)}</div>
          </div>
          {combo >= 3 && (
            <>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-3xl font-black text-[#FF6B35]">{combo}</div>
                <div className="text-white/40 text-xs font-medium">{t('game.combo', lang)}</div>
              </div>
            </>
          )}
        </div>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="w-full h-11 rounded-2xl bg-[#06D6A0]/20 border border-[#06D6A0]/30 text-[#06D6A0] font-bold text-sm hover:bg-[#06D6A0]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-4"
        >
          <Share2 className="h-4 w-4" />
          {copied ? t('game.copied', lang) : t('game.share', lang)}
        </button>

        <p className="text-white/50 text-sm mb-3">{t('game.enterName', lang)}</p>
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 20))}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit(name)}
          placeholder={t('game.yourName', lang)}
          maxLength={20}
          className="w-full h-12 rounded-2xl bg-white/10 border border-white/15 px-4 text-white placeholder-white/30 text-sm font-medium outline-none focus:border-[#FFD23F]/50 focus:bg-white/15 transition-all mb-3"
        />
        <div className="flex gap-2">
          <button
            onClick={onSkip}
            className="flex-1 h-11 rounded-2xl bg-white/10 text-white/60 font-bold text-sm hover:bg-white/20 transition-all"
          >
            {t('game.skip', lang)}
          </button>
          <button
            onClick={() => onSubmit(name)}
            className="flex-1 h-11 rounded-2xl bg-[#FF6B35] text-white font-bold text-sm shadow-lg active:scale-95 transition-all"
          >
            {t('game.save', lang)}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GameScreen() {
  const resetGame = useGameStore((s) => s.resetGame);
  const score = useGameStore((s) => s.score);
  const submitToLeaderboard = useGameStore((s) => s.submitToLeaderboard);
  const addStatsFromGame = useGameStore((s) => s.addStatsFromGame);
  const checkAchievements = useGameStore((s) => s.checkAchievements);
  const gameMode = useGameStore((s) => s.gameMode);
  const combo = useGameStore((s) => s.combo);
  const lang = useGameStore((s) => s.settings.lang);

  const [showNameModal, setShowNameModal] = useState(false);
  const hasSubmittedRef = useRef(false);
  const [lastScore, setLastScore] = useState({ score: 0, combo: 0, gameMode: 'regular' as string });

  const handleBack = () => {
    if (score > 0 && !hasSubmittedRef.current) {
      // Save stats and check achievements
      addStatsFromGame(score, combo, gameMode);
      checkAchievements();
      // Capture score/combo before showing modal
      setLastScore({ score, combo, gameMode });
      // Show name modal for leaderboard
      setShowNameModal(true);
      hasSubmittedRef.current = true;
    } else {
      resetGame();
    }
  };

  const handleSubmitName = (name: string) => {
    submitToLeaderboard(name);
    setShowNameModal(false);
    resetGame();
  };

  const handleSkipName = () => {
    // Still submit as Anonymous
    submitToLeaderboard('Anonymous');
    setShowNameModal(false);
    resetGame();
  };

  // Reset submission flag when game starts (score goes to 0)
  const isGameStart = score === 0;
  useEffect(() => {
    hasSubmittedRef.current = false;
  }, [isGameStart]);

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-[#5C3D2E]">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="absolute top-3 left-3 z-50 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white/90 hover:text-white hover:bg-white/30 active:scale-90 transition-all shadow-md border border-white/15"
        style={{ marginTop: 'env(safe-area-inset-top)' }}
        aria-label={t('game.back', lang)}
      >
        <ArrowLeft size={20} />
      </button>

      {/* Game Scene */}
      <DoorRunnerScene />

      {/* Name Modal */}
      <AnimatePresence>
        {showNameModal && (
          <NameModal
            onSubmit={handleSubmitName}
            onSkip={handleSkipName}
            score={lastScore.score}
            combo={lastScore.combo}
            gameMode={lastScore.gameMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
