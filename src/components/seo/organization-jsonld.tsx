import { getCollection } from '@/lib/content';
import { SITE_URL, OFFICE_ADDRESS } from '@/lib/site';
import { SITE_NAME } from '@/lib/metadata';
import type { EntityEntry } from '@/lib/content-types';

export function OrganizationJsonLd({ locale }: { locale: string }) {
  const entities = getCollection<EntityEntry>('entities')
    .map((entry) => entry.data)
    .sort((a, b) => a.urutan - b.urutan);

  const payload = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: `${SITE_URL}/${locale}`,
    address: {
      '@type': 'PostalAddress',
      ...OFFICE_ADDRESS,
    },
    subOrganization: entities.map((entity) => ({
      '@type': 'Organization',
      name: entity.nama,
      description: entity.deskripsi,
      url: `${SITE_URL}/${locale}/entitas/${entity.slug}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, '\\u003c'),
      }}
    />
  );
}
