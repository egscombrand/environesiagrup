import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/cms/posts', () => ({
  getFeaturedPublishedPosts: vi.fn().mockResolvedValue([]),
}));

const { NewsCards } = await import('./news-cards');

describe('NewsCards', () => {
  it('renders an honest empty state when there are no posts yet', async () => {
    render(await NewsCards({ locale: 'id' }));
    expect(screen.getByText('Belum ada berita terbaru.')).toBeInTheDocument();
  });
});
