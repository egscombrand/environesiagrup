import type { Metadata } from 'next';
import { getPublishedLeadership } from '@/lib/cms/leadership';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { LeadershipGrid } from '@/components/pimpinan/leadership-grid';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: 'Direksi',
    description: 'Jajaran direksi Environesia Company Group.',
    locale,
    path: '/pimpinan/direksi',
  });
}

export default async function DireksiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const people = await getPublishedLeadership('direksi');

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">Pimpinan</p>
          <h1 className="mt-4 font-display text-display text-ink">Direksi</h1>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <LeadershipGrid people={people} emptyLabel="Profil jajaran direksi sedang disiapkan." />
        </Reveal>
      </Section>
    </>
  );
}
