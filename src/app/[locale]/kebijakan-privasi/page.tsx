import type { Metadata } from 'next';
import { PendingContent } from '@/components/layout/pending-content';
import { buildMetadata } from '@/lib/metadata';
import { messagesFor } from '@/i18n/messages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: 'Kebijakan Privasi',
    description: 'Kebijakan privasi Environesia.',
    locale,
    path: '/kebijakan-privasi',
  });
}

export default async function KebijakanPrivasiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = messagesFor(locale);
  return (
    <PendingContent
      locale={locale}
      eyebrow="Legal"
      title={t.privasi.judul}
      description={t.privasi.deskripsi}
      note={t.privasi.catatan}
    />
  );
}
