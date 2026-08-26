import type { Metadata } from 'next';
import { PendingContent } from '@/components/layout/pending-content';
import { buildMetadata } from '@/lib/metadata';
import { findTentangKamiRoute } from '@/lib/tentang-kami-routes';
import { messagesFor } from '@/i18n/messages';

const ROUTE = findTentangKamiRoute('makna-logo');

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: ROUTE.label,
    description: ROUTE.metaDescription,
    locale,
    path: `/tentang-kami/${ROUTE.slug}`,
  });
}

export default async function MaknaLogoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = messagesFor(locale);
  return (
    <PendingContent
      locale={locale}
      eyebrow={t.tentangKami.judul}
      title={ROUTE.label}
      description={ROUTE.deskripsi}
    />
  );
}
