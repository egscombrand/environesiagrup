import Image from 'next/image';
import { BrandTagline } from '@/components/layout/brand-tagline';
import Link from 'next/link';
import { OFFICE_ADDRESS_LINES, OFFICE_BUILDING } from '@/lib/site';

export const FOOTER_LINKS = [
  { label: 'Entitas', href: '/entitas' },
  { label: 'Proyek', href: '/proyek' },
  { label: 'Berita', href: '/berita' },
  { label: 'Karier', href: '/karier' },
  { label: 'Unduhan', href: '/unduhan' },
  { label: 'Kontak', href: '/kontak' },
  { label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
] as const;

export function Footer({ locale }: { locale: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-stone">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Image
              src="/brand/environesia-group.png"
              alt="Environesia Company Group"
              width={191}
              height={40}
              className="h-10 w-auto"
            />
            <BrandTagline className="mt-2 text-small text-slate" />
            <p className="mt-3 font-mono text-label uppercase text-slate">{OFFICE_BUILDING}</p>
            <address className="mt-1 text-small not-italic text-slate">
              {OFFICE_ADDRESS_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>
          <nav aria-label="Navigasi footer">
            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={`/${locale}${item.href}`} className="text-small text-ink hover:text-forest">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-12 font-mono text-label uppercase text-slate">
          © {year} Environesia Company Group
        </p>
      </div>
    </footer>
  );
}
