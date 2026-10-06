import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeEntity } from '@/lib/cms/fixtures';

vi.mock('@/lib/cms/entities', () => ({
  getPublishedEntities: vi.fn(),
}));
vi.mock('@/lib/cms/settings', () => ({
  getSiteSettings: vi.fn().mockResolvedValue({ id: 1, capabilities_subtext: null } as never),
}));
vi.mock('@/lib/cms/navigation', () => ({
  getPublishedNavigationUrlsBySlug: vi.fn().mockResolvedValue({}),
}));

const { getPublishedEntities } = await import('@/lib/cms/entities');
const { getPublishedNavigationUrlsBySlug } = await import('@/lib/cms/navigation');
const { CapabilitiesGrid } = await import('./capabilities-grid');

describe('CapabilitiesGrid', () => {
  it('renders nothing when there are no published entities', async () => {
    vi.mocked(getPublishedEntities).mockResolvedValue([]);
    const result = await CapabilitiesGrid({ locale: 'id' });
    expect(result).toBeNull();
  });

  it('renders every published entity as its own card, never hardcoded', async () => {
    vi.mocked(getPublishedEntities).mockResolvedValue([
      makeEntity({
        id: 'e1',
        name: 'Environesia',
        slug: 'environesia',
        capability_title: 'Perizinan dan Dokumen Lingkungan',
        capability_description: 'Penyusunan AMDAL, UKL-UPL, DELH, DPLH.',
        sort_order: 1,
      }),
      makeEntity({
        id: 'e2',
        name: 'GreenLab',
        slug: 'greenlab',
        capability_title: 'Pengujian dan Pemantauan Lingkungan',
        capability_description: 'Pengambilan sampel dan pengujian air, udara, tanah.',
        sort_order: 2,
      }),
    ]);

    render(await CapabilitiesGrid({ locale: 'id' }));

    expect(screen.getByText('Satu Grup, Beragam Kapabilitas')).toBeInTheDocument();
    expect(screen.getByText('Perizinan dan Dokumen Lingkungan')).toBeInTheDocument();
    expect(screen.getByText('Penyusunan AMDAL, UKL-UPL, DELH, DPLH.')).toBeInTheDocument();
    expect(screen.getByText('Pengujian dan Pemantauan Lingkungan')).toBeInTheDocument();
  });

  it('shows a real "Baca Selengkapnya" link only when a navigation item resolves this entity\'s profile URL', async () => {
    vi.mocked(getPublishedEntities).mockResolvedValue([
      makeEntity({ id: 'e1', name: 'Environesia', slug: 'environesia', capability_title: 'Judul' }),
      makeEntity({ id: 'e2', name: 'GreenLab', slug: 'greenlab', capability_title: 'Judul Lain' }),
    ]);
    vi.mocked(getPublishedNavigationUrlsBySlug).mockResolvedValue({ environesia: '/bisnis-layanan/environesia' });

    render(await CapabilitiesGrid({ locale: 'id' }));

    const links = screen.getAllByRole('link', { name: /Baca Selengkapnya/ });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', '/id/bisnis-layanan/environesia');
  });

  it('a card with no logo has no broken image, but still shows the company name', async () => {
    vi.mocked(getPublishedEntities).mockResolvedValue([
      makeEntity({ id: 'e1', name: 'Environesia', slug: 'environesia', logo_path: null }),
    ]);

    render(await CapabilitiesGrid({ locale: 'id' }));
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Environesia')).toBeInTheDocument();
  });

  it('typography hierarchy: section heading is always bigger than every capability title, consistently for every card', async () => {
    vi.mocked(getPublishedEntities).mockResolvedValue([
      makeEntity({
        id: 'e1',
        name: 'Environesia',
        slug: 'environesia',
        capability_title: 'Perizinan dan Dokumen Lingkungan',
        sort_order: 1,
      }),
      makeEntity({
        id: 'e2',
        name: 'GreenLab',
        slug: 'greenlab',
        capability_title: 'Pengujian dan Pemantauan Lingkungan',
        sort_order: 2,
      }),
    ]);

    render(await CapabilitiesGrid({ locale: 'id' }));

    const heading = screen.getByText('Satu Grup, Beragam Kapabilitas');
    const capabilityTitles = [
      screen.getByText('Perizinan dan Dokumen Lingkungan'),
      screen.getByText('Pengujian dan Pemantauan Lingkungan'),
    ];

    // Level 1 (section heading) must never share a font-size class with a
    // capability title (text-h3) — that exact collision, from an earlier
    // pass that mis-measured the reference and bumped both to text-h2, was
    // the reported hierarchy bug. The heading no longer uses the shared
    // text-display token (a later pass gave it its own bespoke, smaller
    // desktop size — 42–48px instead of text-display's up-to-56px — so a
    // long headline wraps to exactly 2 lines instead of dominating the
    // section), but it must still resolve larger than text-h3 (24px) at
    // every breakpoint.
    expect(heading.className).toContain('text-[46px]');
    expect(heading.className).not.toContain('text-h3');
    expect(heading.className).not.toContain('text-h2');
    for (const capTitle of capabilityTitles) {
      expect(capTitle.className).not.toContain('text-display');
      expect(capTitle.className).not.toContain('text-h2');
      expect(capTitle.className).toContain('text-h3');
    }
  });

  it('a card with no capability copy yet renders without crashing', async () => {
    vi.mocked(getPublishedEntities).mockResolvedValue([
      makeEntity({ id: 'e1', name: 'Environesia', slug: 'environesia', capability_title: null, capability_description: null }),
    ]);

    render(await CapabilitiesGrid({ locale: 'id' }));
    expect(screen.getByText('Environesia')).toBeInTheDocument();
  });
});
