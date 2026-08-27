import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LanguageSwitcher } from './language-switcher';

describe('LanguageSwitcher', () => {
  it('offers all three locales', () => {
    render(<LanguageSwitcher locale="id" pathname="/id" />);
    ['ID', 'EN', '中文'].forEach((label) =>
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    );
  });

  it('keeps the visitor on the same page when switching language', () => {
    render(<LanguageSwitcher locale="id" pathname="/id/entitas/greenlab" />);

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
    render(<LanguageSwitcher locale="zh" pathname="/zh" />);
    expect(screen.getByRole('link', { name: '中文' })).toHaveAttribute('aria-current', 'true');
  });

  it('handles the bare locale root without leaving a trailing slash', () => {
    render(<LanguageSwitcher locale="id" pathname="/id" />);
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('href', '/en');
  });
});
