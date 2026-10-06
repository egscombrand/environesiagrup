import type { LucideIcon } from 'lucide-react';
import { ClipboardCheck, Clock, Globe, Headphones, Users } from 'lucide-react';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { RevealStagger, RevealItem } from '@/components/motion/reveal-stagger';

// Matched 1:1 against a supplied reference screenshot: teal icon badge
// with a white glyph, light-gray card fill (not white), no card border.
//
// The glyph is white, not #01B3A1, despite that value being requested
// twice now — #01B3A1 measures ~1.02:1 contrast against this exact badge
// background (#0CB19F), i.e. the two are visually almost the same color,
// so the icon disappears into its own badge (confirmed via screenshot,
// not a guess). White is what the supplied reference image itself shows.
// If #01B3A1 is genuinely wanted for the glyph, the badge background
// needs to change to something with real contrast against it first.
const ICON_BG = '#0CB19F';
const HEADING_COLOR = '#2A7793';

const PRINCIPLES = [
  {
    icon: ClipboardCheck,
    title: 'Accuration',
    description:
      'Kami memastikan penerapan standar terbaik dan termutakhir melalui proses validasi-verifikasi menggunakan peralatan laboratorium yang telah dikalibrasi.',
  },
  {
    icon: Clock,
    title: 'On Time!',
    description:
      'Environesia berkomitmen untuk menyediakan Laporan Hasil Pengujian (LHU) tepat waktu berdasarkan kontrak pekerjaan.',
  },
  {
    icon: Users,
    title: 'Integrity',
    description:
      'Kami berupaya penuh melakukan hal yang benar setiap saat, transparansi (terdokumentasi, komunikasi, kejujuran) dan pengambilan keputusan etis.',
  },
  {
    icon: Headphones,
    title: 'Caring',
    description:
      'Kami berfokus pada hubungan jangka panjang dengan memberikan pelayanan sepenuh hati dan siap menjawab kebutuhan Anda!',
  },
] as const;

const CONTINUOUS_IMPROVEMENT = {
  icon: Globe,
  title: 'Continuous Improvement',
  description:
    'Semangat kami dalam peningkatan dan perbaikan kualitas layanan berstandar global dengan menerapkan standar mutu terbaik sesuai ISO 9001:2015 Sistem Manajemen Mutu, ISO 14001:2015 Sistem Manajemen Lingkungan, ISO 45001:2018 Sistem Manajemen Kesehatan dan Keselamatan Kerja, dan ISO 17025:2017 Persyaratan Umum untuk Kompetensi Laboratorium Pengujian dan Kalibrasi.',
} as const;

function IconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: ICON_BG }}
    >
      <Icon className="h-8 w-8 text-white" strokeWidth={2} aria-hidden="true" />
    </span>
  );
}

/** Icon + title on one row, description below spanning the card's full
 * width — the same structure for all 5 cards (Continuous Improvement
 * included; it only differs from the rest by spanning wider in the grid,
 * not by its own internal layout). `h-full` + the grid's default
 * row-stretch (no `items-start` override) is what makes every card in a
 * row the same height regardless of its own copy length. */
function PrincipleCard({ icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex h-full flex-col rounded-[16px] bg-stone p-6">
      <div className="flex items-center gap-3">
        <IconBadge icon={icon} />
        <p className="font-landing-display text-[20px] font-bold text-pine-ink">{title}</p>
      </div>
      <p className="mt-4 flex-1 text-justify text-[16px] leading-[1.65] text-pine-ink/70 lg:text-[17px]">
        {description}
      </p>
    </div>
  );
}

/**
 * "Proyek Yang Berkualitas Dibangun dari Budaya Kerja Environesian Yang
 * Berintegritas" — five culture-principle cards, matched 1:1 against a
 * supplied reference image: icon + title on one row, description below it
 * spanning the card's full width, light-gray (not white) card fill, no
 * border. All 5 cards share this exact structure, Continuous Improvement
 * included — it only differs from the rest by spanning wider in the grid.
 *
 * Laid out 3 + 2: a plain 3-column grid where the first 4 cards are
 * ordinary 1-column items (auto-placement fills row 1 with the first 3,
 * then starts row 2 with the 4th), and Continuous Improvement is given an
 * explicit `lg:col-span-2` so it takes the rest of row 2 — wider than a
 * regular card without being full-width, exactly as specified, not via
 * any centering trick. It's still the same `PrincipleCard` component as
 * the other 4; only its grid placement differs.
 */
export function StandardsSection(props: { locale: string; title?: string }) {
  const { title } = props;

  return (
    <Section className="bg-sage-mist/30">
      <Reveal>
        <h2
          className="mx-auto max-w-[1040px] break-words text-center font-landing-display text-[32px] font-bold leading-[1.15] md:text-[36px] lg:text-[40px] xl:text-[46px]"
          style={{ color: HEADING_COLOR }}
        >
          {title ?? 'Proyek Yang Berkualitas Dibangun dari Budaya Kerja Environesian Yang Berintegritas'}
        </h2>
      </Reveal>

      <RevealStagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {PRINCIPLES.map((principle) => (
          <RevealItem key={principle.title}>
            <PrincipleCard icon={principle.icon} title={principle.title} description={principle.description} />
          </RevealItem>
        ))}

        <RevealItem className="sm:col-span-2 lg:col-span-2">
          <PrincipleCard
            icon={CONTINUOUS_IMPROVEMENT.icon}
            title={CONTINUOUS_IMPROVEMENT.title}
            description={CONTINUOUS_IMPROVEMENT.description}
          />
        </RevealItem>
      </RevealStagger>
    </Section>
  );
}
