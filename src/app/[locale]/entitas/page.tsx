import type { Metadata } from 'next';
import Link from 'next/link';
import { getCollection } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { GroupStructureDiagram } from '@/components/entitas/group-structure-diagram';
import type { EntityEntry } from '@/lib/content-types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: 'Entitas Kami',
    description:
      'Empat entitas layanan lingkungan yang membentuk satu rantai terpadu, ditambah satu unit penunjang.',
    locale,
    path: '/entitas',
  });
}

export default async function EntitasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const entities = getCollection<EntityEntry>('entities')
    .map((entry) => entry.data)
    .sort((a, b) => a.urutan - b.urutan);

  const core = entities.filter((entity) => entity.lini === 'inti');
  const supporting = entities.filter((entity) => entity.lini === 'penunjang');

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">Struktur Grup</p>
          <h1 className="mt-4 font-display text-display text-ink">Entitas Kami</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">
            Empat entitas layanan lingkungan membentuk satu rantai berurutan: konsultasi, pengujian
            dan sampling, pelatihan kompetensi, lalu sertifikasi profesi. Satu unit penunjang
            menopang kebutuhan operasional grup.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <GroupStructureDiagram entities={entities} />
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <h2 className="font-display text-h2 text-ink">Lini Inti</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {core.map((entity) => (
              <EntityRow key={entity.slug} entity={entity} locale={locale} />
            ))}
          </div>

          {supporting.length > 0 ? (
            <div className="mt-12 border-t border-line pt-8">
              <p className="font-mono text-label uppercase text-slate">Unit Penunjang</p>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {supporting.map((entity) => (
                  <EntityRow key={entity.slug} entity={entity} locale={locale} />
                ))}
              </div>
            </div>
          ) : null}
        </Reveal>
      </Section>
    </>
  );
}

function EntityRow({ entity, locale }: { entity: EntityEntry; locale: string }) {
  return (
    <Link
      href={`/${locale}/entitas/${entity.slug}`}
      className="block rounded-[14px] border border-line p-6 transition-shadow hover:shadow-sm"
      aria-label={entity.nama}
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: entity.warnaAksen }}
        aria-hidden="true"
      />
      <p className="mt-3 font-display text-h3 text-ink">{entity.nama}</p>
      <p className="mt-1 text-small text-slate">{entity.deskripsi}</p>
    </Link>
  );
}
