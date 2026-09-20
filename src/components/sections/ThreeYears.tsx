'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { huddleAlt, imagery, years } from '@/lib/content';
import SectionIndex from '@/components/ui/SectionIndex';
import Grain from '@/components/ui/Grain';

/**
 * Three years read as one horizontal move. The visitor keeps scrolling
 * down; the timeline travels sideways underneath them.
 *
 * Below `md` the track becomes an ordinary vertical stack — horizontal
 * pinning on a phone fights the browser's own gestures.
 */
export default function ThreeYears() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const context = gsap.context(() => {
      const matcher = gsap.matchMedia();

      matcher.add(
        {
          horizontal: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          stacked: '(max-width: 767px), (prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          const { horizontal } = ctx.conditions as { horizontal: boolean };
          if (!horizontal) return;

          const distance = () =>
            Math.max(0, track.scrollWidth - window.innerWidth);

          const travel = gsap.to(track, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: () => `+=${distance()}`,
              scrub: 1.1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // Each card lifts as it enters the frame. `containerAnimation`
          // is what lets a ScrollTrigger read horizontal position from the
          // vertical scrub above.
          gsap.utils
            .toArray<HTMLElement>('[data-year-card]')
            .forEach((card) => {
              gsap.fromTo(
                card,
                { opacity: 0.25, y: 54, scale: 0.96 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  ease: 'power2.out',
                  scrollTrigger: {
                    trigger: card,
                    containerAnimation: travel,
                    start: 'left 88%',
                    end: 'left 45%',
                    scrub: 1,
                  },
                }
              );
            });
        }
      );

      return () => matcher.revert();
    }, root);

    ScrollTrigger.refresh();
    return () => context.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="years"
      className="relative overflow-hidden bg-navy-deep md:h-svh"
      aria-label={years.title}
    >
      {/* The huddle, receded into the background */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={imagery.huddleHero}
          alt=""
          fill
          sizes="100vw"
          className="scale-[1.15] object-cover opacity-55 blur-[3px]"
          style={{ objectPosition: '50% 40%' }}
        />
        <div className="absolute inset-0 bg-navy-deep/72" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep via-navy-deep/40 to-navy-deep" />
      </div>
      <Grain />
      <span className="sr-only">{huddleAlt}</span>

      <div className="relative z-20 flex h-full flex-col justify-center py-24 md:py-0">
        <div
          ref={trackRef}
          className="flex flex-col gap-16 px-6 will-change-transform sm:px-10 md:h-full md:flex-row md:items-center md:gap-0 md:px-0"
        >
          {/* Panel one: the section's own title */}
          <div className="flex shrink-0 flex-col justify-center md:h-full md:w-[46vw] md:pl-[7vw] lg:w-[40vw]">
            <SectionIndex index={years.index} label={years.label} className="mb-10" />
            <h2 className="jp-headline text-[clamp(1.9rem,5vw,3.6rem)] text-paper">
              {years.title}
            </h2>
            <div className="jp-body mt-8 max-w-sm text-[0.8rem] text-paper/60">
              {years.caption.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </div>
          </div>

          {/* The three chapters */}
          {years.chapters.map((chapter, i) => (
            <div
              key={chapter.id}
              className="flex shrink-0 items-center md:h-full"
            >
              {i > 0 && (
                <div
                  className="hidden shrink-0 items-center px-8 md:flex lg:px-12"
                  aria-hidden="true"
                >
                  <span className="block h-px w-16 bg-paper/25 lg:w-24" />
                  <span className="-ml-1 block h-1.5 w-1.5 rotate-45 border-r border-t border-paper/40" />
                </div>
              )}

              <article
                data-year-card
                className="group w-full max-w-[26rem] md:w-[clamp(19rem,30vw,25rem)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy">
                  <Image
                    src={chapter.image}
                    alt={chapter.alt}
                    fill
                    sizes="(max-width: 768px) 90vw, 30vw"
                    className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-cine)] group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/55 to-transparent" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-paper/12" />
                </div>

                <div className="border-x border-b border-paper/10 bg-navy-deep/55 p-6 backdrop-blur-sm sm:p-7">
                  <p className="en-serif text-sm italic tracking-[0.18em] text-gold-soft">
                    {chapter.ordinal}
                  </p>
                  <h3 className="jp-headline mt-3 text-[clamp(1.25rem,2.4vw,1.85rem)] text-paper">
                    {chapter.grade}
                    <span className="mt-1 block">{chapter.title}</span>
                  </h3>
                  <p className="jp-body mt-5 text-[0.72rem] text-paper/70">
                    {chapter.body}
                  </p>
                </div>
              </article>
            </div>
          ))}

          {/* Closing flourish */}
          <div className="flex shrink-0 items-center justify-center md:h-full md:w-[32vw] md:pl-16">
            <p className="hand text-[clamp(1.8rem,4vw,3.2rem)] leading-[1.2] text-paper/70">
              3 years,
              <br />
              1 story.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
