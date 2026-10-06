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
    sort_order: 1,
  }),
  makeHeroSlide({
    type: 'image',
    desktopImageUrl: '/hero/slide-2.svg',
    eyebrow: 'Eyebrow Dua',
    title: 'Headline Dua',
    description: 'Sub dua',
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

function fillSpanFor(slideLabel: string): HTMLElement {
  const button = screen.getByRole('button', { name: slideLabel });
  const span = button.querySelector('span');
  if (!span) throw new Error(`No fill span found inside "${slideLabel}"`);
  return span;
}

describe('HeroSlider', () => {
  it('renders nothing when there are no slides', () => {
    const { container } = render(<HeroSlider slides={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the first slide as active and the rest hidden from assistive tech', () => {
    render(<HeroSlider slides={slides} />);
    const activeMedia = screen.getByText('Eyebrow Satu').closest('section')?.querySelector('[aria-hidden="false"]');
    expect(activeMedia).not.toBeNull();
  });

  it('shows a clickable label per slide, without a numeric slide counter or title/description text', () => {
    render(<HeroSlider slides={slides} />);
    expect(screen.queryByText(/^01 \/ 02$/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Eyebrow Satu' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Eyebrow Dua' })).toBeInTheDocument();
    expect(screen.queryByText('Headline Satu')).not.toBeInTheDocument();
    expect(screen.queryByText('Sub satu')).not.toBeInTheDocument();
  });

  it('jumps to a slide when its label is clicked', async () => {
    const user = userEvent.setup();
    render(<HeroSlider slides={slides} />);

    await user.click(screen.getByRole('button', { name: 'Eyebrow Dua' }));

    expect(fillSpanFor('Slide 2 / 2').style.width).toBe('0%');
    expect(fillSpanFor('Slide 1 / 2').style.width).toBe('100%');
  });

  it('jumps to a slide when its progress control is clicked', async () => {
    const user = userEvent.setup();
    render(<HeroSlider slides={slides} />);

    await user.click(screen.getByRole('button', { name: 'Slide 2 / 2' }));

    expect(fillSpanFor('Slide 2 / 2').style.width).toBe('0%');
    expect(fillSpanFor('Slide 1 / 2').style.width).toBe('100%');
  });

  it('moves to the next and previous slide via the arrow controls, wrapping around circularly', async () => {
    const user = userEvent.setup();
    render(<HeroSlider slides={slides} />);

    await user.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(fillSpanFor('Slide 2 / 2').style.width).toBe('0%');

    // Circular: next again from the last slide wraps back to the first.
    await user.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(fillSpanFor('Slide 1 / 2').style.width).toBe('0%');

    // Circular: previous from the first slide wraps to the last.
    await user.click(screen.getByRole('button', { name: 'Previous slide' }));
    expect(fillSpanFor('Slide 2 / 2').style.width).toBe('0%');
  });

  it('has no play/pause control of any kind — the sequence always runs on its own', () => {
    render(<HeroSlider slides={slides} />);
    expect(screen.queryByRole('button', { name: 'Pause' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Play' })).not.toBeInTheDocument();
  });

  it('does not pause on mouse hover — autoplay keeps advancing regardless', async () => {
    const { container } = render(<HeroSlider slides={slides} />);
    const section = container.querySelector('section') as Element;

    fireEvent.mouseEnter(section);

    await act(async () => {
      await new Promise((r) => setTimeout(r, 6300));
    });
    expect(fillSpanFor('Slide 2 / 2').style.width).toBe('0%');
  }, 10000);

  it('pauses while a control inside the hero has keyboard focus', async () => {
    const user = userEvent.setup();
    render(<HeroSlider slides={slides} />);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Previous slide' })).toHaveFocus();

    await act(async () => {
      await new Promise((r) => setTimeout(r, 6300));
    });
    // Autoplay stayed frozen on slide 1 the whole time focus was inside the hero.
    expect(fillSpanFor('Slide 1 / 2').style.width).toBe('0%');
    expect(fillSpanFor('Slide 2 / 2').style.width).toBe('0%');
  }, 10000);

  it('advances to the next slide automatically once the active slide reaches 100% progress', async () => {
    render(<HeroSlider slides={slides} />);

    await act(async () => {
      await new Promise((r) => setTimeout(r, 6300));
    });

    expect(fillSpanFor('Slide 2 / 2').style.width).toBe('0%');
  }, 10000);

  it('resets progress to 0% every time a slide loops back to being active, including after a full loop', () => {
    // Real setTimeout-based waits for a multi-transition sequence are prone
    // to jsdom scheduler flakiness unrelated to the component itself (a
    // real-Chromium run of this exact scenario — several loops of a 2s x 2
    // slide sequence — showed clean, stall-free transitions throughout).
    // Faking requestAnimationFrame alongside the timers makes React's
    // effect flushing deterministic instead of racing real wall-clock time.
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
    render(<HeroSlider slides={slides} />);

    act(() => vi.advanceTimersByTime(6500));
    expect(fillSpanFor('Slide 2 / 2').style.width).toBe('0%');

    act(() => vi.advanceTimersByTime(6500));
    expect(fillSpanFor('Slide 1 / 2').style.width).toBe('0%');
  });

  it('keeps manual slide controls under prefers-reduced-motion and keeps the timer running', () => {
    restoreGlobalMocks = mockReducedMotion();
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
    render(<HeroSlider slides={slides} />);

    // Manual navigation affordance must still be present for reduced-motion users —
    // they are not stranded on slide 1 with no way to reach the rest.
    const jumpToSlideTwo = screen.getByRole('button', { name: 'Eyebrow Dua' });
    expect(jumpToSlideTwo).toBeInTheDocument();

    // Reduced motion removes the zoom, not the sequence: slide 1's progress
    // runs on its own, and the slide advances when its duration ends.
    act(() => vi.advanceTimersByTime(1500));
    const progressPct = parseFloat(fillSpanFor('Slide 1 / 2').style.width);
    expect(progressPct).toBeGreaterThan(0);
    expect(progressPct).toBeLessThan(100);

    act(() => vi.advanceTimersByTime(5000));
    expect(fillSpanFor('Slide 2 / 2').style.width).toBe('0%');

    // Manual click must still work: reduced motion disables automatic motion,
    // not user-initiated navigation. Jumping back to slide 1 restarts its timer.
    fireEvent.click(screen.getByRole('button', { name: 'Eyebrow Satu' }));
    act(() => vi.advanceTimersByTime(1500));
    const restartedPct = parseFloat(fillSpanFor('Slide 1 / 2').style.width);
    expect(restartedPct).toBeGreaterThan(0);
    expect(restartedPct).toBeLessThan(100);
  });

  it('falls back to the poster image, not the video URL, when saveData is on for mobile', () => {
    restoreGlobalMocks = mockMobileSaveData();

    const { container } = render(<HeroSlider slides={[videoSlide]} />);

    // An <img> with alt="" gets the accessibility role "presentation", not
    // "img" (it's correctly treated as decorative) — getByRole('img') would
    // never find it, so query the DOM directly instead.
    const image = container.querySelector('img');
    expect(image).toHaveAttribute('src', videoSlide.videoPosterUrl);
    expect(image).not.toHaveAttribute('src', videoSlide.video_url ?? undefined);
    expect(image).not.toHaveAttribute('src', videoSlide.mobileImageUrl);
  });

  it('does not advance when the active video ends while the hero is paused by keyboard focus', async () => {
    const user = userEvent.setup();
    const { container } = render(<HeroSlider slides={[videoSlide, slides[0]]} />);
    const video = container.querySelector('video');
    expect(video).not.toBeNull();

    await user.tab();
    fireEvent.ended(video as Element);

    expect(fillSpanFor('Slide 1 / 2').style.width).not.toBe('100%');
  });

  it('hides the labels, progress row, and arrow controls for a single slide, and shows no controls at all', () => {
    render(<HeroSlider slides={[slides[0]]} />);
    expect(screen.queryByRole('button', { name: 'Eyebrow Satu' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Slide 1/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next slide' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Previous slide' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pause' })).not.toBeInTheDocument();
  });
});

describe('HeroSlider progress sync — no stalls across multiple loops', () => {
  it('runs through several full loops of a 3-slide sequence without ever getting stuck mid-progress', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
    const threeSlides = [
      makeHeroSlide({ type: 'image', desktopImageUrl: '/a.svg', eyebrow: 'One', duration_seconds: 1, sort_order: 1 }),
      makeHeroSlide({ type: 'image', desktopImageUrl: '/b.svg', eyebrow: 'Two', duration_seconds: 1, sort_order: 2 }),
      makeHeroSlide({ type: 'image', desktopImageUrl: '/c.svg', eyebrow: 'Three', duration_seconds: 1, sort_order: 3 }),
    ];
    render(<HeroSlider slides={threeSlides} />);

    // Sample widths across many transitions (fake-timer + mocked rAF/
    // performance runs at its own pace, not a fixed ratio to real
    // duration_seconds — so this asserts the invariant that actually
    // matters, "never stuck, never two slides mid-progress at once", over
    // a fixed number of steps rather than pinning to an exact time when a
    // specific loop boundary is reached).
    const activeLabelsSeen = new Set<string>();
    for (let i = 0; i < 24; i += 1) {
      act(() => vi.advanceTimersByTime(300));

      const widths = ['Slide 1 / 3', 'Slide 2 / 3', 'Slide 3 / 3'].map((label) => ({
        label,
        pct: parseFloat(fillSpanFor(label).style.width),
      }));
      const midProgress = widths.filter((w) => w.pct > 0 && w.pct < 100);
      // At most one slide is ever strictly between 0% and 100% at a time.
      expect(midProgress.length).toBeLessThanOrEqual(1);
      if (midProgress.length === 1) activeLabelsSeen.add(midProgress[0].label);
    }

    // Real transitions did keep happening throughout — more than one slide
    // was seen actively progressing, i.e. autoplay never got stuck on the
    // first one.
    expect(activeLabelsSeen.size).toBeGreaterThan(1);
  });

  it('rapid repeated next/prev clicks never leave two slides simultaneously mid-progress', async () => {
    const user = userEvent.setup();
    render(<HeroSlider slides={slides} />);

    const next = screen.getByRole('button', { name: 'Next slide' });
    const prev = screen.getByRole('button', { name: 'Previous slide' });

    for (let i = 0; i < 5; i += 1) {
      await user.click(next);
      await user.click(prev);
    }

    // An even number of next/prev clicks lands back on slide 1: it is
    // freshly active (0%), and slide 2 has not been reached yet this lap
    // (also 0%, matching the same "ahead of the active slide" state it
    // held at the very start) — never a stale/partial value on either.
    expect(fillSpanFor('Slide 1 / 2').style.width).toBe('0%');
    expect(fillSpanFor('Slide 2 / 2').style.width).toBe('0%');
  });
});
