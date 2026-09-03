import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeLeadershipMember } from '@/lib/cms/fixtures';

vi.mock('@/lib/cms/leadership', () => ({
  getPublishedLeadership: vi.fn().mockResolvedValue([]),
}));

const { LeadershipRoster } = await import('./leadership-roster');

describe('LeadershipRoster', () => {
  it('renders an honest empty state when there is no leadership data yet', async () => {
    render(await LeadershipRoster({ locale: 'id' }));
    expect(screen.getByText('Profil pimpinan sedang disiapkan.')).toBeInTheDocument();
  });
});

describe('LeadershipRoster with data', () => {
  it('renders name and position as the primary visual, with no portrait placeholder when photoUrl is absent', async () => {
    vi.resetModules();
    vi.doMock('@/lib/cms/leadership', () => ({
      getPublishedLeadership: vi.fn().mockResolvedValue([
        makeLeadershipMember({ name: 'Contoh Direktur', position: 'Direktur Utama', photoUrl: undefined }),
      ]),
    }));
    const { LeadershipRoster: WithData } = await import('./leadership-roster');
    const { container } = render(await WithData({ locale: 'id' }));
    expect(screen.getByText('Contoh Direktur')).toBeInTheDocument();
    expect(screen.getByText('Direktur Utama')).toBeInTheDocument();
    // no portrait image rendered when photoUrl is falsy
    expect(container.querySelectorAll('img')).toHaveLength(0);
  });

  it('renders a portrait image when photoUrl is present', async () => {
    vi.resetModules();
    vi.doMock('@/lib/cms/leadership', () => ({
      getPublishedLeadership: vi.fn().mockResolvedValue([
        makeLeadershipMember({ name: 'Contoh Direktur', photoUrl: 'https://example.invalid/photo.jpg' }),
      ]),
    }));
    const { LeadershipRoster: WithPhoto } = await import('./leadership-roster');
    const { container } = render(await WithPhoto({ locale: 'id' }));
    expect(container.querySelectorAll('img')).toHaveLength(1);
  });
});
