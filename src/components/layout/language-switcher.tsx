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
    <nav aria-label={t.nav.pilihBahasa} className="flex items-center gap-2">
      {routing.locales.map((candidate) => (
        <Link
          key={candidate}
          href={`/${candidate}${rest}`}
          aria-current={candidate === locale ? 'true' : undefined}
          className={
            candidate === locale
              ? 'inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-1 font-mono text-label uppercase text-forest transition-colors group-data-[overlay]/hdr:text-paper motion-reduce:transition-none'
              : 'inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-1 font-mono text-label uppercase text-slate transition-colors hover:text-forest group-data-[overlay]/hdr:text-paper/60 group-data-[overlay]/hdr:hover:text-paper motion-reduce:transition-none'
          }
        >
          {LABELS[candidate] ?? candidate}
        </Link>
      ))}
    </nav>
  );
}
