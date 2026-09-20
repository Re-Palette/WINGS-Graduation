'use client';

import { useEffect, useState } from 'react';

/** A single gold hairline on the right edge tracking read-through. */
export default function ProgressRail() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed right-5 top-1/2 z-40 hidden h-40 w-px -translate-y-1/2 bg-paper/15 transition-opacity duration-700 lg:block ${
        progress > 0.985 ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div
        className="w-px bg-gold transition-[height] duration-200 ease-linear"
        style={{ height: `${Math.min(100, progress * 100)}%` }}
      />
    </div>
  );
}
