import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OrganizationJsonLd } from './organization-jsonld';

function parsePayload(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]');
  return JSON.parse(script?.textContent ?? '{}');
}

describe('OrganizationJsonLd', () => {
  it('describes the group as an Organization with its real address', () => {
    const { container } = render(<OrganizationJsonLd locale="id" />);
    const payload = parsePayload(container);

    expect(payload['@type']).toBe('Organization');
    expect(payload.name).toBe('Environesia Company Group');
    expect(payload.address.postalCode).toBe('55284');
    expect(payload.address.addressCountry).toBe('ID');
  });

  it('lists the five entities as subOrganizations', () => {
    const { container } = render(<OrganizationJsonLd locale="id" />);
    const payload = parsePayload(container);
    const names = payload.subOrganization.map((sub: { name: string }) => sub.name);

    expect(names).toHaveLength(5);
    expect(names).toContain('GreenLab');
    expect(names).toContain('Bikin Indonesia Berdaya');
  });

  it('points the canonical url at the active locale', () => {
    const { container } = render(<OrganizationJsonLd locale="en" />);
    expect(parsePayload(container).url).toBe('https://example.invalid/en');
  });
});
