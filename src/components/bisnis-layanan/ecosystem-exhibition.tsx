'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useReducedMotion, useSpring, type PanInfo } from 'framer-motion';
import {
  Activity,
  Award,
  BarChart3,
  Briefcase,
  ClipboardCheck,
  FlaskConical,
  GraduationCap,
  Shirt,
  ShieldCheck,
  TestTube,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import type { Entity } from '@/lib/cms/entities';
import { ENTITY_PROFILES } from './entity-profile-data';

// ---------------------------------------------------------------------
// Premium Interactive Brand Showcase — "one brand, one focus, complete
// information". Reading integrity comes first: every narrative line is
// 15px and never truncated, which means the section's height follows its
// content rather than being force-fit into a hard viewport cap — the
// layout stays as compact as the real copy allows, not shorter.

const PRIMARY = '#2A7793';
const ACCENT = '#01B3A1';
const TEXT = '#444444';
const MUTED = '#666666';
const BORDER = '#E5E7EB';
const EASE = [0.16, 1, 0.3, 1] as const;
// Every narrative/description line — never a keyword label or list item —
// uses exactly this size, on every breakpoint, per the brief.
const NARRATIVE_TEXT_STYLE = { fontSize: '15px', lineHeight: 1.65, color: TEXT } as const;

const BRAND_ORDER = [
  'environesia',
  'greenlab',
  'greenskill',
  'lsp-praktisi-lingkungan',
  'bikin-indonesia-berdaya',
];

// The real illustrations already in the project — used exactly as-is, no
// redraw, no 3D re-creation, no icon substitute. Filenames (and casing)
// are exactly what's on disk under /public/environesiagrup/.
const SHOWCASE_IMAGE: Record<string, string> = {
  environesia: '/environesiagrup/enviro.png',
  greenlab: '/environesiagrup/Greenlab.png',
  greenskill: '/environesiagrup/greenskill.png',
  'lsp-praktisi-lingkungan': '/environesiagrup/lsp.png',
  'bikin-indonesia-berdaya': '/environesiagrup/kinco.png',
};

type BrandContent = {
  category: string;
  profile: string;
  contribution: string;
  focusShort: string[];
  services: string[];
};

// Content follows a deliberate information hierarchy per brand: Kategori +
// Fokus Utama (scan-level identity), Peran dalam Ekosistem (from the same
// real roleInGroup field used across the rest of the site), Layanan Utama
// (what it actually does, with icons), Peran dan Kontribusi (what it
// helps achieve — distinct from the services list), Tentang Perusahaan
// (fuller context). Nothing here is fabricated.
const BRAND_CONTENT: Record<string, BrandContent> = {
  environesia: {
    category: 'Environmental Consulting & Sustainability',
    profile:
      'Environesia berfokus pada konsultansi dan pendampingan lingkungan untuk membantu organisasi memahami, mengelola, dan memenuhi kebutuhan lingkungan dalam pengembangan proyek dan kegiatan usaha.',
    contribution:
      'Membantu organisasi memahami kebutuhan lingkungan, memenuhi kewajiban yang berlaku, dan mengelola aspek lingkungan dalam pengembangan kegiatan usaha.',
    focusShort: ['Consulting', 'Assessment', 'Compliance', 'Monitoring'],
    services: ['Environmental Consulting', 'Environmental Assessment', 'Compliance', 'Monitoring'],
  },
  greenlab: {
    category: 'Environmental Laboratory & Testing',
    profile:
      'GreenLab berfokus pada pengujian dan analisis laboratorium untuk menghasilkan data yang mendukung kebutuhan teknis, regulasi, dan pengambilan keputusan.',
    contribution:
      'Menyediakan data hasil pengujian dan analisis yang dapat mendukung kebutuhan teknis, regulasi, serta pengambilan keputusan.',
    focusShort: ['Laboratory', 'Testing', 'Analysis'],
    services: ['Laboratory', 'Testing', 'Analysis', 'Environmental Testing'],
  },
  greenskill: {
    category: 'Training & Professional Development',
    profile:
      'GreenSkill berfokus pada pengembangan kompetensi melalui pembelajaran, pelatihan, dan pengembangan profesional yang relevan dengan kebutuhan lingkungan dan industri.',
    contribution:
      'Membantu individu dan organisasi mengembangkan kompetensi yang relevan dengan kebutuhan lingkungan dan dunia kerja.',
    focusShort: ['Training', 'Learning', 'Development'],
    services: ['Training', 'Learning', 'Development', 'Professional Development'],
  },
  'lsp-praktisi-lingkungan': {
    category: 'Competency Certification',
    profile:
      'LSP Praktisi Lingkungan Indonesia berfokus pada sertifikasi kompetensi profesional di bidang lingkungan melalui proses asesmen dan skema sertifikasi yang relevan.',
    contribution:
      'Mendukung pengakuan kompetensi profesional melalui proses asesmen dan sertifikasi yang relevan di bidang lingkungan.',
    focusShort: ['Competency', 'Assessment', 'Certification'],
    services: ['Competency', 'Assessment', 'Certification', 'Professional Certification'],
  },
  'bikin-indonesia-berdaya': {
    category: 'Apparel & Professional Uniform',
    profile:
      'Bikin Indonesia Berdaya mendukung kebutuhan apparel, seragam, dan pakaian kerja untuk organisasi, perusahaan, dan aktivitas profesional.',
    contribution:
      'Mendukung kebutuhan apparel dan pakaian kerja yang sesuai untuk kebutuhan organisasi, perusahaan, dan aktivitas profesional.',
    focusShort: ['Apparel', 'Uniform', 'Workwear'],
    services: ['Apparel', 'Uniform', 'Workwear', 'Custom Apparel'],
  },
};

// A relevant, minimal line icon per service label — never a plain white
// generic mark — so the Layanan Utama list doubles as a scannable visual
// cue rather than plain text.
const SERVICE_ICON: Record<string, LucideIcon> = {
  'Environmental Consulting': Briefcase,
  'Environmental Assessment': ClipboardCheck,
  Compliance: ShieldCheck,
  Monitoring: Activity,
  Laboratory: FlaskConical,
  Testing: TestTube,
  Analysis: BarChart3,
  'Environmental Testing': FlaskConical,
  Training: GraduationCap,
  Learning: GraduationCap,
  Development: TrendingUp,
  'Professional Development': TrendingUp,
  Competency: Award,
  Assessment: ClipboardCheck,
  Certification: Award,
  'Professional Certification': Award,
  Apparel: Shirt,
  Uniform: Shirt,
  Workwear: Shirt,
  'Custom Apparel': Shirt,
};

function loopIndex(index: number, count: number) {
  return ((index % count) + count) % count;
}

// The image is the one interactive element: idle (no animation) until a
// mouse moves over it, then a small tilt/parallax follows the cursor, and
// eases back to rest when the cursor leaves. Touch is deliberately left
// out — swiping the row is reserved for changing brands, so it never has
// to compete with a touch-driven tilt gesture.
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
    rotateY.set(px * 6);
    rotateX.set(-py * 6);
    translateX.set(px * 10);
    translateY.set(py * 8);
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
      style={{ perspective: 900 }}
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
          sizes="(max-width: 768px) 66vw, (max-width: 1024px) 30vw, 360px"
          className="object-contain"
          style={{ filter: 'drop-shadow(0 20px 28px rgba(20,40,35,0.16))' }}
          priority
        />
      </motion.div>
    </div>
  );
}

function InfoCard({ children, align }: { children: React.ReactNode; align: 'left' | 'right' }) {
  return (
    <div
      className="rounded-[14px] border bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
      style={{ borderColor: BORDER, textAlign: align === 'left' ? 'left' : 'right' }}
    >
      {children}
    </div>
  );
}

export function EcosystemExhibition({ entities }: { entities: Entity[] }) {
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

  function handleDragEnd(_event: unknown, info: PanInfo) {
    const threshold = 60;
    if (info.offset.x < -threshold) select(activeIndex + 1);
    else if (info.offset.x > threshold) select(activeIndex - 1);
  }

  const active = ordered[activeIndex];
  const activeProfile = active ? ENTITY_PROFILES[active.slug] : null;
  const activeBrand = active ? BRAND_CONTENT[active.slug] : null;
  const nextSlug = count ? ordered[loopIndex(activeIndex + 1, count)]?.slug : undefined;

  if (count === 0 || !active || !activeProfile || !activeBrand) return null;

  return (
    <div
      className="relative mx-auto flex w-full max-w-[1240px] flex-col px-2 py-6 sm:px-4"
      role="group"
      aria-label="Jelajahi perusahaan dalam Environesia Group"
    >
      {/* Plain-text alternative for assistive tech / no-JS: every real
          brand and its official site stays reachable regardless. */}
      <ul className="sr-only">
        {ordered.map((entity) => {
          const profile = ENTITY_PROFILES[entity.slug];
          return (
            <li key={entity.id}>
              <a href={profile?.ctaUrl}>{entity.name}</a>
            </li>
          );
        })}
      </ul>

      {/* Header — "Environesia Company Group" stays the single most
          dominant heading in the section; everything below, including the
          active brand's own name, is deliberately smaller. */}
      <div className="shrink-0 text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: ACCENT }}>
          Environesia Company Group
        </p>
        <h2 className="mt-1 text-[clamp(20px,2.6vw,30px)] font-bold tracking-[-0.01em]" style={{ color: PRIMARY }}>
          Kenali Perusahaan dalam Ekosistem Kami
        </h2>
        <p className="mt-1 text-[13px]" style={{ color: TEXT }}>
          Pilih perusahaan yang ingin Anda kenali lebih dekat.
        </p>
      </div>

      <motion.div
        key={active.id}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        {/* Active brand name — a smaller heading than the section title
            above, with a large faint ordinal as the one decorative
            flourish; consistent #2A7793 across every brand. */}
        <div className="mt-5 flex shrink-0 items-center justify-center gap-3">
          <span
            aria-hidden="true"
            className="select-none text-[clamp(24px,3.6vw,36px)] font-extrabold leading-none"
            style={{ color: '#EEF1F0' }}
          >
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <h3 className="text-center text-[clamp(15px,1.9vw,19px)] font-bold uppercase tracking-[0.04em]" style={{ color: PRIMARY }}>
            {active.name}
          </h3>
        </div>

        <motion.div
          className="mt-4 grid touch-pan-y grid-cols-1 items-center gap-4 md:grid-cols-[1.15fr_minmax(0,1.5fr)_1.15fr] md:gap-5"
          drag={shouldReduceMotion ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={handleDragEnd}
        >
          {/* Left — Profil Perusahaan */}
          <InfoCard align="left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
              Profil Perusahaan
            </p>
            <div className="mt-2.5 space-y-2.5">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.06em]" style={{ color: ACCENT }}>
                  Fokus Utama
                </dt>
                <dd className="mt-0.5 text-[12.5px] leading-[1.5]" style={{ color: TEXT }}>
                  {activeBrand.focusShort.join(' · ')}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.06em]" style={{ color: ACCENT }}>
                  Peran dalam Ekosistem
                </dt>
                <dd className="mt-0.5" style={NARRATIVE_TEXT_STYLE}>
                  {activeProfile.roleInGroup}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.06em]" style={{ color: ACCENT }}>
                  Kategori
                </dt>
                <dd className="mt-0.5 text-[12.5px] leading-[1.5]" style={{ color: TEXT }}>
                  {activeBrand.category}
                </dd>
              </div>
            </div>
          </InfoCard>

          {/* Center — the real brand image, large, dominant, and
              mouse-interactive */}
          <div className="order-first h-[26vh] min-h-[170px] sm:h-[32vh] md:order-none md:h-[360px]">
            <InteractiveBrandImage
              src={SHOWCASE_IMAGE[active.slug] ?? ''}
              alt={`Tim ${active.name}`}
              reduceMotion={shouldReduceMotion}
            />
          </div>

          {/* Right — Layanan Utama, each with a relevant line icon */}
          <InfoCard align="left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
              Layanan Utama
            </p>
            <ul className="mt-2.5 space-y-1.5">
              {activeBrand.services.map((item) => {
                const Icon = SERVICE_ICON[item] ?? Briefcase;
                return (
                  <li key={item} className="flex items-center gap-2 text-[12.5px] leading-[1.4]" style={{ color: TEXT }}>
                    <Icon aria-hidden="true" size={14} strokeWidth={2} style={{ color: ACCENT, flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                );
              })}
            </ul>
          </InfoCard>
        </motion.div>

        {/* A thin divider marks the shift from scannable panels (above)
            to narrative context (below) — subtle, functional framing. */}
        <div className="mx-auto mt-4 h-px w-16 shrink-0" style={{ background: BORDER }} />

        {/* Peran dan Kontribusi — what this brand helps achieve, distinct
            from the Layanan Utama list above. */}
        <div className="mx-auto mt-4 max-w-[680px] shrink-0 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
            Peran dan Kontribusi
          </p>
          <p className="mx-auto mt-1.5" style={{ ...NARRATIVE_TEXT_STYLE, color: PRIMARY }}>
            {activeBrand.contribution}
          </p>
        </div>

        {/* Tentang Perusahaan — fuller context, read in full, never
            clipped. */}
        <div className="mx-auto mt-4 max-w-[680px] shrink-0 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
            Tentang Perusahaan
          </p>
          <p className="mx-auto mt-1.5" style={NARRATIVE_TEXT_STYLE}>
            {activeBrand.profile}
          </p>
          <a
            href={activeProfile.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-white transition-transform duration-200 hover:scale-[1.03]"
            style={{ background: PRIMARY }}
          >
            {activeProfile.ctaLabel}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </motion.div>

      {/* Navigation — minimal counter plus previous/next, always available.
          No Reset View: previous/next/swipe/drag are the only controls, and
          none of them ever becomes non-interactive. */}
      <div className="mt-5 flex shrink-0 items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => select(activeIndex - 1)}
          aria-label="Perusahaan sebelumnya"
          className="flex h-8 w-8 items-center justify-center rounded-full border text-[#444444] transition-colors duration-200 hover:border-[#2A7793]/40 hover:text-[#2A7793]"
          style={{ borderColor: BORDER }}
        >
          ←
        </button>
        <span className="text-[12px] font-semibold tracking-[0.04em]" style={{ color: MUTED }}>
          {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={() => select(activeIndex + 1)}
          aria-label="Perusahaan berikutnya"
          className="flex h-8 w-8 items-center justify-center rounded-full border text-[#444444] transition-colors duration-200 hover:border-[#2A7793]/40 hover:text-[#2A7793]"
          style={{ borderColor: BORDER }}
        >
          →
        </button>
      </div>

      <div className="mt-2 flex shrink-0 flex-wrap items-center justify-center gap-2">
        {ordered.map((entity, index) => (
          <button
            key={entity.id}
            type="button"
            onClick={() => select(index)}
            aria-label={`Pilih ${entity.name}`}
            aria-pressed={index === activeIndex}
            className="h-2 rounded-full transition-all duration-300"
            style={{ width: index === activeIndex ? 20 : 8, background: index === activeIndex ? ACCENT : '#D8DDE2' }}
          />
        ))}
      </div>

      {/* Preload the next image so moving forward feels instant. */}
      {nextSlug ? <link rel="preload" as="image" href={SHOWCASE_IMAGE[nextSlug]} /> : null}
    </div>
  );
}
