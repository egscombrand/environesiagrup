import type { Metadata } from 'next';
import { getCollection } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { CountryMap } from '@/components/home/country-map';
import type { ProjectPin } from '@/lib/content-types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: 'Proyek',
    description: 'Rekam jejak proyek Environesia Company Group.',
    locale,
    path: '/proyek',
  });
}

export default async function ProyekPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const pins = getCollection<ProjectPin>('projects').map((entry) => entry.data);

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">Portofolio</p>
          <h1 className="mt-4 font-display text-display text-ink">Proyek</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">
            Rekam jejak pekerjaan grup bersama klien korporat dan instansi.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <CountryMap pins={pins} />
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <h2 className="font-display text-h2 text-ink">Daftar Proyek</h2>
          {pins.length === 0 ? (
            <p className="mt-6 text-small text-slate">Daftar proyek sedang disiapkan.</p>
          ) : (
            <ul className="mt-8">
              {pins.map((pin) => (
                <li key={`${pin.negara}-${pin.judul}`} className="border-b border-line py-4">
                  <p className="font-display text-h3 text-ink">{pin.judul}</p>
                  <p className="mt-1 font-mono text-label uppercase text-slate">
                    {pin.kota ? `${pin.kota}, ${pin.negara}` : pin.negara}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </Section>
    </>
  );
}
