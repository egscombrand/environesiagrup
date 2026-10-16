import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EcosystemExhibition } from './ecosystem-exhibition';
import type { Entity } from '@/lib/cms/entities';
import type { StoryScene } from '@/lib/cms/story-scenes';

function entity(overrides: Partial<Entity> = {}): Entity {
  return {
    id: overrides.id ?? '1',
    name: 'Environesia',
    slug: 'environesia-consultant',
    logo_path: null,
    cover_image_path: null,
    description: null,
    short_description: null,
    tagline: null,
    accent_color: null,
    capability_title: null,
    capability_description: null,
    services: [],
    legalitas: [],
    lini: null,
    email: null,
    phone: null,
    website: null,
    status: 'published',
    sort_order: 0,
    created_at: '',
    updated_at: '',
    explorer_category: null,
    explorer_description: null,
    explorer_contribution: null,
    explorer_focus: [],
    explorer_image_path: null,
    explorer_services: [],
    explorer_role: null,
    explorerCategory: 'Environmental Consulting',
    explorerDescription: 'Deskripsi Environesia.',
    explorerContribution: 'Kontribusi Environesia.',
    explorerFocus: ['Consulting'],
    explorerServices: ['Environmental Consulting'],
    explorerRole: 'Peran Environesia.',
    explorerImageSrc: '/brand/entitas-environesia-photo.png',
    explorerCtaUrl: 'https://environesia.co.id/',
    ...overrides,
  } as Entity;
}

const GROUP_PHOTO = { imageSrc: 'https://media.test/legacy/banners2.jpg', imageAlt: 'Tim Environesia' };

function scene(overrides: Partial<StoryScene> = {}): StoryScene {
  return {
    id: overrides.id ?? 's1',
    entity_id: '1',
    headline: null,
    description: null,
    image_path: 'legacy/scene.png',
    cta_label: null,
    cta_url: null,
    sort_order: 0,
    status: 'published',
    created_at: '',
    updated_at: '',
    imageUrl: 'https://media.test/legacy/scene.png',
    ...overrides,
  } as StoryScene;
}

describe('EcosystemExhibition — real photo carousel', () => {
  it('shows the Galeri block with 6 branded placeholder slots — never hidden, never a random photo — when the active brand has no published scenes', () => {
    render(<EcosystemExhibition entities={[entity()]} scenesByEntity={{}} groupPhoto={GROUP_PHOTO} />);
    expect(screen.getByText('Galeri Environesia')).toBeInTheDocument();
    expect(screen.getAllByText('Foto segera hadir')).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: /^Slot foto \d — belum tersedia$/ })).toHaveLength(6);
  });

  it('pads with placeholders when scenes exist but none have an image yet', () => {
    render(
      <EcosystemExhibition
        entities={[entity()]}
        scenesByEntity={{ '1': [scene({ image_path: null, imageUrl: undefined })] }}
        groupPhoto={GROUP_PHOTO}
      />
    );
    expect(screen.getByText('Galeri Environesia')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^Slot foto \d — belum tersedia$/ })).toHaveLength(6);
  });

  it('shows the Galeri block, the real photo, and its caption when the active brand has a published scene with an image', () => {
    render(
      <EcosystemExhibition
        entities={[entity()]}
        scenesByEntity={{ '1': [scene({ headline: 'Tim lapangan', description: 'Survei lokasi proyek.' })] }}
        groupPhoto={GROUP_PHOTO}
      />
    );
    expect(screen.getByText('Galeri Environesia')).toBeInTheDocument();
    expect(screen.getByText('Tim lapangan')).toBeInTheDocument();
    expect(screen.getByText('Survei lokasi proyek.')).toBeInTheDocument();
    // 1 real photo + 5 placeholders, to reach the 6-slot floor.
    expect(screen.getByRole('button', { name: 'Lihat foto 1' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^Slot foto \d — belum tersedia$/ })).toHaveLength(5);
  });

  it('shows no extra placeholder slots once there are already 6 or more real photos', () => {
    render(
      <EcosystemExhibition
        entities={[entity()]}
        scenesByEntity={{
          '1': [
            scene({ id: 's1', headline: 'Foto satu' }),
            scene({ id: 's2', headline: 'Foto dua' }),
            scene({ id: 's3', headline: 'Foto tiga' }),
            scene({ id: 's4', headline: 'Foto empat' }),
            scene({ id: 's5', headline: 'Foto lima' }),
            scene({ id: 's6', headline: 'Foto enam' }),
            scene({ id: 's7', headline: 'Foto tujuh' }),
          ],
        }}
        groupPhoto={GROUP_PHOTO}
      />
    );
    expect(screen.queryByText('Foto segera hadir')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Lihat foto 7' })).toBeInTheDocument();
  });

  it('cycles through multiple real photos via next/previous and jumps directly via a dot', async () => {
    const user = userEvent.setup();
    render(
      <EcosystemExhibition
        entities={[entity()]}
        scenesByEntity={{
          // Exactly 6 (the slot floor) — no placeholders padded in, so
          // wrapping backward past the first slot lands on the last real
          // photo rather than a placeholder slot.
          '1': [
            scene({ id: 's1', headline: 'Foto satu' }),
            scene({ id: 's2', headline: 'Foto dua' }),
            scene({ id: 's3', headline: 'Foto tiga' }),
            scene({ id: 's4', headline: 'Foto empat' }),
            scene({ id: 's5', headline: 'Foto lima' }),
            scene({ id: 's6', headline: 'Foto enam' }),
          ],
        }}
        groupPhoto={GROUP_PHOTO}
      />
    );

    expect(screen.getByText('Foto satu')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Foto berikutnya/ }));
    expect(screen.getByText('Foto dua')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Foto sebelumnya/ }));
    expect(screen.getByText('Foto satu')).toBeInTheDocument();

    // Wraps around past the first photo.
    await user.click(screen.getByRole('button', { name: /Foto sebelumnya/ }));
    expect(screen.getByText('Foto enam')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Lihat foto 2' }));
    expect(screen.getByText('Foto dua')).toBeInTheDocument();
  });

  it('resets the carousel to the first photo when switching to a different brand', async () => {
    const user = userEvent.setup();
    const entities = [
      entity({ id: '1', name: 'Environesia', slug: 'environesia-consultant' }),
      entity({ id: '2', name: 'GreenLab', slug: 'greenlab', explorerCtaUrl: 'https://greenlab.co.id/' }),
    ];
    render(
      <EcosystemExhibition
        entities={entities}
        scenesByEntity={{
          '1': [scene({ id: 's1', headline: 'Foto satu' }), scene({ id: 's2', headline: 'Foto dua' })],
          '2': [scene({ id: 'g1', entity_id: '2', headline: 'GreenLab foto' })],
        }}
        groupPhoto={GROUP_PHOTO}
      />
    );

    const exhibition = screen.getByRole('group', { name: 'Jelajahi perusahaan dalam Environesia' });
    await user.click(within(exhibition).getByRole('button', { name: /Foto berikutnya/ }));
    expect(screen.getByText('Foto dua')).toBeInTheDocument();

    await user.click(within(exhibition).getByRole('button', { name: 'Pilih GreenLab' }));
    expect(screen.getByText('GreenLab foto')).toBeInTheDocument();
    // GreenLab has only 1 real photo (padded to 6 slots with placeholders)
    // and the carousel still resets to slot 1 — if the old brand's index
    // (which went as high as slot 2) had carried over unexpectedly, this
    // would instead show a placeholder or throw on an out-of-range slot.
    expect(screen.getByRole('button', { name: 'Lihat foto 1' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByRole('button', { name: /^Slot foto \d — belum tersedia$/ })).toHaveLength(5);

    window.location.hash = '';
  });
});

function mockReducedMotion() {
  const original = window.matchMedia;
  window.matchMedia = ((query: string) =>
    ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList) as typeof window.matchMedia;
  return () => {
    window.matchMedia = original;
  };
}

describe('EcosystemExhibition — carousel autoplay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('advances to the next slot on its own after the autoplay interval', () => {
    render(
      <EcosystemExhibition
        entities={[entity()]}
        scenesByEntity={{
          '1': [scene({ id: 's1', headline: 'Foto satu' }), scene({ id: 's2', headline: 'Foto dua' })],
        }}
        groupPhoto={GROUP_PHOTO}
      />
    );

    expect(screen.getByText('Foto satu')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(4600));
    expect(screen.getByText('Foto dua')).toBeInTheDocument();
  });

  it('pauses autoplay for a while after a manual previous/next click, instead of advancing again immediately', () => {
    render(
      <EcosystemExhibition
        entities={[entity()]}
        scenesByEntity={{
          '1': [
            scene({ id: 's1', headline: 'Foto satu' }),
            scene({ id: 's2', headline: 'Foto dua' }),
            scene({ id: 's3', headline: 'Foto tiga' }),
          ],
        }}
        groupPhoto={GROUP_PHOTO}
      />
    );

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Foto berikutnya/ }));
    });
    expect(screen.getByText('Foto dua')).toBeInTheDocument();

    // The autoplay interval still ticks on its regular cadence in the
    // background — it just finds itself paused and skips this tick. So
    // just past one interval period (but still inside the 6s pause
    // window), it has not moved past the manual click's position yet.
    act(() => vi.advanceTimersByTime(4600));
    expect(screen.getByText('Foto dua')).toBeInTheDocument();

    // By the following tick, the pause window (6s from the click) has
    // elapsed, so autoplay advances again on its own.
    act(() => vi.advanceTimersByTime(4500));
    expect(screen.getByText('Foto tiga')).toBeInTheDocument();
  });

  it('never autoplays at all under prefers-reduced-motion', () => {
    const restore = mockReducedMotion();
    render(
      <EcosystemExhibition
        entities={[entity()]}
        scenesByEntity={{
          '1': [scene({ id: 's1', headline: 'Foto satu' }), scene({ id: 's2', headline: 'Foto dua' })],
        }}
        groupPhoto={GROUP_PHOTO}
      />
    );

    expect(screen.getByText('Foto satu')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(20000));
    expect(screen.getByText('Foto satu')).toBeInTheDocument();

    restore();
  });
});

describe('EcosystemExhibition — Tautan Platform Resmi (YouTube/TikTok)', () => {
  it('shows no social links row at all when the active brand has neither set', () => {
    render(<EcosystemExhibition entities={[entity()]} scenesByEntity={{}} groupPhoto={GROUP_PHOTO} />);
    expect(screen.queryByRole('link', { name: /YouTube/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /TikTok/ })).not.toBeInTheDocument();
  });

  it('shows only the icon for the one link a brand has set', () => {
    render(
      <EcosystemExhibition
        entities={[entity({ socialYoutubeUrl: 'https://www.youtube.com/@Bangsap.Podcast' })]}
        scenesByEntity={{}}
        groupPhoto={GROUP_PHOTO}
      />
    );
    const youtube = screen.getByRole('link', { name: 'YouTube — Environesia' });
    expect(youtube).toHaveAttribute('href', 'https://www.youtube.com/@Bangsap.Podcast');
    expect(youtube).toHaveAttribute('target', '_blank');
    expect(youtube).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.queryByRole('link', { name: /TikTok/ })).not.toBeInTheDocument();
  });

  it('shows both icons, each pointing to the right place, when a brand (Bangsap) has both set', () => {
    render(
      <EcosystemExhibition
        entities={[
          entity({
            id: '6',
            name: 'Bangsap: Bangun Strategi & Perspektif',
            slug: 'bangsap',
            socialYoutubeUrl: 'https://www.youtube.com/@Bangsap.Podcast',
            socialTiktokUrl: 'https://www.tiktok.com/@abangsap_',
          }),
        ]}
        scenesByEntity={{}}
        groupPhoto={GROUP_PHOTO}
      />
    );
    expect(screen.getByRole('link', { name: /YouTube/ })).toHaveAttribute(
      'href',
      'https://www.youtube.com/@Bangsap.Podcast'
    );
    expect(screen.getByRole('link', { name: /TikTok/ })).toHaveAttribute('href', 'https://www.tiktok.com/@abangsap_');
  });
});

describe('EcosystemExhibition — left photo (Foto Showcase)', () => {
  it("shows the active brand's own explorerImageSrc (Foto Showcase, set per-entity in wp-admin), not the static group photo, when it has one", () => {
    render(
      <EcosystemExhibition
        entities={[entity({ explorerImageSrc: 'https://media.test/legacy/bangsap.jpeg' })]}
        scenesByEntity={{}}
        groupPhoto={GROUP_PHOTO}
      />
    );
    const photo = screen.getByAltText('Foto Environesia');
    expect(photo).toHaveAttribute('src', expect.stringContaining(encodeURIComponent('https://media.test/legacy/bangsap.jpeg')));
    expect(screen.queryByAltText(GROUP_PHOTO.imageAlt)).not.toBeInTheDocument();
  });

  it('falls back to the static Group photo when the active brand has no explorerImageSrc set', () => {
    render(
      <EcosystemExhibition
        entities={[entity({ explorerImageSrc: undefined })]}
        scenesByEntity={{}}
        groupPhoto={GROUP_PHOTO}
      />
    );
    expect(screen.getByAltText(GROUP_PHOTO.imageAlt)).toBeInTheDocument();
    expect(screen.queryByAltText('Foto Environesia')).not.toBeInTheDocument();
  });
});
