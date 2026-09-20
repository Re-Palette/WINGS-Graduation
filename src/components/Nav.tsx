'use client';

import { useEffect, useState } from 'react';
import { nav, team } from '@/lib/content';

/**
 * Editorial top bar. It stays out of the way — fading to near-nothing while
 * the visitor reads, returning on upward scroll or hover.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [dimmed, setDimmed] = useState(false);
  const [retired, setRetired] = useState(false);
  const [active, setActive] = useState<string>('top');

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      // Dim once past the opening, unless the visitor is scrolling back up.
      setDimmed(y > window.innerHeight * 0.8 && y > lastY);
      // The ending washes to white; the chrome steps out for the last frame.
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setRetired(scrollable > 0 && y / scrollable > 0.985);
      lastY = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = nav
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (inView) setActive(inView.target.id);
      },
      { threshold: [0.15, 0.4, 0.7], rootMargin: '-25% 0px -25% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Escape closes the mobile sheet.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-opacity duration-700 ease-[var(--ease-cine)] ${
          retired && !open
            ? 'pointer-events-none opacity-0'
            : dimmed && !open
              ? 'opacity-25 hover:opacity-100 focus-within:opacity-100'
              : 'opacity-100'
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-start justify-between px-6 py-6 sm:px-10 sm:py-8">
          <a
            href="#top"
            className="group block"
            aria-label={`${team.name} — トップへ`}
          >
            <span className="en-label block text-[0.7rem] text-paper sm:text-[0.78rem]">
              {team.name}
            </span>
            <span className="en-label mt-2 hidden text-[0.44rem] leading-[1.9] text-paper/45 sm:block">
              {team.school}
              <br />
              {team.unit}
            </span>
          </a>

          <nav className="hidden items-center gap-9 pt-1 md:flex" aria-label="セクション">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`en-label relative text-[0.55rem] transition-colors duration-500 ${
                  active === item.id
                    ? 'text-gold'
                    : 'text-paper/60 hover:text-paper'
                }`}
                aria-current={active === item.id ? 'true' : undefined}
              >
                {item.label}
                <span
                  className={`absolute -bottom-2 left-0 h-px bg-gold transition-all duration-700 ease-[var(--ease-cine)] ${
                    active === item.id ? 'w-full opacity-100' : 'w-0 opacity-0'
                  }`}
                />
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="relative z-50 flex h-8 w-9 flex-col items-end justify-center gap-[7px] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
          >
            <span
              className={`h-px bg-paper transition-all duration-500 ease-[var(--ease-cine)] ${
                open ? 'w-6 translate-y-[4px] rotate-45' : 'w-7'
              }`}
            />
            <span
              className={`h-px bg-paper transition-all duration-500 ease-[var(--ease-cine)] ${
                open ? 'w-6 -translate-y-[4px] -rotate-45' : 'w-5'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        className={`fixed inset-0 z-40 bg-navy-deep/95 backdrop-blur-xl transition-all duration-700 ease-[var(--ease-cine)] md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
      >
        <nav
          className="flex h-full flex-col items-center justify-center gap-8"
          aria-label="セクション"
        >
          {nav.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="en-label text-sm text-paper/80 transition-all duration-700 ease-[var(--ease-cine)]"
              style={{
                transform: open ? 'translateY(0)' : 'translateY(14px)',
                opacity: open ? 1 : 0,
                transitionDelay: `${120 + i * 70}ms`,
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
