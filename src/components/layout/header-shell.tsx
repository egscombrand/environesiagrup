import type { ReactNode } from 'react';

// One header, one look, everywhere — no per-page/per-route branching, and
// no background at all: truly `background: transparent`, not a tinted
// panel. Legibility over arbitrary content (a hero photo, or a page with
// no hero at all) comes from a drop-shadow on the logo and a text-shadow
// on the nav text themselves (see header.tsx, nav-item.tsx,
// language-switcher.tsx, header-mobile-nav.tsx), not from darkening the
// bar behind them — a tinted bar reads as "a panel behind the header",
// which is exactly what this is meant to avoid.
//
// `fixed inset-x-0 top-0` pins this to the viewport itself: no ancestor
// between this element and <html> sets transform/filter/perspective/
// contain/will-change (verified — body/html carry none, and
// NextIntlClientProvider renders no DOM wrapper of its own), so nothing
// can quietly turn this fixed positioning into "fixed relative to some
// ancestor" instead of the viewport.
//
// Every child that reads `data-overlay` (logo, nav links, language
// switcher, mobile toggle — see group-data-[overlay]/hdr: throughout
// layout/) already treats it as a single on/off "light mode" switch, so
// making it permanently on here is enough to keep them white/light
// everywhere without touching any of them.
export function HeaderShell({ children }: { children: ReactNode }) {
  return (
    <header
      data-overlay=""
      className="group/hdr fixed inset-x-0 top-0 z-[9999] w-full bg-transparent backdrop-blur-sm"
    >
      {children}
    </header>
  );
}
