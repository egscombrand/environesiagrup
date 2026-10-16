import type { Metadata } from 'next';
import { getPublishedDocuments } from '@/lib/cms/documents';
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
    title: 'Unduhan',
    description: 'Dokumen resmi Environesia.',
    locale,
    path: '/unduhan',
  });
}

export default async function UnduhanPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = messagesFor(locale);
  const documents = await getPublishedDocuments();

  if (documents.length === 0) {
    return (
      <PendingContent
        locale={locale}
        eyebrow={t.unduhan.judul}
        title={t.unduhan.judul}
        description={t.unduhan.deskripsi}
        note="Belum ada dokumen yang dipublikasikan."
      />
    );
  }

  return (
    <>
      <Section className="grid min-h-[50vh] items-center">
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">{t.unduhan.judul}</p>
          <h1 className="mt-4 font-display text-display text-ink">{t.unduhan.judul}</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">{t.unduhan.deskripsi}</p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <ul>
            {documents.map((document) => (
              <li key={document.id} className="border-b border-line py-4">
                <a
                  href={document.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block hover:opacity-80"
                >
                  <p className="font-mono text-label uppercase text-slate">{document.category}</p>
                  <p className="mt-1 font-display text-h3 text-ink">{document.title}</p>
                  {document.description ? (
                    <p className="mt-1 text-small text-slate">{document.description}</p>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>
    </>
  );
}
