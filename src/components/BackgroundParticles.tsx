// ─── Animated Background Particles ─────────────────────
import { useEffect, useRef } from 'react';
import type { GameTheme } from '../lib/themes';
import { prefersReducedMotion } from '../lib/a11y';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

interface BackgroundParticlesProps {
  theme: GameTheme;
}

export default function BackgroundParticles({ theme }: BackgroundParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    // Respect reduced motion preference
    if (prefersReducedMotion()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Pause animation when tab is not visible (saves CPU/battery)
    const handleVisibility = () => {
      pausedRef.current = document.hidden;
      if (!document.hidden) {
        // Resume animation loop
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Initialize particles
    const COUNT = 30;
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < COUNT; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.4 - 0.1,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.3 + 0.05,
          hue: Math.random() * 60 - 30, // offset from accent color
        });
      }
    }

    // Parse accent color to get base hue
    const isNeon = theme.id === 'neon';
    const isRetro = theme.id === 'retro';

    const animate = () => {
      // Stop loop when paused (tab hidden)
      if (pausedRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        let color: string;
        if (isNeon) {
          const hue = (120 + p.hue + 360) % 360; // green-ish
          color = `hsla(${hue}, 100%, 60%, ${p.opacity})`;
        } else if (isRetro) {
          const hue = (80 + p.hue + 360) % 360; // yellow-green
          color = `hsla(${hue}, 60%, 50%, ${p.opacity})`;
        } else {
          const hue = (30 + p.hue + 360) % 360; // orange-ish
          color = `hsla(${hue}, 80%, 60%, ${p.opacity})`;
        }

        ctx.beginPath();
        if (isNeon) {
          // Neon: glowing circles
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.shadowBlur = 15;
          ctx.shadowColor = color;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (isRetro) {
          // Retro: small squares (pixel feel)
          ctx.rect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          ctx.fillStyle = color;
          ctx.fill();
        } else {
          // Classic: soft circles
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: theme.particleOpacity }}
    />
  );
}
