import { getPublishedCoreEntities } from '@/lib/cms/entities';
import { SITE_URL, BRAND_TAGLINE } from '@/lib/site';
import { SITE_NAME } from '@/lib/metadata';
import { getSiteSettings } from '@/lib/cms/settings';

export async function OrganizationJsonLd({ locale }: { locale: string }) {
  const [entities, settings] = await Promise.all([getPublishedCoreEntities(), getSiteSettings()]);

  const payload = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    slogan: BRAND_TAGLINE,
    url: `${SITE_URL}/${locale}`,
    ...(settings.address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: settings.address,
            addressCountry: 'ID',
          },
        }
      : {}),
    subOrganization: entities.map((entity) => ({
      '@type': 'Organization',
      name: entity.name,
      description: entity.short_description,
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
