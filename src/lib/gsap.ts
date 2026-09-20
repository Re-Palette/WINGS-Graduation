'use client';

import { useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// registerPlugin is idempotent, so this is safe on every module evaluation.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * useLayoutEffect warns during SSR. Scroll scenes must measure before paint,
 * so on the client we want the layout variant and on the server a no-op.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export { gsap, ScrollTrigger };
