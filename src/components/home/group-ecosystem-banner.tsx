import Image from 'next/image';
import Link from 'next/link';
import { getPublishedNavigationUrlsBySlug } from '@/lib/cms/navigation';
import { Reveal } from '@/components/motion/reveal';
import { messagesFor } from '@/i18n/messages';

// A navigation item's `url` is never locale-prefixed in the database (same
// convention used wherever else this codebase turns one into a Link href).
function localeHref(url: string, locale: string) {
  return url.startsWith('http') ? url : `/${locale}${url === '/' ? '' : url}`;
}

/**
 * A compact corporate brand-statement banner directly under the
 * capabilities grid — deliberately not a second "about" section: one
 * headline, one short sentence, two CTAs, over a full-bleed photo. Not
 * built on the shared <Section> wrapper, since every other homepage section
 * wants its content pre-contained in a max-width column, but this one needs
 * its background photo to bleed edge-to-edge while only the text sits
 * inside that column. No card/box behind the text — contrast against the
 * photo comes from a soft text-shadow plus a light overlay wash instead, so
 * the photo itself always stays fully visible.
 */
export async function GroupEcosystemBanner({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);
  const urlsBySlug = await getPublishedNavigationUrlsBySlug('header');
  const environesiaUrl = urlsBySlug['environesia'];

  return (
    <section className="relative w-full overflow-hidden bg-pine-ink">
      <div className="relative min-h-[440px] w-full md:min-h-[520px]">
        <Image
          src="/BannerS2.jpg"
          alt="Gedung kantor Environesia dengan langit cerah — merepresentasikan ekosistem bisnis Environesia Group"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
        />
        {/* A very subtle, even wash for text contrast — the building on the
            left stays fully visible as the banner's main visual; the
            content box (right) carries most of the contrast work itself. */}
        <div className="absolute inset-0 bg-[rgba(11,43,34,0.15)]" />

        <div className="relative flex min-h-[440px] items-center md:min-h-[520px]">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-12">
            <Reveal className="ml-auto w-full max-w-xl text-left">
              <div className="p-6 md:p-8">
                <p
                  className="font-mono text-label uppercase tracking-[0.14em] text-canvas/80"
                  style={{ textShadow: '0 1px 6px rgba(0,0,0,0.55)' }}
                >
                  {title ?? t.beranda.groupEcosystemEyebrow}
                </p>
                <h2
                  className="mt-3 font-landing-display text-display font-bold text-canvas"
                  style={{ textShadow: '0 2px 14px rgba(0,0,0,0.55)' }}
                >
                  {t.beranda.groupEcosystemHeadline}
                </h2>
                <p
                  className="mt-4 font-landing-body text-body leading-relaxed text-canvas/90"
                  style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
                >
                  {t.beranda.groupEcosystemTagline}
                </p>
                <div className="mt-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center">
                  {environesiaUrl ? (
                    <Link
                      href={localeHref(environesiaUrl, locale)}
                      className="inline-flex items-center justify-center rounded-[14px] bg-[#0DA19D] px-6 py-3 text-small font-medium text-white transition-colors hover:bg-[#0B8985]"
                    >
                      {t.beranda.groupEcosystemPrimaryCta}
                    </Link>
                  ) : null}
                  <Link
                    href={`/${locale}/pimpinan`}
                    className="inline-flex items-center justify-center rounded-[14px] border border-canvas/50 px-6 py-3 text-small font-medium text-canvas hover:bg-canvas/10"
                  >
                    {t.beranda.groupEcosystemSecondaryCta}
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
