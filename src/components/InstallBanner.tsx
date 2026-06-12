import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share } from 'lucide-react';
import { usePWAInstall } from '../lib/usePWAInstall';
import { t, type Lang } from '../lib/i18n';
import { useGameStore } from '../store/gameStore';

const DISMISS_KEY = 'installBannerDismissed';
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function isDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const dismissedAt = Number(raw);
    if (Number.isNaN(dismissedAt)) return false;
    return Date.now() - dismissedAt < DISMISS_DURATION_MS;
  } catch {
    return false;
  }
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  // Detect iOS Safari (not inside WKWebView standalone)
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !isStandalone();
}

export default function InstallBanner() {
  const { isInstallable, install } = usePWAInstall();
  const lang = useGameStore((s) => s.settings.lang) as Lang;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner when app is not installed and not recently dismissed
    if (!isStandalone() && !isDismissed()) {
      setVisible(true);
    }
  }, []);

  const handleDismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // Silently fail
    }
    setVisible(false);
  }, []);

  const handleInstall = useCallback(async () => {
    const accepted = await install();
    if (accepted) {
      setVisible(false);
    }
  }, [install]);

  // Don't render anything if standalone (already installed)
  if (isStandalone()) return null;

  const isIosDevice = isIOS();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        >
          <div
            className="relative rounded-2xl border border-white/20 p-4 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255,107,53,0.85) 0%, rgba(255,210,63,0.85) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/20 text-white/80 hover:text-white hover:bg-black/30 active:scale-90 transition-all"
              aria-label={t('install.close', lang)}
            >
              <X size={14} />
            </button>

            {/* Title */}
            <div className="flex items-center gap-2 mb-3">
              <Download className="h-5 w-5 text-white" />
              <span className="text-sm font-black text-white">
                {t('install.title', lang)}
              </span>
            </div>

            {isIosDevice ? (
              /* iOS: step-by-step instructions */
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Share className="h-4 w-4 text-white/90 mt-0.5 shrink-0" />
                  <span className="text-xs font-semibold text-white/95">
                    {t('install.iosStep1', lang)}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm leading-none mt-0.5 shrink-0">➕</span>
                  <span className="text-xs font-semibold text-white/95">
                    {t('install.iosStep2', lang)}
                  </span>
                </div>
                <p className="text-[11px] text-white/70 mt-1">
                  {t('install.ios', lang)}
                </p>
              </div>
            ) : isInstallable ? (
              /* Android: install button */
              <div className="flex items-center gap-3">
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-2 rounded-xl bg-white/25 px-5 py-2.5 text-sm font-bold text-white shadow-lg backdrop-blur-sm active:scale-95 transition-all hover:bg-white/35 border border-white/30"
                >
                  <Download className="h-4 w-4" />
                  {t('install.android', lang)}
                </button>
                <span className="text-[11px] text-white/70">
                  {t('install.ios', lang)}
                </span>
              </div>
            ) : (
              /* Other browsers: generic instructions */
              <div className="space-y-1">
                <p className="text-xs font-semibold text-white/95">
                  {t('install.ios', lang)}
                </p>
              </div>
            )}

            {/* Later button */}
            <button
              onClick={handleDismiss}
              className="mt-3 text-xs font-semibold text-white/60 hover:text-white/80 transition-colors"
            >
              {t('install.later', lang)}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
