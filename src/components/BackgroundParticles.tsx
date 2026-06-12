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
  pulse: number; // for neon glow pulsing
  shape: 'circle' | 'square' | 'diamond' | 'triangle';
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

    // Initialize particles — more variety per theme
    const COUNT = theme.id === 'neon' ? 40 : 35;
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < COUNT; i++) {
        const shapes: Particle['shape'][] = theme.id === 'neon'
          ? ['circle', 'diamond', 'triangle']
          : theme.id === 'retro'
            ? ['square', 'square', 'diamond']
            : ['circle', 'circle', 'diamond'];
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.4 - 0.1,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.3 + 0.05,
          hue: Math.random() * 60 - 30,
          pulse: Math.random() * Math.PI * 2,
          shape: shapes[i % shapes.length],
        });
      }
    }

    const isNeon = theme.id === 'neon';
    const isRetro = theme.id === 'retro';

    const animate = () => {
      // Stop loop when paused (tab hidden)
      if (pausedRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        // Wrap around
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        // Dynamic opacity for neon pulsing
        const pulseFactor = isNeon ? 0.5 + 0.5 * Math.sin(p.pulse) : 1;
        const finalOpacity = p.opacity * pulseFactor;

        let color: string;
        if (isNeon) {
          const hue = (120 + p.hue + 360) % 360; // green-ish
          color = `hsla(${hue}, 100%, 60%, ${finalOpacity})`;
        } else if (isRetro) {
          const hue = (80 + p.hue + 360) % 360; // yellow-green
          color = `hsla(${hue}, 60%, 50%, ${finalOpacity})`;
        } else {
          const hue = (30 + p.hue + 360) % 360; // orange-ish
          color = `hsla(${hue}, 80%, 60%, ${finalOpacity})`;
        }

        ctx.save();
        ctx.translate(p.x, p.y);

        // Draw shape based on theme
        if (isNeon) {
          // Neon: glowing shapes with shadowBlur
          ctx.shadowBlur = 15 + 5 * Math.sin(p.pulse);
          ctx.shadowColor = color;
          ctx.fillStyle = color;
          drawShape(ctx, p.shape, p.size);
          ctx.fill();
        } else if (isRetro) {
          // Retro: pixel-like shapes, no glow
          ctx.fillStyle = color;
          drawShape(ctx, p.shape, p.size);
          ctx.fill();
        } else {
          // Classic: soft circles with gentle glow
          ctx.shadowBlur = 8;
          ctx.shadowColor = color;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
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

function drawShape(ctx: CanvasRenderingContext2D, shape: Particle['shape'], size: number) {
  switch (shape) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      break;
    case 'square':
      ctx.beginPath();
      ctx.rect(-size / 2, -size / 2, size, size);
      break;
    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size, 0);
      ctx.closePath();
      break;
    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size, size * 0.7);
      ctx.lineTo(-size, size * 0.7);
      ctx.closePath();
      break;
  }
}
