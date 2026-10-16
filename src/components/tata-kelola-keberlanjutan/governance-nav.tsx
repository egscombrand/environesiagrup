'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const GOVERNANCE_TABS = [
  { slug: 'tata-kelola', label: 'Tata Kelola' },
  { slug: 'kode-etik', label: 'Kode Etik' },
  { slug: 'kebijakan', label: 'Kebijakan & Kepatuhan' },
  { slug: 'manajemen-risiko', label: 'Manajemen Risiko' },
  { slug: 'nilai-budaya', label: 'Nilai & Budaya' },
  { slug: 'keberlanjutan', label: 'Keberlanjutan' },
  { slug: 'dampak', label: 'Inisiatif & Dampak' },
] as const;

const PARENT = 'tata-kelola-keberlanjutan';

/**
 * Section 3 of every Tata Kelola & Keberlanjutan page: a compact way to jump
 * directly between routes. Section 2 (GovernanceOverview) already carries the
 * heading, the description, and the context for all seven areas, so this section
 * carries none of that itself — just the boxed tab group — to avoid repeating it.
 *
 * The background spans the full viewport width; the boxed group inside is capped
 * and centered. Each tab is a real link to its own route, and the active tab is
 * read from the URL. On mobile the group keeps 16px margins and scrolls sideways
 * inside itself, so the page never scrolls horizontally.
 */
export function GovernanceNav({ locale }: { locale: string }) {
  const pathname = (usePathname() ?? '').replace(/\/$/, '');
  const base = `/${locale}/${PARENT}`;

  const activeSlug =
    pathname === base
      ? 'tata-kelola'
      : GOVERNANCE_TABS.find((tab) => pathname === `${base}/${tab.slug}`)?.slug;

  return (
    <section className="gov-nav-root w-full border-b border-[#E5E7EB] bg-white px-4 py-6 font-landing-body md:px-8 md:py-7">
      <nav aria-label="Tata Kelola dan Keberlanjutan" className="gov-nav-box mx-auto flex max-w-[1200px] justify-center">
        <div className="max-w-full overflow-x-auto rounded-[16px] border border-[#E5E7EB] bg-[#F6F8F7] p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex w-max items-center gap-1 md:w-auto md:flex-wrap md:justify-center">
            {GOVERNANCE_TABS.map((tab) => {
              const active = tab.slug === activeSlug;
              return (
                <li key={tab.slug} className="shrink-0">
                  <Link
                    href={`${base}/${tab.slug}`}
                    aria-current={active ? 'page' : undefined}
                    className={`governance-tab inline-flex min-h-[44px] items-center whitespace-nowrap rounded-[11px] px-3.5 py-2.5 text-[14px] outline-none transition-colors duration-250 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A7793] md:px-4 ${
                      active
                        ? 'bg-[#2A7793] font-semibold text-white shadow-[0_1px_2px_rgba(11,43,34,0.12)]'
                        : 'font-medium text-[#555555] hover:bg-white hover:text-[#2A7793]'
                    }`}
                  >
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </section>
  );
}
