import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HeaderShell } from './header-shell';

/** jsdom's window.scrollY is read-only by default — simulate a real scroll by overriding it, then firing the same 'scroll' event the browser would. */
function scrollTo(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

describe('HeaderShell', () => {
  it('starts in overlay/light mode (white logo/nav) — the common case of a fresh page load at the top', () => {
    render(<HeaderShell><p>nav</p></HeaderShell>);
    expect(screen.getByText('nav').parentElement!).toHaveAttribute('data-overlay');
  });

  it('switches out of overlay mode once scrolled down — the logo/nav need to turn to their normal brand-colored look', () => {
    render(<HeaderShell><p>nav</p></HeaderShell>);
    const header = screen.getByText('nav').parentElement!;

    scrollTo(200);
    expect(header).not.toHaveAttribute('data-overlay');
  });

  it('switches back to overlay mode on scrolling back up to the top', () => {
    render(<HeaderShell><p>nav</p></HeaderShell>);
    const header = screen.getByText('nav').parentElement!;

    scrollTo(200);
    expect(header).not.toHaveAttribute('data-overlay');

    scrollTo(0);
    expect(header).toHaveAttribute('data-overlay');
  });

  it('is fully transparent at the top, with no blur and no shadow', () => {
    render(<HeaderShell><p>nav</p></HeaderShell>);
    const header = screen.getByText('nav').parentElement!;

    scrollTo(0);
    expect(header.className).toContain('bg-transparent');
    expect(header.className).not.toContain('bg-white');
    expect(header.className).not.toContain('blur');
    expect(header.className).not.toContain('shadow');
  });

  it('becomes solid white once scrolled — never blurred/translucent, never shadowed', () => {
    render(<HeaderShell><p>nav</p></HeaderShell>);
    const header = screen.getByText('nav').parentElement!;

    scrollTo(300);
    expect(header.className).toContain('bg-white');
    expect(header.className).not.toContain('bg-transparent');
    expect(header.className).not.toContain('blur');
    expect(header.className).not.toContain('shadow');
  });

  it('is fixed to the viewport, spanning full width, with a very high z-index', () => {
    render(<HeaderShell><p>nav</p></HeaderShell>);
    const header = screen.getByText('nav').parentElement!;

    expect(header.className).toContain('fixed');
    expect(header.className).toContain('inset-x-0');
    expect(header.className).toContain('top-0');
    expect(header.className).toContain('z-[9999]');
  });
});
