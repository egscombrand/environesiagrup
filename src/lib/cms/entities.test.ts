import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
vi.mock('@/lib/supabase/public', () => ({ createPublicClient: vi.fn() }));
vi.mock('@/lib/cms/media', () => ({
  publicMediaUrl: (path: string | null | undefined) => (path ? `https://media.test/${path}` : undefined),
}));

import { ENTITY_EXPLORER_FALLBACK } from './entity-explorer-content';

const row = (overrides: Record<string, unknown> = {}) => ({
  id: 'e1',
  name: 'GreenLab',
  slug: 'greenlab',
  logo_path: null,
  cover_image_path: null,
  website: null,
  explorer_category: null,
  explorer_description: null,
  explorer_contribution: null,
  explorer_focus: [],
  explorer_services: [],
  explorer_role: null,
  explorer_image_path: null,
  ...overrides,
});

describe('Entity Explorer fallback (via getPublishedEntities\' mapping)', () => {
  it('falls back to the hardcoded profile, one field at a time, when the database columns are empty', async () => {
    const { getPublishedEntities } = await import('./entities');
    const { createPublicClient } = await import('@/lib/supabase/public');
    (createPublicClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            is: () => ({
              order: () => Promise.resolve({ data: [row()], error: null }),
            }),
          }),
        }),
      }),
    });

    const [entity] = await getPublishedEntities();
    const fb = ENTITY_EXPLORER_FALLBACK.greenlab;
    expect(entity.explorerCategory).toBe(fb.category);
    expect(entity.explorerDescription).toBe(fb.description);
    expect(entity.explorerContribution).toBe(fb.contribution);
    expect(entity.explorerFocus).toEqual(fb.focus);
    expect(entity.explorerServices).toEqual(fb.services);
    expect(entity.explorerRole).toBe(fb.roleInGroup);
    expect(entity.explorerImageSrc).toBe(`https://media.test/${fb.imagePath}`);
    expect(entity.explorerCtaUrl).toBeUndefined();
  });

  it('prefers the database value for any field that is actually set, and derives the CTA from website', async () => {
    const { getPublishedEntities } = await import('./entities');
    const { createPublicClient } = await import('@/lib/supabase/public');
    (createPublicClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            is: () => ({
              order: () =>
                Promise.resolve({
                  data: [row({ explorer_category: 'Kategori Baru', website: 'toolsgl.my.id' })],
                  error: null,
                }),
            }),
          }),
        }),
      }),
    });

    const [entity] = await getPublishedEntities();
    expect(entity.explorerCategory).toBe('Kategori Baru');
    expect(entity.explorerCtaUrl).toBe('https://toolsgl.my.id');
  });
});
