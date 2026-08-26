import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeEntity } from '@/lib/cms/fixtures';

// OrganizationJsonLd takes only { locale } — there is no prop-level injection
// point for entity data, it reads getPublishedEntities() internally. To feed
// it a controlled, adversarial `short_description` we mock the CMS module
// for this file only (kept out of organization-jsonld.test.tsx so the mock
// doesn't shadow getPublishedEntities for the tests that assert against the
// real five-entity collection).
vi.mock('@/lib/cms/entities', () => ({
  getPublishedEntities: vi.fn().mockResolvedValue([
    makeEntity({
      name: 'Evil Co',
      slug: 'evil-co',
      short_description: 'Berbahaya </script><script>alert(1)</script> lanjutan.',
    }),
  ]),
}));

vi.mock('@/lib/cms/settings', () => ({
  getSiteSettings: vi.fn().mockResolvedValue({ id: 1, address: null }),
}));

const { OrganizationJsonLd } = await import('./organization-jsonld');

describe('OrganizationJsonLd — script injection safety', () => {
  it('escapes "<" so a description containing </script> cannot terminate the script tag early', async () => {
    const { container } = render(await OrganizationJsonLd({ locale: 'id' }));
    const script = container.querySelector('script[type="application/ld+json"]');
    const raw = script?.textContent ?? '';

    expect(raw).not.toContain('</script>');

    const payload = JSON.parse(raw);
    expect(payload.subOrganization[0].description).toBe(
      'Berbahaya </script><script>alert(1)</script> lanjutan.'
    );
  });
});
