'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { routing } from '@/i18n/routing';

// Only pages that actually render a hero behind the header may go transparent.
// Everywhere else the header sits on a light page, where white text would be
// invisible — the failure this component exists to prevent.
function hasHeroBehind(pathname: string | null) {
  if (!pathname) return false;
  return routing.locales.some((locale) => pathname === `/${locale}` || pathname === `/${locale}/`);
}

export function HeaderShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const overHero = hasHeroBehind(pathname);

  useEffect(() => {
    if (!overHero) return;

    // Solid again as soon as the hero starts leaving, so the header never
    // floats transparent over page content further down.
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overHero]);

  const transparent = overHero && !scrolled;

  return (
    <header
      data-overlay={transparent ? '' : undefined}
      className={`group/hdr fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-out motion-reduce:transition-none ${
        transparent ? 'border-b border-transparent bg-transparent' : 'border-b border-sage-mist bg-canvas/95 backdrop-blur'
      }`}
    >
      {children}
    </header>
  );
}
