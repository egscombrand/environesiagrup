import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/supabase/public', () => ({ createPublicClient: vi.fn() }));
vi.mock('@/lib/cms/media', () => ({
  publicMediaUrl: (path: string | null | undefined) => (path ? `https://media.test/${path}` : undefined),
}));

import { buildBisnisLayanan } from './bisnis-layanan';
import { BISNIS_LAYANAN_FALLBACK, GROUP_PHOTO_PATH } from './bisnis-layanan-content';

describe('buildBisnisLayanan', () => {
  it('shows the current copy when no rows exist', () => {
    const content = buildBisnisLayanan(null, null);
    expect(content.hero).toEqual(BISNIS_LAYANAN_FALLBACK.hero);
    expect(content.ekosistem).toEqual(BISNIS_LAYANAN_FALLBACK.ekosistem);
  });

  it('takes the hero heading and lead from its row', () => {
    const content = buildBisnisLayanan({ title: 'Judul baru', description: 'Lead baru' }, null);
    expect(content.hero).toEqual({
      title: 'Judul baru',
      description: 'Lead baru',
      metaTitle: BISNIS_LAYANAN_FALLBACK.hero.metaTitle,
      metaDescription: BISNIS_LAYANAN_FALLBACK.hero.metaDescription,
    });
  });

  it('takes the ekosistem heading and rich text from its row', () => {
    const content = buildBisnisLayanan(null, { title: 'Judul E', description: 'Teks **tebal**' });
    expect(content.ekosistem).toEqual({ title: 'Judul E', richText: 'Teks **tebal**' });
  });

  describe('groupPhoto', () => {
    it('uses the already-migrated real photo as the default — never a placeholder — when no row or image is stored yet', () => {
      const content = buildBisnisLayanan(null, null);
      expect(content.groupPhoto).toEqual({
        imageSrc: `https://media.test/${GROUP_PHOTO_PATH}`,
        imageAlt: BISNIS_LAYANAN_FALLBACK.groupPhoto.imageAlt,
      });
    });

    it('still falls back to the migrated photo when the hero row exists but has no group-photo image stored', () => {
      const content = buildBisnisLayanan({ title: 'Judul baru', images: [] }, null);
      expect(content.groupPhoto.imageSrc).toBe(`https://media.test/${GROUP_PHOTO_PATH}`);
    });

    it('takes the photo and alt text an admin uploaded, once one is stored', () => {
      const content = buildBisnisLayanan(
        { images: [{ key: 'group-photo', path: 'media/group.jpg', alt: 'Tim lapangan Environesia' }] },
        null
      );
      expect(content.groupPhoto).toEqual({
        imageSrc: 'https://media.test/media/group.jpg',
        imageAlt: 'Tim lapangan Environesia',
      });
    });
  });
});
