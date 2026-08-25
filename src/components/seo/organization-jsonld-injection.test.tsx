import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// OrganizationJsonLd takes only { locale } — there is no prop-level injection
// point for entity data, it reads getCollection('entities') internally. To
// feed it a controlled, adversarial `deskripsi` we mock the content module
// for this file only (kept out of organization-jsonld.test.tsx so the mock
// doesn't shadow getCollection for the tests that assert against the real
// five-entity collection).
vi.mock('@/lib/content', () => ({
  getCollection: () => [
    {
      slug: 'evil-co',
      data: {
        nama: 'Evil Co',
        slug: 'evil-co',
        lini: 'inti',
        warnaAksen: '#000000',
        deskripsi: 'Berbahaya </script><script>alert(1)</script> lanjutan.',
        layanan: [],
        legalitas: [],
        urutan: 1,
      },
      content: '',
    },
  ],
}));

import { OrganizationJsonLd } from './organization-jsonld';

describe('OrganizationJsonLd — script injection safety', () => {
  it('escapes "<" so a description containing </script> cannot terminate the script tag early', () => {
    const { container } = render(<OrganizationJsonLd locale="id" />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const raw = script?.textContent ?? '';

    expect(raw).not.toContain('</script>');

    const payload = JSON.parse(raw);
    expect(payload.subOrganization[0].description).toBe(
      'Berbahaya </script><script>alert(1)</script> lanjutan.'
    );
  });
});
