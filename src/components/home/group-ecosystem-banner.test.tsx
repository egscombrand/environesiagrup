import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/cms/navigation', () => ({
  getPublishedNavigationUrlsBySlug: vi.fn(),
}));

const { getPublishedNavigationUrlsBySlug } = await import('@/lib/cms/navigation');
const { GroupEcosystemBanner } = await import('./group-ecosystem-banner');

describe('GroupEcosystemBanner', () => {
  it('renders the headline, the one-sentence tagline (never a long paragraph), and the secondary CTA to the real leadership route', async () => {
    vi.mocked(getPublishedNavigationUrlsBySlug).mockResolvedValue({});

    render(await GroupEcosystemBanner({ locale: 'id' }));

    expect(screen.getByText('Beragam Keahlian. Satu Ekosistem.')).toBeInTheDocument();
    expect(
      screen.getByText('Ekosistem layanan lingkungan yang menghubungkan keahlian, teknologi, dan sumber daya manusia.')
    ).toBeInTheDocument();

    const secondary = screen.getByRole('link', { name: 'Direksi & Manajemen' });
    expect(secondary).toHaveAttribute('href', '/id/pimpinan');
  });

  it('shows the primary CTA only when a navigation item resolves the Environesia profile URL — never a hardcoded route', async () => {
    vi.mocked(getPublishedNavigationUrlsBySlug).mockResolvedValue({});
    render(await GroupEcosystemBanner({ locale: 'id' }));
    expect(screen.queryByRole('link', { name: 'Kenali Environesia' })).not.toBeInTheDocument();
    // The secondary CTA (a real, always-present static route) still renders
    // even when the primary one can't resolve — never zero CTAs.
    expect(screen.getByRole('link', { name: 'Direksi & Manajemen' })).toBeInTheDocument();
  });

  it('links the primary CTA to the real, CMS-resolved profile URL once one exists', async () => {
    vi.mocked(getPublishedNavigationUrlsBySlug).mockResolvedValue({
      environesia: '/bisnis-layanan/environesia',
    });
    render(await GroupEcosystemBanner({ locale: 'id' }));

    const primary = screen.getByRole('link', { name: 'Kenali Environesia' });
    expect(primary).toHaveAttribute('href', '/id/bisnis-layanan/environesia');
  });

  it('an admin title override replaces the eyebrow, not the fixed headline/tagline copy', async () => {
    vi.mocked(getPublishedNavigationUrlsBySlug).mockResolvedValue({});
    render(await GroupEcosystemBanner({ locale: 'id', title: 'Custom Eyebrow' }));

    expect(screen.getByText('Custom Eyebrow')).toBeInTheDocument();
    expect(screen.getByText('Beragam Keahlian. Satu Ekosistem.')).toBeInTheDocument();
  });
});
