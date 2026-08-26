import type { Metadata } from 'next';
import { getPublishedEntities } from '@/lib/cms/entities';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { GroupStructureDiagram } from '@/components/entitas/group-structure-diagram';
import { messagesFor } from '@/i18n/messages';

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
  const t = messagesFor(locale);
  const entities = await getPublishedEntities();

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">{t.entitas.eyebrow}</p>
          <h1 className="mt-4 font-display text-display text-ink">{t.entitas.judul}</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">{t.entitas.intro}</p>
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
