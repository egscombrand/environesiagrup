import { act, fireEvent } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { HeroSlider } from './hero-slider';

function mockReducedMotion() {
  const original = window.matchMedia;
  window.matchMedia = ((query: string) =>
    ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList) as typeof window.matchMedia;
  return () => {
    window.matchMedia = original;
  };
}

const slides = [
  {
    type: 'image' as const,
    src: '/hero/slide-1.svg',
    eyebrow: 'Eyebrow Satu',
    headline: 'Headline Satu',
    subheadline: 'Sub satu',
    ctaLabel: 'CTA Satu',
    ctaUrl: '/entitas',
    urutan: 1,
  },
  {
    type: 'image' as const,
    src: '/hero/slide-2.svg',
    eyebrow: 'Eyebrow Dua',
    headline: 'Headline Dua',
    subheadline: 'Sub dua',
    ctaLabel: 'CTA Dua',
    ctaUrl: '/proyek',
    urutan: 2,
  },
];

describe('HeroSlider', () => {
  it('renders nothing when there are no slides', () => {
    const { container } = render(<HeroSlider slides={[]} locale="id" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the first slide as active and the rest hidden from assistive tech', () => {
    render(<HeroSlider slides={slides} locale="id" />);
    expect(screen.getByText('Headline Satu').closest('[aria-hidden]')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
    expect(screen.getByText('Headline Dua').closest('[aria-hidden]')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('has a locale-prefixed CTA link on the active slide', () => {
    render(<HeroSlider slides={slides} locale="id" />);
    expect(screen.getByRole('link', { name: /CTA Satu/ })).toHaveAttribute(
      'href',
      '/id/entitas'
    );
  });

  it('jumps to a slide when its progress control is clicked', async () => {
    const user = userEvent.setup();
    render(<HeroSlider slides={slides} locale="id" />);

    await user.click(screen.getByRole('button', { name: 'Slide 2' }));

    expect(screen.getByText('Headline Dua').closest('[aria-hidden]')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
    expect(screen.getByText('Headline Satu').closest('[aria-hidden]')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('advances to the next slide automatically after the image duration', () => {
    vi.useFakeTimers();
    render(<HeroSlider slides={slides} locale="id" />);

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.getByText('Headline Dua').closest('[aria-hidden]')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
    vi.useRealTimers();
  });

  it('keeps manual slide controls under prefers-reduced-motion and never auto-advances', () => {
    const restoreMatchMedia = mockReducedMotion();
    vi.useFakeTimers();

    render(<HeroSlider slides={slides} locale="id" />);

    // Manual navigation affordance must still be present for reduced-motion users —
    // they are not stranded on slide 1 with no way to reach the rest.
    const jumpToSlideTwo = screen.getByRole('button', { name: 'Slide 2' });
    expect(jumpToSlideTwo).toBeInTheDocument();

    // Automatic rotation must be disabled: advancing well past the 6s image
    // duration must NOT change the active slide.
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(screen.getByText('Headline Satu').closest('[aria-hidden]')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
    expect(screen.getByText('Headline Dua').closest('[aria-hidden]')).toHaveAttribute(
      'aria-hidden',
      'true'
    );

    // Manual click must still work: reduced motion disables automatic motion,
    // not user-initiated navigation.
    fireEvent.click(jumpToSlideTwo);
    expect(screen.getByText('Headline Dua').closest('[aria-hidden]')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
    expect(screen.getByText('Headline Satu').closest('[aria-hidden]')).toHaveAttribute(
      'aria-hidden',
      'true'
    );

    vi.useRealTimers();
    restoreMatchMedia();
  });
});
