'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import type { Entity } from '@/lib/cms/entities';
import type { StoryScene } from '@/lib/cms/story-scenes';
import { Button } from '@/components/ui/button';

// ---------------------------------------------------------------------
// Premium editorial showcase — "Kenali Perusahaan dalam Ekosistem Kami".
// A 50/50 layout: a large photo on the left — the active brand's own
// "Foto Showcase" (set per-entity in wp-admin), falling back to the
// Group's own photo when a brand hasn't set one yet — and a full
// information column on the right (ordinal + name + logo, about, two
// profile cards, Fokus & Kategori, a real-photo carousel when the brand
// has one, and a CTA).
// Height follows content — this is no longer squeezed into one viewport,
// unlike the original single-card version.

// PRIMARY stays reserved for accents/interactive bits (tag chips, carousel
// dots, the branded gallery placeholder) — actual heading/title text uses
// INK (near-black), never the brand blue, per the site's typography system.
const PRIMARY = '#2A7793';
const ACCENT = '#01B3A1';
const INK = '#1A1A1A';
const TEXT = '#444444';
const MUTED = '#666666';
const BORDER = '#E5E7EB';
const EASE = [0.16, 1, 0.3, 1] as const;

const BRAND_ORDER = [
  'environesia-consultant',
  'greenlab',
  'greenskill',
  'lsp-praktisi-lingkungan',
  'bikin-indonesia-berdaya',
  'bangsap',
];

function loopIndex(index: number, count: number) {
  return ((index % count) + count) % count;
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
      {children}
    </p>
  );
}

const SOCIAL_LINK_ICON =
  'flex h-9 w-9 items-center justify-center rounded-full border text-[#444444] transition-colors duration-200 hover:border-[#2A7793]/40 hover:bg-[#2A7793] hover:text-white motion-reduce:transition-none';

// lucide-react ships no brand marks (only generic icons) — same reasoning
// as the LinkedIn/Instagram glyphs in director-profile-modal.tsx. Filled,
// not stroke-based, since that's how these two marks are normally drawn.
function YoutubeGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.56 9.38.56 9.38.56s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.4 3.6-6.4 3.6Z" />
    </svg>
  );
}

function TiktokGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.6 2h-3.2v13.6a2.7 2.7 0 1 1-1.9-2.58v-3.3a6 6 0 1 0 5.1 5.93V8.73a7.5 7.5 0 0 0 4.4 1.4V6.9a4.3 4.3 0 0 1-4.4-4.3V2Z" />
    </svg>
  );
}

function ProfileCard({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-[16px] border bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-shadow duration-200 motion-reduce:transition-none hover:shadow-[0_8px_22px_rgba(16,40,36,0.08)]"
      style={{ borderColor: BORDER }}
    >
      {children}
    </div>
  );
}

// The dominant left-side photo: idle until a mouse moves over it, then a
// small tilt/parallax follows the cursor, easing back to rest on leave.
// Touch is deliberately left out — this photo is now fixed (the Group's
// own identity, not a per-brand image), so there is nothing for a touch
// gesture on it to do.
//
// `object-contain`, not `-cover`: enviro.png is a transparent-background
// portrait illustration (people, not a photographic banner) — `-cover`
// would crop straight through them. `-contain` is what every other
// illustration in this file already uses, for the same reason.
function InteractiveBrandImage({ src, alt, reduceMotion }: { src: string; alt: string; reduceMotion: boolean }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const translateX = useMotionValue(0);
  const translateY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const springX = useSpring(translateX, springConfig);
  const springY = useSpring(translateY, springConfig);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 5);
    rotateX.set(-py * 5);
    translateX.set(px * 8);
    translateY.set(py * 6);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
    translateX.set(0);
    translateY.set(0);
  }

  return (
    <div
      className="relative h-full w-full"
      style={{ perspective: 1000 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        className="relative h-full w-full"
        style={{
          rotateX: reduceMotion ? 0 : springRotateX,
          rotateY: reduceMotion ? 0 : springRotateY,
          x: reduceMotion ? 0 : springX,
          y: reduceMotion ? 0 : springY,
          transformStyle: 'preserve-3d',
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 92vw, 46vw"
          className="object-contain"
          style={{ filter: 'drop-shadow(0 24px 32px rgba(20,40,35,0.18))' }}
          priority
        />
      </motion.div>
    </div>
  );
}

// At least this many slots always show, real photos first, then enough
// branded placeholders to reach this floor — the carousel itself is
// always visible and always navigable, never hidden for lack of data.
// More than this many real photos is never capped. 6 matches Bangsap's
// own brief ("siapkan 6 slot foto") and is applied to every brand for
// consistency, rather than only one brand having a different slot count.
const MIN_CAROUSEL_SLOTS = 6;

// Autoplay cadence, and how long after any user interaction (manual nav,
// hover, drag, keyboard focus) before it resumes.
const AUTOPLAY_INTERVAL_MS = 4500;
const AUTOPLAY_RESUME_DELAY_MS = 6000;

type CarouselSlot =
  | { kind: 'photo'; key: string; scene: StoryScene & { imageUrl: string } }
  | { kind: 'placeholder'; key: string };

// A professional, on-brand empty state for a slot with no photo yet — the
// same teal/primary palette as the rest of this section, never a generic
// gray box or a stock/random image. An admin fills this slot by adding a
// scene (with a photo) to this brand's Story in wp-admin; the next publish
// swaps this placeholder for that real photo automatically.
function PhotoPlaceholder() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2.5"
      style={{ background: 'linear-gradient(135deg, rgba(42,119,147,0.10), rgba(1,179,161,0.14))' }}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full border bg-white/70"
        style={{ borderColor: 'rgba(42,119,147,0.25)' }}
      >
        <ImageIcon className="h-5 w-5" style={{ color: PRIMARY }} aria-hidden="true" />
      </div>
      <p className="text-[11.5px] font-medium" style={{ color: PRIMARY }}>
        Foto segera hadir
      </p>
    </div>
  );
}

// "Carousel Foto Real" — always rendered by the parent, for every brand,
// regardless of how many real photos it has. Real photos (from this
// brand's published Story scenes) fill the first slots; any remaining
// slots up to MIN_CAROUSEL_SLOTS show PhotoPlaceholder instead of being
// left empty or hidden. Keyed by the parent on the active brand's id, so
// switching brands fully remounts this (resetting back to the first slot)
// instead of carrying over a stale index from the previous brand.
function RealPhotoCarousel({
  scenes,
  entityName,
  reduceMotion,
}: {
  scenes: (StoryScene & { imageUrl: string })[];
  entityName: string;
  reduceMotion: boolean;
}) {
  const [index, setIndex] = useState(0);
  // A later timestamp than Date.now() while the user is actively
  // interacting (or shortly after) — autoplay checks this before each
  // tick and skips advancing while it's in the future, instead of a
  // boolean flag, so "resume 6s after the LAST interaction" doesn't need
  // its own separate timer to track/cancel.
  const [pausedUntil, setPausedUntil] = useState(0);

  const slots: CarouselSlot[] = useMemo(() => {
    const photoSlots: CarouselSlot[] = scenes.map((scene) => ({ kind: 'photo', key: scene.id, scene }));
    const placeholderCount = Math.max(MIN_CAROUSEL_SLOTS - photoSlots.length, 0);
    const placeholderSlots: CarouselSlot[] = Array.from({ length: placeholderCount }, (_, i) => ({
      kind: 'placeholder',
      key: `placeholder-${i}`,
    }));
    return [...photoSlots, ...placeholderSlots];
  }, [scenes]);

  const count = slots.length;
  const slot = slots[index];

  function go(delta: number) {
    setIndex((i) => loopIndex(i + delta, count));
  }

  function registerInteraction() {
    setPausedUntil(Date.now() + AUTOPLAY_RESUME_DELAY_MS);
  }

  function goManual(delta: number) {
    registerInteraction();
    go(delta);
  }

  function handleDragEnd(_event: unknown, info: PanInfo) {
    registerInteraction();
    const threshold = 50;
    if (info.offset.x < -threshold) go(1);
    else if (info.offset.x > threshold) go(-1);
  }

  // Autoplay: off entirely under prefers-reduced-motion (never just a
  // faster/invisible version of it), with just 1 slot (nothing to cycle
  // to), or while paused following any interaction — manual nav, drag,
  // hover, or keyboard focus landing on the carousel (see onFocus below).
  useEffect(() => {
    if (reduceMotion || count <= 1) return;
    const timer = setInterval(() => {
      if (Date.now() < pausedUntil) return;
      setIndex((i) => loopIndex(i + 1, count));
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [reduceMotion, count, pausedUntil]);

  return (
    <div
      onMouseEnter={registerInteraction}
      onFocus={registerInteraction}
      onTouchStart={registerInteraction}
    >
      <motion.div
        className="relative aspect-[12/5] touch-pan-y overflow-hidden rounded-[14px]"
        style={{ backgroundColor: '#F3F6F5' }}
        drag={count > 1 && !reduceMotion ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={slot.key}
            className="pointer-events-none absolute inset-0"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {slot.kind === 'photo' ? (
              <>
                <Image
                  src={slot.scene.imageUrl}
                  alt={slot.scene.headline ?? `Foto ${entityName}`}
                  fill
                  sizes="(max-width: 768px) 92vw, 46vw"
                  className="object-cover"
                />
                {slot.scene.headline || slot.scene.description ? (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(11,43,34,0.72)] to-transparent px-3 pb-2 pt-8">
                    {slot.scene.headline ? (
                      <p className="text-[12px] font-semibold text-white">{slot.scene.headline}</p>
                    ) : null}
                    {slot.scene.description ? (
                      <p className="mt-0.5 text-[11px] text-white/85">{slot.scene.description}</p>
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : (
              <PhotoPlaceholder />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {count > 1 ? (
        <div className="mt-2.5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => goManual(-1)}
            aria-label={`Foto sebelumnya — ${entityName}`}
            className="flex h-7 w-7 items-center justify-center rounded-full border text-[#444444] transition-colors duration-200 hover:border-[#2A7793]/40 hover:text-[#2A7793]"
            style={{ borderColor: BORDER }}
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {slots.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => {
                  registerInteraction();
                  setIndex(i);
                }}
                aria-label={s.kind === 'photo' ? `Lihat foto ${i + 1}` : `Slot foto ${i + 1} — belum tersedia`}
                aria-pressed={i === index}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: i === index ? 14 : 6, background: i === index ? ACCENT : '#D8DDE2' }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goManual(1)}
            aria-label={`Foto berikutnya — ${entityName}`}
            className="flex h-7 w-7 items-center justify-center rounded-full border text-[#444444] transition-colors duration-200 hover:border-[#2A7793]/40 hover:text-[#2A7793]"
            style={{ borderColor: BORDER }}
          >
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function EcosystemExhibition({
  entities,
  scenesByEntity,
  groupPhoto,
}: {
  entities: Entity[];
  scenesByEntity: Record<string, StoryScene[]>;
  groupPhoto: { imageSrc: string | null; imageAlt: string };
}) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [activeIndex, setActiveIndex] = useState(0);

  const ordered = useMemo(
    () => BRAND_ORDER.map((slug) => entities.find((entity) => entity.slug === slug)).filter((e): e is Entity => Boolean(e)),
    [entities]
  );
  const count = ordered.length;

  // Deep-linking: a brand menu link (e.g. "/bisnis-layanan#greenlab")
  // selects that brand directly, same contract every earlier version of
  // this section relied on.
  useEffect(() => {
    const slug = window.location.hash.slice(1);
    const index = ordered.findIndex((entity) => entity.slug === slug);
    if (index !== -1) setActiveIndex(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handlePopState() {
      const slug = window.location.hash.slice(1);
      const index = ordered.findIndex((entity) => entity.slug === slug);
      if (index !== -1) setActiveIndex(index);
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [ordered]);

  function select(index: number) {
    if (count === 0) return;
    const next = loopIndex(index, count);
    setActiveIndex(next);
    const slug = ordered[next]?.slug;
    if (slug) window.history.pushState(null, '', `#${slug}`);
  }

  const active = ordered[activeIndex];
  const activeScenes = active
    ? (scenesByEntity[active.id] ?? []).filter((scene): scene is StoryScene & { imageUrl: string } => Boolean(scene.imageUrl))
    : [];

  if (count === 0 || !active) return null;

  return (
    <div
      className="relative mx-auto w-full max-w-[1240px] px-2 py-6 sm:px-4"
      role="group"
      aria-label="Jelajahi perusahaan dalam Environesia"
    >
      {/* Plain-text alternative for assistive tech / no-JS: every real
          brand and its official site stays reachable regardless. */}
      <ul className="sr-only">
        {ordered.map((entity) => (
          <li key={entity.id}>
            <a href={entity.explorerCtaUrl}>{entity.name}</a>
          </li>
        ))}
      </ul>

      {/* Section header — left-aligned, never centered: it introduces the
          50/50 layout below rather than sitting above it as its own
          separate, centered block. */}
      <div className="max-w-[640px] text-left">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: ACCENT }}>
          Environesia
        </p>
        <h2 className="mt-2 text-h2 font-bold" style={{ color: INK }}>
          Kenali Perusahaan dalam Ekosistem Kami
        </h2>
        <p className="mt-2 text-body" style={{ color: TEXT }}>
          Pilih perusahaan yang ingin Anda kenali lebih dekat.
        </p>
      </div>

      <motion.div
        key={active.id}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="mt-10 grid grid-cols-1 items-start gap-10 md:mt-14 md:grid-cols-2 md:gap-16"
      >
        {/* LEFT 50% — the active brand's own "Foto Showcase"
            (explorer_image_path, set per-entity in wp-admin), falling back
            to the Group's own photo only when that brand hasn't set one
            yet. This is the same field admins see as "Foto Showcase" on
            the Entity edit form — it must actually render somewhere, or
            editing it there has no visible effect anywhere on the site. */}
        <div
          // `md:h-[560px]` is a genuinely definite height, not `h-full` —
          // the grid above uses `items-start` (the two columns size
          // independently, never stretched to match each other), so a
          // percentage height here would have nothing definite to resolve
          // against and the whole nested `h-full` chain inside
          // InteractiveBrandImage (needed for its `fill` image) would
          // collapse to 0 — which is exactly what happened before this was
          // a fixed pixel value instead of min-height-on-an-auto-box.
          className="order-first relative aspect-[4/5] overflow-hidden rounded-[24px] sm:aspect-[5/6] md:order-none md:aspect-auto md:h-[560px]"
          style={{ backgroundColor: '#F3F6F5' }}
        >
          {active.explorerImageSrc ? (
            <InteractiveBrandImage src={active.explorerImageSrc} alt={`Foto ${active.name}`} reduceMotion={shouldReduceMotion} />
          ) : groupPhoto.imageSrc ? (
            <InteractiveBrandImage src={groupPhoto.imageSrc} alt={groupPhoto.imageAlt} reduceMotion={shouldReduceMotion} />
          ) : null}
        </div>

        {/* RIGHT 50% — the full information column, top to bottom:
            01 — Nama Brand + Logo (side by side) → Tentang Perusahaan →
            2 Card Profile → Fokus & Kategori → Carousel Foto Real (if
            available) → CTA. */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden="true"
                className="select-none text-[clamp(26px,3.2vw,34px)] font-extrabold leading-none"
                style={{ color: '#E3ECEA' }}
              >
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <h3 className="text-h3 font-bold" style={{ color: INK }}>
                {active.name}
              </h3>
              {/* Logo beside the name, not below it — sized to the name's
                  own type scale (h-6/h-7, roughly its cap-height) so the
                  two read as one balanced lockup: never a tiny
                  afterthought, never big enough to outweigh the name.
                  `object-contain` + no fixed width keeps its real aspect
                  ratio, whatever that happens to be per brand. */}
              {active.logoUrl ? (
                <Image
                  src={active.logoUrl}
                  alt={`Logo ${active.name}`}
                  width={300}
                  height={100}
                  className="h-6 w-auto shrink-0 object-contain sm:h-7"
                />
              ) : null}
            </div>

            {/* Compact brand switcher, right by the name — the quick way
                to move on without scrolling back up past the whole
                information column below. */}
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => select(activeIndex - 1)}
                aria-label="Perusahaan sebelumnya"
                className="flex h-8 w-8 items-center justify-center rounded-full border text-[#444444] transition-colors duration-200 hover:border-[#2A7793]/40 hover:text-[#2A7793]"
                style={{ borderColor: BORDER }}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => select(activeIndex + 1)}
                aria-label="Perusahaan berikutnya"
                className="flex h-8 w-8 items-center justify-center rounded-full border text-[#444444] transition-colors duration-200 hover:border-[#2A7793]/40 hover:text-[#2A7793]"
                style={{ borderColor: BORDER }}
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-6">
            <FieldLabel>Tentang Perusahaan</FieldLabel>
            <p className="mt-2.5 text-[16px] leading-[1.75] md:text-[17px]" style={{ color: TEXT }}>
              {active.explorerDescription}
            </p>
          </div>

          {/* 2 Card Profile — positions swapped from the previous pass
              (Peran & Kontribusi now left, Fokus & Kategori now right);
              same two cards, same data, only their left/right order
              changed. */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ProfileCard>
              <FieldLabel>Peran &amp; Kontribusi</FieldLabel>
              <p className="mt-2.5 text-body" style={{ color: TEXT }}>
                {active.explorerRole}
              </p>
              <p className="mt-3.5 text-body" style={{ color: TEXT }}>
                {active.explorerContribution}
              </p>
            </ProfileCard>
            <ProfileCard>
              <FieldLabel>Fokus &amp; Kategori</FieldLabel>
              <p className="mt-2.5 text-[16px] font-semibold leading-[1.4] md:text-[17px]" style={{ color: INK }}>
                {active.explorerCategory}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {active.explorerFocus.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-3 py-1.5 text-[13px] font-medium leading-[1.3]"
                    style={{ backgroundColor: 'rgba(42,119,147,0.08)', color: PRIMARY }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </ProfileCard>
          </div>

          <div className="mt-5">
            <FieldLabel>Galeri {active.name}</FieldLabel>
            <div className="mt-2.5">
              <RealPhotoCarousel scenes={activeScenes} entityName={active.name} reduceMotion={shouldReduceMotion} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {active.explorerCtaUrl ? (
              <Button href={active.explorerCtaUrl} target="_blank" rel="noopener noreferrer">
                Kunjungi {active.name}
              </Button>
            ) : null}

            {/* Tautan Platform Resmi — only the icons this brand actually
                has a URL for; most brands show none of this row at all. */}
            {active.socialYoutubeUrl || active.socialTiktokUrl ? (
              <div className="flex items-center gap-2">
                {active.socialYoutubeUrl ? (
                  <a
                    href={active.socialYoutubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`YouTube — ${active.name}`}
                    className={SOCIAL_LINK_ICON}
                    style={{ borderColor: BORDER }}
                  >
                    <YoutubeGlyph className="h-4 w-4" />
                  </a>
                ) : null}
                {active.socialTiktokUrl ? (
                  <a
                    href={active.socialTiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`TikTok — ${active.name}`}
                    className={SOCIAL_LINK_ICON}
                    style={{ borderColor: BORDER }}
                  >
                    <TiktokGlyph className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>

      {/* Overview — every brand reachable directly, not just next/previous. */}
      <div className="mt-10 flex flex-wrap items-center justify-start gap-2">
        {ordered.map((entity, index) => (
          <button
            key={entity.id}
            type="button"
            onClick={() => select(index)}
            aria-label={`Pilih ${entity.name}`}
            aria-pressed={index === activeIndex}
            className="h-2 rounded-full transition-all duration-300"
            style={{ width: index === activeIndex ? 22 : 8, background: index === activeIndex ? ACCENT : '#D8DDE2' }}
          />
        ))}
      </div>
    </div>
  );
}
