import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

let mockPathname: string | null = '/id';

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

const { LanguageSwitcher } = await import('./language-switcher');

describe('LanguageSwitcher', () => {
  it('offers all three locales', () => {
    mockPathname = '/id';
    render(<LanguageSwitcher locale="id" />);
    ['ID', 'EN', '中文'].forEach((label) =>
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    );
  });

  it('keeps the visitor on the same page when switching language', () => {
    mockPathname = '/id/entitas/greenlab';
    render(<LanguageSwitcher locale="id" />);

    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute(
      'href',
      '/en/entitas/greenlab'
    );
    expect(screen.getByRole('link', { name: '中文' })).toHaveAttribute(
      'href',
      '/zh/entitas/greenlab'
    );
  });

  it('marks the active locale for assistive tech', () => {
    mockPathname = '/zh';
    render(<LanguageSwitcher locale="zh" />);
    expect(screen.getByRole('link', { name: '中文' })).toHaveAttribute('aria-current', 'true');
  });

  it('handles the bare locale root without leaving a trailing slash', () => {
    mockPathname = '/id';
    render(<LanguageSwitcher locale="id" />);
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('href', '/en');
  });

  it('does not leave a trailing slash when the current path itself ends in one', () => {
    mockPathname = '/id/';
    render(<LanguageSwitcher locale="id" />);
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('href', '/en');
  });
});
