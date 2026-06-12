// ─── Theme System ──────────────────────────────────────
// Visual themes for the game — fully theme-aware from home to gameplay

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

  // ─── Extended theme properties ───

  /** Sky gradient for game scene */
  skyGradient: string;
  /** Sun/moon color */
  sunColor: string;
  /** Sun/moon glow */
  sunGlow: string;
  /** Sun ray color */
  sunRayColor: string;
  /** Cloud color */
  cloudColor: string;
  /** City silhouette / horizon fill */
  cityColor: string;

  /** Door frame gradient */
  doorFrame: string;
  /** Door arch accent */
  doorArchAccent: string;
  /** Door handle color */
  doorHandle: string;
  /** Door handle border */
  doorHandleBorder: string;
  /** Door panel inset border */
  doorPanelBorder: string;
  /** Current door pulse border color */
  doorPulseBorder: string;

  /** Runner skin tone */
  runnerSkin: string;
  /** Runner skin border */
  runnerSkinBorder: string;
  /** Runner hair color */
  runnerHair: string;
  /** Runner hoodie/outfit color */
  runnerOutfit: string;
  /** Runner outfit accent (stripe/detail) */
  runnerOutfitAccent: string;
  /** Runner outfit zipper/highlight */
  runnerOutfitZip: string;
  /** Runner pants color */
  runnerPants: string;
  /** Runner shoe color */
  runnerShoes: string;
  /** Runner dust/trail color */
  runnerDust: string;

  /** Road border glow */
  roadBorderGlow: string;
  /** Road center dash color */
  roadDashColor: string;
  /** Lane edge glow */
  laneEdgeGlow: string;
  /** Road edge glow color */
  roadEdgeGlow: string;

  /** HUD background style */
  hudBg: string;
  /** HUD score accent */
  hudScoreAccent: string;
  /** HUD combo border color */
  hudComboBorder: string;

  /** Speed indicator accent */
  speedAccent: string;

  /** Correct feedback overlay */
  feedbackCorrectBg: string;
  /** Wrong feedback overlay */
  feedbackWrongBg: string;
  /** Hint feedback overlay */
  feedbackHintBg: string;

  /** Screen flash color on correct */
  flashCorrect: string;
  /** Screen flash color on wrong */
  flashWrong: string;
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

    // Extended — Classic warm sunset theme
    skyGradient: 'linear-gradient(to bottom, #FF8C42 0%, #FFC857 40%, #FFE4A0 75%, #FFF8E1 100%)',
    sunColor: '#FFD54F',
    sunGlow: '0 0 60px #FF980060, 0 0 120px #FF980030',
    sunRayColor: '#FFD54F',
    cloudColor: 'rgba(255,255,255,0.8)',
    cityColor: '#7B5B3A',

    doorFrame: 'linear-gradient(180deg, #8B6B4A 0%, #5C3D2E 100%)',
    doorArchAccent: '#8B6B4A',
    doorHandle: '#FFD23F',
    doorHandleBorder: '#E5B82E',
    doorPanelBorder: 'rgba(255,255,255,0.15)',
    doorPulseBorder: 'rgba(255,210,63,0.4)',

    runnerSkin: '#FFDBB5',
    runnerSkinBorder: '#F5C49C',
    runnerHair: '#5C3D2E',
    runnerOutfit: '#FF6B35',
    runnerOutfitAccent: '#E55A25',
    runnerOutfitZip: '#FFD23F',
    runnerPants: '#2B4C7E',
    runnerShoes: '#EF476F',
    runnerDust: 'rgba(139,107,74,0.5)',

    roadBorderGlow: '#FFD23F80',
    roadDashColor: 'rgba(255,210,63,0.4)',
    laneEdgeGlow: '#FF6B35',
    roadEdgeGlow: '#FF6B3540',

    hudBg: 'rgba(0,0,0,0.4)',
    hudScoreAccent: '#FFD23F',
    hudComboBorder: 'rgba(255,210,63,0.3)',

    speedAccent: '#FFD23F',

    feedbackCorrectBg: 'rgba(6,214,160,0.5)',
    feedbackWrongBg: 'rgba(239,71,111,0.5)',
    feedbackHintBg: 'rgba(255,210,63,0.3)',
    flashCorrect: 'rgba(6,214,160,0.15)',
    flashWrong: 'rgba(239,71,111,0.15)',
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

    // Extended — Neon cyberpunk night
    skyGradient: 'linear-gradient(to bottom, #050520 0%, #0a0a2e 30%, #1a0a3e 60%, #0d0d3d 100%)',
    sunColor: '#00ff88',
    sunGlow: '0 0 80px #00ff8840, 0 0 160px #00ff8820',
    sunRayColor: '#00ff8840',
    cloudColor: 'rgba(0,255,136,0.08)',
    cityColor: '#0a1a3a',

    doorFrame: 'linear-gradient(180deg, #1a1a4a 0%, #0d0d2a 100%)',
    doorArchAccent: '#1a1a4a',
    doorHandle: '#00ff88',
    doorHandleBorder: '#00cc6a',
    doorPanelBorder: 'rgba(0,255,136,0.15)',
    doorPulseBorder: 'rgba(0,255,136,0.5)',

    runnerSkin: '#d0d0ff',
    runnerSkinBorder: '#a0a0dd',
    runnerHair: '#ff00ff',
    runnerOutfit: '#1a1a4a',
    runnerOutfitAccent: '#00ff88',
    runnerOutfitZip: '#00ff88',
    runnerPants: '#0d0d2a',
    runnerShoes: '#ff00ff',
    runnerDust: 'rgba(0,255,136,0.3)',

    roadBorderGlow: '#00ff8840',
    roadDashColor: 'rgba(0,255,136,0.3)',
    laneEdgeGlow: '#00ff88',
    roadEdgeGlow: '#ff00ff30',

    hudBg: 'rgba(5,5,20,0.7)',
    hudScoreAccent: '#00ff88',
    hudComboBorder: 'rgba(0,255,136,0.4)',

    speedAccent: '#00ff88',

    feedbackCorrectBg: 'rgba(0,255,136,0.4)',
    feedbackWrongBg: 'rgba(255,0,102,0.4)',
    feedbackHintBg: 'rgba(255,0,255,0.3)',
    flashCorrect: 'rgba(0,255,136,0.2)',
    flashWrong: 'rgba(255,0,102,0.2)',
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

    // Extended — Retro forest nature
    skyGradient: 'linear-gradient(to bottom, #6b9e5a 0%, #8bc06b 30%, #a8d88a 60%, #c8e8b0 100%)',
    sunColor: '#f5d442',
    sunGlow: '0 0 50px #f5d44240, 0 0 100px #f5d44220',
    sunRayColor: '#f5d44240',
    cloudColor: 'rgba(255,255,255,0.5)',
    cityColor: '#2d5a27',

    doorFrame: 'linear-gradient(180deg, #5a3a15 0%, #3a2a10 100%)',
    doorArchAccent: '#5a3a15',
    doorHandle: '#f5d442',
    doorHandleBorder: '#c4a820',
    doorPanelBorder: 'rgba(245,212,66,0.15)',
    doorPulseBorder: 'rgba(245,212,66,0.4)',

    runnerSkin: '#f5e0c0',
    runnerSkinBorder: '#d4c0a0',
    runnerHair: '#3a2a10',
    runnerOutfit: '#e85d3a',
    runnerOutfitAccent: '#c44a28',
    runnerOutfitZip: '#f5d442',
    runnerPants: '#2d5a27',
    runnerShoes: '#8B4513',
    runnerDust: 'rgba(90,74,53,0.4)',

    roadBorderGlow: '#f5d44240',
    roadDashColor: 'rgba(245,212,66,0.3)',
    laneEdgeGlow: '#e85d3a',
    roadEdgeGlow: '#e85d3a30',

    hudBg: 'rgba(26,58,21,0.6)',
    hudScoreAccent: '#f5d442',
    hudComboBorder: 'rgba(245,212,66,0.3)',

    speedAccent: '#f5d442',

    feedbackCorrectBg: 'rgba(107,158,90,0.5)',
    feedbackWrongBg: 'rgba(232,93,58,0.5)',
    feedbackHintBg: 'rgba(245,212,66,0.3)',
    flashCorrect: 'rgba(107,158,90,0.15)',
    flashWrong: 'rgba(232,93,58,0.15)',
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
