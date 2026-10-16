import Image from 'next/image';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { DirectorProfileButton } from '@/components/tentang-kami/sections/director-profile-modal';
import { ClipRevealImage, StaggerGroup, StaggerItem, StaggerLineItem } from '@/components/tentang-kami/sections/director-motion';
import { getDirektur, type DirectorView } from '@/lib/cms/leadership-profile';
import { messagesFor } from '@/i18n/messages';

// Shared frame for the three Dewan Direksi photos so all three occupy the
// same visual area regardless of each source file's real dimensions —
// `object-contain` inside a fixed-aspect box, never a crop.
const DEWAN_DIREKSI_PHOTO_ASPECT = '801 / 1426';

/**
 * Direktur Utama & Dewan Direksi. The people, their photos, bios, and modal
 * details come from the database (see getDirektur). Direktur Utama is the
 * featured profile, the Dewan Direksi are a secondary tier, and the group-entity
 * leader sits in its own chapter.
 */
export async function DirekturSection({ locale }: { locale: string }) {
  const t = messagesFor(locale);
  const content = await getDirektur();
  const utama = content.directorUtama;
  const entitas = content.entitas;

  return (
    <Section className="py-8 md:py-10">
      <StaggerGroup staggerMs={100}>
        <StaggerItem distance={12} durationMs={500}>
          <p className="font-mono text-[14px] font-bold uppercase tracking-[0.12em] text-[#2A7793]">{t.tentangKami.judul}</p>
        </StaggerItem>
        <StaggerItem distance={20} durationMs={650}>
          <h1 className="mt-2 font-landing-display text-display font-bold text-[#111111]">{content.pageTitle}</h1>
        </StaggerItem>
        <StaggerLineItem durationMs={550} className="mt-4 h-[2px] w-14 bg-[#2A7793]" />
      </StaggerGroup>

      {/* Direktur Utama — the page's main focal point, its own featured
          profile, never grouped into the Dewan Direksi grid at equal
          weight. Jabatan → nama → accent line → deskripsi → CTA reveal in
          sequence on scroll-into-view. */}
      <Reveal className="mt-8 md:mt-10">
        <h2 className="text-h2 font-bold text-[#111111]">{content.headings.direkturUtama}</h2>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,340px)_1fr] md:items-center md:gap-14">
        <ClipRevealImage durationMs={900}>
          {utama.photoSrc ? (
            <Image
              src={utama.photoSrc}
              alt={`${utama.name} — ${utama.position}`}
              width={utama.photoSize.width}
              height={utama.photoSize.height}
              quality={100}
              className="mx-auto h-auto max-h-[520px] w-auto rounded-[10px] object-contain md:mx-0"
            />
          ) : null}
        </ClipRevealImage>
        <StaggerGroup staggerMs={100}>
          <StaggerItem distance={16} durationMs={600}>
            <p className="font-mono text-[14px] font-bold uppercase leading-snug tracking-[0.12em] text-[#2A7793]">
              {utama.position}
            </p>
          </StaggerItem>
          <StaggerItem distance={16} durationMs={650}>
            <p className="mt-2 font-landing-display text-[32px] font-bold leading-[1.15] text-[#111111] md:text-[40px]">
              {utama.name}
            </p>
          </StaggerItem>
          <StaggerLineItem durationMs={550} className="mt-4 h-[2px] w-12 bg-[#2A7793]" />
          {utama.bio ? (
            <StaggerItem distance={16} durationMs={600}>
              <p className="mt-4 max-w-[46ch] text-[16px] leading-[1.7] text-[#444444]">{utama.bio}</p>
            </StaggerItem>
          ) : null}
          <StaggerItem distance={16} durationMs={500}>
            <DirectorProfileButton person={utama} />
          </StaggerItem>
        </StaggerGroup>
      </div>

      {/* Dewan Direksi — a visually distinct, secondary tier below, more
          compact than Direktur Utama's featured treatment. */}
      <Reveal className="mt-12 md:mt-14">
        <h2 className="text-h2 font-bold text-[#111111]">{content.headings.dewan}</h2>
      </Reveal>

      <StaggerGroup staggerMs={120} className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {content.dewan.map((person: DirectorView) => (
          <StaggerItem key={person.name} distance={30} durationMs={650} className="group">
            <ClipRevealImage durationMs={700}>
              <div
                className="w-full max-w-[220px] overflow-hidden rounded-[10px] bg-stone"
                style={{ aspectRatio: DEWAN_DIREKSI_PHOTO_ASPECT }}
              >
                {person.photoSrc ? (
                  <Image
                    src={person.photoSrc}
                    alt={`${person.name} — ${person.position}`}
                    width={person.photoSize.width}
                    height={person.photoSize.height}
                    quality={100}
                    className="h-full w-full object-contain transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.015]"
                  />
                ) : null}
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
              {person.bio ? (
                <p className="mt-2.5 max-w-[32ch] text-small text-[#444444]">{person.bio}</p>
              ) : null}
              <DirectorProfileButton person={person} />
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Leadership Entitas Grup — leadership of a group entity, kept
          visually distinct from Environesia's own Dewan Direksi.
          Reads as a new chapter: photo unveils left-to-right while the
          info column drifts in from the right, both very subtle. */}
      <Reveal className="mt-12 md:mt-14">
        <h2 className="text-h2 font-bold text-[#111111]">{content.headings.entitas.title}</h2>
        <p className="mt-2 max-w-[52ch] text-[16px] leading-[1.7] text-[#444444]">{content.headings.entitas.intro}</p>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,280px)_1fr] md:items-center md:gap-12">
        <ClipRevealImage durationMs={850} direction="right">
          {entitas.photoSrc ? (
            <Image
              src={entitas.photoSrc}
              alt={`${entitas.name} — ${entitas.position}, ${entitas.entity ?? ''}`}
              width={entitas.photoSize.width}
              height={entitas.photoSize.height}
              quality={100}
              className="mx-auto h-auto max-h-[460px] w-auto rounded-[10px] object-contain md:mx-0"
            />
          ) : null}
        </ClipRevealImage>
        <StaggerGroup staggerMs={90}>
          <StaggerItem axis="x" distance={20} durationMs={600}>
            <p className="font-mono text-[13px] font-bold uppercase leading-snug tracking-[0.12em] text-[#2A7793]">
              {entitas.entity}
            </p>
          </StaggerItem>
          <StaggerItem axis="x" distance={20} durationMs={600}>
            <p className="mt-1.5 font-landing-display text-[24px] font-bold leading-[1.15] text-[#111111] md:text-[28px]">
              {entitas.name}
            </p>
          </StaggerItem>
          <StaggerItem axis="x" distance={20} durationMs={600}>
            <p className="mt-1 font-mono text-[13px] font-bold uppercase leading-snug tracking-[0.12em] text-[#2A7793]">
              {entitas.position}
            </p>
          </StaggerItem>
          <StaggerLineItem durationMs={550} className="mt-4 h-[2px] w-12 bg-[#2A7793]" />
          {entitas.bio ? (
            <StaggerItem axis="x" distance={20} durationMs={600}>
              <p className="mt-4 max-w-[46ch] text-[16px] leading-[1.7] text-[#444444]">
                {entitas.bio}
              </p>
            </StaggerItem>
          ) : null}
          <StaggerItem axis="x" distance={20} durationMs={600}>
            <DirectorProfileButton person={entitas} />
          </StaggerItem>
        </StaggerGroup>
      </div>
    </Section>
  );
}
