'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { imagery, thanks } from '@/lib/content';
import SectionIndex from '@/components/ui/SectionIndex';
import Particles from '@/components/ui/Particles';

/**
 * The huddle dissolves into open sky. Light rays sweep, motes rise, and
 * the wordmark settles in the middle of it.
 */
export default function ThankYou() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      if (reduced) {
        gsap.set('[data-thanks-reveal]', { opacity: 1, y: 0 });
        gsap.set('[data-thanks-sky]', { scale: 1, opacity: 1 });
        return;
      }

      gsap.fromTo(
        '[data-thanks-sky]',
        { scale: 1.22, opacity: 0.55 },
        {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'top top',
            scrub: 1.4,
          },
        }
      );

      gsap.fromTo(
        '[data-thanks-reveal]',
        { opacity: 0, y: 56, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          ease: 'power3.out',
          duration: 2.4,
          stagger: 0.42,
          scrollTrigger: { trigger: root, start: 'top 42%' },
        }
      );

      // Rays sweep very slowly across the whole section.
      gsap.fromTo(
        '[data-thanks-rays]',
        { rotate: -7, opacity: 0.25 },
        {
          rotate: 7,
          opacity: 0.55,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
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
      id="message"
      className="relative h-svh bg-navy-deep motion-safe:h-[220svh]"
      aria-label="ありがとう"
    >
      <div className="sticky top-0 flex h-svh w-full items-center overflow-hidden">
        <div data-thanks-sky className="absolute inset-0 will-change-transform">
          <Image
            src={imagery.skySunset}
            alt=""
            fill
            sizes="100vw"
            /* The source frame is small; a touch of blur reads as haze
               rather than as a soft upscale. */
            className="object-cover blur-[1.5px]"
            style={{ objectPosition: '50% 55%' }}
            aria-hidden="true"
          />
          {/* Joins the section to the dark huddle above it */}
          <div className="absolute inset-x-0 top-0 h-[28svh] bg-gradient-to-b from-navy-deep to-transparent" />
          {/* Lifts the sky where the type sits */}
          <div className="absolute inset-0 bg-gradient-to-b from-paper/30 via-paper/12 to-transparent" />
        </div>

        {/* Light rays */}
        <div
          data-thanks-rays
          className="pointer-events-none absolute left-1/2 top-[-30%] h-[160%] w-[140%] -translate-x-1/2 origin-top will-change-transform"
          aria-hidden="true"
          style={{
            background:
              'conic-gradient(from 178deg at 50% 0%, transparent 0deg, rgba(255,255,255,0.16) 4deg, transparent 8deg, transparent 14deg, rgba(232,207,134,0.14) 18deg, transparent 23deg, transparent 32deg, rgba(255,255,255,0.12) 36deg, transparent 41deg)',
            mixBlendMode: 'screen',
          }}
        />

        <Particles count={90} color="255,248,232" />

        <div className="absolute left-6 top-[16svh] z-20 sm:left-10">
          <SectionIndex index={thanks.index} label={thanks.label} tone="dark" />
        </div>

        <div className="relative z-20 mx-auto w-full max-w-4xl px-6 text-center">
          <h2
            data-thanks-reveal
            className="en-serif text-[clamp(2.6rem,10vw,7rem)] leading-none tracking-[0.1em] text-navy drop-shadow-[0_2px_36px_rgba(253,253,251,0.95)]"
          >
            {thanks.wordmark}
          </h2>
          <p
            data-thanks-reveal
            className="en-serif mt-4 text-[clamp(0.9rem,2vw,1.35rem)] italic tracking-[0.3em] text-navy/75"
          >
            {thanks.generation}
          </p>

          <div
            className="gold-rule mx-auto my-[6svh] h-px w-40"
            data-thanks-reveal
            aria-hidden="true"
          />

          {thanks.lines.map((line) => (
            <p
              key={line}
              data-thanks-reveal
              className="jp-headline mt-5 text-[clamp(1.3rem,4.2vw,2.9rem)] text-navy drop-shadow-[0_2px_26px_rgba(253,253,251,0.9)]"
            >
              {line}
            </p>
          ))}
        </div>

        <div className="absolute bottom-[9svh] right-6 z-20 hidden text-right sm:right-10 lg:block">
          <p className="en-label text-[0.5rem] leading-[2.4] text-navy/55">
            {thanks.signature.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
