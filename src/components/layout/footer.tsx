import Image from 'next/image';
import Link from 'next/link';
import { BrandTagline } from '@/components/layout/brand-tagline';
import { getPublishedNavigation } from '@/lib/cms/navigation';
import { getSiteSettings } from '@/lib/cms/settings';
import { messagesFor } from '@/i18n/messages';

export async function Footer({ locale }: { locale: string }) {
  const [footerItems, settings] = await Promise.all([
    getPublishedNavigation('footer'),
    getSiteSettings(),
  ]);
  const t = messagesFor(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-stone">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Image
              src={settings.logoUrl ?? '/brand/environesia-group.png'}
              alt={settings.site_name}
              width={191}
              height={40}
              className="h-10 w-auto"
            />
            <BrandTagline className="mt-2 text-small text-slate" />
            {settings.address ? (
              <address className="mt-3 text-small not-italic text-slate">
                {settings.address.split('\n').map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            ) : null}
          </div>
          <nav aria-label={t.nav.footer}>
            <ul className="flex flex-col gap-2">
              {footerItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.url.startsWith('http') ? item.url : `/${locale}${item.url}`}
                    target={item.open_new_tab ? '_blank' : undefined}
                    rel={item.open_new_tab ? 'noreferrer' : undefined}
                    className="text-small text-ink hover:text-forest"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-12 font-mono text-label uppercase text-slate">
          {settings.footer_copyright || `© ${year} ${settings.site_name}`}
        </p>
      </div>
    </footer>
  );
}
