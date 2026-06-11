// ─── PWA Install Prompt Hook ────────────────────────────
import { useState, useEffect, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      if (mountedRef.current) {
        setIsInstallable(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    const installedHandler = () => {
      if (mountedRef.current) {
        setIsInstalled(true);
        setIsInstallable(false);
      }
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      mountedRef.current = false;
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const install = async () => {
    if (!deferredPromptRef.current) return false;
    const prompt = deferredPromptRef.current;
    deferredPromptRef.current = null;
    await prompt.prompt();
    const result = await prompt.userChoice;
    if (mountedRef.current) {
      setIsInstallable(false);
    }
    return result.outcome === 'accepted';
  };

  return { isInstallable, isInstalled, install };
}
