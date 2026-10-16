import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getPublishedEntitySlugs } from '@/lib/cms/entities';
import { getPublishedJobSlugs } from '@/lib/cms/jobs';
import { getPublishedPillarSlugs } from '@/lib/cms/pillars';
import { getPublishedPostSlugs } from '@/lib/cms/posts';
import { getPublishedProjectSlugs } from '@/lib/cms/projects';
import { SITE_URL } from '@/lib/site';
import { TENTANG_KAMI_ROUTES } from '@/lib/tentang-kami-routes';

const STATIC_PATHS = [
  '/',
  '/entitas',
  '/bisnis',
  '/tentang-kami',
  ...TENTANG_KAMI_ROUTES.map((route) => `/tentang-kami/${route.slug}`),
  '/pimpinan',
  '/pimpinan/direksi',
  '/pimpinan/komisaris',
  '/proyek-insight',
  '/berita',
  '/karier',
  '/kontak',
  '/unduhan',
  '/kebijakan-privasi',
];

function priorityFor(path: string) {
  if (path === '/') return 1;
  if (path.split('/').filter(Boolean).length === 1) return 0.8;
  return 0.6;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [entitySlugs, jobSlugs, pillarSlugs, postSlugs, projectSlugs] = await Promise.all([
    getPublishedEntitySlugs(),
    getPublishedJobSlugs(),
    getPublishedPillarSlugs(),
    getPublishedPostSlugs(),
    getPublishedProjectSlugs(),
  ]);

  const paths = [
    ...STATIC_PATHS,
    ...entitySlugs.map((slug) => `/entitas/${slug}`),
    ...jobSlugs.map((slug) => `/karier/${slug}`),
    ...pillarSlugs.map((slug) => `/bisnis/${slug}`),
    ...postSlugs.map((slug) => `/berita/${slug}`),
    ...projectSlugs.map((slug) => `/proyek/${slug}`),
  ];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${SITE_URL}/${locale}${path === '/' ? '' : path}`,
      changeFrequency: 'monthly' as const,
      priority: priorityFor(path),
    }))
  );
}
