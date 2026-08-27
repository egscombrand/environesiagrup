import Link from 'next/link';
import { routing } from '@/i18n/routing';
import { messagesFor } from '@/i18n/messages';

const LABELS: Record<string, string> = { id: 'ID', en: 'EN', zh: '中文' };

// Takes the pathname as a prop rather than reading a client hook, so this
// stays a Server Component and can be rendered directly in a test.
export function LanguageSwitcher({ locale, pathname }: { locale: string; pathname: string }) {
  const t = messagesFor(locale);

  // strip the leading locale segment; '/id/entitas' -> '/entitas', '/id' -> ''
  const rest = pathname.replace(/^\/[^/]+/, '');

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
