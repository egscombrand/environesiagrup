import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { makeEntity } from '@/lib/cms/fixtures';

vi.mock('@/lib/cms/entities', () => ({
  getPublishedEntities: vi.fn(),
}));

const { getPublishedEntities } = await import('@/lib/cms/entities');
const { BusinessProjectsDeck } = await import('./business-projects-deck');

describe('BusinessProjectsDeck', () => {
  it('shows an honest empty state when none of the CMS entities match a known deck', async () => {
    vi.mocked(getPublishedEntities).mockResolvedValue([]);

    render(await BusinessProjectsDeck({ locale: 'id' }));

    expect(screen.getByText('Satu Dekade Environesia Membangun Negeri')).toBeInTheDocument();
    expect(screen.getByText('Daftar proyek sedang disiapkan.')).toBeInTheDocument();
  });

  it("renders Environesia's real project data by default when it's the only entity", async () => {
    vi.mocked(getPublishedEntities).mockResolvedValue([
      makeEntity({ id: 'e1', name: 'Environesia', slug: 'environesia-consultant' }),
    ]);

    render(await BusinessProjectsDeck({ locale: 'id' }));

    // "PT Bukit Asam Tbk" is both the project's client heading and its own
    // "Perusahaan" detail value, so it legitimately appears twice.
    expect(screen.getAllByText('PT Bukit Asam Tbk').length).toBeGreaterThan(0);
    expect(screen.getByText(/Jasa Pemantauan Lingkungan UPTE dan PLTU 3X10 MW/)).toBeInTheDocument();
    expect(screen.getByText('Kabupaten Muara Enim')).toBeInTheDocument();
    expect(screen.getByText('Sumatera Selatan')).toBeInTheDocument();
  });

  it("never repeats the active entity's own logo/name/description in the project panel — the coverflow above already shows it", async () => {
    vi.mocked(getPublishedEntities).mockResolvedValue([
      makeEntity({
        id: 'e1',
        name: 'Environesia',
        slug: 'environesia-consultant',
        short_description: 'Konsultan lingkungan terintegrasi.',
      }),
    ]);

    render(await BusinessProjectsDeck({ locale: 'id' }));

    // The entity name still appears once, as the coverflow card's own
    // label (not a heading) — but never again as a second heading/blurb.
    expect(screen.queryByRole('heading', { name: 'Environesia' })).not.toBeInTheDocument();
    expect(screen.queryByText('Konsultan lingkungan terintegrasi.')).not.toBeInTheDocument();
    // The active project's own name (the work itself) is the headline
    // instead — the client name is secondary context text beside it.
    expect(
      screen.getByRole('heading', { name: /Jasa Pemantauan Lingkungan UPTE dan PLTU 3X10 MW/ })
    ).toBeInTheDocument();
  });

  it('skips a metadata field entirely when it has no known value, rather than showing a bare "-"', async () => {
    vi.mocked(getPublishedEntities).mockResolvedValue([
      makeEntity({ id: 'e1', name: 'Environesia', slug: 'environesia-consultant' }),
    ]);

    render(await BusinessProjectsDeck({ locale: 'id' }));

    // Bukit Asam's own "Tanggal" has no known value — the field is hidden,
    // not rendered as "Tanggal / -".
    expect(screen.queryByText('Tanggal')).not.toBeInTheDocument();
    // Its known fields still render normally.
    expect(screen.getByText('Lokasi')).toBeInTheDocument();
    expect(screen.getByText('Kabupaten Muara Enim')).toBeInTheDocument();
  });

  it('opens with the 3rd entity centered as the active one when at least 3 are published', async () => {
    vi.mocked(getPublishedEntities).mockResolvedValue([
      makeEntity({ id: 'e1', name: 'Environesia', slug: 'environesia-consultant' }),
      makeEntity({ id: 'e2', name: 'GreenLab', slug: 'greenlab' }),
      makeEntity({ id: 'e3', name: 'LSP Praktisi Lingkungan Indonesia', slug: 'lsp-praktisi-lingkungan' }),
      makeEntity({ id: 'e4', name: 'GreenSkill', slug: 'greenskill' }),
      makeEntity({ id: 'e5', name: 'Bikin Indonesia Berdaya', slug: 'bikin-indonesia-berdaya' }),
    ]);

    render(await BusinessProjectsDeck({ locale: 'id' }));

    expect(screen.getByRole('button', { name: 'LSP Praktisi Lingkungan Indonesia' })).toHaveAttribute(
      'aria-current',
      'true'
    );
    // LSP's own placeholder project shows up as the active project
    // headline, confirming the panel followed the coverflow switch.
    expect(screen.getByRole('heading', { name: 'Sertifikasi Kompetensi Praktisi Lingkungan' })).toBeInTheDocument();
  });

  it('only shows a coverflow card for an entity that actually has a matching published CMS record — never a fabricated one', async () => {
    vi.mocked(getPublishedEntities).mockResolvedValue([
      makeEntity({ id: 'e1', name: 'Environesia', slug: 'environesia-consultant' }),
      makeEntity({ id: 'e2', name: 'GreenLab', slug: 'greenlab' }),
    ]);

    render(await BusinessProjectsDeck({ locale: 'id' }));

    expect(screen.getByRole('button', { name: 'Environesia' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'GreenLab' })).toBeInTheDocument();
    // LSP/GreenSkill/Bikin Indonesia Berdaya weren't published in this test,
    // so their cards must not appear even though they exist in the static data.
    expect(screen.queryByRole('button', { name: /LSP/ })).not.toBeInTheDocument();
  });

  it("clicking an entity card swaps the panel to that entity's own projects", async () => {
    const user = userEvent.setup();
    vi.mocked(getPublishedEntities).mockResolvedValue([
      makeEntity({ id: 'e1', name: 'Environesia', slug: 'environesia-consultant' }),
      makeEntity({ id: 'e2', name: 'GreenLab', slug: 'greenlab' }),
    ]);

    render(await BusinessProjectsDeck({ locale: 'id' }));

    // With 2 entities, the "3rd" default clamps to the last one (GreenLab).
    expect(
      screen.getByRole('heading', { name: 'Pengujian dan Pemantauan Kualitas Lingkungan' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Environesia' }));

    expect(
      screen.getByRole('heading', { name: /Jasa Pemantauan Lingkungan UPTE dan PLTU 3X10 MW/ })
    ).toBeInTheDocument();
  });

  it('hovering a non-active entity card gives it a subtle lift without making it the active one', async () => {
    const user = userEvent.setup();
    vi.mocked(getPublishedEntities).mockResolvedValue([
      makeEntity({ id: 'e1', name: 'Environesia', slug: 'environesia-consultant' }),
      makeEntity({ id: 'e2', name: 'GreenLab', slug: 'greenlab' }),
    ]);

    render(await BusinessProjectsDeck({ locale: 'id' }));

    // With 2 entities, the "3rd" default clamps to the last one (GreenLab).
    const environesiaCard = screen.getByRole('button', { name: 'Environesia' });
    const styleBeforeHover = environesiaCard.getAttribute('style');

    await user.hover(environesiaCard);

    expect(environesiaCard.getAttribute('style')).not.toBe(styleBeforeHover);
    expect(environesiaCard).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('button', { name: 'GreenLab' })).toHaveAttribute('aria-current', 'true');
  });

  it('the entity arrows step to the previous/next card and wrap around at the ends', async () => {
    const user = userEvent.setup();
    vi.mocked(getPublishedEntities).mockResolvedValue([
      makeEntity({ id: 'e1', name: 'Environesia', slug: 'environesia-consultant' }),
      makeEntity({ id: 'e2', name: 'GreenLab', slug: 'greenlab' }),
      makeEntity({ id: 'e3', name: 'LSP Praktisi Lingkungan Indonesia', slug: 'lsp-praktisi-lingkungan' }),
    ]);

    render(await BusinessProjectsDeck({ locale: 'id' }));

    // Opens on the 3rd (LSP, the last of these three).
    expect(screen.getByRole('button', { name: 'LSP Praktisi Lingkungan Indonesia' })).toHaveAttribute(
      'aria-current',
      'true'
    );

    await user.click(screen.getByRole('button', { name: 'Entitas berikutnya' }));
    expect(screen.getByRole('button', { name: 'Environesia' })).toHaveAttribute('aria-current', 'true');

    await user.click(screen.getByRole('button', { name: 'Entitas sebelumnya' }));
    expect(screen.getByRole('button', { name: 'LSP Praktisi Lingkungan Indonesia' })).toHaveAttribute(
      'aria-current',
      'true'
    );
  });

  it('a placeholder entity never shows the word "dummy" or "placeholder" anywhere in the UI', async () => {
    vi.mocked(getPublishedEntities).mockResolvedValue([
      makeEntity({ id: 'e2', name: 'GreenLab', slug: 'greenlab' }),
    ]);

    const { container } = render(await BusinessProjectsDeck({ locale: 'id' }));

    expect(container.textContent?.toLowerCase()).not.toContain('dummy');
    expect(container.textContent?.toLowerCase()).not.toContain('placeholder');
  });

  it('never renders the "Bikin Indonesia Berdaya" entity name as the "BIB" abbreviation', async () => {
    vi.mocked(getPublishedEntities).mockResolvedValue([
      makeEntity({ id: 'e1', name: 'Environesia', slug: 'environesia-consultant' }),
      makeEntity({ id: 'e5', name: 'Bikin Indonesia Berdaya', slug: 'bikin-indonesia-berdaya' }),
    ]);

    const { container } = render(await BusinessProjectsDeck({ locale: 'id' }));

    expect(screen.getByRole('button', { name: 'Bikin Indonesia Berdaya' })).toBeInTheDocument();
    expect(container.textContent).not.toContain('BIB');
  });

  it('shows the active project photo distinguished by aria-current', async () => {
    vi.mocked(getPublishedEntities).mockResolvedValue([
      makeEntity({ id: 'e1', name: 'Environesia', slug: 'environesia-consultant' }),
    ]);

    render(await BusinessProjectsDeck({ locale: 'id' }));

    expect(screen.getByRole('button', { name: /^PT Bukit Asam Tbk/ })).toHaveAttribute('aria-current', 'true');
  });

  it('the project carousel arrows step to the previous/next project and disable at the ends', async () => {
    const user = userEvent.setup();
    vi.mocked(getPublishedEntities).mockResolvedValue([
      makeEntity({ id: 'e1', name: 'Environesia', slug: 'environesia-consultant' }),
    ]);

    render(await BusinessProjectsDeck({ locale: 'id' }));

    const previous = screen.getByRole('button', { name: 'Proyek sebelumnya' });
    const next = screen.getByRole('button', { name: 'Proyek berikutnya' });
    expect(previous).toBeDisabled();

    await user.click(next);

    expect(screen.getByRole('button', { name: /^PT Bina Guna Kimia \(FMC Corporation\)/ })).toHaveAttribute(
      'aria-current',
      'true'
    );
    expect(
      screen.getByRole('heading', { name: 'Perubahan persetujuan lingkungan dan penambahan kapasitas produksi' })
    ).toBeInTheDocument();
    expect(previous).not.toBeDisabled();
  });

  it('clicking a peeking project photo jumps straight to it and updates the detail panel', async () => {
    const user = userEvent.setup();
    vi.mocked(getPublishedEntities).mockResolvedValue([
      makeEntity({ id: 'e1', name: 'Environesia', slug: 'environesia-consultant' }),
    ]);

    render(await BusinessProjectsDeck({ locale: 'id' }));

    const secondPhoto = screen.getByRole('button', { name: /^PT Bina Guna Kimia \(FMC Corporation\)/ });
    expect(secondPhoto).not.toHaveAttribute('aria-current');

    await user.click(secondPhoto);

    expect(secondPhoto).toHaveAttribute('aria-current', 'true');
    expect(
      screen.getByRole('heading', { name: 'Perubahan persetujuan lingkungan dan penambahan kapasitas produksi' })
    ).toBeInTheDocument();
  });
});
