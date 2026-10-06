import type { Metadata } from 'next';
import { PendingContent } from '@/components/layout/pending-content';
import { buildMetadata } from '@/lib/metadata';
import { messagesFor } from '@/i18n/messages';

// Deliberately not part of TENTANG_KAMI_ROUTES / the Tentang Kami sub-nav —
// Green Business is a separate concept slated for its own home later, not
// one of the 7 pages the "Tentang Kami" system now covers. The route stays
// reachable (nothing deleted), it's just no longer advertised in that menu.
const LABEL = 'Green Business';
const DESKRIPSI = 'Manifesto keberlanjutan grup.';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: LABEL,
    description: 'Manifesto keberlanjutan Environesia Group.',
    locale,
    path: '/tentang-kami/green-business',
  });
}

export default async function GreenBusinessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = messagesFor(locale);
  return <PendingContent locale={locale} eyebrow={t.tentangKami.judul} title={LABEL} description={DESKRIPSI} />;
}
