import type { Metadata } from 'next';
import { getPublishedEntities } from '@/lib/cms/entities';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { GroupStructureDiagram } from '@/components/entitas/group-structure-diagram';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: 'Entitas Kami',
    description:
      'Lima entitas Environesia Company Group di bidang lingkungan dan manufaktur apparel.',
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
  const entities = await getPublishedEntities();

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">Struktur Grup</p>
          <h1 className="mt-4 font-display text-display text-ink">Entitas Kami</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">
            Lima entitas yang bergerak di konsultasi lingkungan, pengujian dan sampling,
            pelatihan kompetensi, sertifikasi profesi, serta konveksi custom apparel.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <GroupStructureDiagram entities={entities} locale={locale} />
        </Reveal>
      </Section>

    </>
  );
}
