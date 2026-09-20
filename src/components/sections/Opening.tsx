'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { huddleAlt, imagery, opening, story } from '@/lib/content';
import SectionIndex from '@/components/ui/SectionIndex';
import Grain from '@/components/ui/Grain';

/** How deep inside the huddle the opening frame starts. */
const START_SCALE = 4.2;

export default function Opening() {
  const rootRef = useRef<HTMLElement>(null);
  const [introDone, setIntroDone] = useState(false);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const frame = '[data-opening-frame]';
      const overture = '[data-opening-overture]';
      const declaration = gsap.utils.toArray<HTMLElement>(
        '[data-opening-declaration] > span'
      );
      const veil = '[data-opening-veil]';
      const cue = '[data-opening-cue]';

      if (reduced) {
        // No camera move: present the photograph and the words, at rest.
        gsap.set(frame, { scale: 1, filter: 'blur(0px)' });
        gsap.set(veil, { opacity: 0.32 });
        gsap.set(overture, { opacity: 0 });
        gsap.set(declaration, { opacity: 1, y: 0 });
        setIntroDone(true);
        return;
      }

      // ---- Act one: the dark room. Time-based, before any scrolling. ----
      gsap.set(frame, { scale: START_SCALE, filter: 'blur(14px)', opacity: 0 });
      gsap.set(veil, { opacity: 0.9 });
      gsap.set(declaration, { opacity: 0, y: 26 });

      const intro = gsap.timeline({
        delay: 1.1,
        onComplete: () => setIntroDone(true),
      });

      intro
        .to(frame, { opacity: 1, duration: 3.4, ease: 'power1.inOut' }, 0)
        .to(
          '[data-overture-line]',
          {
            opacity: 1,
            y: 0,
            duration: 1.9,
            ease: 'power2.out',
            stagger: 1.15,
          },
          0.2
        )
        .to(cue, { opacity: 1, duration: 1.6, ease: 'power1.out' }, 3.4);

      // ---- Act two: the camera pulls back as the visitor scrolls. ----
      const scene = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
      });

      // The camera finishes its move at 72% of the runway; the last
      // quarter is a held frame, so the reveal has somewhere to land
      // instead of being cut off by the pin releasing.
      scene
        .to(
          frame,
          {
            scale: 1,
            filter: 'blur(0px)',
            ease: 'power1.out',
            duration: 0.72,
          },
          0
        )
        .to(veil, { opacity: 0.32, ease: 'none', duration: 0.72 }, 0)
        // The overture steps aside early, while the photo is still close.
        .to(
          overture,
          { opacity: 0, y: -40, filter: 'blur(6px)', ease: 'power1.in', duration: 0.18 },
          0
        )
        .to(cue, { opacity: 0, duration: 0.08 }, 0)
        // …and the declaration arrives as the huddle becomes readable.
        .to(
          declaration,
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            duration: 0.1,
            stagger: 0.05,
          },
          0.52
        )
        .to({}, { duration: 0.28 });

      return () => {
        intro.kill();
        scene.kill();
      };
    }, root);

    ScrollTrigger.refresh();
    return () => context.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative h-svh bg-navy-deep motion-safe:h-[480svh]"
      aria-label="オープニング"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* The photograph, framed as the band it settles into, so the
            camera only ever travels between "inside the huddle" and
            "the whole huddle". Phones get a taller crop — a 2.92:1 strip
            on a portrait screen is too thin to read as a huddle. */}
        <div
          data-opening-frame
          className="absolute left-1/2 top-1/2 w-screen -translate-x-1/2 -translate-y-1/2 will-change-transform"
          style={{ transformOrigin: '50% 50%' }}
        >
          {/* Below md the band keeps a fixed height instead of the
              photograph's shape — a 2.4:1 strip on a portrait screen is
              too thin to read as a huddle. Height wins over aspect-ratio
              while it is set, so one element serves both. */}
          <div
            className="relative h-[58svh] w-full md:h-auto"
            style={{ aspectRatio: imagery.huddleHeroAspect }}
          >
            <Image
              src={imagery.huddleHero}
              alt={huddleAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: '50% 45%' }}
            />
          </div>
        </div>

        {/* Pulls the venue's own colour into the navy palette — a real
            gymnasium arrives with a bright cyan curtain behind it.
            Deliberately light: past about 25% it starts flattening the
            royal blue of the uniforms and the gold of the ribbons, which
            are the team's colours and the reason the photograph works.
            A blend layer rather than a CSS filter on the photograph
            itself: the frame is scaled every frame and filters are not
            free. */}
        <div
          className="pointer-events-none absolute inset-0 bg-navy mix-blend-color opacity-20"
          aria-hidden="true"
        />
        <div
          data-opening-veil
          className="absolute inset-0 bg-navy-deep"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-navy-deep/50 via-transparent to-navy-deep/70"
          aria-hidden="true"
        />
        {/* Scrims so the chapter rail and the declaration always have
            something to sit on, whatever the photograph is doing. */}
        <div
          className="absolute inset-y-0 left-0 w-[34vw] bg-gradient-to-r from-navy-deep/85 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 right-0 w-[40vw] bg-gradient-to-l from-navy-deep/75 to-transparent md:w-[34vw]"
          aria-hidden="true"
        />
        <Grain />

        {/* Act one — the overture */}
        <div
          data-opening-overture
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
        >
          <p
            data-overture-line
            className="en-label translate-y-4 text-[0.55rem] text-paper/70 opacity-0 sm:text-[0.66rem]"
          >
            {opening.overture[0]}
          </p>
          <p
            data-overture-line
            className="en-label mt-4 translate-y-4 text-[0.55rem] text-paper/70 opacity-0 sm:text-[0.66rem]"
          >
            {opening.overture[1]}
          </p>
          <h1
            data-overture-line
            className="script mt-8 translate-y-4 text-[clamp(3.6rem,15vw,11rem)] leading-[0.9] text-paper opacity-0 drop-shadow-[0_8px_40px_rgba(5,14,33,0.7)]"
          >
            {opening.overture[2]}
          </h1>
          <p
            data-overture-line
            className="en-serif mt-6 translate-y-4 text-sm tracking-[0.34em] text-gold-soft/80 opacity-0 sm:text-base"
          >
            {`1st Generation · Graduation`}
          </p>
        </div>

        {/* Act two — the declaration */}
        <p
          data-opening-declaration
          className="jp-headline absolute inset-x-0 bottom-[16svh] z-20 flex flex-col items-center gap-2 px-6 text-center text-[clamp(1.35rem,3.6vw,2.6rem)] text-paper drop-shadow-[0_6px_30px_rgba(5,14,33,0.85)] sm:bottom-[18svh] md:inset-x-auto md:right-[7vw] md:items-end md:text-right"
        >
          {opening.declaration.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        {/* Chapter index — matches the comp's left rail */}
        <div className="absolute left-6 top-[26svh] z-20 sm:left-10">
          <SectionIndex index={opening.index} label={opening.label} />
          <p className="en-label mt-6 text-[0.6rem] text-paper/45">
            {opening.year}
          </p>
        </div>

        {/* Caption from the comp, sitting under the index on wide screens */}
        <div className="absolute bottom-[10svh] left-6 z-20 hidden max-w-[16rem] sm:left-10 lg:block">
          <div className="jp-body text-[0.68rem] text-paper/55">
            {story.caption.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div
          data-opening-cue
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 opacity-0 md:left-10 md:translate-x-0"
          aria-hidden="true"
        >
          <p className="en-label text-[0.5rem] text-paper/55">
            {opening.scrollCue}
          </p>
          <div className="relative mx-auto mt-3 h-12 w-px overflow-hidden bg-paper/20 md:mx-0">
            {!reduced && introDone && (
              <span className="absolute inset-x-0 top-0 block h-4 animate-[cue_2.6s_var(--ease-soft)_infinite] bg-gold" />
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cue {
          0%   { transform: translateY(-100%); opacity: 0; }
          35%  { opacity: 1; }
          100% { transform: translateY(300%); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
