'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { huddleAlt, imagery, story } from '@/lib/content';
import SectionIndex from '@/components/ui/SectionIndex';
import Grain from '@/components/ui/Grain';

/**
 * The huddle holds still and only the words move — one line at a time,
 * each one given room to land before the next arrives.
 */
export default function OurStory() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('[data-story-line]');
      if (lines.length === 0) return;

      if (reduced) {
        // Stack the lines as a readable list instead of cross-fading them.
        gsap.set(lines, {
          position: 'relative',
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
        });
        gsap.set('[data-story-stack]', { position: 'relative', height: 'auto' });
        return;
      }

      gsap.set(lines, { opacity: 0, y: 34, filter: 'blur(8px)' });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      // Leave a beat of quiet at each end so the section breathes.
      const lead = 0.06;
      const tail = 0.1;
      const span = (1 - lead - tail) / lines.length;

      lines.forEach((line, i) => {
        const at = lead + i * span;
        const isLast = i === lines.length - 1;

        timeline.to(
          line,
          { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: span * 0.42 },
          at
        );

        // The closing line stays — it is the one the visitor carries forward.
        if (!isLast) {
          timeline.to(
            line,
            { opacity: 0, y: -30, filter: 'blur(8px)', ease: 'power2.in', duration: span * 0.34 },
            at + span * 0.66
          );
        }
      });

      // A very slow push-in keeps the held frame alive.
      gsap.fromTo(
        '[data-story-frame]',
        { scale: 1.04 },
        {
          scale: 1.2,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.6,
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
      id="story"
      className="relative h-[620svh] bg-navy-deep"
      aria-label="私たちの日々"
    >
      <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden">
        <div data-story-frame className="absolute inset-0 will-change-transform">
          <Image
            src={imagery.huddleHero}
            alt={huddleAlt}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: '50% 42%' }}
          />
        </div>

        <div className="absolute inset-0 bg-navy-deep/45" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-navy-deep/75 via-navy-deep/15 to-navy-deep/75"
          aria-hidden="true"
        />
        <Grain />

        <div className="absolute left-6 top-1/2 z-20 -translate-y-1/2 sm:left-10">
          <SectionIndex index={story.index} label={story.label} />
        </div>

        {/* The words */}
        <div
          data-story-stack
          className="relative z-20 flex h-[46svh] w-full items-center justify-center px-6 sm:h-[40svh]"
        >
          <div className="relative flex w-full max-w-[64rem] flex-col items-center gap-6 sm:gap-8">
            {story.lines.map((line) => (
              <p
                key={line}
                data-story-line
                className="jp-headline absolute text-center text-[clamp(1.75rem,6vw,4.75rem)] leading-[1.45] text-paper drop-shadow-[0_8px_40px_rgba(5,14,33,0.8)]"
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        <p className="hand absolute bottom-[12svh] right-[7vw] z-20 hidden text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.25] text-paper/75 lg:block">
          We grew
          <br />
          together.
        </p>
      </div>
    </section>
  );
}
