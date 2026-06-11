// ─── Accessibility helpers ──────────────────────────────

/**
 * Announce a message to screen readers via the aria-live region.
 * Uses a slight delay to ensure the DOM update is detected.
 */
export function announce(message: string): void {
  if (typeof document === 'undefined') return;

  const el = document.getElementById('game-announcer');
  if (!el) return;

  // Clear then set to ensure repeat announcements are detected
  el.textContent = '';
  requestAnimationFrame(() => {
    el.textContent = message;
  });
}

/**
 * Check if the user prefers reduced motion.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Trap focus within an element (for modals).
 * Call on keydown event.
 */
export function trapFocus(e: KeyboardEvent, container: HTMLElement): void {
  if (e.key !== 'Tab') return;

  const focusable = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  }
}
