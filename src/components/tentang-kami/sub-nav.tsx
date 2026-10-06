'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Award, BadgeCheck, History, Network, Target, Users, type LucideIcon } from 'lucide-react';
import { TENTANG_KAMI_ROUTES } from '@/lib/tentang-kami-routes';

const ACCENT = '#0DA19D';

// A small visual cue per tab, matched by slug — never in the shared
// TENTANG_KAMI_ROUTES data itself (that's plain data reused for metadata
// generation elsewhere, not something to couple to a React icon component).
const TAB_ICONS: Record<string, LucideIcon> = {
  sejarah: History,
  'visi-misi-tatanilai': Target,
  'struktur-organisasi': Network,
  direktur: Users,
  penghargaan: Award,
  legalitas: BadgeCheck,
};

/**
 * The single navigation rail for the Tentang Kami area — rendered in its
 * normal place in the page (after the Identitas Visual / Makna Logo
 * section, before the active tab's content), not pinned to the viewport
 * from the moment the page loads. `position: sticky` with `top` set to
 * the Global Header's real measured height: on load it sits wherever
 * that normal position puts it, and only locks in place, directly under
 * the fixed header, once the user has scrolled far enough that it would
 * otherwise pass beneath it.
 *
 * Boxed segmented style, not flat underline tabs: every tab is its own
 * thin-bordered rounded-rect at rest, the active one filled with a soft
 * accent tint that slides between tabs (a `layoutId`-animated background,
 * not a repositioned underline).
 *
 * No horizontal scrolling anywhere, by explicit requirement — all 6 tabs
 * must be visible at a glance:
 * - Mobile: a fixed 2-column grid (3 rows), each cell content-width
 *   flexible via wrapping, never truncated.
 * - Tablet: a wrapping flex row (naturally 2 rows at these widths),
 *   centered, no scroll container.
 * - Wide desktop (≥1400px, a custom breakpoint — not Tailwind's stock
 *   `lg`/`xl`): a single non-wrapping flex row sized to fit all 6
 *   natural-width tabs. This threshold isn't arbitrary: measured directly
 *   (real rendered widths, not estimated), 6 labels — one as long as
 *   "Direktur Utama & Dewan Direksi" — genuinely overflow their own row at
 *   1024–1366px even at tight padding, so anything narrower than ~1400px
 *   correctly gets the wrapping tablet layout instead of a forced,
 *   overflowing single row.
 */
export function TentangKamiSubNav({
  locale,
  activeSlug,
  onSelectTab,
}: {
  locale: string;
  activeSlug?: string;
  onSelectTab?: (slug: string) => void;
}) {
  const pathname = usePathname() ?? '';
  const shouldReduceMotion = useReducedMotion();
  const hubPath = `/${locale}/tentang-kami`;
  const onHub = pathname === hubPath || pathname === `${hubPath}/`;

  // Sane fallback (matching --header-h's base value) so the very first
  // paint — before the measurement effect below runs — sticks at
  // roughly the right offset instead of flashing at top:0.
  const [headerHeight, setHeaderHeight] = useState(84);

  // Track the header's real height so `top` always lands exactly at its
  // bottom edge, on any breakpoint, even if the header's own height ever
  // changes (logo size, padding, a future redesign).
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
    (TENTANG_KAMI_ROUTES.find((route) => {
      const href = `/${locale}/tentang-kami/${route.slug}`;
      return pathname === href || pathname === `${href}/`;
    })?.slug ?? (onHub ? 'sejarah' : 'sejarah'));

  return (
    <nav
      aria-label="Navigasi Tentang Kami"
      className="sticky z-[9990] w-full border-b border-pine-ink/10 bg-stone/50"
      style={{ top: headerHeight }}
    >
      {/* Wider than the site's standard 1280px content cap — 6 real tab
          labels genuinely need the extra room to fit one row without
          scrolling or shrinking text; the standard cap left too little
          space at ordinary desktop widths. */}
      <div className="mx-auto max-w-[1560px] px-4 py-2.5 md:px-8 md:py-3">
        <ul className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-2 min-[1400px]:flex-nowrap min-[1400px]:justify-center min-[1400px]:gap-2">
          {TENTANG_KAMI_ROUTES.map((route) => {
            const href = `/${locale}/tentang-kami/${route.slug}`;
            const active = currentActiveSlug === route.slug;
            const Icon = TAB_ICONS[route.slug];

            return (
              <li key={route.slug} className="relative min-[1400px]:shrink-0">
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  onClick={(e) => {
                    if (onSelectTab) {
                      e.preventDefault();
                      onSelectTab(route.slug);
                    }
                  }}
                  className="group relative flex h-full items-center gap-2 rounded-[11px] border px-2.5 py-2.5 transition-colors duration-[180ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:px-3.5 min-[1400px]:px-3.5"
                  style={{
                    borderColor: active ? `${ACCENT}4D` : 'rgba(11,43,34,0.10)',
                    ['--tw-ring-color' as string]: `${ACCENT}80`,
                  }}
                >
                  {/* Active fill — a layoutId-animated box that slides
                      between tabs, sitting behind the icon/label of
                      whichever tab is active. Inactive tabs get only a
                      plain hover tint (CSS, not this motion element), so
                      the sliding animation is reserved for genuine tab
                      changes. */}
                  {active ? (
                    <motion.span
                      layoutId="tentang-kami-tab-active-bg"
                      className="absolute inset-0 rounded-[11px]"
                      style={{ backgroundColor: `${ACCENT}14` }}
                      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    />
                  ) : (
                    <span className="absolute inset-0 rounded-[11px] bg-transparent transition-colors duration-[180ms] group-hover:bg-pine-ink/[0.04]" />
                  )}

                  {Icon ? (
                    <Icon
                      className="relative h-[18px] w-[18px] shrink-0 transition-colors duration-[180ms] min-[1400px]:h-5 min-[1400px]:w-5"
                      style={{ color: active ? ACCENT : 'rgba(11,43,34,0.55)' }}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  ) : null}

                  <span
                    className={`relative tracking-[0.005em] transition-colors duration-[180ms] min-[1400px]:whitespace-nowrap ${
                      active
                        ? 'text-[14px] font-semibold min-[1400px]:text-[15px]'
                        : 'text-[14px] font-medium min-[1400px]:text-[15px]'
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
