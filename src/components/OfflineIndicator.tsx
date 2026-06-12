// ─── Offline Indicator for PWA ─────────────────────────
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { t } from '../lib/i18n';
import type { Lang } from '../lib/i18n';

export default function OfflineIndicator({ lang }: { lang: Lang }) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [justBackOnline, setJustBackOnline] = useState(false);

  useEffect(() => {
    const goOffline = () => {
      setIsOffline(true);
      setJustBackOnline(false);
    };
    const goOnline = () => {
      setIsOffline(false);
      setJustBackOnline(true);
      setTimeout(() => setJustBackOnline(false), 3000);
    };

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          className="fixed bottom-4 left-1/2 z-[150] flex items-center gap-2 rounded-2xl bg-[#EF476F]/90 px-4 py-2.5 shadow-xl backdrop-blur-sm border border-[#EF476F]/50"
          style={{ x: '-50%' }}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <WifiOff className="h-4 w-4 text-white" />
          <span className="text-white text-xs font-bold">{t('offline.message', lang)}</span>
        </motion.div>
      )}
      {justBackOnline && !isOffline && (
        <motion.div
          className="fixed bottom-4 left-1/2 z-[150] flex items-center gap-2 rounded-2xl bg-[#06D6A0]/90 px-4 py-2.5 shadow-xl backdrop-blur-sm border border-[#06D6A0]/50"
          style={{ x: '-50%' }}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <Wifi className="h-4 w-4 text-white" />
          <span className="text-white text-xs font-bold">{t('offline.backOnline', lang)}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
