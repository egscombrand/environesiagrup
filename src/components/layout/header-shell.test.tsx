import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HeaderShell } from './header-shell';

// One universal look, no per-page/per-route branching, and no background
// panel at all — see the component's own comment for why legibility comes
// from drop-shadow/text-shadow on the logo and nav text instead of a
// tinted bar behind them.
describe('HeaderShell', () => {
  it('is always in light mode (white logo/nav) — the component takes no route input at all', () => {
    render(<HeaderShell><p>nav</p></HeaderShell>);
    expect(screen.getByText('nav').parentElement!).toHaveAttribute('data-overlay');
  });

  it('never renders any background panel — no solid color, no tint', () => {
    render(<HeaderShell><p>nav</p></HeaderShell>);
    const header = screen.getByText('nav').parentElement!;

    expect(header.className).not.toContain('bg-canvas');
    expect(header.className).not.toContain('bg-white');
    expect(header.className).not.toContain('bg-pine-ink');
    expect(header.className).not.toContain('bg-black');
    expect(header.className).toContain('bg-transparent');
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
