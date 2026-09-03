import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MilestonesJourney } from './milestones-journey';
import type { Milestone } from '@/lib/cms/milestones';

const milestones = [
  { id: '1', year: 2021, date_label: '13 Januari 2021', title: 'Langkah pertama', description: 'Awal', imageUrl: '/a.jpg', sort_order: 0 },
  { id: '2', year: 2022, date_label: '', title: 'Tumbuh', description: 'Kedua', imageUrl: '/b.jpg', sort_order: 1 },
  { id: '3', year: 2023, date_label: '', title: 'Meluas', description: 'Ketiga', imageUrl: '/c.jpg', sort_order: 2 },
] as unknown as Milestone[];

function renderJourney() {
  return render(
    <MilestonesJourney
      milestones={milestones}
      heading="Pencapaian & Tonggak Sejarah"
      eyebrow="Perjalanan Kami"
      intro="Dari sebuah langkah kecil."
      previousLabel="Sebelumnya"
      nextLabel="Berikutnya"
    />
  );
}

describe('MilestonesJourney', () => {
  it('shows the first milestone on load', () => {
    renderJourney();
    expect(screen.getByRole('heading', { name: 'Langkah pertama' })).toBeInTheDocument();
    expect(screen.getByText('01 / 03')).toBeInTheDocument();
  });

  it('advances and goes back through milestones', async () => {
    const user = userEvent.setup();
    renderJourney();

    await user.click(screen.getByRole('button', { name: /Berikutnya/ }));
    expect(await screen.findByRole('heading', { name: 'Tumbuh' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Sebelumnya/ }));
    expect(await screen.findByRole('heading', { name: 'Langkah pertama' })).toBeInTheDocument();
  });

  it('disables the controls at each end rather than wrapping', async () => {
    const user = userEvent.setup();
    renderJourney();

    expect(screen.getByRole('button', { name: /Sebelumnya/ })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: /Berikutnya/ }));
    await user.click(screen.getByRole('button', { name: /Berikutnya/ }));

    expect(await screen.findByRole('heading', { name: 'Meluas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Berikutnya/ })).toBeDisabled();
  });

  it('keeps the image inside a fixed aspect-ratio frame so the panel cannot jump height', () => {
    const { container } = renderJourney();

    // the frame is what makes the crossfade free of layout cost — the
    // outgoing and incoming images overlap inside a box of constant size
    const frame = container.querySelector('.aspect-\\[4\\/3\\]');
    expect(frame).toBeInTheDocument();
    expect(frame?.className).toContain('relative');
    expect(frame?.querySelector('.absolute')).toBeInTheDocument();
  });

  it('gives the carousel controls a 44px touch target', () => {
    renderJourney();
    for (const name of [/Sebelumnya/, /Berikutnya/]) {
      expect(screen.getByRole('button', { name }).className).toContain('min-h-[44px]');
    }
  });
});
