import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { makeEntity } from '@/lib/cms/fixtures';

const twoEntities = [
  makeEntity({ name: 'Environesia', slug: 'environesia', short_description: 'Konsultasi lingkungan.', sort_order: 1 }),
  makeEntity({ name: 'GreenLab', slug: 'greenlab', short_description: 'Pengujian dan sampling.', sort_order: 2 }),
];

const nineEntities = Array.from({ length: 9 }, (_, i) =>
  makeEntity({ name: `Entity ${i + 1}`, slug: `entity-${i + 1}`, sort_order: i + 1 })
);

vi.mock('@/lib/cms/entities', () => ({
  getPublishedEntities: vi.fn(),
}));
vi.mock('@/lib/cms/settings', () => ({
  getSiteSettings: vi.fn(),
}));
vi.mock('@/lib/cms/story-scenes', () => ({
  getPublishedStoryScenesByEntity: vi.fn(),
}));
vi.mock('@/lib/cms/navigation', () => ({
  getPublishedNavigationUrlsBySlug: vi.fn(),
}));

const { getPublishedEntities } = await import('@/lib/cms/entities');
const { getSiteSettings } = await import('@/lib/cms/settings');
const { getPublishedStoryScenesByEntity } = await import('@/lib/cms/story-scenes');
const { getPublishedNavigationUrlsBySlug } = await import('@/lib/cms/navigation');
const { EcosystemDiagram } = await import('./ecosystem-diagram');

function mockSettings(overrides: { site_name?: string; logoUrl?: string } = {}) {
  vi.mocked(getSiteSettings).mockResolvedValue({
    id: 1,
    site_name: overrides.site_name ?? 'Environesia Company Group',
    tagline: null,
    logoUrl: overrides.logoUrl,
  } as never);
  // No scenes authored in these tests — every company falls back to its
  // short_description as an implicit single scene.
  vi.mocked(getPublishedStoryScenesByEntity).mockResolvedValue({});
  // No navigation items linked in these tests — the profile CTA simply
  // doesn't render, covered explicitly in ecosystem-diagram-client.test.tsx.
  vi.mocked(getPublishedNavigationUrlsBySlug).mockResolvedValue({});
}

// AnimatePresence's exiting panels can linger in the DOM under jsdom (no
// real animation-completion signal), which is enough to make a same-named
// query ambiguous against the next phase.
async function waitForRemovalIfPresent(getElement: () => HTMLElement | null) {
  if (getElement()) {
    await waitForElementToBeRemoved(getElement);
  }
}

// The overture's one click, then "Skip" to jump straight past the
// automatic reveal and company introduction into the full composition —
// the fastest, most deterministic way to reach it in a test, since the
// reveal/intro phases are otherwise entirely auto-timed (covered by their
// own dedicated tests in ecosystem-diagram-client.test.tsx).
async function openEcosystem() {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Lanjut' }));
  await waitForRemovalIfPresent(() => screen.queryByRole('button', { name: 'Lanjut' }));

  const skipButton = screen.getByRole('button', { name: /Lewati/ });
  await user.click(skipButton);
  await waitForRemovalIfPresent(() => screen.queryByRole('button', { name: /Lewati/ }));
}

describe('EcosystemDiagram', () => {
  it('shows the brand mark, presenting label, and heading together — no click needed to see them', async () => {
    mockSettings();
    vi.mocked(getPublishedEntities).mockResolvedValue(twoEntities);

    render(await EcosystemDiagram({ locale: 'id' }));

    expect(screen.getByText('Environesia Company Group')).toBeInTheDocument();
    expect(screen.getByText('Mempersembahkan…')).toBeInTheDocument();
    expect(screen.getByText('ENVIROnesia Group')).toBeInTheDocument();
  });

  it('an admin title_override replaces the default welcome headline', async () => {
    mockSettings();
    vi.mocked(getPublishedEntities).mockResolvedValue(twoEntities);

    render(await EcosystemDiagram({ locale: 'id', title: 'A Very Distinctive Override' }));

    expect(screen.getByText('A Very Distinctive Override')).toBeInTheDocument();
    expect(screen.queryByText('ENVIROnesia Group')).not.toBeInTheDocument();
  });

  it('renders the real site name from settings as the logo fallback, not hardcoded text', async () => {
    mockSettings({ site_name: 'A Very Distinctive Group Name' });
    vi.mocked(getPublishedEntities).mockResolvedValue(twoEntities);

    render(await EcosystemDiagram({ locale: 'id' }));

    expect(screen.getByText('A Very Distinctive Group Name')).toBeInTheDocument();
  });

  it('after the click and Skip, shows every published entity in the composition, for both a small and a large entity count', async () => {
    mockSettings();
    vi.mocked(getPublishedEntities).mockResolvedValue(twoEntities);
    const { unmount } = render(await EcosystemDiagram({ locale: 'id' }));
    await openEcosystem();
    for (const entity of twoEntities) {
      expect(screen.getByRole('button', { name: new RegExp(entity.name) })).toBeInTheDocument();
    }
    unmount();

    vi.mocked(getPublishedEntities).mockResolvedValue(nineEntities);
    render(await EcosystemDiagram({ locale: 'id' }));
    await openEcosystem();
    for (const entity of nineEntities) {
      expect(screen.getByRole('button', { name: new RegExp(entity.name) })).toBeInTheDocument();
    }
  });

  it('renders nothing when there are no published entities', async () => {
    mockSettings();
    vi.mocked(getPublishedEntities).mockResolvedValue([]);

    const { container } = render(await EcosystemDiagram({ locale: 'id' }));
    expect(container).toBeEmptyDOMElement();
  });

  it('treats a brand-new, previously-unseen entity name identically to the rest — no name-based conditionals', async () => {
    mockSettings();
    const withNewEntity = [...twoEntities, makeEntity({ name: 'Zzz Newest Entity', slug: 'zzz-newest', sort_order: 3 })];
    vi.mocked(getPublishedEntities).mockResolvedValue(withNewEntity);

    render(await EcosystemDiagram({ locale: 'id' }));
    await openEcosystem();
    expect(screen.getByRole('button', { name: /Zzz Newest Entity/ })).toBeInTheDocument();
  });

  it('renders a long entity name in full in the accessible name', async () => {
    mockSettings();
    const longName = 'LSP Praktisi Lingkungan Indonesia Bersertifikat Nasional';
    vi.mocked(getPublishedEntities).mockResolvedValue([
      makeEntity({ name: longName, slug: 'lsp-panjang', sort_order: 1 }),
    ]);

    render(await EcosystemDiagram({ locale: 'id' }));
    await openEcosystem();
    expect(screen.getByRole('button', { name: new RegExp(longName) })).toBeInTheDocument();
  });
});
