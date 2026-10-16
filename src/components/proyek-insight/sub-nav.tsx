'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Briefcase, Handshake, Megaphone, Newspaper, type LucideIcon } from 'lucide-react';
import { PROYEK_INSIGHT_ROUTES } from '@/lib/proyek-insight-routes';

const ACCENT = '#0DA19D';

// Same small visual-cue-per-tab convention as Tentang Kami's own sub-nav
// (src/components/tentang-kami/sub-nav.tsx) — kept out of the shared route
// data for the same reason: that data is also reused for plain metadata
// generation, which has no business importing a React icon component.
const TAB_ICONS: Record<string, LucideIcon> = {
  'portofolio-proyek': Briefcase,
  'klien-mitra': Handshake,
  'berita-perusahaan': Newspaper,
  'siaran-pers': Megaphone,
};

/**
 * The navigation rail for the Proyek & Insight area — same sticky,
 * boxed-segmented-tabs pattern as Tentang Kami's sub-nav, just with this
 * section's own 4 real tabs instead of 6. Only 4 tabs here, so no
 * 1400px-wide-desktop special case is needed — a simple wrapping flex row
 * fits all 4 without scrolling at every width this site supports.
 */
export function ProyekInsightSubNav({ locale, activeSlug }: { locale: string; activeSlug?: string }) {
  const pathname = usePathname() ?? '';
  const shouldReduceMotion = useReducedMotion();
  const hubPath = `/${locale}/proyek-insight`;
  const onHub = pathname === hubPath || pathname === `${hubPath}/`;

  const [headerHeight, setHeaderHeight] = useState(84);

  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;

    const update = () => setHeaderHeight(header.getBoundingClientRect().height);
    update();
    window.addEventListener('resize', update, { passive: true });
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    resizeObserver?.observe(header);

    return () => {
      window.removeEventListener('resize', update);
      resizeObserver?.disconnect();
    };
  }, []);

  const currentActiveSlug =
    activeSlug ??
    (PROYEK_INSIGHT_ROUTES.find((route) => {
      const href = `/${locale}/proyek-insight/${route.slug}`;
      return pathname === href || pathname === `${href}/`;
    })?.slug ?? (onHub ? 'portofolio-proyek' : 'portofolio-proyek'));

  return (
    <nav
      aria-label="Navigasi Proyek & Insight"
      className="sticky z-[9990] w-full border-b border-pine-ink/10 bg-stone"
      style={{ top: headerHeight }}
    >
      <div className="mx-auto max-w-[1280px] px-4 py-2.5 md:px-8 md:py-3">
        <ul className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap sm:justify-center sm:gap-2">
          {PROYEK_INSIGHT_ROUTES.map((route) => {
            const href = `/${locale}/proyek-insight/${route.slug}`;
            const active = currentActiveSlug === route.slug;
            const Icon = TAB_ICONS[route.slug];

            return (
              <li key={route.slug} className="relative">
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className="group relative flex h-full items-center justify-center gap-1.5 rounded-[11px] border px-2 py-2 text-center transition-colors duration-[180ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:gap-2 sm:px-3.5 sm:py-2.5"
                  style={{
                    borderColor: active ? `${ACCENT}4D` : 'rgba(11,43,34,0.10)',
                    ['--tw-ring-color' as string]: `${ACCENT}80`,
                  }}
                >
                  {active ? (
                    <motion.span
                      layoutId="proyek-insight-tab-active-bg"
                      className="absolute inset-0 rounded-[11px]"
                      style={{ backgroundColor: `${ACCENT}14` }}
                      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    />
                  ) : (
                    <span className="absolute inset-0 rounded-[11px] bg-transparent transition-colors duration-[180ms] group-hover:bg-pine-ink/[0.04]" />
                  )}

                  {Icon ? (
                    <Icon
                      className="relative hidden h-[18px] w-[18px] shrink-0 transition-colors duration-[180ms] sm:block"
                      style={{ color: active ? ACCENT : 'rgba(11,43,34,0.55)' }}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  ) : null}

                  <span
                    className={`relative leading-tight tracking-[0.005em] transition-colors duration-[180ms] sm:whitespace-nowrap ${
                      active ? 'text-[13px] font-semibold sm:text-[14px]' : 'text-[13px] font-medium sm:text-[14px]'
                    }`}
                    style={{ color: active ? ACCENT : '#0B2B22' }}
                  >
                    {route.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
