'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { NavigationNode } from '@/lib/cms/navigation';

export function MobileNav({ locale, items }: { locale: string; items: readonly NavigationNode[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        className="p-2 text-small text-ink"
      >
        {open ? 'Tutup' : 'Menu'}
      </button>
      {open ? (
        <nav
          id="mobile-nav-menu"
          aria-label="Navigasi mobile"
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
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
