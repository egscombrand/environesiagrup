import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeEntity } from '@/lib/cms/fixtures';

const entities = [
  makeEntity({ name: 'Environesia', slug: 'environesia' }),
  makeEntity({ name: 'GreenLab', slug: 'greenlab' }),
  makeEntity({ name: 'GreenSkill', slug: 'greenskill' }),
  makeEntity({ name: 'LSP Praktisi Lingkungan Indonesia', slug: 'lsp-praktisi-lingkungan' }),
  makeEntity({ name: 'Bikin Indonesia Berdaya', slug: 'bikin-indonesia-berdaya' }),
];

vi.mock('@/lib/cms/entities', () => ({
  getPublishedEntities: vi.fn().mockResolvedValue(entities),
}));

vi.mock('@/lib/cms/settings', () => ({
  getSiteSettings: vi.fn().mockResolvedValue({
    id: 1,
    address: 'Grha Environesia (Lantai 2)\nJl. Jati Mataram No. 284B, Karangjati\nSinduadi, Mlati, Sleman\nDaerah Istimewa Yogyakarta 55284',
  }),
}));

const { OrganizationJsonLd } = await import('./organization-jsonld');

function parsePayload(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]');
  return JSON.parse(script?.textContent ?? '{}');
}

describe('OrganizationJsonLd', () => {
  it('describes the group as an Organization with its real address', async () => {
    const { container } = render(await OrganizationJsonLd({ locale: 'id' }));
    const payload = parsePayload(container);

    expect(payload['@type']).toBe('Organization');
    expect(payload.name).toBe('Environesia Company Group');
    expect(payload.address.streetAddress).toContain('55284');
    expect(payload.address.addressCountry).toBe('ID');
  });

  it('lists the five entities as subOrganizations', async () => {
    const { container } = render(await OrganizationJsonLd({ locale: 'id' }));
    const payload = parsePayload(container);
    const names = payload.subOrganization.map((sub: { name: string }) => sub.name);

    expect(names).toHaveLength(5);
    expect(names).toContain('GreenLab');
    expect(names).toContain('Bikin Indonesia Berdaya');
  });

  it('points the canonical url at the active locale', async () => {
    const { container } = render(await OrganizationJsonLd({ locale: 'en' }));
    expect(parsePayload(container).url).toBe('https://example.invalid/en');
  });
});
