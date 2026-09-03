import Image from 'next/image';
import Link from 'next/link';
import { BrandTagline } from '@/components/layout/brand-tagline';
import { getPublishedNavigation, navigationLabel } from '@/lib/cms/navigation';
import { getSiteSettings } from '@/lib/cms/settings';
import { getPublishedEntities } from '@/lib/cms/entities';
import { messagesFor } from '@/i18n/messages';

export async function Footer({ locale }: { locale: string }) {
  const [footerItems, settings, entities] = await Promise.all([
    getPublishedNavigation('footer'),
    getSiteSettings(),
    getPublishedEntities(),
  ]);
  const t = messagesFor(locale);
  const year = new Date().getFullYear();

  const socials: { label: string; url: string }[] = [
    { label: 'Instagram', url: settings.social_instagram ?? '' },
    { label: 'LinkedIn', url: settings.social_linkedin ?? '' },
    { label: 'Facebook', url: settings.social_facebook ?? '' },
    { label: 'YouTube', url: settings.social_youtube ?? '' },
    { label: 'TikTok', url: settings.social_tiktok ?? '' },
    { label: 'X', url: settings.social_twitter ?? '' },
  ].filter((social) => social.url);

  const whatsappUrl = settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` : null;

  return (
    <footer className="bg-pine-ink">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-12 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src={settings.logoUrl ?? '/brand/environesia-group.png'}
              alt={settings.site_name}
              width={191}
              height={40}
              className="h-10 w-auto"
            />
            <BrandTagline className="mt-2 font-landing-body text-small text-canvas/60" />
            {settings.address ? (
              <address className="mt-3 font-landing-body text-small not-italic text-canvas/60">
                {settings.address.split('\n').map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            ) : null}
            {socials.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-label uppercase text-canvas/60">
                {socials.map((social) => (
                  <a key={social.label} href={social.url} target="_blank" rel="noreferrer" className="hover:text-emerald-pulse">
                    {social.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <nav aria-label={t.nav.footer}>
            <p className="font-mono text-label uppercase text-canvas/50">{t.beranda.footerLinksTitle}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {footerItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.url.startsWith('http') ? item.url : `/${locale}${item.url}`}
                    target={item.open_new_tab ? '_blank' : undefined}
                    rel={item.open_new_tab ? 'noreferrer' : undefined}
                    className="font-landing-body text-small text-canvas/85 hover:text-emerald-pulse"
                  >
                    {navigationLabel(item, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-label uppercase text-canvas/50">{t.beranda.footerEntitasTitle}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {entities.map((entity) => (
                <li key={entity.slug}>
                  <Link
                    href={`/${locale}/entitas/${entity.slug}`}
                    className="flex items-center gap-2 font-landing-body text-small text-canvas/85 hover:text-emerald-pulse"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: entity.accent_color ?? undefined }}
                      aria-hidden="true"
                    />
                    {entity.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-label uppercase text-canvas/50">{t.beranda.footerContactTitle}</p>
            <ul className="mt-3 flex flex-col gap-2 font-landing-body text-small text-canvas/85">
              {settings.email ? (
                <li>
                  <a href={`mailto:${settings.email}`} className="hover:text-emerald-pulse">
                    {settings.email}
                  </a>
                </li>
              ) : null}
              {settings.phone ? (
                <li>
                  <a href={`tel:${settings.phone}`} className="hover:text-emerald-pulse">
                    {settings.phone}
                  </a>
                </li>
              ) : null}
              {whatsappUrl ? (
                <li>
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-emerald-pulse">
                    WhatsApp
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-canvas/10 pt-6 font-mono text-label uppercase text-canvas/50">
          {settings.footer_copyright || `© ${year} ${settings.site_name}`}
        </p>
      </div>
    </footer>
  );
}
