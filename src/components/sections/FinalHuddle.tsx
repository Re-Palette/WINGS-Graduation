'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { finale, huddleAlt, imagery } from '@/lib/content';
import SectionIndex from '@/components/ui/SectionIndex';
import Grain from '@/components/ui/Grain';

/**
 * The peak. The photograph returns whole, the page slows almost to a stop,
 * and four lines arrive with long silences between them.
 *
 * The runway is deliberately the longest in the site — this is the one
 * moment the visitor should not be able to hurry through.
 */
export default function FinalHuddle() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('[data-finale-line]');
      if (lines.length === 0) return;

      if (reduced) {
        gsap.set(lines, { opacity: 1, y: 0, filter: 'blur(0px)' });
        gsap.set('[data-finale-veil]', { opacity: 0.5 });
        return;
      }

      gsap.set(lines, { opacity: 0, y: 30, filter: 'blur(10px)' });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.8,
          invalidateOnRefresh: true,
        },
      });

      // The frame darkens as the words accumulate.
      timeline
        .fromTo(
          '[data-finale-veil]',
          { opacity: 0.22 },
          { opacity: 0.66, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '[data-finale-frame]',
          { scale: 1.16 },
          { scale: 1.0, ease: 'none', duration: 1 },
          0
        );

      const lead = 0.12;
      const span = (1 - lead - 0.18) / lines.length;

      lines.forEach((line, i) => {
        const at = lead + i * span;
        // Lines stack rather than replace each other — by 「ありがとう。」
        // all four are on screen together.
        timeline.to(
          line,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            ease: 'power2.out',
            duration: span * 0.5,
          },
          at
        );
        // Earlier lines recede so the newest one always leads.
        if (i > 0) {
          timeline.to(
            lines[i - 1],
            { opacity: 0.32, ease: 'power1.out', duration: span * 0.4 },
            at
          );
        }
      });
    }, root);

    ScrollTrigger.refresh();
    return () => context.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="relative h-svh bg-navy-deep motion-safe:h-[520svh]"
      aria-label="最後の円陣"
    >
      <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden">
        <div data-finale-frame className="absolute inset-0 will-change-transform">
          <Image
            src={imagery.huddleFinal}
            alt={huddleAlt}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: '58% 45%' }}
          />
        </div>

        <div
          data-finale-veil
          className="absolute inset-0 bg-navy-deep"
          aria-hidden="true"
        />
        <Grain />

        <div className="absolute left-6 top-1/2 z-20 -translate-y-1/2 sm:left-10">
          <SectionIndex index={finale.index} label={finale.label} />
        </div>

        <div className="relative z-20 flex flex-col items-center gap-5 px-6 text-center sm:gap-7">
          {finale.lines.map((line, i) => (
            <p
              key={line}
              data-finale-line
              className={`jp-headline text-paper drop-shadow-[0_8px_44px_rgba(5,14,33,0.9)] ${
                i === finale.lines.length - 1
                  ? 'mt-6 text-[clamp(2.2rem,8vw,6rem)] text-gold-soft sm:mt-10'
                  : 'text-[clamp(1.5rem,5vw,3.8rem)]'
              }`}
            >
              {line}
            </p>
          ))}
        </div>

        <div className="absolute bottom-[10svh] left-6 z-20 hidden sm:left-10 lg:block">
          <div className="jp-body text-[0.7rem] text-paper/55">
            {finale.caption.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
