import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { BrandTagline } from '@/components/layout/brand-tagline';
import { getPublishedNavigation } from '@/lib/cms/navigation';
import { getSiteSettings } from '@/lib/cms/settings';
import { messagesFor } from '@/i18n/messages';
import { LanguageSwitcher } from './language-switcher';
import { MobileNav } from './header-mobile-nav';

export async function Header({ locale }: { locale: string }) {
  const [navItems, settings, requestHeaders] = await Promise.all([
    getPublishedNavigation('header'),
    getSiteSettings(),
    headers(),
  ]);
  const t = messagesFor(locale);
  const pathname = requestHeaders.get('x-pathname') ?? `/${locale}`;

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
        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-8" aria-label={t.nav.utama}>
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
          <LanguageSwitcher locale={locale} pathname={pathname} />
        </div>
        <MobileNav locale={locale} items={navItems} />
      </div>
    </header>
  );
}
