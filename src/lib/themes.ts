// ─── Theme System ──────────────────────────────────────
// Visual themes for the game

export type ThemeId = 'classic' | 'neon' | 'retro';

export interface GameTheme {
  id: ThemeId;
  /** Home screen gradient */
  homeBg: string;
  /** Game scene background */
  gameBg: string;
  /** Leaderboard screen gradient */
  lbBg: string;
  /** Primary accent color */
  accent: string;
  /** Secondary accent */
  accent2: string;
  /** Text on dark bg */
  textLight: string;
  /** Text on light bg */
  textDark: string;
  /** Door glow effect */
  doorGlow: string;
  /** Timer bar color */
  timerOk: string;
  timerWarn: string;
  timerDanger: string;
  /** Particle color */
  particleCorrect: string;
  particleWrong: string;
  /** Name modal bg */
  modalBg: string;
  /** Road color */
  road: string;
  roadLine: string;
  /** Title shadow */
  titleShadow: string;
  subtitleShadow: string;
  /** Particle overlay opacity */
  particleOpacity: number;
}

export const THEMES: Record<ThemeId, GameTheme> = {
  classic: {
    id: 'classic',
    homeBg: 'linear-gradient(160deg, #FF8C42 0%, #FFC857 35%, #FFE4A0 70%, #FFF8E1 100%)',
    gameBg: '#5C3D2E',
    lbBg: 'linear-gradient(160deg, #2B1D0E 0%, #5C3D2E 40%, #8B6B4A 100%)',
    accent: '#FF6B35',
    accent2: '#06D6A0',
    textLight: '#FFFFFF',
    textDark: '#5C3D2E',
    doorGlow: '0 0 20px rgba(6,214,160,0.6)',
    timerOk: '#06D6A0',
    timerWarn: '#FFD23F',
    timerDanger: '#EF476F',
    particleCorrect: '#06D6A0',
    particleWrong: '#EF476F',
    modalBg: 'linear-gradient(160deg, #2B1D0E 0%, #5C3D2E 40%, #8B6B4A 100%)',
    road: '#3D2B1F',
    roadLine: '#5C3D2E',
    titleShadow: '0 3px 0 #E55A25, 0 6px 0 #CC4A15, 0 8px 12px rgba(0,0,0,0.2)',
    subtitleShadow: '0 2px 0 #CC8400, 0 4px 8px rgba(0,0,0,0.15)',
    particleOpacity: 0.3,
  },
  neon: {
    id: 'neon',
    homeBg: 'linear-gradient(160deg, #0a0a2e 0%, #1a0a3e 35%, #0d0d3d 70%, #050520 100%)',
    gameBg: '#0a0a1a',
    lbBg: 'linear-gradient(160deg, #0a0a2e 0%, #1a0a3e 40%, #0d0d3d 100%)',
    accent: '#00ff88',
    accent2: '#ff00ff',
    textLight: '#e0e0ff',
    textDark: '#c0c0ff',
    doorGlow: '0 0 30px rgba(0,255,136,0.8), 0 0 60px rgba(0,255,136,0.3)',
    timerOk: '#00ff88',
    timerWarn: '#ffff00',
    timerDanger: '#ff0066',
    particleCorrect: '#00ff88',
    particleWrong: '#ff0066',
    modalBg: 'linear-gradient(160deg, #0a0a2e 0%, #1a0a3e 40%, #0d0d3d 100%)',
    road: '#0d0d2a',
    roadLine: '#1a1a4a',
    titleShadow: '0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 40px #00ff8860',
    subtitleShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff60',
    particleOpacity: 0.5,
  },
  retro: {
    id: 'retro',
    homeBg: 'linear-gradient(160deg, #2d5a27 0%, #4a7c3f 35%, #6b9e5a 70%, #8bc06b 100%)',
    gameBg: '#2d5a27',
    lbBg: 'linear-gradient(160deg, #1a3a15 0%, #2d5a27 40%, #4a7c3f 100%)',
    accent: '#f5d442',
    accent2: '#e85d3a',
    textLight: '#f5f0e0',
    textDark: '#2d5a27',
    doorGlow: '0 0 15px rgba(245,212,66,0.5)',
    timerOk: '#6b9e5a',
    timerWarn: '#f5d442',
    timerDanger: '#e85d3a',
    particleCorrect: '#6b9e5a',
    particleWrong: '#e85d3a',
    modalBg: 'linear-gradient(160deg, #1a3a15 0%, #2d5a27 40%, #4a7c3f 100%)',
    road: '#1a3a15',
    roadLine: '#2d5a27',
    titleShadow: '3px 3px 0 #1a3a15, 5px 5px 0 rgba(0,0,0,0.2)',
    subtitleShadow: '2px 2px 0 #1a3a15, 4px 4px 0 rgba(0,0,0,0.15)',
    particleOpacity: 0.25,
  },
};

export function getTheme(id: ThemeId): GameTheme {
  return THEMES[id];
}

export function detectTheme(): ThemeId {
  if (typeof window === 'undefined') return 'classic';
  const saved = localStorage.getItem('drm_theme');
  if (saved && saved in THEMES) return saved as ThemeId;
  return 'classic';
}

export function saveTheme(id: ThemeId): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('drm_theme', id);
  }
}
