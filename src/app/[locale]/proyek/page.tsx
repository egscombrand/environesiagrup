import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedProjects, getPublishedProjectPins } from '@/lib/cms/projects';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { CountryMap } from '@/components/home/country-map';

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
  const { locale } = await params;
  const [projects, pins] = await Promise.all([getPublishedProjects(), getPublishedProjectPins()]);

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
          {projects.length === 0 ? (
            <p className="mt-6 text-small text-slate">Daftar proyek sedang disiapkan.</p>
          ) : (
            <ul className="mt-8">
              {projects.map((project) => (
                <li key={project.id} className="border-b border-line py-4">
                  <Link href={`/${locale}/proyek/${project.slug}`} className="block hover:opacity-80">
                    <p className="font-display text-h3 text-ink">{project.title}</p>
                    <p className="mt-1 font-mono text-label uppercase text-slate">
                      {[project.city, project.country].filter(Boolean).join(', ')}
                      {project.year ? ` · ${project.year}` : ''}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </Section>
    </>
  );
}
