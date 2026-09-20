'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

type Mote = {
  x: number;
  y: number;
  r: number;
  drift: number;
  rise: number;
  alpha: number;
  phase: number;
};

/**
 * Slow motes of light for the sky sections. Canvas rather than DOM so a
 * hundred of them cost nothing, and it idles completely when off-screen.
 */
export default function Particles({
  count = 70,
  color = '255, 255, 255',
  className = '',
}: {
  count?: number;
  color?: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let motes: Mote[] = [];

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const seed = () => {
      motes = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.4 + Math.random() * 1.6,
        drift: (Math.random() - 0.5) * 0.02,
        rise: 0.006 + Math.random() * 0.018,
        alpha: 0.15 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      frame = requestAnimationFrame(draw);
      if (!visible || width === 0) return;

      context.clearRect(0, 0, width, height);

      for (const mote of motes) {
        mote.y -= mote.rise / 100;
        mote.x += mote.drift / 100;

        if (mote.y < -0.05) {
          mote.y = 1.05;
          mote.x = Math.random();
        }
        if (mote.x < -0.05) mote.x = 1.05;
        if (mote.x > 1.05) mote.x = -0.05;

        // Gentle breathing so the field never looks mechanical.
        const twinkle =
          0.65 + 0.35 * Math.sin(time / 1400 + mote.phase);

        context.beginPath();
        context.arc(mote.x * width, mote.y * height, mote.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(${color}, ${mote.alpha * twinkle})`;
        context.fill();
      }
    };

    if (reduced) {
      // Static field: seed, size, paint once, then stop.
      seed();
      resize();
      for (const mote of motes) {
        context.beginPath();
        context.arc(mote.x * width, mote.y * height, mote.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(${color}, ${mote.alpha * 0.6})`;
        context.fill();
      }
      return;
    }

    seed();
    resize();
    frame = requestAnimationFrame(draw);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: '10%' }
    );
    observer.observe(canvas);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [count, color, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
