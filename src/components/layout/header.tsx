import Image from 'next/image';
import { BrandTagline } from '@/components/layout/brand-tagline';
import Link from 'next/link';
import { MobileNav } from './header-mobile-nav';

export const NAV_ITEMS = [
  { label: 'Beranda', href: '/' },
  { label: 'Entitas', href: '/entitas' },
  { label: 'Pimpinan', href: '/pimpinan' },
  { label: 'Bisnis', href: '/bisnis' },
  { label: 'Tentang Kami', href: '/tentang-kami' },
  { label: 'Proyek', href: '/proyek' },
  { label: 'Berita', href: '/berita' },
  { label: 'Karier', href: '/karier' },
  { label: 'Kontak', href: '/kontak' },
] as const;

export function Header({ locale }: { locale: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 md:px-12">
        <div className="flex flex-col gap-1">
          <Link href={`/${locale}`} className="flex">
            <Image
              src="/brand/environesia-group.png"
              alt="Environesia Company Group"
              width={172}
              height={36}
              priority
              className="h-8 w-auto md:h-9"
            />
          </Link>
          <BrandTagline className="text-[10px] leading-tight text-slate md:text-[11px]" />
        </div>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigasi utama">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href === '/' ? '' : item.href}`}
              className="text-small text-ink hover:text-forest"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <MobileNav locale={locale} items={NAV_ITEMS} />
      </div>
    </header>
  );
}
