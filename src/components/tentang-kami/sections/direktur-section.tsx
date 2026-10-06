import Image from 'next/image';
import { getPublishedLeadership } from '@/lib/cms/leadership';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { DirectorProfileButton, type DirectorProfile } from '@/components/tentang-kami/sections/director-profile-modal';
import { ClipRevealImage, StaggerGroup, StaggerItem, StaggerLineItem } from '@/components/tentang-kami/sections/director-motion';
import { findTentangKamiRoute } from '@/lib/tentang-kami-routes';
import { messagesFor } from '@/i18n/messages';

const ROUTE = findTentangKamiRoute('direktur');

// Real, verified content given directly — hardcoded (not CMS-driven)
// because the `leadership` table has no published rows yet (confirmed
// empty). Saprian's biography, education, experience, and teaching
// history were given directly and are reproduced as-is. The three Dewan
// Direksi members have no bio content available yet — this project's
// standing rule is to never invent it, so their `description` and modal
// fields stay undefined until real content exists. DirectorProfileButton
// already renders an honest "akan segera hadir" state inside the modal
// when a person has none of these fields set.
//
// University/institution logos are the real crests provided in
// `public/pendidikan/` (kept at their original filenames) — never an
// external or hotlinked source.
//
// Photos are the real portrait files already in `public/` (kept at
// their original filenames — spaces URL-encoded, nothing moved or
// renamed).
const DIREKTUR_UTAMA: DirectorProfile & { photo: string; width: number; height: number; description?: string } = {
  position: 'Director Environesia Group',
  name: 'Ir. Saprian, S.T., M.Sc., M.T., IPM., ASEAN Eng.',
  descriptor: 'Praktisi Bisnis Lingkungan',
  photo: '/leadership/direktur-utama.png',
  width: 1314,
  height: 2154,
  description:
    'Ir. Saprian, S.T., M.Sc., M.T., IPM., ASEAN Eng., dikenal sebagai Bangsap, merupakan praktisi bisnis lingkungan yang telah menangani lebih dari 1.000 proyek di 38 provinsi dan 10 negara. Ia merupakan Founder & CEO dari 5 entitas bisnis lingkungan serta Dosen Praktisi di Magister Pengelolaan Lingkungan UGM dan Sustainable Business BINUS University.',
  education: [
    {
      level: 'S1 Teknik Lingkungan',
      institution: 'Universitas Islam Indonesia (UII)',
      degree: 'S.T.',
      scholarship: 'Beasiswa Abdul Kahar Muzakkir',
      logo: '/pendidikan/Logo-UII-Asli.webp',
    },
    {
      level: 'S2 Magister Pengelolaan Lingkungan',
      institution: 'Universitas Gadjah Mada (UGM)',
      degree: 'M.Sc.',
      scholarship: 'LPDP',
      logo: '/pendidikan/logo-ugm-transparent.png',
    },
    {
      level: 'S2 Magister Teknik Lingkungan',
      institution: 'Universitas Islam Indonesia (UII)',
      degree: 'M.T.',
      logo: '/pendidikan/Logo-UII-Asli.webp',
    },
    {
      level: 'Program Insinyur Teknik',
      institution: 'Universitas Gadjah Mada (UGM)',
      degree: 'Ir.',
      logo: '/pendidikan/logo-ugm-transparent.png',
    },
    {
      level: 'S3 Program Doktor Manajemen & Bisnis',
      institution: 'IPB University',
      note: 'Menempuh pendidikan doktoral sebagai bagian dari penguatan kapasitas akademik, kepemimpinan, dan pengembangan bisnis berkelanjutan.',
      logo: '/pendidikan/Logo_IPB.png',
    },
  ],
  experience: [
    'Ir. Saprian, S.T., M.Sc., M.T., IPM., ASEAN Eng. dikenal sebagai praktisi bisnis lingkungan dengan pengalaman menangani lebih dari 1.000 proyek di 38 provinsi dan 10 negara.',
    'Ia merupakan Founder & CEO dari 5 entitas bisnis lingkungan dengan pengalaman dalam pengembangan dan pengelolaan usaha di bidang konsultansi dan laboratorium lingkungan, sertifikasi kompetensi, serta pendidikan dan pelatihan.',
    'Pengalaman profesional tersebut mencakup pekerjaan bersama masyarakat, perusahaan, pemerintah, hingga mitra internasional dalam berbagai konteks pengelolaan lingkungan dan pengembangan bisnis.',
  ],
  stats: [
    { value: '1.000+', label: 'Proyek' },
    { value: '38', label: 'Provinsi' },
    { value: '10', label: 'Negara' },
    { value: '5', label: 'Entitas Bisnis Lingkungan' },
  ],
  contribution: [
    'Bagi Bangsap, keberlanjutan lingkungan tidak cukup berhenti sebagai gagasan, tetapi perlu diterjemahkan menjadi solusi yang dapat digunakan, memberi manfaat, dan memiliki model bisnis yang mampu berjalan secara berkelanjutan.',
  ],
  contributionLabel: 'Kontribusi Profesional',
  teaching: [
    {
      institution: 'Universitas Gadjah Mada (UGM)',
      program: 'Magister Pengelolaan Lingkungan',
      description:
        'Aktivitas sebagai dosen praktisi menjadi ruang untuk menghubungkan teori akademik dengan pengalaman praktik lingkungan dan kasus nyata di lapangan.',
      logo: '/pendidikan/logo-ugm-transparent.png',
    },
    {
      institution: 'BINUS University',
      program: 'Sustainable Business',
      description: 'Mengajarkan bisnis berkelanjutan dan penerapannya dalam praktik bisnis.',
      logo: '/pendidikan/Logo_Binus_University.png',
    },
  ],
};

const DEWAN_DIREKSI: Array<DirectorProfile & { photo: string; width: number; height: number; description?: string }> = [
  {
    position: 'Director Corporate Services and Innovation',
    name: 'Nurul Lahtifah, S.T.',
    photo: '/Mba%20Nurul.jpg',
    width: 801,
    height: 1426,
  },
  {
    position: 'Director of Operational',
    name: 'Yusuf Wiryawan, S.T.M.Ling.M.T.',
    photo: '/Bang%20ucup.jpg',
    width: 801,
    height: 1426,
  },
  {
    position: 'Director Business Development',
    name: 'Ir. Ariyan Eka Putra, S.T.M.T.',
    photo: '/BANG%20ARIYAN.jpg',
    width: 801,
    height: 1426,
  },
];

// Shared frame for the three Dewan Direksi photos so all three occupy the
// same visual area regardless of each source file's real dimensions —
// `object-contain` inside a fixed-aspect box, never a crop.
const DEWAN_DIREKSI_PHOTO_ASPECT = '801 / 1426';

// Leadership of a group entity (not Environesia Group itself) — kept
// visually and structurally separate from Dewan Direksi so "Direktur"
// here is never mistaken for a Director-of-Environesia-Group role. Only
// one profile exists today; the layout below is a single editorial
// profile rather than a grid, specifically so it doesn't read as an
// empty 3-column grid with two placeholder slots. His photo is sized
// medium-large — bigger than each Dewan Direksi photo, but still clearly
// smaller than Direktur Utama's — so he reads as a real leadership figure
// without being mistaken for a fourth Environesia Group director.
const LEADERSHIP_ENTITAS_GRUP: DirectorProfile & { photo: string; width: number; height: number; entityLabel: string; description?: string } = {
  entityLabel: 'PT Indonesia Bikin Berdaya',
  name: 'Fauzan Madani',
  position: 'Direktur',
  entity: 'PT Indonesia Bikin Berdaya',
  photo: '/Bang%20ojan.jpeg',
  width: 801,
  height: 1426,
};

export async function DirekturSection(props: {
  locale: string;
  dewanDireksi?: Awaited<ReturnType<typeof getPublishedLeadership>>;
}) {
  const { locale } = props;
  const t = messagesFor(locale);

  return (
    <Section className="py-8 md:py-10">
      <StaggerGroup staggerMs={100}>
        <StaggerItem distance={12} durationMs={500}>
          <p className="font-mono text-[14px] font-bold uppercase tracking-[0.12em] text-[#2A7793]">{t.tentangKami.judul}</p>
        </StaggerItem>
        <StaggerItem distance={20} durationMs={650}>
          <h1 className="mt-2 font-landing-display text-display font-bold leading-[1.15] text-[#111111]">{ROUTE.label}</h1>
        </StaggerItem>
        <StaggerLineItem durationMs={550} className="mt-4 h-[2px] w-14 bg-[#2A7793]" />
      </StaggerGroup>

      {/* Direktur Utama — the page's main focal point, its own featured
          profile, never grouped into the Dewan Direksi grid at equal
          weight. Jabatan → nama → accent line → deskripsi → CTA reveal in
          sequence on scroll-into-view. */}
      <Reveal className="mt-8 md:mt-10">
        <h2 className="text-[22px] font-bold text-[#111111] md:text-[26px]">Direktur Utama</h2>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,340px)_1fr] md:items-center md:gap-14">
        <ClipRevealImage durationMs={900}>
          <Image
            src={DIREKTUR_UTAMA.photo}
            alt={`${DIREKTUR_UTAMA.name} — ${DIREKTUR_UTAMA.position}`}
            width={DIREKTUR_UTAMA.width}
            height={DIREKTUR_UTAMA.height}
            quality={100}
            className="mx-auto h-auto max-h-[520px] w-auto rounded-[10px] object-contain md:mx-0"
          />
        </ClipRevealImage>
        <StaggerGroup staggerMs={100}>
          <StaggerItem distance={16} durationMs={600}>
            <p className="font-mono text-[14px] font-bold uppercase leading-snug tracking-[0.12em] text-[#2A7793]">
              {DIREKTUR_UTAMA.position}
            </p>
          </StaggerItem>
          <StaggerItem distance={16} durationMs={650}>
            <p className="mt-2 font-landing-display text-[32px] font-bold leading-[1.15] text-[#111111] md:text-[40px]">
              {DIREKTUR_UTAMA.name}
            </p>
          </StaggerItem>
          <StaggerLineItem durationMs={550} className="mt-4 h-[2px] w-12 bg-[#2A7793]" />
          {DIREKTUR_UTAMA.description ? (
            <StaggerItem distance={16} durationMs={600}>
              <p className="mt-4 max-w-[46ch] text-[16px] leading-[1.7] text-[#444444]">{DIREKTUR_UTAMA.description}</p>
            </StaggerItem>
          ) : null}
          <StaggerItem distance={16} durationMs={500}>
            <DirectorProfileButton person={DIREKTUR_UTAMA} />
          </StaggerItem>
        </StaggerGroup>
      </div>

      {/* Dewan Direksi — a visually distinct, secondary tier below, more
          compact than Direktur Utama's featured treatment. */}
      <Reveal className="mt-12 md:mt-14">
        <h2 className="text-[22px] font-bold text-[#111111] md:text-[26px]">Dewan Direksi</h2>
      </Reveal>

      <StaggerGroup staggerMs={120} className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {DEWAN_DIREKSI.map((person) => (
          <StaggerItem key={person.name} distance={30} durationMs={650} className="group">
            <ClipRevealImage durationMs={700}>
              <div
                className="w-full max-w-[220px] overflow-hidden rounded-[10px] bg-stone"
                style={{ aspectRatio: DEWAN_DIREKSI_PHOTO_ASPECT }}
              >
                <Image
                  src={person.photo}
                  alt={`${person.name} — ${person.position}`}
                  width={person.width}
                  height={person.height}
                  quality={100}
                  className="h-full w-full object-contain transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.015]"
                />
              </div>
            </ClipRevealImage>
            <div
              className="mt-3 h-[2px] w-12 origin-left scale-x-[0.67] bg-[#2A7793] transition-transform duration-300 motion-reduce:transition-none group-hover:scale-x-100"
            />
            <div className="mt-2">
              <p className="font-mono text-[13px] font-bold uppercase leading-snug tracking-[0.12em] text-[#2A7793]">
                {person.position}
              </p>
              <p className="mt-1.5 font-landing-display text-[19px] font-bold leading-snug text-[#111111]">{person.name}</p>
              {person.description ? (
                <p className="mt-2.5 max-w-[32ch] text-[14px] leading-[1.7] text-[#444444]">{person.description}</p>
              ) : null}
              <DirectorProfileButton person={person} />
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Leadership Entitas Grup — leadership of a group entity, kept
          visually distinct from Environesia Group's own Dewan Direksi.
          Reads as a new chapter: photo unveils left-to-right while the
          info column drifts in from the right, both very subtle. */}
      <Reveal className="mt-12 md:mt-14">
        <h2 className="text-[22px] font-bold text-[#111111] md:text-[26px]">Leadership Entitas Grup</h2>
        <p className="mt-2 max-w-[52ch] text-[16px] leading-[1.7] text-[#444444]">
          Kepemimpinan pada entitas yang menjadi bagian dari Environesia Group.
        </p>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,280px)_1fr] md:items-center md:gap-12">
        <ClipRevealImage durationMs={850} direction="right">
          <Image
            src={LEADERSHIP_ENTITAS_GRUP.photo}
            alt={`${LEADERSHIP_ENTITAS_GRUP.name} — ${LEADERSHIP_ENTITAS_GRUP.position}, ${LEADERSHIP_ENTITAS_GRUP.entityLabel}`}
            width={LEADERSHIP_ENTITAS_GRUP.width}
            height={LEADERSHIP_ENTITAS_GRUP.height}
            quality={100}
            className="mx-auto h-auto max-h-[460px] w-auto rounded-[10px] object-contain md:mx-0"
          />
        </ClipRevealImage>
        <StaggerGroup staggerMs={90}>
          <StaggerItem axis="x" distance={20} durationMs={600}>
            <p className="font-mono text-[13px] font-bold uppercase leading-snug tracking-[0.12em] text-[#2A7793]">
              {LEADERSHIP_ENTITAS_GRUP.entityLabel}
            </p>
          </StaggerItem>
          <StaggerItem axis="x" distance={20} durationMs={600}>
            <p className="mt-1.5 font-landing-display text-[24px] font-bold leading-[1.15] text-[#111111] md:text-[28px]">
              {LEADERSHIP_ENTITAS_GRUP.name}
            </p>
          </StaggerItem>
          <StaggerItem axis="x" distance={20} durationMs={600}>
            <p className="mt-1 font-mono text-[13px] font-bold uppercase leading-snug tracking-[0.12em] text-[#2A7793]">
              {LEADERSHIP_ENTITAS_GRUP.position}
            </p>
          </StaggerItem>
          <StaggerLineItem durationMs={550} className="mt-4 h-[2px] w-12 bg-[#2A7793]" />
          {LEADERSHIP_ENTITAS_GRUP.description ? (
            <StaggerItem axis="x" distance={20} durationMs={600}>
              <p className="mt-4 max-w-[46ch] text-[16px] leading-[1.7] text-[#444444]">
                {LEADERSHIP_ENTITAS_GRUP.description}
              </p>
            </StaggerItem>
          ) : null}
          <StaggerItem axis="x" distance={20} durationMs={600}>
            <DirectorProfileButton person={LEADERSHIP_ENTITAS_GRUP} />
          </StaggerItem>
        </StaggerGroup>
      </div>
    </Section>
  );
}
