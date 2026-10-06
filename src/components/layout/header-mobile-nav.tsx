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
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center p-2 font-landing-body text-small text-pine-ink transition-colors group-data-[overlay]/hdr:text-canvas group-data-[overlay]/hdr:[text-shadow:0_1px_2px_rgba(0,0,0,0.85),0_1px_6px_rgba(0,0,0,0.45)] motion-reduce:transition-none"
      >
        {open ? t.nav.tutup : t.nav.menu}
      </button>
      {open ? (
        <nav
          id="mobile-nav-menu"
          aria-label={t.nav.mobile}
          className="absolute inset-x-0 top-full border-b border-sage-mist bg-canvas px-6 py-4"
        >
          <ul className="flex flex-col gap-4">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.url.startsWith('http') ? item.url : `/${locale}${item.url === '/' ? '' : item.url}`}
                  target={item.open_new_tab ? '_blank' : undefined}
                  rel={item.open_new_tab ? 'noreferrer' : undefined}
                  className="font-landing-body text-small text-pine-ink hover:text-emerald-pulse"
                  onClick={() => setOpen(false)}
                >
                  {navigationLabel(item, locale)}
                </Link>

                {/* Children are shown inline rather than behind a second tap.
                    The mobile panel is already an expanded sheet, so hiding
                    them would add a step without saving space. */}
                {item.children.length > 0 ? (
                  <ul className="mt-2 flex flex-col gap-2 border-l border-sage-mist pl-4">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={
                            child.url.startsWith('http')
                              ? child.url
                              : `/${locale}${child.url === '/' ? '' : child.url}`
                          }
                          target={child.open_new_tab ? '_blank' : undefined}
                          rel={child.open_new_tab ? 'noreferrer' : undefined}
                          className="font-landing-body text-small text-pine-ink/60 hover:text-emerald-pulse"
                          onClick={() => setOpen(false)}
                        >
                          {navigationLabel(child, locale)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-sage-mist pt-4">
            <LanguageSwitcher locale={locale} />
          </div>
        </nav>
      ) : null}
    </div>
  );
}
