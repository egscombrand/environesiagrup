'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { HeroSlide } from '@/lib/cms/hero';

const DEFAULT_IMAGE_DURATION_MS = 6000;
const CROSSFADE_MS = 800;

function slideSrc(slide: HeroSlide, useMobileSrc: boolean): string | undefined {
  if (slide.type === 'video') return slide.video_url ?? undefined;
  return (useMobileSrc && slide.mobileImageUrl) || slide.desktopImageUrl;
}

/** Known duration in ms, or null when it can only be learned once the video
 * loads (no CMS override on a video slide) — those are driven by the
 * <video> element's own timeupdate/ended events instead. */
function resolveKnownDurationMs(slide: HeroSlide): number | null {
  if (slide.duration_seconds != null) return slide.duration_seconds * 1000;
  if (slide.type === 'image') return DEFAULT_IMAGE_DURATION_MS;
  return null;
}

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [focusPaused, setFocusPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [useMobileSrc, setUseMobileSrc] = useState(false);
  const [saveData, setSaveData] = useState(false);
  // Single source of truth for playback position, 0-100, for whichever
  // slide is currently active — driven by requestAnimationFrame (images,
  // or a video with a CMS duration override) or by the <video> element's
  // own timeupdate (a video with no override). No CSS animation, no
  // remount-to-restart trickery: pausing freezes this value exactly,
  // resuming continues from it.
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  // No play/pause control and no pause-on-hover — the sequence is meant to
  // run on its own, always. The one exception is keyboard focus: tabbing
  // into the prev/next/label controls pauses playback while it's there (an
  // invisible a11y affordance, not a UI control) so a keyboard user isn't
  // fighting the slide changing under them mid-interaction.
  const paused = focusPaused;

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
  const knownDurationMs = current ? resolveKnownDurationMs(current) : null;

  function setProgressValue(pct: number) {
    progressRef.current = pct;
    setProgress(pct);
  }

  function goTo(next: number) {
    if (slides.length === 0) return;
    setIndex(((next % slides.length) + slides.length) % slides.length);
  }
  const goNext = () => goTo(index + 1);
  const goPrev = () => goTo(index - 1);

  // Whenever the active slide changes — autoplay, a click on any label or
  // timeline segment, prev/next, or looping back to a slide shown before —
  // its progress always restarts at exactly 0%. Declared before the tick
  // effect below so this reset is guaranteed to run first (React runs
  // effects in declaration order within a commit).
  useEffect(() => {
    setProgressValue(0);
  }, [index]);

  // Drives progress + auto-advance for any slide with a duration known
  // upfront (every image, or a video with a CMS override). One rAF loop at
  // a time: its cleanup (always run before a new instance starts, on any
  // dependency change) cancels the previous loop, so there is never more
  // than one timer per slide.
  useEffect(() => {
    if (!current || paused || reducedMotion || slides.length === 0 || knownDurationMs == null) return;

    let raf = 0;
    let lastUpdateAt = 0;
    const start = performance.now() - (progressRef.current / 100) * knownDurationMs;

    const tick = (now: number) => {
      const pct = Math.min(((now - start) / knownDurationMs) * 100, 100);
      if (pct >= 100) {
        setProgressValue(100);
        goNext();
        return;
      }
      // Re-rendering on every single frame (~60/sec) is unnecessary for a
      // progress bar and adds up under heavy re-render load — throttle the
      // visible update to ~20/sec while still checking completion every
      // frame, so the actual advance timing stays exact.
      if (now - lastUpdateAt >= 50) {
        setProgressValue(pct);
        lastUpdateAt = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, paused, reducedMotion, knownDurationMs, index]);

  // Video with no CMS duration override: progress follows real playback
  // position instead of a timer.
  useEffect(() => {
    if (!current || current.type !== 'video' || knownDurationMs != null) return;
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.duration > 0) setProgressValue((video.currentTime / video.duration) * 100);
    };
    video.addEventListener('timeupdate', onTimeUpdate);
    return () => video.removeEventListener('timeupdate', onTimeUpdate);
  }, [current, knownDurationMs]);

  // Changing the `autoPlay` attribute on an already-playing <video> has no
  // effect — pausing/resuming needs an imperative call via a ref. Only the
  // active slide's video is ever playing, so only it is wired to the ref
  // (see `ref={isActive ? videoRef : undefined}` below).
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
      className="relative -mt-[var(--header-h)] h-dvh min-h-[560px] w-full overflow-hidden bg-pine-ink"
      onFocus={() => setFocusPaused(true)}
      onBlur={() => setFocusPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current == null) return;
        const delta = (e.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(delta) < 50) return;
        if (delta > 0) goPrev();
        else goNext();
      }}
    >
      <link
        rel="preload"
        as={nextSlide.type === 'video' ? 'video' : 'image'}
        href={slideSrc(nextSlide, useMobileSrc)}
      />

      {/* Media layer — the sole visual focal point, nothing overlaid on it
          except a thin top scrim so the transparent header stays legible. */}
      {slides.map((slide, i) => {
        const isActive = i === index;
        const src = slideSrc(slide, useMobileSrc);
        const showVideo = slide.type === 'video' && !(useMobileSrc && saveData);
        const kenBurnsClass = !reducedMotion && isActive ? 'animate-[kenburns_6s_ease-out_forwards]' : '';

        return (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity"
            style={{ opacity: isActive ? 1 : 0, transitionDuration: `${CROSSFADE_MS}ms`, pointerEvents: 'none' }}
            aria-hidden={!isActive}
          >
            {showVideo ? (
              <video
                ref={isActive ? videoRef : undefined}
                className={`h-full w-full object-cover ${kenBurnsClass}`}
                src={src}
                poster={slide.videoPosterUrl}
                muted
                autoPlay={isActive && !paused && !reducedMotion}
                playsInline
                preload="metadata"
                onEnded={() => {
                  if (!paused) goNext();
                }}
              />
            ) : (
              <img
                src={slide.type === 'video' ? slide.videoPosterUrl : src}
                alt=""
                fetchPriority={isActive ? 'high' : 'auto'}
                className={`h-full w-full object-cover ${kenBurnsClass}`}
              />
            )}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[rgba(11,43,34,0.5)] to-transparent" />
          </div>
        );
      })}

      {/* Labels (direct navigation) above a full-width, synced timeline —
          no separate title/description block underneath. */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(11,43,34,0.9)] via-[rgba(11,43,34,0.4)] to-transparent pb-5 pt-10 md:pb-6">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12">
          <div className="flex items-center gap-2">
            {slides.length > 1 ? (
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous slide"
                className="tap-target shrink-0 rounded-full p-1 text-canvas/70 transition-colors hover:text-canvas motion-reduce:transition-none"
              >
                <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ) : null}

            <div className="flex flex-1 flex-col gap-1.5">
              {slides.length > 1 ? (
                <div className="flex gap-1.5">
                  {slides.map((slide, i) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => goTo(i)}
                      className={`tap-target flex-1 truncate text-left font-mono text-[10px] uppercase tracking-[0.06em] transition-colors motion-reduce:transition-none ${
                        i === index ? 'text-canvas' : 'text-canvas/40 hover:text-canvas/70'
                      }`}
                    >
                      {slide.eyebrow}
                    </button>
                  ))}
                </div>
              ) : null}

              {slides.length > 1 ? (
                <div className="flex gap-1.5">
                  {slides.map((slide, i) => {
                    const isPast = i < index;
                    const isActive = i === index;
                    const pct = isPast ? 100 : isActive ? (reducedMotion ? 100 : progress) : 0;

                    return (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Slide ${i + 1} / ${slides.length}`}
                        className="h-[2px] flex-1 overflow-hidden rounded-full bg-canvas/25"
                      >
                        <span className="block h-full rounded-full bg-canvas" style={{ width: `${pct}%` }} />
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {slides.length > 1 ? (
              <button
                type="button"
                onClick={goNext}
                aria-label="Next slide"
                className="tap-target shrink-0 rounded-full p-1 text-canvas/70 transition-colors hover:text-canvas motion-reduce:transition-none"
              >
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
