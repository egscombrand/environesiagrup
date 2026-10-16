'use client';

import { useEffect, useState, type ReactNode } from 'react';

// How far past the very top the page has to scroll before the header
// switches out of "overlay" mode — a small buffer so a 1–2px sub-pixel
// scroll (some browsers report these at rest) never flickers the state.
const SCROLLED_THRESHOLD = 24;

// At the top of the page the bar is fully transparent (no panel, no
// blur) so the hero shows through. Past SCROLLED_THRESHOLD it becomes a
// solid, opaque `bg-white` — a plain color swap, never `backdrop-blur`
// or any translucent/glass fill, and never a shadow (a shadow would
// read as "a panel behind the header", which this design avoids even
// once solid). `transition-colors` is what makes that swap smooth
// instead of an instant cut.
//
// The same `overlay` boolean also drives `data-overlay`, which every
// header child (logo, nav links, language switcher, mobile toggle —
// see group-data-[overlay]/hdr: throughout layout/) reads to flip
// between white/light styling (over the hero) and normal dark/brand-
// colored styling (once the bar is solid white) — so the background
// and the logo/text color change together, in the same scroll step.
//
// `fixed inset-x-0 top-0` pins this to the viewport itself: no ancestor
// between this element and <html> sets transform/filter/perspective/
// contain/will-change (verified — body/html carry none, and
// NextIntlClientProvider renders no DOM wrapper of its own), so nothing
// can quietly turn this fixed positioning into "fixed relative to some
// ancestor" instead of the viewport.
export function HeaderShell({ children }: { children: ReactNode }) {
  // Starts true (the overlay/top-of-page look) so the very first paint —
  // before this effect's listener can run — matches the common case: a
  // fresh page load starts scrolled to the top.
  const [overlay, setOverlay] = useState(true);

  useEffect(() => {
    function onScroll() {
      setOverlay(window.scrollY <= SCROLLED_THRESHOLD);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      data-overlay={overlay ? '' : undefined}
      className={`group/hdr fixed inset-x-0 top-0 z-[9999] w-full transition-colors duration-300 motion-reduce:transition-none ${
        overlay ? 'bg-transparent' : 'bg-white'
      }`}
    >
      {children}
    </header>
  );
}
