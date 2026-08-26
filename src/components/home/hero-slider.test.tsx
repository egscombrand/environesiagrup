import { act, fireEvent } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HeroSlider } from './hero-slider';
import { makeHeroSlide } from '@/lib/cms/fixtures';

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

function mockMobileSaveData() {
  const originalMatchMedia = window.matchMedia;
  window.matchMedia = ((query: string) =>
    ({
      matches: query === '(max-width: 767px)',
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList) as typeof window.matchMedia;

  const originalConnection = (navigator as unknown as { connection?: unknown }).connection;
  Object.defineProperty(navigator, 'connection', {
    value: { saveData: true },
    configurable: true,
  });

  return () => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(navigator, 'connection', {
      value: originalConnection,
      configurable: true,
    });
  };
}

const slides = [
  makeHeroSlide({
    type: 'image',
    desktopImageUrl: '/hero/slide-1.svg',
    eyebrow: 'Eyebrow Satu',
    title: 'Headline Satu',
    description: 'Sub satu',
    cta_label: 'CTA Satu',
    cta_url: '/entitas',
    sort_order: 1,
  }),
  makeHeroSlide({
    type: 'image',
    desktopImageUrl: '/hero/slide-2.svg',
    eyebrow: 'Eyebrow Dua',
    title: 'Headline Dua',
    description: 'Sub dua',
    cta_label: 'CTA Dua',
    cta_url: '/proyek',
    sort_order: 2,
  }),
];

const videoSlide = makeHeroSlide({
  type: 'video',
  video_url: '/hero/video-1.mp4',
  mobileImageUrl: '/hero/video-1-mobile.mp4',
  videoPosterUrl: '/hero/poster-1.svg',
  eyebrow: 'Eyebrow Video',
  title: 'Headline Video',
  description: 'Sub video',
  cta_label: 'CTA Video',
  cta_url: '/video',
  sort_order: 1,
});

// Mocks that mutate global browser state (window.matchMedia, navigator.connection,
// fake timers) are restored here rather than at the end of each test body — a
// mid-test assertion failure would otherwise throw before a manual restore()
// call is reached, leaking the mock into every later test in this file.
let restoreGlobalMocks: (() => void) | undefined;

afterEach(() => {
  restoreGlobalMocks?.();
  restoreGlobalMocks = undefined;
  vi.useRealTimers();
});

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
    restoreGlobalMocks = mockReducedMotion();
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
  });

  it('falls back to the poster image, not the video URL, when saveData is on for mobile', () => {
    restoreGlobalMocks = mockMobileSaveData();

    const { container } = render(<HeroSlider slides={[videoSlide]} locale="id" />);

    // An <img> with alt="" gets the accessibility role "presentation", not
    // "img" (it's correctly treated as decorative) — getByRole('img') would
    // never find it, so query the DOM directly instead.
    const image = container.querySelector('img');
    expect(image).toHaveAttribute('src', videoSlide.videoPosterUrl);
    expect(image).not.toHaveAttribute('src', videoSlide.video_url ?? undefined);
    expect(image).not.toHaveAttribute('src', videoSlide.mobileImageUrl);
  });

  it('does not advance when the active video ends while the slider is paused', () => {
    const { container } = render(<HeroSlider slides={[videoSlide, slides[0]]} locale="id" />);
    const section = container.querySelector('section');
    const video = container.querySelector('video');
    expect(section).not.toBeNull();
    expect(video).not.toBeNull();

    // Hover pauses the slider (project.md §5: "Pause saat hover atau focus").
    fireEvent.mouseEnter(section as Element);
    fireEvent.ended(video as Element);

    expect(screen.getByText('Headline Video').closest('[aria-hidden]')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
    expect(screen.getByText('Headline Satu').closest('[aria-hidden]')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('removes an inactive slide CTA link from the tab order', () => {
    render(<HeroSlider slides={slides} locale="id" />);

    // getByRole('link') excludes anything inside an aria-hidden ancestor (the
    // inactive slide's whole wrapper is aria-hidden), so — same as the other
    // aria-hidden assertions in this file — locate via text and walk up to
    // the <a> instead.
    expect(screen.getByText('CTA Satu').closest('a')).toHaveAttribute('tabIndex', '0');
    expect(screen.getByText('CTA Dua').closest('a')).toHaveAttribute('tabIndex', '-1');
  });
});
