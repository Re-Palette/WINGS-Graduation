'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { imagery, team } from '@/lib/content';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * Holds the page on black until the huddle is decoded, so the opening
 * pull-back never starts on an empty frame. Capped so a slow connection
 * can't trap anyone behind it.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      setDone(true);
      document.body.style.removeProperty('overflow');
    };

    document.body.style.overflow = 'hidden';

    const image = new window.Image();
    image.src = imagery.huddleHero;

    // Never hold the visitor longer than the beat is worth.
    const floor = window.setTimeout(() => {
      if (image.complete) finish();
    }, reduced ? 200 : 1500);
    const ceiling = window.setTimeout(finish, reduced ? 400 : 4200);

    image.onload = () => window.setTimeout(finish, reduced ? 0 : 900);
    image.onerror = finish;

    return () => {
      window.clearTimeout(floor);
      window.clearTimeout(ceiling);
      document.body.style.removeProperty('overflow');
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center">
            <motion.p
              className="en-label text-[0.6rem] text-paper/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
            >
              {team.name}
            </motion.p>
            <div className="mt-6 h-px w-24 overflow-hidden bg-paper/10">
              <motion.div
                className="h-px bg-gold"
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: reduced ? 0.3 : 2.6, ease: 'easeInOut' }}
              />
            </div>
            <span className="sr-only">読み込み中</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
