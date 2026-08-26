import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCollection } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import type { EntityEntry } from '@/lib/content-types';

function allEntities() {
  return getCollection<EntityEntry>('entities').map((entry) => entry.data);
}

function findEntity(slug: string) {
  return allEntities().find((entity) => entity.slug === slug);
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    allEntities().map((entity) => ({ locale, slug: entity.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const entity = findEntity(slug);

  if (!entity) {
    return buildMetadata({
      title: 'Entitas tidak ditemukan',
      description: 'Halaman entitas yang Anda cari tidak tersedia.',
      locale,
      path: `/entitas/${slug}`,
    });
  }

  return buildMetadata({
    title: entity.nama,
    description: entity.deskripsi,
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
  const entity = findEntity(slug);

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
            ← Semua entitas
          </Link>
          {entity.logo ? (
            // The logo carries the entity name, so it becomes the visible heading.
            // `alt` supplies the h1's accessible text, keeping the document outline
            // intact for screen readers and crawlers.
            <h1 className="mt-6">
              <Image
                src={entity.logo}
                alt={entity.nama}
                width={640}
                height={200}
                priority
                className="h-16 w-auto object-contain md:h-20"
              />
            </h1>
          ) : (
            <h1 className="mt-6 font-display text-display text-ink">{entity.nama}</h1>
          )}
          <div
            className="mt-5 h-[3px] w-24 rounded-full"
            style={{ backgroundColor: entity.warnaAksen }}
            aria-hidden="true"
          />
          <p className="mt-6 max-w-2xl text-body text-slate">{entity.deskripsi}</p>
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
              <h2 className="font-display text-h3 text-ink">Layanan</h2>
              {entity.layanan.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {entity.layanan.map((layanan) => (
                    <li key={layanan} className="border-b border-line pb-2 text-small text-slate">
                      {layanan}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-small text-slate">Rincian layanan akan segera hadir.</p>
              )}
            </div>

            <div>
              <h2 className="font-display text-h3 text-ink">Legalitas & Akreditasi</h2>
              {entity.legalitas.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {entity.legalitas.map((item) => (
                    <li key={item} className="border-b border-line pb-2 text-small text-slate">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-small text-slate">Data legalitas akan segera hadir.</p>
              )}
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
