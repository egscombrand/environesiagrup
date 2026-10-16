import { getPublishedProjects } from '@/lib/cms/projects';
import { getPublishedPosts } from '@/lib/cms/posts';
import { ClientsPartners } from '@/components/home/clients-partners';
import { PortofolioProyekSection } from './sections/portofolio-proyek-section';
import { PostsListSection } from './sections/posts-list-section';
import { SiaranPersList } from './sections/siaran-pers-list';
import { ProyekInsightTabsClient } from './tabs-controller';

/**
 * The one "Proyek & Insight" experience, rendered identically whichever URL
 * got the visitor here: the hub (`/proyek-insight`) or one specific tab's
 * own route (`/proyek-insight/klien-mitra`, …) — same reasoning as Tentang
 * Kami's hub view (src/components/tentang-kami/hub-view.tsx). Unlike that
 * one, the hero itself lives inside the client tabs controller here, since
 * this section's hero changes with the active tab instead of staying fixed.
 */
export async function ProyekInsightHubView({ locale, initialTab }: { locale: string; initialTab: string }) {
  const [projects, siaranPersPosts, beritaPosts] = await Promise.all([
    getPublishedProjects(),
    getPublishedPosts('siaran_pers'),
    getPublishedPosts('berita_perusahaan'),
  ]);

  // Siaran Pers (press clippings) and Berita Perusahaan (self-authored news)
  // are separate content types — each tab reads only its own, never the
  // other's. See src/lib/admin/resources/siaran-pers.ts and
  // berita-perusahaan.ts for the editors that keep them apart.
  const tabsContent = {
    'portofolio-proyek': <PortofolioProyekSection locale={locale} projects={projects} />,
    'klien-mitra': await ClientsPartners({ locale }),
    'berita-perusahaan': (
      <PostsListSection locale={locale} posts={beritaPosts} emptyMessage="Belum ada berita perusahaan." />
    ),
    'siaran-pers': (
      <SiaranPersList locale={locale} posts={siaranPersPosts} emptyMessage="Siaran pers sedang disiapkan." />
    ),
  };

  return <ProyekInsightTabsClient locale={locale} initialTab={initialTab} tabs={tabsContent} />;
}
