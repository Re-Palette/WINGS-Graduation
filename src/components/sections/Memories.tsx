'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { memories } from '@/lib/content';
import SectionIndex from '@/components/ui/SectionIndex';
import Particles from '@/components/ui/Particles';
import Sky from '@/components/ui/Sky';

/** How far back the deepest polaroid starts, in pixels of Z. */
const DEPTH_RANGE = 2600;

/**
 * Memories resurfacing: polaroids sit at different depths in a perspective
 * space and drift toward the viewer as the section is scrolled, turning
 * gently and sharpening as they arrive.
 */
export default function Memories() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-memory]');
      if (cards.length === 0) return;

      if (reduced) {
        gsap.set(cards, {
          z: 0,
          opacity: 1,
          filter: 'blur(0px)',
          rotateY: 0,
          rotateZ: (i, el) => Number(el.dataset.rotate ?? 0),
        });
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.3,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card) => {
        const depth = Number(card.dataset.depth ?? 0);
        const rotate = Number(card.dataset.rotate ?? 0);

        // Deeper photos start further away and arrive later.
        gsap.set(card, {
          z: -DEPTH_RANGE * depth - 300,
          opacity: 0,
          filter: 'blur(12px)',
          rotateY: rotate * 2.4,
          rotateZ: rotate * 1.6,
        });

        timeline
          .to(
            card,
            {
              z: 140,
              rotateY: rotate * -0.5,
              rotateZ: rotate,
              ease: 'none',
              duration: 1,
            },
            0
          )
          .to(
            card,
            { opacity: 1, filter: 'blur(0px)', ease: 'power1.out', duration: 0.22 },
            depth * 0.42
          )
          // Each one passes the viewer and dissolves, never piling up.
          .to(
            card,
            { opacity: 0, filter: 'blur(10px)', ease: 'power1.in', duration: 0.16 },
            0.72 + depth * 0.2
          );
      });

      // The heading recedes as the photographs come forward.
      gsap.to('[data-memory-heading]', {
        y: -70,
        opacity: 0.12,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '45% bottom',
          scrub: 1,
        },
      });
    }, root);

    ScrollTrigger.refresh();
    return () => context.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="memories"
      className="relative h-[380svh] bg-navy-deep"
      aria-label="思い出"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* Sky */}
        <Sky />
        <div
          className="absolute inset-0 bg-gradient-to-b from-navy-deep via-transparent to-navy-deep/90"
          aria-hidden="true"
        />
        <Particles count={60} color="255,255,255" />

        <div className="absolute left-6 top-1/2 z-30 -translate-y-1/2 sm:left-10">
          <SectionIndex index={memories.index} label={memories.label} tone="dark" />
        </div>

        {/* Heading */}
        <div
          data-memory-heading
          className="absolute left-6 top-[18svh] z-30 max-w-xs sm:left-10 lg:left-[9vw] lg:top-[26svh]"
        >
          <h2 className="jp-headline text-[clamp(1.6rem,4vw,3rem)] text-navy drop-shadow-[0_2px_18px_rgba(253,253,251,0.85)]">
            {memories.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <div className="jp-body mt-7 text-[0.72rem] text-navy/70">
            {memories.caption.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </div>
        </div>

        {/* The cloud */}
        <div
          className="absolute inset-0 z-20"
          style={{ perspective: '1100px', perspectiveOrigin: '55% 50%' }}
        >
          <div
            className="relative h-full w-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {memories.items.map((item) => (
              <figure
                key={item.src}
                data-memory
                data-depth={item.depth}
                data-rotate={item.rotate}
                className="absolute w-[36vw] max-w-[17rem] min-w-[8.5rem] will-change-transform sm:w-[24vw] lg:w-[17vw]"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: `translate(-50%, -50%) scale(${item.scale})`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Polaroid */}
                <div className="bg-paper p-[5%] pb-[14%] shadow-[0_28px_70px_-24px_rgba(5,14,33,0.85)]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy/10">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 36vw, (max-width: 1024px) 24vw, 17vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="en-label mt-[7%] text-center text-[0.42rem] text-navy/45">
                    {item.caption}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>

        <p className="hand absolute bottom-[12svh] right-[7vw] z-30 hidden text-[clamp(1.4rem,2.6vw,2.2rem)] leading-[1.3] text-navy/70 lg:block">
          Thank you
          <br />
          for all the memories.
        </p>
      </div>
    </section>
  );
}
