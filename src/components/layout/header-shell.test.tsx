import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

let mockPathname = '/id';
vi.mock('next/navigation', () => ({ usePathname: () => mockPathname }));

import { HeaderShell } from './header-shell';

describe('HeaderShell', () => {
  beforeEach(() => {
    window.scrollY = 0;
  });

  it('goes transparent over the homepage hero', () => {
    mockPathname = '/id';
    render(<HeaderShell><p>nav</p></HeaderShell>);

    const header = screen.getByText('nav').parentElement!;
    expect(header).toHaveAttribute('data-overlay');
    expect(header.className).toContain('bg-transparent');
  });

  it('stays solid on a page with no hero behind it', () => {
    mockPathname = '/id/kontak';
    render(<HeaderShell><p>nav</p></HeaderShell>);

    const header = screen.getByText('nav').parentElement!;
    expect(header).not.toHaveAttribute('data-overlay');
    expect(header.className).toContain('bg-canvas/95');
  });

  it('treats every locale root as a hero page', () => {
    for (const path of ['/en', '/zh']) {
      mockPathname = path;
      const { unmount } = render(<HeaderShell><p>nav</p></HeaderShell>);
      expect(screen.getByText('nav').parentElement!).toHaveAttribute('data-overlay');
      unmount();
    }
  });

  it('goes solid once the visitor scrolls off the hero', () => {
    mockPathname = '/id';
    window.scrollY = 200;
    render(<HeaderShell><p>nav</p></HeaderShell>);

    expect(screen.getByText('nav').parentElement!).not.toHaveAttribute('data-overlay');
  });
});
