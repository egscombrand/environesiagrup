import type { Metadata } from 'next';
import Link from 'next/link';
import { getCollection } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import type { EntityEntry } from '@/lib/content-types';

const SUB_PAGES = [
  { label: 'Sejarah', href: '/tentang-kami/sejarah', deskripsi: 'Perjalanan grup dari tahun ke tahun.' },
  { label: 'Visi & Misi', href: '/tentang-kami/visi-misi', deskripsi: 'Arah dan komitmen jangka panjang.' },
  { label: 'Makna Logo', href: '/tentang-kami/makna-logo', deskripsi: 'Filosofi di balik identitas visual grup.' },
  { label: 'Struktur Organisasi', href: '/tentang-kami/struktur-organisasi', deskripsi: 'Susunan organisasi grup.' },
  { label: 'Green Business', href: '/tentang-kami/green-business', deskripsi: 'Manifesto keberlanjutan grup.' },
  { label: 'Penghargaan', href: '/tentang-kami/penghargaan', deskripsi: 'Pengakuan dan apresiasi yang diterima.' },
] as const;

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
            {SUB_PAGES.map((page) => (
              <Link
                key={page.href}
                href={`/${locale}${page.href}`}
                className="block rounded-[14px] border border-line bg-paper p-6 transition-shadow hover:shadow-sm"
              >
                <p className="font-display text-h3 text-ink">{page.label}</p>
                <p className="mt-1 text-small text-slate">{page.deskripsi}</p>
              </Link>
            ))}
          </div>
        </Reveal>
      </Section>
    </>
  );
}
