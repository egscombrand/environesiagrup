import Image from 'next/image';
import Link from 'next/link';
import { getPublishedNavigation } from '@/lib/cms/navigation';
import { getSiteSettings } from '@/lib/cms/settings';
import { messagesFor } from '@/i18n/messages';
import { LanguageSwitcher } from './language-switcher';
import { HeaderShell } from './header-shell';
import { NavItem } from './nav-item';
import { MobileNav } from './header-mobile-nav';

export async function Header({ locale }: { locale: string }) {
  const [navItems, settings] = await Promise.all([
    getPublishedNavigation('header'),
    getSiteSettings(),
  ]);
  const t = messagesFor(locale);

  return (
    <HeaderShell>
      {/* Deliberately no max-w cap — the header spans the full viewport
          width (padding only) rather than sitting in the same ~1280px
          boxed container the page sections use, so it reads as one wide,
          airy bar rather than a cramped box floating in the middle of a
          much wider page. */}
      <div className="flex items-center justify-between px-8 py-4 md:px-12 lg:px-16">
        <Link href={`/${locale}`} aria-label={t.nav.beranda} className="flex">
          <Image
            src={settings.logoUrl ?? '/brand/environesia-group.png'}
            alt={settings.site_name}
            width={172}
            height={36}
            priority
            // Same real mark, recolored pure white and given a soft dark
            // drop-shadow — the header itself has no background at all,
            // so the logo needs to carry its own contrast to stay legible
            // over whatever happens to be behind it (photo, plain light
            // page, anything). group-data-[overlay] is the header's own
            // existing convention for that state (see NavItem below), so
            // this is a color/shadow transform, never a second asset.
            className="h-8 w-auto transition-[filter] duration-300 group-data-[overlay]/hdr:brightness-0 group-data-[overlay]/hdr:invert group-data-[overlay]/hdr:drop-shadow-[0_1px_5px_rgba(0,0,0,0.7)] motion-reduce:transition-none md:h-9"
          />
        </Link>
        <div className="hidden items-center gap-10 md:flex">
          <nav className="flex items-center gap-9" aria-label={t.nav.utama}>
            {navItems.map((item) => (
              <NavItem key={item.id} item={item} locale={locale} />
            ))}
          </nav>
          <LanguageSwitcher locale={locale} />
        </div>
        <MobileNav locale={locale} items={navItems} />
      </div>
    </HeaderShell>
  );
}
