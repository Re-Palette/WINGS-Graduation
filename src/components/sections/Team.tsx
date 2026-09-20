'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { imagery, member } from '@/lib/content';
import SectionIndex from '@/components/ui/SectionIndex';
import Grain from '@/components/ui/Grain';

/**
 * The people who built WINGS, one at a time.
 *
 * A card renders its portrait when `photo` is set in the content model;
 * without one it falls back to a monogram plate over the team frame, so
 * the section is complete before every portrait has been collected.
 */
export default function Team() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-member-card]');

      if (reduced) {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
        gsap.set('[data-member-media]', { y: 0 });
        return;
      }

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 96, scale: 0.965 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: 'power3.out',
            duration: 1.9,
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Media drifts against the card — the parallax that gives the
        // editorial layout its depth.
        const media = card.querySelector('[data-member-media]');
        if (media) {
          gsap.fromTo(
            media,
            { y: '-8%' },
            {
              y: '8%',
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
              },
            }
          );
        }
      });

      gsap.fromTo(
        '[data-member-heading] > *',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          ease: 'power3.out',
          duration: 1.6,
          stagger: 0.16,
          scrollTrigger: { trigger: '[data-member-heading]', start: 'top 82%' },
        }
      );
    }, root);

    ScrollTrigger.refresh();
    return () => context.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="member"
      className="relative overflow-hidden bg-navy-deep py-[16svh]"
      aria-label="メンバー"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep via-navy/45 to-navy-deep" />
        <div className="absolute left-1/2 top-0 h-[60svh] w-[120vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(31,78,157,0.28),transparent_70%)]" />
      </div>
      <Grain vignette={false} />

      <div className="relative z-20 mx-auto max-w-[1400px] px-6 sm:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionIndex index={member.index} label={member.label} className="mb-10" />
            <div data-member-heading>
              <h2 className="jp-headline text-[clamp(1.9rem,5vw,3.6rem)] text-paper">
                {member.title.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <div className="jp-body mt-8 max-w-md text-[0.8rem] text-paper/60">
                {member.caption.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="hand text-[clamp(1.4rem,2.4vw,2.1rem)] leading-[1.3] text-paper/60 lg:max-w-xs lg:text-right">
            {member.aside}
          </p>
        </div>

        <div className="mt-[12svh] grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-14 lg:gap-y-24">
          {member.roster.map((person, i) => (
            <article
              key={person.id}
              data-member-card
              /* Alternating vertical offset keeps the grid editorial
                 rather than tabular. */
              className={`group ${
                i % 2 === 1 ? 'sm:mt-[7svh]' : ''
              } ${i % 3 === 2 ? 'lg:mt-[12svh]' : ''}`}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-navy">
                <div data-member-media className="absolute -inset-y-[10%] inset-x-0">
                  <Image
                    src={person.photo ?? imagery.huddleHero}
                    alt={person.photo ? `${person.name} のポートレート` : ''}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    className={
                      person.photo
                        ? 'object-cover'
                        : 'object-cover opacity-60 blur-[1.5px] saturate-[0.7]'
                    }
                    style={{ objectPosition: `${18 + i * 13}% 45%` }}
                  />
                </div>

                <div
                  className={`absolute inset-0 ${
                    person.photo
                      ? 'bg-gradient-to-t from-navy-deep/92 via-navy-deep/25 to-transparent'
                      : 'bg-gradient-to-b from-navy-deep/45 via-navy/55 to-navy-deep/92'
                  }`}
                />

                {/* Monogram plate — only when no portrait is supplied */}
                {!person.photo && (
                  <p
                    className="en-serif absolute inset-0 flex items-center justify-center text-[clamp(4rem,11vw,7.5rem)] leading-none text-paper/22 transition-all duration-[1600ms] ease-[var(--ease-cine)] group-hover:text-gold/35"
                    aria-hidden="true"
                  >
                    {person.monogram}
                  </p>
                )}

                <div className="absolute inset-0 ring-1 ring-inset ring-gold/30 transition-all duration-[1200ms] ease-[var(--ease-cine)] group-hover:ring-gold/60" />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <p className="en-label text-[0.5rem] text-gold-soft/85">
                    {person.role}
                  </p>
                  <h3 className="en-serif mt-3 text-[clamp(1.2rem,2vw,1.6rem)] tracking-[0.18em] text-paper">
                    {person.name}
                  </h3>
                  <p className="jp-body mt-1 text-[0.6rem] text-paper/45">
                    {person.reading}
                  </p>
                </div>
              </div>

              <p className="jp-body mt-6 text-[0.74rem] text-paper/65">
                {person.word}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
