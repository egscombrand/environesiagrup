import Image from 'next/image';
import Link from 'next/link';
import { getPublishedNavigation, navigationLabel } from '@/lib/cms/navigation';
import { getSiteSettings } from '@/lib/cms/settings';
import { messagesFor } from '@/i18n/messages';

// Sampled directly (pixel-measured) from the approved reference comp for
// this footer — same one-off-color convention already used for
// capabilities-grid's heading and the leadership-message section.
const BG = '#2E7692';
const BG_DARK = '#255D6E';

function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path
        d="M4.5 3h2.7l1.2 3.4-1.8 1.4a9.5 9.5 0 0 0 4.6 4.6l1.4-1.8 3.4 1.2v2.7c0 .8-.7 1.5-1.5 1.4C8.9 15.4 4.6 11.1 3.1 5.5 3 4.7 3.7 4 4.5 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
      <rect x="3" y="4.5" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.5 5.5 10 10.5l6.5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function href(url: string, locale: string) {
  return url.startsWith('http') ? url : `/${locale}${url}`;
}

export async function Footer({ locale }: { locale: string }) {
  const [footerItems, settings] = await Promise.all([
    getPublishedNavigation('footer'),
    getSiteSettings(),
  ]);
  const t = messagesFor(locale);
  const year = new Date().getFullYear();

  // The 3 real link columns: the top-level footer nav items that actually
  // have children, in their configured order — the same real navigation
  // tree the header's mega-menu uses, just grouped by parent instead of
  // flattened into one list.
  const groups = footerItems.filter((item) => item.children.length > 0).slice(0, 3);
  const addressLines = settings.address ? settings.address.split('\n').filter(Boolean) : [];

  return (
    <footer style={{ backgroundColor: BG }}>
      <div className="mx-auto max-w-[1480px] px-8 py-14 md:px-12 lg:px-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div>
            <Image
              src={settings.logoUrl ?? '/brand/environesia-group.png'}
              alt={settings.site_name}
              width={191}
              height={40}
              // The footer background is always this dark teal, never a
              // light page, so — unlike the header's overlay-conditional
              // version — the logo is unconditionally recolored white here.
              className="h-9 w-auto brightness-0 invert"
            />

            {addressLines.length > 0 ? (
              <address className="mt-6 font-landing-body text-[15px] leading-relaxed not-italic text-white/85">
                <span className="block font-semibold text-white">{addressLines[0]}</span>
                {addressLines.slice(1).map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            ) : null}

            <div className="mt-5 flex flex-col gap-3">
              {settings.phone ? (
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2.5 font-landing-body text-[15px] text-white/85 hover:text-white"
                >
                  <PhoneIcon />
                  {settings.phone}
                </a>
              ) : null}
              {settings.email ? (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2.5 font-landing-body text-[15px] text-white/85 hover:text-white"
                >
                  <MailIcon />
                  {settings.email}
                </a>
              ) : null}
            </div>
          </div>

          {groups.map((group) => (
            <nav key={group.id} aria-label={navigationLabel(group, locale)}>
              <Link
                href={href(group.url, locale)}
                target={group.open_new_tab ? '_blank' : undefined}
                rel={group.open_new_tab ? 'noreferrer' : undefined}
                className="font-landing-display text-[18px] font-bold text-white hover:text-white/80"
              >
                {navigationLabel(group, locale)}
              </Link>
              <ul className="mt-5 flex flex-col gap-3">
                {group.children.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={href(child.url, locale)}
                      target={child.open_new_tab ? '_blank' : undefined}
                      rel={child.open_new_tab ? 'noreferrer' : undefined}
                      className="font-landing-body text-[15px] text-white/80 hover:text-white"
                    >
                      {navigationLabel(child, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: BG_DARK }}>
        <div className="mx-auto flex max-w-[1480px] flex-col gap-3 px-8 py-5 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
          <p className="font-landing-body text-[14px] text-white/70">
            {settings.footer_copyright || `© ${year} ${settings.site_name}. Seluruh hak cipta dilindungi.`}
          </p>
          <Link href={`/${locale}/kebijakan-privasi`} className="font-landing-body text-[14px] text-white/70 hover:text-white">
            {t.privasi.judul}
          </Link>
        </div>
      </div>
    </footer>
  );
}
