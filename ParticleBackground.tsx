// ── ParticleBackground Component ──
// Canvas-based floating particle animation in the background

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  alpha: number;
  alphaDir: number;
}

const COLORS_LIGHT = [
  'rgba(233, 30, 140, alpha)',
  'rgba(155, 39, 175, alpha)',
  'rgba(255, 107, 107, alpha)',
  'rgba(255, 217, 61, alpha)',
  'rgba(107, 203, 119, alpha)',
];

const COLORS_DARK = [
  'rgba(255, 100, 180, alpha)',
  'rgba(200, 100, 255, alpha)',
  'rgba(255, 150, 100, alpha)',
  'rgba(255, 230, 100, alpha)',
  'rgba(100, 220, 130, alpha)',
];

interface Props {
  isDark: boolean;
}

export const ParticleBackground: React.FC<Props> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = isDark ? COLORS_DARK : COLORS_LIGHT;
    const COUNT = window.innerWidth < 768 ? 40 : 70;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.5 + 0.1,
      alphaDir: Math.random() > 0.5 ? 0.003 : -0.003,
    });

    const init = () => {
      resize();
      particlesRef.current = Array.from({ length: COUNT }, createParticle);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaDir;

        // Bounce edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        if (p.alpha <= 0.05 || p.alpha >= 0.65) p.alphaDir *= -1;

        // Draw particle
        const colorStr = p.color.replace('alpha', String(p.alpha.toFixed(2)));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = colorStr;
        ctx.fill();

        // Draw glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.5);
        glow.addColorStop(0, colorStr);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fill();
      });

      // Draw connections
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = ((120 - dist) / 120) * 0.08;
            ctx.strokeStyle = isDark
              ? `rgba(200, 100, 255, ${lineAlpha})`
              : `rgba(233, 30, 140, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });

      animRef.current = requestAnimationFrame(draw);
    };

    init();
    draw();

    const handleResize = () => {
      resize();
      particlesRef.current = Array.from({ length: COUNT }, createParticle);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      aria-hidden="true"
    />
  );
};
