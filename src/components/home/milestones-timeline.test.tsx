import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { makeMilestone } from '@/lib/cms/fixtures';

vi.mock('@/lib/cms/milestones', () => ({
  getPublishedMilestones: vi.fn().mockResolvedValue([]),
}));
vi.mock('@/lib/cms/settings', () => ({
  getSiteSettings: vi.fn().mockResolvedValue({
    id: 1,
    milestones_eyebrow: null,
    milestones_intro: null,
  } as never),
}));

const { MilestonesTimeline } = await import('./milestones-timeline');

describe('MilestonesTimeline', () => {
  it('renders an honest empty state when there are no milestones yet', async () => {
    render(await MilestonesTimeline({ locale: 'id' }));
    expect(screen.getByText('Tonggak sejarah grup sedang disusun.')).toBeInTheDocument();
  });
});

describe('MilestonesTimeline with data', () => {
  async function renderWith(milestones: ReturnType<typeof makeMilestone>[]) {
    vi.resetModules();
    vi.doMock('@/lib/cms/milestones', () => ({
      getPublishedMilestones: vi.fn().mockResolvedValue(milestones),
    }));
    vi.doMock('@/lib/cms/settings', () => ({
      getSiteSettings: vi.fn().mockResolvedValue({ id: 1, milestones_eyebrow: null, milestones_intro: null } as never),
    }));
    const { MilestonesTimeline: WithData } = await import('./milestones-timeline');
    return render(await WithData({ locale: 'id' }));
  }

  const two = [
    makeMilestone({ year: 2016, title: 'Environesia didirikan', description: 'Awal mula.', sort_order: 1 }),
    makeMilestone({ year: 2020, title: 'GreenLab terakreditasi KAN', description: 'Pengakuan formal.', sort_order: 2 }),
  ];

  it('renders each milestone with its real year, never a fabricated one — first one active by default', async () => {
    await renderWith(two);
    expect(screen.getAllByText('2016').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Environesia didirikan').length).toBeGreaterThan(0);
    expect(screen.getByText('2020')).toBeInTheDocument();
    expect(screen.getByText('Awal mula.')).toBeInTheDocument();
  });

  it('clicking a milestone node makes it the active story', async () => {
    const user = userEvent.setup();
    await renderWith(two);

    await user.click(screen.getByRole('button', { name: /2020.*GreenLab terakreditasi KAN/ }));
    expect(screen.getByText('Pengakuan formal.')).toBeInTheDocument();
  });

  it('Next and Previous move sequentially and disable at the ends', async () => {
    const user = userEvent.setup();
    await renderWith(two);

    const next = screen.getByRole('button', { name: /Berikutnya/ });
    const previous = screen.getByRole('button', { name: /Sebelumnya/ });
    expect(previous).toBeDisabled();

    await user.click(next);
    expect(screen.getByText('Pengakuan formal.')).toBeInTheDocument();
    expect(next).toBeDisabled();

    await user.click(previous);
    expect(screen.getByText('Awal mula.')).toBeInTheDocument();
  });

  it('a single milestone shows no Previous/Next navigation', async () => {
    await renderWith([makeMilestone({ year: 2016, title: 'Environesia didirikan' })]);
    expect(screen.queryByRole('button', { name: /Berikutnya/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Sebelumnya/ })).not.toBeInTheDocument();
  });

  it('a milestone with no image falls back to a typography-only story, no crash', async () => {
    await renderWith([makeMilestone({ year: 2016, title: 'Environesia didirikan', image_path: null })]);
    expect(screen.getByRole('heading', { name: 'Environesia didirikan' })).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
