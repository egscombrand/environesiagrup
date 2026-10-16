import type { Metadata } from 'next';
import Link from 'next/link';
import { getOpenPublishedJobs, employmentTypeLabel } from '@/lib/cms/jobs';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { PendingContent } from '@/components/layout/pending-content';
import { messagesFor } from '@/i18n/messages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: 'Karier',
    description: 'Peluang berkarier bersama Environesia.',
    locale,
    path: '/karier',
  });
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' });

export default async function KarierPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = messagesFor(locale);
  const jobs = await getOpenPublishedJobs();

  if (jobs.length === 0) {
    return (
      <PendingContent
        locale={locale}
        eyebrow={t.karier.judul}
        title={t.karier.judul}
        description={t.karier.deskripsi}
        note="Belum ada lowongan yang dibuka saat ini."
      />
    );
  }

  return (
    <>
      <Section className="grid min-h-[50vh] items-center">
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">{t.karier.judul}</p>
          <h1 className="mt-4 font-display text-display text-ink">{t.karier.judul}</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">{t.karier.deskripsi}</p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <ul>
            {jobs.map((job) => (
              <li key={job.id} className="border-b border-line py-4">
                <Link href={`/${locale}/karier/${job.slug}`} className="group block">
                  <p className="font-display text-h3 text-ink group-hover:text-forest">{job.title}</p>
                  <p className="mt-1 font-mono text-label uppercase text-slate">
                    {[job.division, job.location, employmentTypeLabel(job.employment_type)].filter(Boolean).join(' · ')}
                  </p>
                  {job.deadline ? (
                    <p className="mt-1 text-small text-slate">
                      Batas lamaran: {dateFormatter.format(new Date(job.deadline))}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>
    </>
  );
}
