import Image from 'next/image';
import Link from 'next/link';
import { BrandTagline } from '@/components/layout/brand-tagline';
import { getPublishedNavigation } from '@/lib/cms/navigation';
import { getSiteSettings } from '@/lib/cms/settings';
import { MobileNav } from './header-mobile-nav';

export async function Header({ locale }: { locale: string }) {
  const [navItems, settings] = await Promise.all([
    getPublishedNavigation('header'),
    getSiteSettings(),
  ]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 md:px-12">
        <div className="flex flex-col gap-1">
          <Link href={`/${locale}`} className="flex">
            <Image
              src={settings.logoUrl ?? '/brand/environesia-group.png'}
              alt={settings.site_name}
              width={172}
              height={36}
              priority
              className="h-8 w-auto md:h-9"
            />
          </Link>
          <BrandTagline className="text-[10px] leading-tight text-slate md:text-[11px]" />
        </div>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigasi utama">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.url.startsWith('http') ? item.url : `/${locale}${item.url === '/' ? '' : item.url}`}
              target={item.open_new_tab ? '_blank' : undefined}
              rel={item.open_new_tab ? 'noreferrer' : undefined}
              className="text-small text-ink hover:text-forest"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <MobileNav locale={locale} items={navItems} />
      </div>
    </header>
  );
}
