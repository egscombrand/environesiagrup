import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { OFFICE_ADDRESS_LINES, OFFICE_BUILDING } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: 'Kontak',
    description: 'Hubungi Environesia Company Group di kantor pusat kami di Sleman, Yogyakarta.',
    locale,
    path: '/kontak',
  });
}

export default async function KontakPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">Hubungi Kami</p>
          <h1 className="mt-4 font-display text-display text-ink">Kontak</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">
            Untuk kebutuhan konsultasi, pengujian, pelatihan, atau sertifikasi lingkungan, tim kami
            dapat dihubungi melalui kantor pusat.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[14px] border border-line bg-paper p-8">
              <p className="font-mono text-label uppercase text-slate">Kantor Pusat</p>
              <p className="mt-3 font-display text-h3 text-ink">{OFFICE_BUILDING}</p>
              <address className="mt-2 text-small not-italic text-slate">
                {OFFICE_ADDRESS_LINES.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>

            <div className="rounded-[14px] border border-line bg-paper p-8">
              <p className="font-mono text-label uppercase text-slate">Formulir</p>
              <p className="mt-3 text-body text-ink">
                Formulir kontak akan tersedia setelah kebijakan privasi terbit.
              </p>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
