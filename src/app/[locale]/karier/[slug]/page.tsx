import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedJobBySlug, getPublishedJobSlugs, employmentTypeLabel } from '@/lib/cms/jobs';
import { getPublishedEntities } from '@/lib/cms/entities';
import { buildMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { ARTICLE_HTML_CLASS, SanitizedHtml } from '@/components/cms/sanitized-html';

const DEFAULT_COVER = '/environesia-hq-building.png';
const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' });

export async function generateStaticParams() {
  const slugs = await getPublishedJobSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const job = await getPublishedJobBySlug(slug);

  if (!job) {
    return buildMetadata({
      title: 'Lowongan tidak ditemukan',
      description: 'Halaman lowongan yang Anda cari tidak tersedia.',
      locale,
      path: `/karier/${slug}`,
    });
  }

  return buildMetadata({
    title: job.title,
    description: [job.location, employmentTypeLabel(job.employment_type)].filter(Boolean).join(' · ') || undefined,
    locale,
    path: `/karier/${job.slug}`,
  });
}

function isHttpUrl(value: string | null): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const job = await getPublishedJobBySlug(slug);
  if (!job) notFound();

  const entities = job.entity_id ? await getPublishedEntities() : [];
  const company = entities.find((entity) => entity.id === job.entity_id);

  const meta = [company?.name, job.division, job.location, employmentTypeLabel(job.employment_type)].filter(Boolean);

  return (
    <>
      <Section>
        <Reveal>
          <Link href={`/${locale}/karier`} className="font-mono text-label uppercase text-slate hover:text-forest">
            ← Semua lowongan
          </Link>

          <div className="mt-8 overflow-hidden rounded-[18px]">
            <Image
              src={job.coverImageUrl ?? DEFAULT_COVER}
              alt=""
              width={1280}
              height={640}
              className="h-auto w-full object-cover"
              priority
            />
          </div>

          {meta.length > 0 ? (
            <p className="mt-8 font-mono text-label uppercase text-slate">{meta.join(' · ')}</p>
          ) : null}
          <h1 className="mt-2 font-display text-display text-ink">{job.title}</h1>

          <dl className="mt-6 grid gap-4 border-y border-line py-6 sm:grid-cols-3">
            {job.deadline ? (
              <div>
                <dt className="font-mono text-label uppercase text-slate">Batas Lamaran</dt>
                <dd className="mt-1 text-body text-ink">{dateFormatter.format(new Date(job.deadline))}</dd>
              </div>
            ) : null}
            {job.location ? (
              <div>
                <dt className="font-mono text-label uppercase text-slate">Lokasi</dt>
                <dd className="mt-1 text-body text-ink">{job.location}</dd>
              </div>
            ) : null}
          </dl>

          {isHttpUrl(job.google_form_url) ? (
            <a
              href={job.google_form_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center rounded-[10px] bg-forest px-6 py-3 text-small font-medium text-white transition-opacity hover:opacity-90"
            >
              Lamar Sekarang ↗
            </a>
          ) : null}
        </Reveal>
      </Section>

      {job.general_recruitment || job.specific_recruitment ? (
        <Section className="bg-stone">
          <Reveal>
            <div className="mx-auto max-w-2xl space-y-10">
              {job.general_recruitment ? (
                <div>
                  <h2 className="font-display text-h2 text-ink">Informasi Rekrutmen</h2>
                  <SanitizedHtml html={job.general_recruitment} className={`mt-4 ${ARTICLE_HTML_CLASS}`} />
                </div>
              ) : null}
              {job.specific_recruitment ? (
                <div>
                  <h2 className="font-display text-h2 text-ink">Detail Posisi</h2>
                  <SanitizedHtml html={job.specific_recruitment} className={`mt-4 ${ARTICLE_HTML_CLASS}`} />
                </div>
              ) : null}
            </div>
          </Reveal>
        </Section>
      ) : null}
    </>
  );
}
