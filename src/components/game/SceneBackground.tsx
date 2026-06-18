import { useMemo } from 'react';
import { LANE_COLORS } from '../../lib/constants';
import type { GameTheme } from '../../lib/themes';

function SkyBackground({ theme }: { theme: GameTheme }) {
  const isNeon = theme.id === 'neon';
  const isRetro = theme.id === 'retro';

  const clouds = useMemo(() => [
    { id: 1, left: '10%', top: '6%', w: 80, h: 28, speed: 35 },
    { id: 2, left: '55%', top: '3%', w: 100, h: 32, speed: 45 },
    { id: 3, left: '80%', top: '10%', w: 60, h: 22, speed: 30 },
    { id: 4, left: '30%', top: '14%', w: 70, h: 24, speed: 40 },
  ], []);

  // Neon: building windows data (pre-computed)
  const neonWindows = useMemo(() => {
    if (!isNeon) return [];
    const wins: { id: number; left: number; bottom: number; color: string; size: number }[] = [];
    const rng = seededRng(42);
    for (let i = 0; i < 15; i++) {
      wins.push({
        id: i,
        left: rng() * 90 + 5,
        bottom: rng() * 8 + 1,
        color: [theme.accent, theme.accent2, '#ffff00', '#ff8800'][Math.floor(rng() * 4)],
        size: 2 + rng() * 3,
      });
    }
    return wins;
  }, [isNeon, theme.accent, theme.accent2]);

  // Retro: tree data
  const retroTrees = useMemo(() => {
    if (!isRetro) return [];
    return [
      { id: 1, left: '8%', height: 35, width: 25 },
      { id: 2, left: '25%', height: 45, width: 30 },
      { id: 3, left: '60%', height: 40, width: 28 },
      { id: 4, left: '82%', height: 30, width: 22 },
    ];
  }, [isRetro]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky gradient — theme-aware */}
      <div className="absolute inset-0" style={{ background: theme.skyGradient }} />

      {/* Neon: stars in the sky */}
      {isNeon && (
        <>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={`star-${i}`} className="absolute rounded-full"
              style={{
                left: `${(i * 17 + 3) % 95}%`,
                top: `${(i * 13 + 7) % 25}%`,
                width: i % 3 === 0 ? 2 : 1,
                height: i % 3 === 0 ? 2 : 1,
                backgroundColor: i % 5 === 0 ? theme.accent : 'rgba(255,255,255,0.4)',
                boxShadow: i % 5 === 0 ? `0 0 4px ${theme.accent}60` : undefined,
                animation: i % 4 === 0 ? 'neonFlicker 2s ease-in-out infinite' : undefined,
                animationDelay: `${i * 0.3}s`,
              }} />
          ))}
        </>
      )}

      {/* Sun/Moon — theme-aware */}
      <div className="absolute top-[4%] left-1/2 -translate-x-1/2 w-24 h-24 rounded-full"
        style={{
          background: isNeon
            ? `radial-gradient(circle, ${theme.accent}30 0%, ${theme.accent}10 40%, transparent 100%)`
            : `radial-gradient(circle, #FFF8E1 0%, ${theme.sunColor} 40%, ${theme.sunColor}80 80%, transparent 100%)`,
          boxShadow: theme.sunGlow,
        }}
      >
        {!isNeon && (
          <div className="absolute inset-0" style={{ animation: 'sunRotate 20s linear infinite' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="absolute left-1/2 top-1/2 w-1 h-8 rounded-full origin-bottom"
                style={{
                  backgroundColor: theme.sunRayColor,
                  opacity: 0.4,
                  transform: `translate(-50%, -100%) rotate(${i * 45}deg) translateY(-14px)`,
                }} />
            ))}
          </div>
        )}
        {/* Neon: pulsing moon ring */}
        {isNeon && (
          <div className="absolute inset-2 rounded-full border"
            style={{
              borderColor: `${theme.accent}40`,
              animation: 'portalPulse 3s ease-in-out infinite',
            }} />
        )}
      </div>

      {/* Clouds — theme-aware */}
      {clouds.map(c => (
        <div key={c.id} className="absolute rounded-full"
          style={{
            left: c.left, top: c.top, width: c.w, height: c.h,
            backgroundColor: theme.cloudColor,
            animation: `cloudDrift ${c.speed}s linear infinite`,
            filter: isNeon ? 'blur(2px)' : 'blur(1px)',
          }}>
          <div className="absolute -top-2 left-1/4 w-3/5 h-3/4 rounded-full"
            style={{ backgroundColor: theme.cloudColor }} />
          <div className="absolute -top-1 right-1/4 w-2/5 h-2/3 rounded-full"
            style={{ backgroundColor: theme.cloudColor, opacity: 0.7 }} />
        </div>
      ))}

      {/* Retro: trees on horizon */}
      {retroTrees.map(tree => (
        <div key={tree.id} className="absolute"
          style={{ left: tree.left, bottom: '27%', width: tree.width, height: tree.height }}>
          {/* Trunk */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-[40%] rounded-sm"
            style={{ backgroundColor: '#5a3a15' }} />
          {/* Canopy — triangle layers */}
          <div className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: '25%', width: '100%', height: '75%' }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{ borderLeft: `${tree.width / 2}px solid transparent`, borderRight: `${tree.width / 2}px solid transparent`, borderBottom: `${tree.height * 0.5}px solid #2d5a27` }} />
            <div className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
              style={{ bottom: '30%', borderLeft: `${tree.width * 0.4}px solid transparent`, borderRight: `${tree.width * 0.4}px solid transparent`, borderBottom: `${tree.height * 0.4}px solid #3a7a30` }} />
          </div>
        </div>
      ))}

      {/* City silhouette / horizon */}
      <div className="absolute bottom-[28%] left-0 right-0 h-[12%]">
        {isNeon ? (
          // Neon: Cyberpunk city with windows
          <svg viewBox="0 0 400 50" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,50 L0,35 L15,35 L15,20 L25,20 L25,30 L40,30 L40,15 L50,15 L50,25 L65,25 L65,35 L80,35 L80,10 L90,10 L90,30 L105,30 L105,20 L120,20 L120,35 L140,35 L140,25 L155,25 L155,40 L170,40 L170,15 L185,15 L185,30 L200,30 L200,22 L215,22 L215,38 L230,38 L230,12 L245,12 L245,28 L260,28 L260,35 L280,35 L280,18 L295,18 L295,32 L310,32 L310,25 L325,25 L325,40 L340,40 L340,20 L360,20 L360,35 L380,35 L380,28 L400,28 L400,50 Z"
              fill={theme.cityColor} opacity="0.5" />
          </svg>
        ) : (
          <svg viewBox="0 0 400 50" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,50 L0,35 L15,35 L15,20 L25,20 L25,30 L40,30 L40,15 L50,15 L50,25 L65,25 L65,35 L80,35 L80,10 L90,10 L90,30 L105,30 L105,20 L120,20 L120,35 L140,35 L140,25 L155,25 L155,40 L170,40 L170,15 L185,15 L185,30 L200,30 L200,22 L215,22 L215,38 L230,38 L230,12 L245,12 L245,28 L260,28 L260,35 L280,35 L280,18 L295,18 L295,32 L310,32 L310,25 L325,25 L325,40 L340,40 L340,20 L360,20 L360,35 L380,35 L380,28 L400,28 L400,50 Z"
              fill={theme.cityColor} opacity={isRetro ? 0.4 : 0.3} />
          </svg>
        )}

        {/* Neon: glowing windows on buildings */}
        {isNeon && neonWindows.map(w => (
          <div key={w.id} className="absolute rounded-[1px]"
            style={{
              left: `${w.left}%`,
              bottom: `${w.bottom}%`,
              width: w.size,
              height: w.size,
              backgroundColor: w.color,
              boxShadow: `0 0 4px ${w.color}80`,
              animation: 'neonFlicker 3s ease-in-out infinite',
              animationDelay: `${w.id * 0.5}s`,
            }} />
        ))}
      </div>
    </div>
  );
}

// Simple seeded RNG for neon windows (deterministic)
function seededRng(seed: number) {
  let s = (seed | 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// ─── Road ─────────────────────────────────────────────
export function RoadVisual({ pathCount, theme }: { pathCount: number; theme: GameTheme }) {
  const isNeon = theme.id === 'neon';
  const isRetro = theme.id === 'retro';
  const lanes = Array.from({ length: pathCount });
  const depthMarks = Array.from({ length: 8 });

  return (
    <div className="absolute inset-0 overflow-hidden">
      <SkyBackground theme={theme} />
      <div className="runner-road absolute left-[4%] right-[4%] bottom-0"
        style={{
          height: '78%',
          background: `linear-gradient(to bottom, ${theme.roadLine} 0%, ${theme.road} 20%, ${theme.gameBg} 50%, ${theme.road} 100%)`,
          borderLeft: `3px solid ${theme.roadBorderGlow}`,
          borderRight: `3px solid ${theme.roadBorderGlow}`,
        }}
      >
        {/* Perspective shoulder bands */}
        <div className="absolute inset-0 pointer-events-none opacity-70"
          style={{
            background: `
              linear-gradient(102deg, ${theme.roadEdgeGlow}90 0%, transparent 12%, transparent 88%, ${theme.roadEdgeGlow}90 100%),
              radial-gradient(ellipse at 50% 0%, ${theme.hudScoreAccent}26 0%, transparent 42%)
            `,
          }} />
        <div className="absolute inset-x-[10%] top-0 h-[42%] pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, ${theme.hudScoreAccent}22, transparent)`,
            clipPath: 'polygon(38% 0, 62% 0, 100% 100%, 0 100%)',
          }} />

        <div aria-hidden="true" className="memory-horizon-gate absolute left-1/2 top-[5%] h-14 w-32 -translate-x-1/2 rounded-full border"
          style={{
            borderColor: `${theme.hudScoreAccent}55`,
            boxShadow: `0 0 24px ${theme.hudScoreAccent}28, inset 0 0 18px ${theme.hudScoreAccent}18`,
          }}>
          <div className="absolute left-1/2 top-1/2 h-2 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: `linear-gradient(90deg, transparent, ${theme.hudScoreAccent}88, transparent)` }} />
        </div>

        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          {lanes.map((_, i) => {
            const color = LANE_COLORS[i % LANE_COLORS.length];
            return (
              <div key={`lane-beam-${i}`} className="memory-lane-beam absolute top-[2%] bottom-[1%]"
                style={{
                  left: `${(i / pathCount) * 100}%`,
                  width: `${100 / pathCount}%`,
                  background: `linear-gradient(to bottom, ${color}05 0%, ${color}12 34%, ${color}24 76%, ${color}36 100%)`,
                  clipPath: 'polygon(46% 0, 54% 0, 96% 100%, 4% 100%)',
                  animationDelay: `${i * 0.12}s`,
                }} />
            );
          })}

          {depthMarks.map((_, i) => (
            <div key={`depth-mark-${i}`} className="memory-depth-mark absolute left-1/2 h-[2px] -translate-x-1/2 rounded-full"
              style={{
                top: `${12 + i * 10.5}%`,
                width: `${28 + i * 8}%`,
                opacity: 0.14 + i * 0.035,
                background: `linear-gradient(90deg, transparent, ${theme.hudScoreAccent}99, transparent)`,
                boxShadow: `0 0 10px ${theme.hudScoreAccent}24`,
                animationDelay: `${i * 0.08}s`,
              }} />
          ))}
        </div>

        {/* Lane dividers */}
        {Array.from({ length: pathCount + 1 }).map((_, i) => (
          <div key={i} className="absolute top-0 bottom-0"
            style={{
              left: `${(i / pathCount) * 100}%`,
              width: isNeon ? '1px' : '2px',
              background: `linear-gradient(to bottom, transparent 0%, ${theme.roadDashColor} 30%, ${theme.laneEdgeGlow}60 100%)`,
              boxShadow: isNeon ? `0 0 4px ${theme.laneEdgeGlow}30` : undefined,
              transform: `perspective(260px) rotateX(18deg) skewX(${(i - pathCount / 2) * -1.4}deg)`,
              transformOrigin: 'top center',
            }} />
        ))}

        {/* Lane bottom glow */}
        {lanes.map((_, i) => {
          const color = LANE_COLORS[i % LANE_COLORS.length];
          return (
            <div key={`ls-${i}`} className="absolute bottom-0"
              style={{
                left: `${(i / pathCount) * 100 + 0.5}%`,
                width: `${100 / pathCount - 1}%`,
                height: '12px',
                background: `linear-gradient(to top, ${color}a0, ${color}38 45%, transparent)`,
              }}>
              <div className="absolute inset-x-[18%] bottom-[5px] h-[3px] rounded-full"
                style={{ backgroundColor: `${color}d0`, boxShadow: `0 0 14px ${color}70` }} />
            </div>
          );
        })}

        {/* Center dashes */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 overflow-hidden">
          <div className="road-dashes w-full h-[200%] flex flex-col gap-3 pt-0"
            style={{ animation: 'dashScroll 0.6s linear infinite' }}>
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="w-full h-3 rounded-full shrink-0"
                style={{
                  backgroundColor: theme.roadDashColor,
                  boxShadow: isNeon ? `0 0 4px ${theme.roadDashColor}` : undefined,
                }} />
            ))}
          </div>
        </div>

        {/* Road edge glow */}
        <div className="absolute left-0 top-0 bottom-0 w-2 rounded-r"
          style={{
            background: `linear-gradient(to bottom, transparent, ${theme.roadEdgeGlow}60, ${theme.roadEdgeGlow}80)`,
            boxShadow: isNeon ? `2px 0 10px ${theme.roadEdgeGlow}` : `2px 0 10px ${theme.roadEdgeGlow}`,
          }} />
        <div className="absolute right-0 top-0 bottom-0 w-2 rounded-l"
          style={{
            background: `linear-gradient(to bottom, transparent, ${theme.roadEdgeGlow}60, ${theme.roadEdgeGlow}80)`,
            boxShadow: isNeon ? `-2px 0 10px ${theme.roadEdgeGlow}` : `-2px 0 10px ${theme.roadEdgeGlow}`,
          }} />

        {/* Vanishing point glow */}
        <div className="absolute left-1/2 -translate-x-1/2 w-24 h-24 rounded-full"
          style={{
            top: '3%',
            background: `radial-gradient(circle, ${isNeon ? theme.accent : theme.hudScoreAccent}40 0%, transparent 70%)`,
          }} />

        {/* Retro: grass tufts on road edges */}
        {isRetro && (
          <>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={`grass-${i}`} className="absolute left-0 w-3 h-4"
                style={{ bottom: `${10 + i * 18}%` }}>
                <div className="w-1 h-3 rounded-t-full bg-[#3a7a30] rotate-[-15deg] absolute bottom-0 left-0" />
                <div className="w-1 h-3.5 rounded-t-full bg-[#4a8a40] absolute bottom-0 left-1" />
                <div className="w-1 h-3 rounded-t-full bg-[#3a7a30] rotate-[15deg] absolute bottom-0 left-2" />
              </div>
            ))}
            {[0, 1, 2, 3, 4].map(i => (
              <div key={`grass-r-${i}`} className="absolute right-0 w-3 h-4"
                style={{ bottom: `${12 + i * 18}%` }}>
                <div className="w-1 h-3 rounded-t-full bg-[#3a7a30] rotate-[-15deg] absolute bottom-0 left-0" />
                <div className="w-1 h-3.5 rounded-t-full bg-[#4a8a40] absolute bottom-0 left-1" />
                <div className="w-1 h-3 rounded-t-full bg-[#3a7a30] rotate-[15deg] absolute bottom-0 left-2" />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
