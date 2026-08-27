'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { NavigationNode } from '@/lib/cms/navigation';
import { navigationLabel } from '@/lib/cms/navigation-label';
import { messagesFor } from '@/i18n/messages';
import { LanguageSwitcher } from './language-switcher';

export function MobileNav({ locale, items }: { locale: string; items: readonly NavigationNode[] }) {
  const [open, setOpen] = useState(false);
  const t = messagesFor(locale);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        className="p-2 text-small text-ink"
      >
        {open ? t.nav.tutup : t.nav.menu}
      </button>
      {open ? (
        <nav
          id="mobile-nav-menu"
          aria-label={t.nav.mobile}
          className="absolute inset-x-0 top-full border-b border-line bg-paper px-6 py-4"
        >
          <ul className="flex flex-col gap-4">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.url.startsWith('http') ? item.url : `/${locale}${item.url === '/' ? '' : item.url}`}
                  target={item.open_new_tab ? '_blank' : undefined}
                  rel={item.open_new_tab ? 'noreferrer' : undefined}
                  className="text-small text-ink hover:text-forest"
                  onClick={() => setOpen(false)}
                >
                  {navigationLabel(item, locale)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-line pt-4">
            <LanguageSwitcher locale={locale} />
          </div>
        </nav>
      ) : null}
    </div>
  );
}
