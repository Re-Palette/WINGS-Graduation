'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks the OS "reduce motion" preference and keeps tracking it — visitors
 * can toggle it mid-session and the scroll scenes rebuild when they do.
 *
 * Returns `false` on the first render (including SSR) so markup matches
 * between server and client; the real value lands on the first effect.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
