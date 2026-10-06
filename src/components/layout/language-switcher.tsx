'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { messagesFor } from '@/i18n/messages';

const LABELS: Record<string, string> = { id: 'ID', en: 'EN', zh: '中文' };

// Reads the current path from usePathname() rather than a server-only
// Dynamic API (headers()), so this stays a client-rendered leaf that does
// not force the rest of the page out of static generation. One test-file
// mock is a much smaller cost than losing static rendering site-wide.
export function LanguageSwitcher({ locale }: { locale: string }) {
  const t = messagesFor(locale);
  const pathname = usePathname() ?? `/${locale}`;

  // strip the leading locale segment and any trailing slash;
  // '/id/entitas' -> '/entitas', '/id' -> '', '/id/' -> ''
  const rest = pathname.replace(/^\/[^/]+/, '').replace(/\/$/, '');

  return (
    <nav
      aria-label={t.nav.pilihBahasa}
      className="flex items-center gap-1 rounded-full border border-pine-ink/10 p-1 group-data-[overlay]/hdr:border-canvas/40 group-data-[overlay]/hdr:drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)]"
    >
      {routing.locales.map((candidate) => (
        <Link
          key={candidate}
          href={`/${candidate}${rest}`}
          aria-current={candidate === locale ? 'true' : undefined}
          className={
            candidate === locale
              ? 'rounded-full bg-emerald-pulse px-3 py-1 font-mono text-label uppercase text-white transition-colors motion-reduce:transition-none'
              : 'rounded-full px-3 py-1 font-mono text-label uppercase text-pine-ink/60 transition-colors hover:text-pine-ink group-data-[overlay]/hdr:text-canvas/70 group-data-[overlay]/hdr:hover:text-canvas group-data-[overlay]/hdr:[text-shadow:0_1px_2px_rgba(0,0,0,0.85),0_1px_6px_rgba(0,0,0,0.45)] motion-reduce:transition-none'
          }
        >
          {LABELS[candidate] ?? candidate}
        </Link>
      ))}
    </nav>
  );
}
