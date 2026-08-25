import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getCollection } from '@/lib/content';
import { SITE_URL } from '@/lib/site';
import type { EntityEntry, PillarEntry } from '@/lib/content-types';

const STATIC_PATHS = [
  '/',
  '/entitas',
  '/bisnis',
  '/tentang-kami',
  '/tentang-kami/sejarah',
  '/tentang-kami/visi-misi',
  '/tentang-kami/makna-logo',
  '/tentang-kami/struktur-organisasi',
  '/tentang-kami/green-business',
  '/tentang-kami/penghargaan',
  '/pimpinan',
  '/pimpinan/direksi',
  '/pimpinan/komisaris',
];

function priorityFor(path: string) {
  if (path === '/') return 1;
  if (path.split('/').filter(Boolean).length === 1) return 0.8;
  return 0.6;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entitySlugs = getCollection<EntityEntry>('entities').map((entry) => entry.data.slug);
  const pillarSlugs = getCollection<PillarEntry>('pillars').map((entry) => entry.data.slug);

  const paths = [
    ...STATIC_PATHS,
    ...entitySlugs.map((slug) => `/entitas/${slug}`),
    ...pillarSlugs.map((slug) => `/bisnis/${slug}`),
  ];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${SITE_URL}/${locale}${path === '/' ? '' : path}`,
      changeFrequency: 'monthly' as const,
      priority: priorityFor(path),
    }))
  );
}
