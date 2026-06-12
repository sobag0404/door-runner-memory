import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { localStore } from '../lib/localStore';
import { t, type Lang } from '../lib/i18n';
import { useGameStore } from '../store/gameStore';

const TUTORIAL_SEEN_KEY = 'tutorialSeen';

function markTutorialSeen(): void {
  localStore.set(TUTORIAL_SEEN_KEY, true);
}

// ─── Tutorial Steps (i18n keys) ───
const STEP_KEYS = [
  { emoji: '[ ]', titleKey: 'tutorial.step1Title', textKey: 'tutorial.step1Text', visual: 'door' },
  { emoji: '>', titleKey: 'tutorial.step2Title', textKey: 'tutorial.step2Text', visual: 'controls' },
  { emoji: 'x3', titleKey: 'tutorial.step3Title', textKey: 'tutorial.step3Text', visual: 'combo' },
  { emoji: ':)', titleKey: 'tutorial.step4Title', textKey: 'tutorial.step4Text', visual: 'timer' },
] as const;

// ─── Mini Visuals ───
function DoorVisual() {
  return (
    <div className="flex items-end justify-center gap-3 h-24">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`w-14 h-20 rounded-t-lg border-2 flex items-center justify-center text-lg font-black ${
            i === 1 ? 'bg-[#06D6A0]/80 border-[#06D6A0] text-white' : 'bg-white/10 border-white/20 text-white/40'
          }`}
          animate={i === 1 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {i + 1}
        </motion.div>
      ))}
    </div>
  );
}

function ControlsVisual({ lang }: { lang: Lang }) {
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );

  if (isTouch) {
    return (
      <div className="flex items-center justify-center gap-2 h-24">
        <motion.span
          className="text-3xl font-black text-white/80"
          animate={{ x: [-6, 6, -6] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {'<'}
        </motion.span>
        <span className="text-white/30 text-lg">/</span>
        <motion.span
          className="text-3xl font-black text-white/80"
          animate={{ x: [6, -6, 6] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {'>'}
        </motion.span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 h-24">
      <kbd className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/15 border border-white/25 text-white/80 text-lg font-bold shadow-lg">{'<-'}</kbd>
      <kbd className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/15 border border-white/25 text-white/80 text-lg font-bold shadow-lg">{'->'}</kbd>
      <span className="text-white/30 text-sm mx-1">{t('tutorial.or', lang)}</span>
      <kbd className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/15 border border-white/25 text-white/80 text-lg font-bold shadow-lg">A</kbd>
      <kbd className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/15 border border-white/25 text-white/80 text-lg font-bold shadow-lg">D</kbd>
    </div>
  );
}

function ComboVisual({ lang }: { lang: Lang }) {
  return (
    <div className="flex items-center justify-center h-24">
      <motion.div
        className="text-2xl font-black px-4 py-1.5 rounded-full"
        style={{ color: '#FF6B35' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {t('combo.nice', lang)} &gt;&gt; {t('combo.super', lang)} &gt;&gt; {t('combo.insane', lang)}
      </motion.div>
    </div>
  );
}

function TimerVisual() {
  return (
    <div className="flex items-center justify-center h-24 w-full px-8">
      <div className="w-full h-4 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #EF476F, #FFD23F, #06D6A0)' }}
          animate={{ width: ['100%', '50%', '15%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ───
export default function TutorialOverlay({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const lang = useGameStore((s) => s.settings.lang);
  const current = STEP_KEYS[step];
  const isLast = step === STEP_KEYS.length - 1;

  const handleNext = () => {
    if (isLast) {
      markTutorialSeen();
      onClose();
    } else {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    markTutorialSeen();
    onClose();
  };

  const Visual = (() => {
    switch (current.visual) {
      case 'door': return <DoorVisual />;
      case 'controls': return <ControlsVisual lang={lang} />;
      case 'combo': return <ComboVisual lang={lang} />;
      case 'timer': return <TimerVisual />;
    }
  })();

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleSkip} />

      <motion.div
        className="relative w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white/10"
        style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #2B1D0E 40%, #5C3D2E 100%)' }}
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        role="dialog"
        aria-modal="true"
        aria-label={t('tutorial.step1Title', lang)}
      >
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-5">
          {STEP_KEYS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-[#FF6B35]' : i < step ? 'w-4 bg-[#06D6A0]' : 'w-4 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="text-center"
          >
            <motion.div
              className="text-5xl mb-3 font-black text-[#FF6B35]"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {current.emoji}
            </motion.div>
            <h3 className="text-xl font-black text-white mb-2">{t(current.titleKey, lang)}</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">{t(current.textKey, lang)}</p>
            {Visual}
          </motion.div>
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleSkip}
            className="flex-1 h-11 rounded-2xl bg-white/10 text-white/50 font-bold text-sm hover:bg-white/15 transition-all"
          >
            {t('tutorial.skip', lang)}
          </button>
          <button
            onClick={handleNext}
            className="flex-1 h-11 rounded-2xl bg-[#FF6B35] text-white font-bold text-sm shadow-lg shadow-[#FF6B35]/30 active:scale-95 transition-all"
          >
            {isLast ? t('tutorial.go', lang) : t('tutorial.next', lang)}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
