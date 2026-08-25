import type { Metadata } from 'next';
import Link from 'next/link';
import { getCollection } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import type { PillarEntry } from '@/lib/content-types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: 'Pilar Bisnis',
    description:
      'Empat pilar layanan lingkungan: konsultasi, pengujian dan sampling, pelatihan kompetensi, dan sertifikasi profesi.',
    locale,
    path: '/bisnis',
  });
}

export default async function BisnisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pillars = getCollection<PillarEntry>('pillars')
    .map((entry) => entry.data)
    .sort((a, b) => a.urutan - b.urutan);

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">Layanan</p>
          <h1 className="mt-4 font-display text-display text-ink">Pilar Bisnis</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">
            Empat pilar yang membentuk satu rantai layanan berurutan, dari perencanaan hingga
            pengakuan kompetensi.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {pillars.map((pillar) => (
              <Link
                key={pillar.slug}
                href={`/${locale}/bisnis/${pillar.slug}`}
                className="block rounded-[14px] border border-line bg-paper p-6 transition-shadow hover:shadow-sm"
              >
                <p className="font-mono text-label uppercase text-slate">
                  {String(pillar.urutan).padStart(2, '0')}
                </p>
                <p className="mt-2 font-display text-h3 text-ink">{pillar.nama}</p>
                <p className="mt-1 text-small text-slate">{pillar.deskripsi}</p>
              </Link>
            ))}
          </div>
        </Reveal>
      </Section>
    </>
  );
}
