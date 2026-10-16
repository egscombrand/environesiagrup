import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/cms/entities', () => ({
  getPublishedEntitySlugs: vi.fn().mockResolvedValue(['environesia', 'greenlab', 'greenskill', 'lsp-praktisi-lingkungan', 'bikin-indonesia-berdaya']),
}));

vi.mock('@/lib/cms/jobs', () => ({
  getPublishedJobSlugs: vi.fn().mockResolvedValue(['staff-lapangan']),
}));

vi.mock('@/lib/cms/pillars', () => ({
  getPublishedPillarSlugs: vi.fn().mockResolvedValue(['konsultasi', 'pengujian-sampling', 'pelatihan-kompetensi', 'sertifikasi-profesi']),
}));

vi.mock('@/lib/cms/posts', () => ({
  getPublishedPostSlugs: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/lib/cms/projects', () => ({
  getPublishedProjectSlugs: vi.fn().mockResolvedValue([]),
}));

const { default: sitemap } = await import('./sitemap');

describe('sitemap', () => {
  it('includes the homepage for both locales', async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toContain('https://example.invalid/id');
    expect(urls).toContain('https://example.invalid/en');
    expect(urls).toContain('https://example.invalid/zh');
  });

  it('includes every entity detail page in both locales', async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toContain('https://example.invalid/id/entitas/greenlab');
    expect(urls).toContain('https://example.invalid/en/entitas/bikin-indonesia-berdaya');
    expect(urls).toContain('https://example.invalid/zh/entitas/greenlab');
  });

  it('includes every pillar detail page in both locales', async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toContain('https://example.invalid/id/bisnis/konsultasi');
    expect(urls).toContain('https://example.invalid/en/bisnis/sertifikasi-profesi');
  });

  it('includes every open job detail page in both locales', async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toContain('https://example.invalid/id/karier/staff-lapangan');
    expect(urls).toContain('https://example.invalid/en/karier/staff-lapangan');
  });

  it('never emits a duplicate url', async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('gives the homepage a higher priority than a detail page', async () => {
    const entries = await sitemap();
    const home = entries.find((entry) => entry.url.endsWith('/id'));
    const detail = entries.find((entry) => entry.url.endsWith('/id/entitas/greenlab'));
    expect(home?.priority).toBeGreaterThan(detail?.priority ?? 1);
  });
});
