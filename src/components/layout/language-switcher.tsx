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
              ? 'font-mono text-label uppercase text-forest'
              : 'font-mono text-label uppercase text-slate hover:text-forest'
          }
        >
          {LABELS[candidate] ?? candidate}
        </Link>
      ))}
    </nav>
  );
}
