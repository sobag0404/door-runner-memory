import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppContent from './components/AppContent'

// ─── Register Service Worker (PWA) ──────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = new URL('sw.js', window.location.origin + import.meta.env.BASE_URL);

    navigator.serviceWorker.register(swUrl.pathname).catch((err) => {
      console.warn('SW registration failed:', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppContent />
  </StrictMode>,
)
