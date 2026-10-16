import type { Metadata } from 'next';
import { getPublishedLeadership } from '@/lib/cms/leadership';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { LeadershipGrid } from '@/components/pimpinan/leadership-grid';
import { messagesFor } from '@/i18n/messages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: 'Direksi',
    description: 'Jajaran direksi Environesia.',
    locale,
    path: '/pimpinan/direksi',
  });
}

export default async function DireksiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = messagesFor(locale);
  const people = await getPublishedLeadership('direksi');

  return (
    <>
      <Section className="grid min-h-[50vh] items-center">
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">{t.pimpinan.judul}</p>
          <h1 className="mt-4 font-display text-display text-ink">{t.pimpinan.direksi}</h1>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <LeadershipGrid people={people} emptyLabel={t.pimpinan.direksiPending} />
        </Reveal>
      </Section>
    </>
  );
}
