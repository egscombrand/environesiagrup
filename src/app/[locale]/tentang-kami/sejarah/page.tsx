import type { Metadata } from 'next';
import { PendingContent } from '@/components/layout/pending-content';
import { buildMetadata } from '@/lib/metadata';
import { findTentangKamiRoute } from '@/lib/tentang-kami-routes';

const ROUTE = findTentangKamiRoute('sejarah');

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

export default async function SejarahPage() {
  return (
    <PendingContent eyebrow="Tentang Kami" title={ROUTE.label} description={ROUTE.deskripsi} />
  );
}
