import Image from 'next/image';

const TITLE_COLOR = '#2A7793';
const ACCENT_COLOR = '#01B3A1';
const DESCRIPTION_STYLE = { fontSize: '15px', fontWeight: 400, lineHeight: 1.65, color: '#444444' } as const;

/**
 * A short, static intro for the whole Proyek & Insight area, shown once
 * right above the tab bar — same position and content regardless of which
 * tab is active (unlike the hero above it, which reacts to the active
 * tab). Real team photo (public/bannerinsight.png), `object-contain` so
 * none of the collage's three photos are cropped, sized up (via a wider
 * container, not a cropped/stretched image) to read as the section's main
 * visual rather than a thumbnail.
 */
export function ProyekInsightIntroSection() {
  return (
    <section className="border-b border-pine-ink/10 bg-canvas">
      <div className="mx-auto flex max-w-[1480px] flex-col-reverse items-center gap-10 px-4 py-16 md:flex-row md:gap-16 md:px-8 md:py-24">
        <div className="w-full md:w-[45%]">
          <Image
            src="/bannerinsight.png"
            alt="Tim Environesia mengerjakan proyek lingkungan di berbagai sektor"
            width={7620}
            height={2932}
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="w-full md:w-[55%]">
          <h2
            className="font-landing-display text-[36px] font-extrabold leading-[1.15] md:text-[50px]"
            style={{ color: TITLE_COLOR }}
          >
            Lebih dari <span style={{ color: ACCENT_COLOR }}>1.000 Proyek</span>, Beragam Sektor dan Wilayah
          </h2>

          <p className="mt-5 text-justify font-landing-body" style={DESCRIPTION_STYLE}>
            Sejak 2016, Environesia telah terlibat dalam lebih dari 1.000 proyek di berbagai sektor dan wilayah.
            Pengalaman tersebut mencakup kebutuhan lingkungan untuk pembangkit listrik, kawasan industri,
            pertambangan, infrastruktur publik, fasilitas kesehatan, hingga pengelolaan limbah dan persampahan.
          </p>

          <p className="mt-4 text-justify font-landing-body" style={DESCRIPTION_STYLE}>
            Portofolio ini memperlihatkan pengalaman kami berdasarkan sektor, layanan, wilayah, dan periode
            pelaksanaan. Gunakan penyaring untuk menemukan proyek yang paling relevan dengan kebutuhan Anda.
          </p>
        </div>
      </div>
    </section>
  );
}
