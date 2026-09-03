import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EcosystemProgressiveReveal } from './ecosystem-progressive-reveal';
import { makeEntity } from '@/lib/cms/fixtures';

const lines = ['One ecosystem.', 'Five companies.', 'Different expertise.', 'One purpose.'];
const entities = [
  makeEntity({ id: 'e1', name: 'Environesia', accent_color: '#0FA96B' }),
  makeEntity({ id: 'e2', name: 'GreenLab', accent_color: '#33C4C9' }),
];

// A tiny real duration, not a faked clock — framer-motion's own scheduling
// (RAF-driven) stays on real time either way, so faking `setTimeout`
// globally risks a mismatch between "my timer fired" and "the animation
// library is ready to react." A short real wait sidesteps that entirely.
const FAST_MS = 20;

describe('EcosystemProgressiveReveal', () => {
  it('shows the first line and a 01/0N indicator on mount, without needing a click', () => {
    render(
      <EcosystemProgressiveReveal
        lines={lines}
        entities={entities}
        siteName="Environesia Group"
        skipLabel="Skip"
        onComplete={() => {}}
        onSkip={() => {}}
        stepDurationMs={FAST_MS}
      />
    );

    expect(screen.getByText(lines[0])).toBeInTheDocument();
    expect(screen.getByText('01 / 04')).toBeInTheDocument();
  });

  it('auto-advances through every line on its own, then calls onComplete — no click involved', async () => {
    const onComplete = vi.fn();
    render(
      <EcosystemProgressiveReveal
        lines={lines}
        entities={entities}
        siteName="Environesia Group"
        skipLabel="Skip"
        onComplete={onComplete}
        onSkip={() => {}}
        stepDurationMs={FAST_MS}
      />
    );

    for (let i = 1; i < lines.length; i++) {
      expect(await screen.findByText(lines[i])).toBeInTheDocument();
    }
    await vi.waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
  });

  it('clicking Skip calls onSkip immediately, without waiting for the timer', async () => {
    const onSkip = vi.fn();
    const user = userEvent.setup();
    render(
      <EcosystemProgressiveReveal
        lines={lines}
        entities={entities}
        siteName="Environesia Group"
        skipLabel="Skip"
        onComplete={() => {}}
        onSkip={onSkip}
        stepDurationMs={60_000}
      />
    );

    await user.click(screen.getByRole('button', { name: /Skip/ }));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('the whole flow stays fully functional under prefers-reduced-motion', async () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) =>
      ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList) as typeof window.matchMedia;

    try {
      const onComplete = vi.fn();
      render(
        <EcosystemProgressiveReveal
          lines={lines}
          entities={entities}
          siteName="Environesia Group"
          skipLabel="Skip"
          onComplete={onComplete}
          onSkip={() => {}}
          stepDurationMs={FAST_MS}
        />
      );

      for (let i = 1; i < lines.length; i++) {
        expect(await screen.findByText(lines[i])).toBeInTheDocument();
      }
      await vi.waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
    } finally {
      window.matchMedia = original;
    }
  });
});
