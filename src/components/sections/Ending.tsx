'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { ending, team } from '@/lib/content';
import Particles from '@/components/ui/Particles';
import WingMark from '@/components/ui/WingMark';

/**
 * Take-off. The type rises out of frame, the wing motif draws itself,
 * and the whole page washes to white.
 */
export default function Ending() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const strokes = gsap.utils.toArray<SVGPathElement>('.wing-stroke path');

      if (reduced) {
        gsap.set('[data-ending-line]', { opacity: 1, y: 0 });
        gsap.set(strokes, { strokeDasharray: 'none', strokeDashoffset: 0, opacity: 1 });
        gsap.set('[data-ending-wash]', { opacity: 0 });
        return;
      }

      gsap.fromTo(
        '[data-ending-line]',
        { opacity: 0, y: 90 },
        {
          opacity: 1,
          y: 0,
          ease: 'power3.out',
          duration: 2.2,
          stagger: 0.5,
          scrollTrigger: { trigger: root, start: 'top 58%' },
        }
      );

      // The stage lifts — the "taking flight" move.
      gsap.fromTo(
        '[data-ending-stage]',
        { y: 0 },
        {
          y: '-14svh',
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
          },
        }
      );

      // Feathers draw themselves in.
      strokes.forEach((path, i) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'power2.out',
          duration: 2.6,
          delay: i * 0.12,
          scrollTrigger: { trigger: '[data-ending-wing]', start: 'top 82%' },
        });
      });

      // Fade to white on the last screen of the page.
      gsap.fromTo(
        '[data-ending-wash]',
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: root,
            start: '60% center',
            end: '88% bottom',
            scrub: 1.2,
          },
        }
      );
    }, root);

    ScrollTrigger.refresh();
    return () => context.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="relative h-[240svh] bg-[#eaf1fb]"
      aria-label="エンディング"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* Open sky */}
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-b from-[#bcd4f2] via-[#e2ecfa] to-[#fdfdfb]" />
          <div className="absolute left-1/2 top-[-20%] h-[90%] w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9),transparent_65%)] blur-2xl" />
        </div>
        <Particles count={55} color="255,255,255" />

        <div
          data-ending-stage
          className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center will-change-transform"
        >
          <p
            data-ending-line
            className="en-serif text-[clamp(2.4rem,10vw,7rem)] leading-none tracking-[0.14em] text-navy"
          >
            {ending.lines[0]}
          </p>
          <p
            data-ending-line
            className="en-label my-8 text-[0.6rem] text-navy/45 sm:my-10"
          >
            {ending.lines[1]}
          </p>
          <p
            data-ending-line
            className="en-serif text-[clamp(1.6rem,7vw,5rem)] leading-[1.15] tracking-[0.12em] text-royal"
          >
            {ending.lines[2]}
          </p>

          <div
            data-ending-wing
            className="mt-[9svh] w-[clamp(9rem,22vw,16rem)] text-royal/50"
          >
            <WingMark className="h-auto w-full" />
          </div>

          <p className="en-label mt-[7svh] text-[0.48rem] text-navy/35">
            {ending.footer}
          </p>
        </div>

        {/* Fade to white — and the mark that remains in it */}
        <div
          data-ending-wash
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center bg-paper opacity-0"
        >
          <p className="script text-[clamp(2.4rem,9vw,6rem)] leading-none text-navy/85">
            {team.name}
          </p>
          <p className="en-label mt-7 text-[0.5rem] text-navy/35">
            {ending.footer}
          </p>
        </div>
      </div>
    </section>
  );
}
