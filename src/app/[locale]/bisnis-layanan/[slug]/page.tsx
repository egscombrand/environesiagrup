import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedEntityBySlug } from '@/lib/cms/entities';
import { getPublishedNavigationItemByUrl, getPublishedNavigationUrlsBySlug } from '@/lib/cms/navigation';
import { buildMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { messagesFor } from '@/i18n/messages';

// The same entity detail content as /entitas/{slug}, at the URL the site's
// navigation (header) links to — /bisnis-layanan/{slug}. Which entity a
// given URL means is never hardcoded here: this page reads the published
// navigation item whose `url` is this exact path, and that item's own
// `slug` field (set by an admin in WP-Admin → Navigation) is the entity's
// `slug` to look up. If an admin repoints the item's URL, or changes which
// entity its Slug field names, this page follows without a code change.
async function resolveEntity(slug: string) {
  const navItem = await getPublishedNavigationItemByUrl(`/bisnis-layanan/${slug}`);
  if (!navItem?.slug) return null;
  return getPublishedEntityBySlug(navItem.slug);
}

export async function generateStaticParams() {
  const urlsBySlug = await getPublishedNavigationUrlsBySlug('header');
  const routeSlugs = Object.values(urlsBySlug)
    .filter((url) => url.startsWith('/bisnis-layanan/'))
    .map((url) => url.replace('/bisnis-layanan/', ''))
    .filter(Boolean);

  return routing.locales.flatMap((locale) => routeSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const entity = await resolveEntity(slug);

  if (!entity) {
    return buildMetadata({
      title: 'Halaman tidak ditemukan',
      description: 'Halaman bisnis & layanan yang Anda cari tidak tersedia.',
      locale,
      path: `/bisnis-layanan/${slug}`,
    });
  }

  return buildMetadata({
    title: entity.name,
    description: entity.short_description ?? undefined,
    locale,
    path: `/bisnis-layanan/${slug}`,
  });
}

export default async function BusinessLayananDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = messagesFor(locale);
  const entity = await resolveEntity(slug);

  if (!entity) {
    notFound();
  }

  return (
    <>
      <Section>
        <Reveal>
          <Link
            href={`/${locale}/entitas`}
            className="font-mono text-label uppercase text-slate hover:text-forest"
          >
            ← {t.entitas.kembali}
          </Link>
          {entity.logoUrl ? (
            // The logo carries the entity name, so it becomes the visible heading.
            // `alt` supplies the h1's accessible text, keeping the document outline
            // intact for screen readers and crawlers.
            <h1 className="mt-6">
              <Image
                src={entity.logoUrl}
                alt={entity.name}
                width={640}
                height={200}
                priority
                className="h-16 w-auto object-contain md:h-20"
              />
            </h1>
          ) : (
            <h1 className="mt-6 font-display text-display text-ink">{entity.name}</h1>
          )}
          <div
            className="mt-5 h-[3px] w-24 rounded-full"
            style={{ backgroundColor: entity.accent_color ?? undefined }}
            aria-hidden="true"
          />
          <p className="mt-6 max-w-2xl text-body text-slate">{entity.short_description}</p>
          {entity.website ? (
            <p className="mt-4">
              <a
                href={`https://${entity.website}`}
                className="font-mono text-label uppercase text-forest underline underline-offset-4"
                rel="noreferrer"
                target="_blank"
              >
                {entity.website}
              </a>
            </p>
          ) : null}
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-h3 text-ink">{t.common.layanan}</h2>
              {entity.services.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {entity.services.map((layanan) => (
                    <li key={layanan} className="border-b border-line pb-2 text-small text-slate">
                      {layanan}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-small text-slate">{t.common.layananPending}</p>
              )}
            </div>

            <div>
              <h2 className="font-display text-h3 text-ink">{t.entitas.legalitas}</h2>
              {entity.legalitas.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {entity.legalitas.map((item) => (
                    <li key={item} className="border-b border-line pb-2 text-small text-slate">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-small text-slate">{t.entitas.legalitasPending}</p>
              )}
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
