import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DirectorProfileButton, type DirectorProfile } from './director-profile-modal';

const BASE: DirectorProfile = {
  name: 'Orang Uji',
  position: 'Direktur Uji',
};

async function openModal(person: DirectorProfile) {
  const user = userEvent.setup();
  render(<DirectorProfileButton person={person} />);
  await user.click(screen.getByRole('button', { name: /Lihat Profil Lengkap/ }));
  return screen.getByRole('dialog');
}

describe('DirectorProfileButton — Professional Links', () => {
  it('shows no Tautan Profesional section at all when no link is set', async () => {
    const dialog = await openModal(BASE);
    expect(dialog).not.toHaveTextContent('Tautan Profesional');
  });

  it('shows only the icons for links that are actually set', async () => {
    const dialog = await openModal({ ...BASE, linkedinUrl: 'https://linkedin.com/in/orang-uji' });
    expect(dialog).toHaveTextContent('Tautan Profesional');

    const linkedin = screen.getByRole('link', { name: 'LinkedIn — Orang Uji' });
    expect(linkedin).toHaveAttribute('href', 'https://linkedin.com/in/orang-uji');
    expect(linkedin).toHaveAttribute('target', '_blank');
    expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer');

    expect(screen.queryByRole('link', { name: /Instagram/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Email/ })).not.toBeInTheDocument();
  });

  it('shows all three icons, each pointing to the right place, when all three are set', async () => {
    await openModal({
      ...BASE,
      linkedinUrl: 'https://linkedin.com/in/orang-uji',
      instagramUrl: 'https://instagram.com/orang.uji',
      email: 'uji@environesia.co.id',
    });

    expect(screen.getByRole('link', { name: 'LinkedIn — Orang Uji' })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/orang-uji'
    );
    const instagram = screen.getByRole('link', { name: 'Instagram — Orang Uji' });
    expect(instagram).toHaveAttribute('href', 'https://instagram.com/orang.uji');
    expect(instagram).toHaveAttribute('target', '_blank');
    const email = screen.getByRole('link', { name: 'Email — Orang Uji' });
    expect(email).toHaveAttribute('href', 'mailto:uji@environesia.co.id');
    // A mailto: link opens the user's own mail client in place, never a new tab.
    expect(email).not.toHaveAttribute('target');
  });

  it('places the links after every other section, as the last thing in the modal', async () => {
    const dialog = await openModal({
      ...BASE,
      education: [{ level: 'S1', institution: 'Universitas Uji' }],
      linkedinUrl: 'https://linkedin.com/in/orang-uji',
    });

    const sections = Array.from(dialog.querySelectorAll('h3')).map((h) => h.textContent);
    expect(sections).toEqual(['Pendidikan', 'Tautan Profesional']);
  });

  it('still shows "Profil lengkap akan segera hadir" when there is no other detail, alongside the links', async () => {
    const dialog = await openModal({ ...BASE, email: 'uji@environesia.co.id' });
    expect(dialog).toHaveTextContent('Profil lengkap akan segera hadir.');
    expect(dialog).toHaveTextContent('Tautan Profesional');
  });
});
