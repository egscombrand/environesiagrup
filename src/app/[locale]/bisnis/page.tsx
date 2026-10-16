import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedPillars } from '@/lib/cms/pillars';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { messagesFor } from '@/i18n/messages';

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
  const t = messagesFor(locale);
  const pillars = await getPublishedPillars();

  return (
    <>
      <Section className="grid min-h-[50vh] items-center">
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">{t.bisnis.eyebrow}</p>
          <h1 className="mt-4 font-display text-display text-ink">{t.bisnis.judul}</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">{t.bisnis.intro}</p>
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
                  {String(pillar.sort_order).padStart(2, '0')}
                </p>
                <p className="mt-2 font-display text-h3 text-ink">{pillar.name}</p>
                <p className="mt-1 text-small text-slate">{pillar.short_description}</p>
              </Link>
            ))}
          </div>
        </Reveal>
      </Section>
    </>
  );
}
