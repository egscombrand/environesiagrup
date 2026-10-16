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
      {/* Deliberately WIDER than the ~1280px box the page sections use
          (Section in layout/section.tsx) — the header gets its own, more
          generous container so logo and language switcher sit well apart
          from the centered menu instead of crowding it. `gap-10` is the
          breathing room between each column (logo↔nav, nav↔actions);
          `px-8`/`md:px-12` keeps logo and language switcher a little
          inset from the bar's own edges, never flush against them.
          `py-5` is unchanged vertical breathing room from the previous
          pass.

          A 3-column grid (logo / nav / actions), not flex+justify-between:
          with the two edge columns both `1fr`, the middle (nav) column is
          genuinely centered in the bar regardless of how wide the logo or
          the language switcher + mobile toggle happen to be — flex could
          only ever pin the nav to "whatever's left after the logo", which
          reads as off-center and unbalanced once the two sides differ in
          width. On mobile the nav column is empty (hidden below md), so
          this quietly degrades to the same "logo left, toggle right"
          two-cell layout as before. */}
      <div className="mx-auto grid max-w-[1480px] grid-cols-[1fr_auto_1fr] items-center gap-10 px-8 py-5 md:px-12">
        <Link href={`/${locale}`} aria-label={t.nav.beranda} className="flex md:justify-self-start">
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

        <nav className="hidden items-center gap-6 md:flex" aria-label={t.nav.utama}>
          {navItems.map((item) => (
            <NavItem key={item.id} item={item} locale={locale} />
          ))}
        </nav>

        <div className="flex items-center justify-end gap-4 md:justify-self-end">
          <div className="hidden md:block">
            <LanguageSwitcher locale={locale} />
          </div>
          <MobileNav locale={locale} items={navItems} />
        </div>
      </div>
    </HeaderShell>
  );
}
