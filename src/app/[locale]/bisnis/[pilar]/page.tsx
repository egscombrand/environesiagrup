import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCollection } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { EntityCard } from '@/components/entitas/entity-card';
import type { PillarEntry, EntityEntry } from '@/lib/content-types';

function allPillars() {
  return getCollection<PillarEntry>('pillars').map((entry) => entry.data);
}

function findPillar(slug: string) {
  return allPillars().find((pillar) => pillar.slug === slug);
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    allPillars().map((pillar) => ({ locale, pilar: pillar.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pilar: string }>;
}): Promise<Metadata> {
  const { locale, pilar } = await params;
  const pillar = findPillar(pilar);

  if (!pillar) {
    return buildMetadata({
      title: 'Pilar tidak ditemukan',
      description: 'Halaman pilar yang Anda cari tidak tersedia.',
      locale,
      path: `/bisnis/${pilar}`,
    });
  }

  return buildMetadata({
    title: pillar.nama,
    description: pillar.deskripsi,
    locale,
    path: `/bisnis/${pillar.slug}`,
  });
}

export default async function PillarDetailPage({
  params,
}: {
  params: Promise<{ locale: string; pilar: string }>;
}) {
  const { locale, pilar } = await params;
  const pillar = findPillar(pilar);

  if (!pillar) {
    notFound();
  }

  const entities = getCollection<EntityEntry>('entities').map((entry) => entry.data);
  const related = pillar.entitasTerkait
    .map((slug) => entities.find((entity) => entity.slug === slug))
    .filter((entity): entity is EntityEntry => Boolean(entity));

  return (
    <>
      <Section>
        <Reveal>
          <Link
            href={`/${locale}/bisnis`}
            className="font-mono text-label uppercase text-slate hover:text-forest"
          >
            ← Semua pilar
          </Link>
          <p className="mt-6 font-mono text-label uppercase text-slate">
            {String(pillar.urutan).padStart(2, '0')}
          </p>
          <h1 className="mt-2 font-display text-display text-ink">{pillar.nama}</h1>
          <p className="mt-6 max-w-2xl text-body text-slate">{pillar.deskripsi}</p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-h3 text-ink">Layanan</h2>
              {pillar.layanan.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {pillar.layanan.map((layanan) => (
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
              <h2 className="font-display text-h3 text-ink">Dijalankan Oleh</h2>
              {related.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {related.map((entity) => (
                    <EntityCard key={entity.slug} entity={entity} locale={locale} />
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-small text-slate">Entitas terkait akan segera hadir.</p>
              )}
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
