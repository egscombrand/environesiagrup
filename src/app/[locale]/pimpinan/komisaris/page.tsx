import type { Metadata } from 'next';
import { getCollection } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { LeadershipGrid } from '@/components/pimpinan/leadership-grid';
import type { LeadershipEntry } from '@/lib/content-types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: 'Komisaris',
    description: 'Dewan komisaris Environesia Company Group.',
    locale,
    path: '/pimpinan/komisaris',
  });
}

export default async function KomisarisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const people = getCollection<LeadershipEntry>('leadership')
    .map((entry) => entry.data)
    .filter((person) => person.tipe === 'komisaris');

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">Pimpinan</p>
          <h1 className="mt-4 font-display text-display text-ink">Komisaris</h1>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <LeadershipGrid
            people={people}
            emptyLabel="Keberadaan dewan komisaris belum dikonfirmasi."
          />
        </Reveal>
      </Section>
    </>
  );
}
