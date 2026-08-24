'use client';

import { useEffect, useRef, useState } from 'react';
import type { HeroSlideEntry } from '@/lib/content-types';

const IMAGE_DURATION_MS = 6000;
const MAX_VIDEO_DURATION_MS = 15000;
const CROSSFADE_MS = 800;

export function HeroSlider({ slides, locale }: { slides: HeroSlideEntry[]; locale: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [useMobileSrc, setUseMobileSrc] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const onMotionChange = () => setReducedMotion(motionQuery.matches);
    motionQuery.addEventListener('change', onMotionChange);

    const widthQuery = window.matchMedia('(max-width: 767px)');
    setUseMobileSrc(widthQuery.matches);
    const onWidthChange = () => setUseMobileSrc(widthQuery.matches);
    widthQuery.addEventListener('change', onWidthChange);

    // @ts-expect-error non-standard API, absent in most browsers
    setSaveData(navigator.connection?.saveData === true);

    return () => {
      motionQuery.removeEventListener('change', onMotionChange);
      widthQuery.removeEventListener('change', onWidthChange);
    };
  }, []);

  const current = slides[index];

  useEffect(() => {
    if (!current || reducedMotion || paused || slides.length <= 1 || current.type === 'video') {
      return;
    }

    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, IMAGE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [index, paused, reducedMotion, slides.length, current]);

  useEffect(() => {
    if (!current || reducedMotion || paused || current.type !== 'video') return;

    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, MAX_VIDEO_DURATION_MS);

    return () => clearTimeout(timer);
  }, [index, paused, reducedMotion, current]);

  // Changing the `autoPlay` attribute on an already-playing <video> has no
  // effect — pausing/resuming on hover or focus needs an imperative call via
  // a ref. Only the active slide's video is ever playing, so only it is wired
  // to the ref (see `ref={isActive ? videoRef : undefined}` below).
  useEffect(() => {
    if (!current || current.type !== 'video') return;
    const video = videoRef.current;
    if (!video) return;

    if (paused || reducedMotion) {
      video.pause();
    } else {
      // play() is specced to return a promise that rejects if the browser
      // blocks autoplay, but not every environment honors that (older
      // WebViews, and jsdom's play() stub in tests all return undefined) —
      // guard before chaining rather than assuming a promise comes back.
      const playResult = video.play();
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(() => {});
      }
    }
  }, [paused, reducedMotion, current]);

  if (slides.length === 0) {
    return null;
  }

  const nextSlide = slides[(index + 1) % slides.length];

  return (
    <section
      className="relative h-[80vh] min-h-[480px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <link
        rel="preload"
        as={nextSlide.type === 'video' ? 'video' : 'image'}
        href={nextSlide.src}
      />
      {slides.map((slide, i) => {
        const isActive = i === index;
        const src = useMobileSrc && slide.srcMobile ? slide.srcMobile : slide.src;
        const showVideo = slide.type === 'video' && !(useMobileSrc && saveData);
        const kenBurnsClass =
          !reducedMotion && isActive ? 'animate-[kenburns_6s_ease-out_forwards]' : '';

        return (
          <div
            key={slide.headline}
            className="absolute inset-0 transition-opacity"
            style={{
              opacity: isActive ? 1 : 0,
              transitionDuration: `${CROSSFADE_MS}ms`,
              pointerEvents: isActive ? 'auto' : 'none',
            }}
            aria-hidden={!isActive}
          >
            {showVideo ? (
              <video
                ref={isActive ? videoRef : undefined}
                className={`h-full w-full object-cover ${kenBurnsClass}`}
                src={src}
                poster={slide.poster}
                muted
                autoPlay={isActive && !paused && !reducedMotion}
                playsInline
                preload="metadata"
                onEnded={() => {
                  if (!paused) {
                    setIndex((prev) => (prev + 1) % slides.length);
                  }
                }}
              />
            ) : (
              <img
                src={slide.type === 'video' ? slide.poster : src}
                alt=""
                fetchPriority={isActive ? 'high' : 'auto'}
                className={`h-full w-full object-cover ${kenBurnsClass}`}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,20,16,0.45)] to-transparent" />
            <a
              href={`/${locale}${slide.ctaUrl}`}
              tabIndex={isActive ? 0 : -1}
              className="absolute inset-0 flex flex-col items-start justify-end p-8 md:p-16"
            >
              <p className="font-mono text-label uppercase text-paper">{slide.eyebrow}</p>
              <h1 className="mt-3 max-w-2xl font-display text-display text-paper">
                {slide.headline}
              </h1>
              <p className="mt-3 max-w-xl text-body text-paper/90">{slide.subheadline}</p>
              <span className="mt-6 inline-block rounded-[14px] bg-paper px-6 py-3 text-small font-medium text-forest">
                {slide.ctaLabel}
              </span>
            </a>
          </div>
        );
      })}
      {slides.length > 1 ? (
        <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-4">
          {slides.map((slide, i) => (
            <button
              key={slide.headline}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className="h-1 flex-1 rounded-full bg-paper/40"
            >
              <span
                className={`block h-full rounded-full bg-paper ${reducedMotion ? '' : 'transition-all'}`}
                style={{ width: i <= index ? '100%' : '0%' }}
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
