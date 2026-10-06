import { HeroPhoto } from '@/components/hero-photo';

// Same real office building photo and full-bleed hero pattern as Tentang
// Kami's own hero (src/components/tentang-kami/hero-banner.tsx). From md up the
// photo layer is aspect-ratio-locked to its true proportions. On phones it
// stretches to fill the whole hero, so no solid pine-ink band shows beneath a
// short photo. Kept as a separate component (not shared) since the two pages'
// heading/copy will diverge as this page grows past its placeholder stage.
export function BisnisLayananHero() {
  return (
    <section className="relative -mt-[var(--header-h)] grid w-full bg-pine-ink">
      <div className="relative col-start-1 row-start-1 w-full self-stretch overflow-hidden md:aspect-[3640/1610] md:self-start">
        <HeroPhoto />
        <div className="absolute inset-0 bg-gradient-to-b from-pine-ink/40 via-pine-ink/5 to-pine-ink/60" />
      </div>

      <div className="relative z-10 col-start-1 row-start-1 flex min-h-[calc(26rem+var(--header-h))] items-center justify-center px-6 pt-[var(--header-h)] text-center md:min-h-[calc(30rem+var(--header-h))]">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-landing-display text-[36px] font-bold leading-[1.1] text-white md:text-[52px]">
            Bisnis &amp; Ekosistem Environesia
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-[1.7] text-white/90 md:text-[17px]">
            Environesia Group tumbuh dari satu perusahaan konsultansi lingkungan menjadi sebuah ekosistem dengan
            beragam entitas dan keahlian. Setiap perusahaan memiliki fokus dan perannya sendiri, namun tetap
            terhubung dalam satu perjalanan yang sama. Dari lingkungan, pengujian, dan pengembangan kompetensi
            hingga apparel dan kebutuhan pendukung lainnya, setiap bagian hadir untuk menjawab kebutuhan yang
            berbeda. Kenali perusahaan dalam Environesia Group dan temukan keahlian yang sesuai dengan kebutuhan
            Anda.
          </p>
        </div>
      </div>
    </section>
  );
}
