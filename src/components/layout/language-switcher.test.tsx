import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

let mockPathname: string | null = '/id';
let mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

const { LanguageSwitcher } = await import('./language-switcher');

// The option list is portalled to <body> and only mounted while open (a
// combobox-style disclosure, not an always-present-but-hidden list) — every
// test that inspects an option opens the dropdown first. Queried by role
// alone (there's only ever one button in this component's render) rather
// than by its accessible name, which is itself translated per-locale.
async function openSwitcher(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button'));
}

describe('LanguageSwitcher', () => {
  it('offers all three locales as options, each with its name and code (never just a flag)', async () => {
    const user = userEvent.setup();
    mockPathname = '/id';
    render(<LanguageSwitcher locale="id" />);
    await openSwitcher(user);

    expect(screen.getByRole('option', { name: /Bahasa Indonesia/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /English/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /简体中文/ })).toBeInTheDocument();
  });

  it('keeps the visitor on the same page when switching language', async () => {
    const user = userEvent.setup();
    mockPathname = '/id/entitas/greenlab';
    render(<LanguageSwitcher locale="id" />);
    await openSwitcher(user);

    expect(screen.getByRole('option', { name: /English/ })).toHaveAttribute(
      'href',
      '/en/entitas/greenlab'
    );
    expect(screen.getByRole('option', { name: /简体中文/ })).toHaveAttribute(
      'href',
      '/zh/entitas/greenlab'
    );
  });

  it('carries the query string along when switching language', async () => {
    const user = userEvent.setup();
    mockPathname = '/id/proyek-insight';
    mockSearchParams = new URLSearchParams('sektor=energi&tahun=2025');
    render(<LanguageSwitcher locale="id" />);
    await openSwitcher(user);

    expect(screen.getByRole('option', { name: /English/ })).toHaveAttribute(
      'href',
      '/en/proyek-insight?sektor=energi&tahun=2025'
    );
    mockSearchParams = new URLSearchParams();
  });

  it('marks the active locale for assistive tech and visually', async () => {
    const user = userEvent.setup();
    mockPathname = '/zh';
    render(<LanguageSwitcher locale="zh" />);
    await openSwitcher(user);

    const active = screen.getByRole('option', { name: /简体中文/ });
    expect(active).toHaveAttribute('aria-current', 'true');
    expect(active).toHaveAttribute('aria-selected', 'true');
  });

  it('handles the bare locale root without leaving a trailing slash', async () => {
    const user = userEvent.setup();
    mockPathname = '/id';
    render(<LanguageSwitcher locale="id" />);
    await openSwitcher(user);
    expect(screen.getByRole('option', { name: /English/ })).toHaveAttribute('href', '/en');
  });

  it('does not leave a trailing slash when the current path itself ends in one', async () => {
    const user = userEvent.setup();
    mockPathname = '/id/';
    render(<LanguageSwitcher locale="id" />);
    await openSwitcher(user);
    expect(screen.getByRole('option', { name: /English/ })).toHaveAttribute('href', '/en');
  });

  it('gives the trigger button a 44px touch target', () => {
    render(<LanguageSwitcher locale="id" />);
    expect(screen.getByRole('button', { name: 'Pilih bahasa' }).className).toContain('tap-target');
  });

  it('opens the dropdown on click and closes it on Escape, returning focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher locale="id" />);

    const trigger = screen.getByRole('button', { name: 'Pilih bahasa' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes the dropdown after picking a language', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher locale="id" />);
    await openSwitcher(user);

    await user.click(screen.getByRole('option', { name: /English/ }));

    expect(screen.getByRole('button', { name: 'Pilih bahasa' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
