import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedProjects, getPublishedProjectBySlug } from '@/lib/cms/projects';
import { getPublishedEntities } from '@/lib/cms/entities';
import { buildMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { RichText } from '@/components/cms/rich-text';
import { EntityCard } from '@/components/entitas/entity-card';

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return routing.locales.flatMap((locale) => projects.map((project) => ({ locale, slug: project.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return buildMetadata({
      title: 'Proyek tidak ditemukan',
      description: 'Halaman proyek yang Anda cari tidak tersedia.',
      locale,
      path: `/proyek/${slug}`,
    });
  }

  return buildMetadata({
    title: project.title,
    description: project.summary,
    locale,
    path: `/proyek/${project.slug}`,
  });
}

export default async function ProyekDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const entities = await getPublishedEntities();
  const relatedEntities = entities.filter((entity) => project.entityIds.includes(entity.id));
  const clientLabel = project.client_anonymous ? project.client_descriptor : project.client;

  return (
    <>
      <Section>
        <Reveal>
          <Link
            href={`/${locale}/proyek`}
            className="font-mono text-label uppercase text-slate hover:text-forest"
          >
            ← Semua proyek
          </Link>
          <p className="mt-6 font-mono text-label uppercase text-slate">
            {[project.city, project.country].filter(Boolean).join(', ')}
            {project.year ? ` · ${project.year}` : ''}
            {project.sector ? ` · ${project.sector}` : ''}
          </p>
          <h1 className="mt-2 font-display text-display text-ink">{project.title}</h1>
          {project.summary ? <p className="mt-4 max-w-2xl text-body text-slate">{project.summary}</p> : null}
          {clientLabel ? (
            <p className="mt-4 font-mono text-label uppercase text-slate">Klien: {clientLabel}</p>
          ) : null}
          {project.featuredImageUrl ? (
            <Image
              src={project.featuredImageUrl}
              alt=""
              width={1280}
              height={720}
              className="mt-8 h-auto w-full rounded-[14px] object-cover"
              priority
            />
          ) : null}
        </Reveal>
      </Section>

      {project.content ? (
        <Section className="bg-stone">
          <Reveal>
            <div className="mx-auto max-w-2xl">
              <RichText content={project.content} />
            </div>
          </Reveal>
        </Section>
      ) : null}

      {project.images.length > 0 ? (
        <Section>
          <Reveal>
            <h2 className="font-display text-h2 text-ink">Galeri</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.images.map((image) => (
                <Image
                  key={image.id}
                  src={image.url ?? ''}
                  alt={image.alt_text ?? ''}
                  width={640}
                  height={480}
                  className="h-auto w-full rounded-[14px] object-cover"
                />
              ))}
            </div>
          </Reveal>
        </Section>
      ) : null}

      {relatedEntities.length > 0 ? (
        <Section className="bg-stone">
          <Reveal>
            <h2 className="font-display text-h2 text-ink">Dikerjakan Oleh</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedEntities.map((entity) => (
                <EntityCard key={entity.slug} entity={entity} locale={locale} />
              ))}
            </div>
          </Reveal>
        </Section>
      ) : null}
    </>
  );
}
