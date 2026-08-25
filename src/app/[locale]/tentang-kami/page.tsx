import type { Metadata } from 'next';
import Link from 'next/link';
import { getCollection } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { TENTANG_KAMI_ROUTES } from '@/lib/tentang-kami-routes';
import type { EntityEntry } from '@/lib/content-types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: 'Tentang Kami',
    description:
      'Environesia Company Group menaungi empat lini layanan lingkungan dan satu unit penunjang.',
    locale,
    path: '/tentang-kami',
  });
}

export default async function TentangKamiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const entities = getCollection<EntityEntry>('entities').map((entry) => entry.data);
  const coreCount = entities.filter((entity) => entity.lini === 'inti').length;

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">Profil</p>
          <h1 className="mt-4 font-display text-display text-ink">Tentang Kami</h1>
          <p className="mt-6 max-w-2xl text-body text-slate">
            Environesia Company Group adalah holding yang membawahi empat lini layanan lingkungan
            dan satu unit manufaktur apparel. Keempat lini lingkungan bekerja sebagai satu rantai
            berurutan — konsultasi, pengujian dan sampling, pelatihan kompetensi, lalu sertifikasi
            profesi — sementara unit penunjang menopang kebutuhan operasional grup.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="rounded-[14px] border border-line bg-paper p-8">
              <p className="font-display text-display text-forest">{entities.length}</p>
              <p className="mt-2 font-mono text-label uppercase text-slate">Entitas dalam grup</p>
            </div>
            <div className="rounded-[14px] border border-line bg-paper p-8">
              <p className="font-display text-display text-forest">{coreCount}</p>
              <p className="mt-2 font-mono text-label uppercase text-slate">Lini layanan lingkungan</p>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <h2 className="font-display text-h2 text-ink">Selengkapnya</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {TENTANG_KAMI_ROUTES.map((route) => (
              <Link
                key={route.slug}
                href={`/${locale}/tentang-kami/${route.slug}`}
                className="block rounded-[14px] border border-line bg-paper p-6 transition-shadow hover:shadow-sm"
              >
                <p className="font-display text-h3 text-ink">{route.label}</p>
                <p className="mt-1 text-small text-slate">{route.deskripsi}</p>
              </Link>
            ))}
          </div>
        </Reveal>
      </Section>
    </>
  );
}
