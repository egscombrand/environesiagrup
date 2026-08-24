import Link from 'next/link';

const FOOTER_LINKS = [
  { label: 'Entitas', href: '/entitas' },
  { label: 'Proyek', href: '/proyek' },
  { label: 'Berita', href: '/berita' },
  { label: 'Karier', href: '/karier' },
  { label: 'Unduhan', href: '/unduhan' },
  { label: 'Kontak', href: '/kontak' },
] as const;

export function Footer({ locale }: { locale: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-stone">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-h3 font-semibold text-forest">Environesia Group</p>
            <p className="mt-3 font-mono text-label uppercase text-slate">Grha Environesia (Lantai 2)</p>
            <address className="mt-1 text-small not-italic text-slate">
              Jl. Jati Mataram No. 284B, Karangjati
              <br />
              Sinduadi, Mlati, Sleman
              <br />
              Daerah Istimewa Yogyakarta 55284
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
