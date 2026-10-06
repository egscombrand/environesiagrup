import { redirect } from 'next/navigation';

// /proyek was the original standalone project list — superseded by the
// "Proyek & Insight" hub (/proyek-insight), which has the real CMS nav
// tabs and the current Project Directory presentation. Kept as a redirect
// (not deleted) so old links/bookmarks/the sitemap still land somewhere
// real, and so the old plain-list markup this page used to render can
// never be served again. /proyek/[slug] detail pages are unaffected.
export default async function ProyekPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/proyek-insight`);
}
