// ─── Sound Effects (Web Audio API) ──────────────────────
// All sounds are synthesized — no external audio files needed
// Supports multiple sound packs: classic, 8bit, soft

export type SoundPack = 'classic' | '8bit' | 'soft';

let audioCtx: AudioContext | null = null;
let currentPack: SoundPack = 'classic';

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/** Set the active sound pack */
export function setSoundPack(pack: SoundPack): void {
  currentPack = pack;
}

/** Get the active sound pack */
export function getSoundPack(): SoundPack {
  return currentPack;
}

/** Detect sound pack from localStorage */
export function detectSoundPack(): SoundPack {
  if (typeof window === 'undefined') return 'classic';
  const saved = localStorage.getItem('drm_soundPack');
  if (saved === 'classic' || saved === '8bit' || saved === 'soft') {
    currentPack = saved;
    return saved;
  }
  return 'classic';
}

/** Save sound pack to localStorage */
export function saveSoundPack(pack: SoundPack): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('drm_soundPack', pack);
  }
  currentPack = pack;
}

// ─── Helper: create oscillator + gain ───
function osc(ctx: AudioContext, type: OscillatorType, freq: number, gain: number, start: number, dur: number) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(gain, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  o.connect(g).connect(ctx.destination);
  o.start(start);
  o.stop(start + dur);
  return o;
}

// ─── Sound: Correct tap ──────────────────────────────────
export function playCorrect() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    if (currentPack === '8bit') {
      // 8-bit: square wave bleep
      osc(ctx, 'square', 880, 0.10, now, 0.1);
      osc(ctx, 'square', 1320, 0.08, now + 0.06, 0.1);
    } else if (currentPack === 'soft') {
      // Soft: gentle triangle chime
      osc(ctx, 'triangle', 660, 0.14, now, 0.3);
      osc(ctx, 'sine', 990, 0.06, now + 0.08, 0.25);
    } else {
      // Classic: bright sine chime
      osc(ctx, 'sine', 880, 0.18, now, 0.25);
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.type = 'sine';
      o2.frequency.setValueAtTime(1760, now + 0.05);
      g2.gain.setValueAtTime(0.08, now + 0.05);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      o2.connect(g2).connect(ctx.destination);
      o2.start(now + 0.05);
      o2.stop(now + 0.2);

      // Rising pitch
      const o3 = ctx.createOscillator();
      const g3 = ctx.createGain();
      o3.type = 'sine';
      o3.frequency.setValueAtTime(880, now);
      o3.frequency.exponentialRampToValueAtTime(1320, now + 0.08);
      g3.gain.setValueAtTime(0.18, now);
      g3.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      o3.connect(g3).connect(ctx.destination);
      o3.start(now);
      o3.stop(now + 0.25);
    }
  } catch { /* ignore audio errors */ }
}

// ─── Sound: Wrong answer ────────────────────────────────
export function playWrong() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    if (currentPack === '8bit') {
      // 8-bit: buzzy error
      osc(ctx, 'square', 200, 0.10, now, 0.15);
      osc(ctx, 'square', 150, 0.10, now + 0.1, 0.15);
      osc(ctx, 'square', 100, 0.10, now + 0.2, 0.2);
    } else if (currentPack === 'soft') {
      // Soft: muted low tone
      osc(ctx, 'sine', 200, 0.12, now, 0.4);
      osc(ctx, 'sine', 150, 0.08, now + 0.1, 0.3);
    } else {
      // Classic: sawtooth buzz
      const o1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      o1.type = 'sawtooth';
      o1.frequency.setValueAtTime(300, now);
      o1.frequency.exponentialRampToValueAtTime(100, now + 0.35);
      g1.gain.setValueAtTime(0.12, now);
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      o1.connect(g1).connect(ctx.destination);
      o1.start(now);
      o1.stop(now + 0.35);

      // Thud
      osc(ctx, 'sine', 80, 0.20, now, 0.2);
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.type = 'sine';
      o2.frequency.setValueAtTime(80, now);
      o2.frequency.exponentialRampToValueAtTime(40, now + 0.2);
      g2.gain.setValueAtTime(0.20, now);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      o2.connect(g2).connect(ctx.destination);
      o2.start(now);
      o2.stop(now + 0.2);
    }
  } catch { /* ignore audio errors */ }
}

// ─── Sound: Combo milestone ────────────────────────────
export function playCombo(level: number) {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    const baseFreq = level >= 10 ? 660 : level >= 7 ? 550 : 440;
    const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];

    if (currentPack === '8bit') {
      // 8-bit: square arpeggio
      notes.forEach((freq, i) => {
        osc(ctx, 'square', freq, 0.08, now + i * 0.06, 0.12);
      });
    } else if (currentPack === 'soft') {
      // Soft: gentle sine arpeggio
      notes.forEach((freq, i) => {
        osc(ctx, 'sine', freq, 0.10, now + i * 0.08, 0.3);
      });
    } else {
      // Classic: sine arpeggio
      notes.forEach((freq, i) => {
        osc(ctx, 'sine', freq, 0.12, now + i * 0.06, 0.2);
      });
    }
  } catch { /* ignore audio errors */ }
}

// ─── Sound: Timeout ─────────────────────────────────────
export function playTimeout() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    if (currentPack === '8bit') {
      osc(ctx, 'square', 200, 0.10, now, 0.15);
      osc(ctx, 'square', 120, 0.10, now + 0.12, 0.2);
    } else if (currentPack === 'soft') {
      osc(ctx, 'triangle', 180, 0.12, now, 0.5);
    } else {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(200, now);
      o.frequency.exponentialRampToValueAtTime(80, now + 0.4);
      g.gain.setValueAtTime(0.15, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      o.connect(g).connect(ctx.destination);
      o.start(now);
      o.stop(now + 0.4);
    }
  } catch { /* ignore audio errors */ }
}

// ─── Sound: Button tap ──────────────────────────────────
export function playTap() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    if (currentPack === '8bit') {
      osc(ctx, 'square', 600, 0.06, now, 0.05);
    } else if (currentPack === 'soft') {
      osc(ctx, 'sine', 500, 0.04, now, 0.1);
    } else {
      osc(ctx, 'sine', 600, 0.06, now, 0.08);
    }
  } catch { /* ignore audio errors */ }
}

// ─── Sound: Game start ──────────────────────────────────
export function playStart() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    if (currentPack === '8bit') {
      // 8-bit: ascending square blips
      osc(ctx, 'square', 300, 0.08, now, 0.08);
      osc(ctx, 'square', 450, 0.08, now + 0.08, 0.08);
      osc(ctx, 'square', 600, 0.08, now + 0.16, 0.08);
      osc(ctx, 'square', 900, 0.08, now + 0.24, 0.12);
    } else if (currentPack === 'soft') {
      // Soft: gentle rising tone
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(250, now);
      o.frequency.exponentialRampToValueAtTime(600, now + 0.3);
      g.gain.setValueAtTime(0.08, now);
      g.gain.linearRampToValueAtTime(0.12, now + 0.15);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      o.connect(g).connect(ctx.destination);
      o.start(now);
      o.stop(now + 0.4);
    } else {
      // Classic: whoosh sweep
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(200, now);
      o.frequency.exponentialRampToValueAtTime(800, now + 0.15);
      o.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
      g.gain.setValueAtTime(0.10, now);
      g.gain.linearRampToValueAtTime(0.15, now + 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      o.connect(g).connect(ctx.destination);
      o.start(now);
      o.stop(now + 0.3);
    }
  } catch { /* ignore audio errors */ }
}

// ─── Sound: Score milestone (10, 20, 30...) ────────────
export function playMilestone() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6

    if (currentPack === '8bit') {
      notes.forEach((freq, i) => {
        osc(ctx, 'square', freq, 0.08, now + i * 0.08, 0.15);
      });
    } else if (currentPack === 'soft') {
      notes.forEach((freq, i) => {
        osc(ctx, 'triangle', freq, 0.08, now + i * 0.1, 0.35);
      });
    } else {
      notes.forEach((freq, i) => {
        osc(ctx, 'sine', freq, 0.10, now + i * 0.08, 0.3);
      });
    }
  } catch { /* ignore audio errors */ }
}

// ─── Ensure AudioContext is resumed on first user gesture ──
export function initAudioOnInteraction() {
  const handler = () => {
    getCtx();
    document.removeEventListener('touchstart', handler);
    document.removeEventListener('click', handler);
  };
  document.addEventListener('touchstart', handler, { once: true });
  document.addEventListener('click', handler, { once: true });
}
