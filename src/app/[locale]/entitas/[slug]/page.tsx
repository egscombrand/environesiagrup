import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedEntities, getPublishedEntityBySlug } from '@/lib/cms/entities';
import { buildMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { messagesFor } from '@/i18n/messages';

export async function generateStaticParams() {
  const entities = await getPublishedEntities();
  return routing.locales.flatMap((locale) =>
    entities.map((entity) => ({ locale, slug: entity.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const entity = await getPublishedEntityBySlug(slug);

  if (!entity) {
    return buildMetadata({
      title: 'Entitas tidak ditemukan',
      description: 'Halaman entitas yang Anda cari tidak tersedia.',
      locale,
      path: `/entitas/${slug}`,
    });
  }

  return buildMetadata({
    title: entity.name,
    description: entity.short_description ?? undefined,
    locale,
    path: `/entitas/${entity.slug}`,
  });
}

export default async function EntityDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = messagesFor(locale);
  const entity = await getPublishedEntityBySlug(slug);

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
