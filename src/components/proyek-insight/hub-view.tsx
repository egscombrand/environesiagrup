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
  const [projects, posts] = await Promise.all([getPublishedProjects(), getPublishedPosts()]);

  // Siaran Pers is the single source for all news — every published article
  // is listed there. The Berita Perusahaan tab stays in place but has nothing
  // of its own to repeat, so it points to Siaran Pers instead of duplicating it.
  const tabsContent = {
    'portofolio-proyek': <PortofolioProyekSection locale={locale} projects={projects} />,
    'klien-mitra': await ClientsPartners({ locale }),
    'berita-perusahaan': (
      <PostsListSection locale={locale} posts={[]} emptyMessage="Seluruh berita kini tersedia di Siaran Pers." />
    ),
    'siaran-pers': (
      <SiaranPersList locale={locale} posts={posts} emptyMessage="Siaran pers sedang disiapkan." />
    ),
  };

  return <ProyekInsightTabsClient locale={locale} initialTab={initialTab} tabs={tabsContent} />;
}
