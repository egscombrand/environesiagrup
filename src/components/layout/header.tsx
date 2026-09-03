import Image from 'next/image';
import Link from 'next/link';
import { BrandTagline } from '@/components/layout/brand-tagline';
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
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 md:px-12">
        <div className="flex flex-col gap-1">
          <Link href={`/${locale}`} aria-label={t.nav.beranda} className="flex">
            <Image
              src={settings.logoUrl ?? '/brand/environesia-group.png'}
              alt={settings.site_name}
              width={172}
              height={36}
              priority
              className="h-8 w-auto md:h-9"
            />
          </Link>
          <BrandTagline className="font-landing-body text-[10px] leading-tight text-pine-ink/60 transition-colors group-data-[overlay]/hdr:text-canvas/80 md:text-[11px] motion-reduce:transition-none" />
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-10" aria-label={t.nav.utama}>
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
