import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedPillars, getPublishedPillarBySlug } from '@/lib/cms/pillars';
import { getPublishedEntities } from '@/lib/cms/entities';
import { buildMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { EntityCard } from '@/components/entitas/entity-card';

export async function generateStaticParams() {
  const pillars = await getPublishedPillars();
  return routing.locales.flatMap((locale) =>
    pillars.map((pillar) => ({ locale, pilar: pillar.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pilar: string }>;
}): Promise<Metadata> {
  const { locale, pilar } = await params;
  const pillar = await getPublishedPillarBySlug(pilar);

  if (!pillar) {
    return buildMetadata({
      title: 'Pilar tidak ditemukan',
      description: 'Halaman pilar yang Anda cari tidak tersedia.',
      locale,
      path: `/bisnis/${pilar}`,
    });
  }

  return buildMetadata({
    title: pillar.name,
    description: pillar.short_description ?? undefined,
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
  const pillar = await getPublishedPillarBySlug(pilar);

  if (!pillar) {
    notFound();
  }

  const entities = await getPublishedEntities();
  const related = entities.filter((entity) => pillar.relatedEntityIds.includes(entity.id));

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
            {String(pillar.sort_order).padStart(2, '0')}
          </p>
          <h1 className="mt-2 font-display text-display text-ink">{pillar.name}</h1>
          <p className="mt-6 max-w-2xl text-body text-slate">{pillar.short_description}</p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-h3 text-ink">Layanan</h2>
              {pillar.services.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {pillar.services.map((layanan) => (
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
