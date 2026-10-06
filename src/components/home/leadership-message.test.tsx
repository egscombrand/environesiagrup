import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LeadershipMessage } from './leadership-message';

describe('LeadershipMessage', () => {
  it('renders the heading and the real Direktur Utama photo, with no default eyebrow', async () => {
    render(await LeadershipMessage({ locale: 'id' }));

    expect(
      screen.getByRole('heading', { name: '1 Dekade Menghadirkan Dampak, Inovasi dan Solusi Nyata' })
    ).toBeInTheDocument();

    const photo = screen.getByRole('img');
    expect(photo).toHaveAttribute('src', expect.stringContaining('direktur-utama.png'));
    expect(photo).toHaveAttribute('alt', expect.stringContaining('Ir. Saprian'));
  });

  it('renders a title override as the eyebrow when the CMS supplies one', async () => {
    render(await LeadershipMessage({ locale: 'id', title: 'Custom Eyebrow' }));
    expect(screen.getByText('Custom Eyebrow')).toBeInTheDocument();
  });

  it('renders the full real message, never a placeholder', async () => {
    render(await LeadershipMessage({ locale: 'id' }));

    expect(
      screen.getByText(/Environesia tumbuh dari sebuah perusahaan konsultansi lingkungan/)
    ).toBeInTheDocument();
    expect(screen.getByText(/lebih dari 1\.000 proyek telah kami selesaikan di 38 provinsi dan 10 negara/)).toBeInTheDocument();
    expect(screen.getByText(/dapat dipertanggungjawabkan\./)).toBeInTheDocument();
    expect(screen.getByText(/kapasitas sumber daya manusia/)).toBeInTheDocument();
    expect(screen.getByText(/profesionalisme dan integritas menjadi prinsip yang kami jaga/)).toBeInTheDocument();
    expect(
      screen.getByText(/Sepuluh tahun perjalanan adalah sebuah pencapaian, tetapi juga menjadi awal/)
    ).toBeInTheDocument();
    expect(screen.getByText(/ecosystem yang terus berkembang, Environesia berkomitmen/)).toBeInTheDocument();

    expect(screen.queryByText(/akan ditambahkan di sini/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/menyusul/i)).not.toBeInTheDocument();
  });

  it('renders the real signature — name and correct title — never a fabricated one', async () => {
    render(await LeadershipMessage({ locale: 'id' }));

    expect(screen.getByText('Ir. Saprian, S.T., M.Sc., M.T., IPM., ASEAN Eng.')).toBeInTheDocument();
    expect(screen.getByText('Direktur Utama PT Environesia Global Saraya')).toBeInTheDocument();
  });

  it('keeps the heading and real message fixed across locales, but still localizes the signature title', async () => {
    render(await LeadershipMessage({ locale: 'en' }));

    // The heading, like the message body, is real supplied copy — not
    // translated per locale.
    expect(
      screen.getByRole('heading', { name: '1 Dekade Menghadirkan Dampak, Inovasi dan Solusi Nyata' })
    ).toBeInTheDocument();
    expect(screen.getByText('President Director of PT Environesia Global Saraya')).toBeInTheDocument();
    expect(
      screen.getByText(/Environesia tumbuh dari sebuah perusahaan konsultansi lingkungan/)
    ).toBeInTheDocument();
    expect(screen.getByText('Ir. Saprian, S.T., M.Sc., M.T., IPM., ASEAN Eng.')).toBeInTheDocument();
  });
});
