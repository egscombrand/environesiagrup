import { getPublishedMilestones } from '@/lib/cms/milestones';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { PerjalananTimeline } from '@/components/tentang-kami/perjalanan-timeline';
import { messagesFor } from '@/i18n/messages';

const ACCENT = '#0DA19D';

/** A clearly-marked reserved photo area — never a fabricated stock image,
 * never "Coming Soon" text. A solid accent-color block, matched 1:1
 * against a supplied reference: a deliberately bold, obvious "replace me"
 * fill rather than a subtle gray box, so it reads unmistakably as a
 * placeholder rather than a rendering bug. No real asset exists yet for
 * any of these three narrative beats. */
function PhotoPlaceholder({ className = '' }: { className?: string }) {
  return (
    <div
      className={`aspect-[4/3] w-full rounded-[16px] ${className}`}
      style={{ backgroundColor: ACCENT }}
      role="img"
      aria-label="Foto akan ditambahkan"
    />
  );
}

/**
 * The actual "Perjalanan Kami" content — shared by its own dedicated route
 * (/tentang-kami/sejarah, for direct links and its own metadata) and the
 * Tentang Kami hub page, which shows this same content by default under
 * the tab nav rather than duplicating it inline.
 *
 * The heading copy here ("Satu Dekade Environesia") is its own, separate
 * from the tab's own name ("Perjalanan Kami", still used for the nav
 * label and this route's SEO title elsewhere) — the eyebrow keeps that
 * tab identity, while the H1/description tell the actual editorial
 * story. Left-aligned on purpose, as an editorial intro sitting above the
 * (centered) timeline visual, not another centered hero.
 *
 * Exactly two layers, by explicit instruction — a third "Milestone
 * Perjalanan" highlight reel existed here briefly and was removed because
 * it re-stated the same real dates as both neighbors, reading as
 * duplicated information: "Sekilas Environesia" (the full 6-paragraph
 * editorial narrative, in 3 alternating text/photo blocks) → the existing
 * year-by-year interactive timeline (chronological detail, untouched).
 * Never re-add a third summary layer between them.
 */
export async function PerjalananKamiSection({
  locale,
  milestones: propMilestones,
}: {
  locale: string;
  milestones?: Awaited<ReturnType<typeof getPublishedMilestones>>;
}) {
  const t = messagesFor(locale);
  const milestones = propMilestones ?? (await getPublishedMilestones());

  return (
    <>
      <Section className="pt-6 pb-6 md:pt-6 md:pb-6">
        <Reveal className="text-left">
          <p className="font-mono text-label uppercase tracking-[0.14em] text-slate">Perjalanan Kami</p>
          <h1 className="mt-3 font-landing-display text-[18px] font-extrabold sm:text-[20px]" style={{ color: '#2A7793' }}>
            Satu Dekade Environesia
          </h1>
          <p className="mt-3 max-w-2xl font-landing-body text-body text-pine-ink/70">
            Sepuluh tahun perjalanan, pengalaman, dan pertumbuhan Environesia Group.
          </p>
        </Reveal>
      </Section>

      <Section className="pt-0 pb-8 md:pt-0 md:pb-10">
        <Reveal className="text-left">
          <h2 className="font-landing-display text-[24px] font-bold text-pine-ink md:text-[28px]">
            Sekilas Environesia
          </h2>
        </Reveal>

        {/* Blok 1 — Awal Perjalanan (paragraf 1–2): narasi kiri, foto
            kanan pada desktop; DOM order narasi→foto juga yang membuat
            mobile jatuh ke narasi-atas/foto-bawah tanpa perlu `order-*`. */}
        <Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-[3fr_2fr] md:items-center md:gap-10">
            <div className="space-y-4 text-justify font-landing-body text-[17px] leading-[1.7] text-pine-ink/80 md:text-[18px]">
              <p>
                Environesia memulai perjalanannya pada 2016 sebagai penyedia jasa konsultansi lingkungan. Pada saat
                itu, ruang lingkup kami masih sederhana, berfokus pada penyusunan dokumen AMDAL dan UKL-UPL untuk
                kebutuhan klien, dengan proyek-proyek awal yang datang dari sektor perkebunan dan ketenagalistrikan.
                Dari pekerjaan tersebut, kami mulai mengenal lebih dekat berbagai persoalan yang dihadapi industri
                dalam mengelola lingkungan, sekaligus memahami bahwa sebuah rekomendasi yang baik selalu
                membutuhkan lebih dari sekadar kemampuan menyusun dokumen. Di balik setiap pekerjaan terdapat data,
                pengujian, proses lapangan, tenaga profesional, dan berbagai kebutuhan lain yang saling bergantung.
              </p>
              <p>
                Semakin banyak pekerjaan yang kami tangani, semakin terlihat pula mata rantai yang belum
                sepenuhnya kami miliki. Salah satunya adalah kebutuhan akan data pengujian. Pada masa itu,
                pekerjaan konsultansi masih banyak bergantung pada laboratorium pihak ketiga, sementara proses
                pengujian menjadi salah satu bagian yang paling rentan terhadap antrean dan keterlambatan.
                Kebutuhan untuk memiliki kendali yang lebih baik atas proses tersebut kemudian mendorong
                berdirinya PT Greenlab Indo Global pada Maret 2018, yang mulai beroperasi penuh pada Oktober 2019.
                Kehadiran Greenlab membawa kapabilitas pengujian ke dalam grup dan membuat hubungan antara
                konsultansi, pengukuran, dan data dapat dikelola dalam ekosistem yang semakin terintegrasi.
              </p>
            </div>
            <PhotoPlaceholder />
          </div>
        </Reveal>

        {/* Blok 2 — Bertumbuh dari Kebutuhan (paragraf 3–4): dibalik —
            foto kiri, narasi kanan. DOM order foto→narasi supaya mobile
            jatuh ke foto-atas/narasi-bawah secara konsisten dengan logika
            yang sama seperti Blok 1. */}
        <Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-[2fr_3fr] md:items-center md:gap-10">
            <PhotoPlaceholder />
            <div className="space-y-4 text-justify font-landing-body text-[17px] leading-[1.7] text-pine-ink/80 md:text-[18px]">
              <p>
                Namun kebutuhan di lapangan ternyata tidak berhenti pada data. Pada periode yang sama, kami
                melihat kebutuhan lain yang muncul dari aktivitas proyek sehari-hari: seragam dan perlengkapan
                kerja bagi orang-orang yang menjalankan pekerjaan di lapangan. Dari kebutuhan tersebut, PT Bikin
                Indonesia Berdaya berdiri pada 2019 untuk mengembangkan kapabilitas di bidang apparel dan
                kebutuhan seragam. Bagi kami, langkah ini bukan sekadar menambah lini usaha. Ia menjadi bagian
                dari cara kami bertumbuh mengenali kebutuhan yang muncul di sekitar pekerjaan, kemudian membangun
                kemampuan untuk menjawabnya.
              </p>
              <p>
                Memasuki 2020 hingga 2024, perjalanan tersebut membawa Environesia ke cakupan yang jauh lebih
                luas. Sebaran proyek berkembang hingga 38 provinsi, dengan pengalaman yang semakin beragam di
                berbagai sektor. Kepercayaan pun datang dari BUMN besar, kementerian, perusahaan penanaman modal
                asing, hingga lembaga pembiayaan multilateral seperti World Bank, ADB, dan JICA. Setiap proyek
                membawa karakter, standar, dan tantangan yang berbeda, memperluas pengalaman sekaligus memperkuat
                kemampuan kami untuk bekerja dalam konteks yang semakin kompleks. Pada 2023, perjalanan itu bahkan
                membawa pekerjaan pemantauan lingkungan hingga Timor Leste, sebuah langkah yang memperluas
                pengalaman Environesia melampaui batas geografis Indonesia.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Blok 3 — Memperkuat Ekosistem (paragraf 5–6): full-width
            closing statement, no photo, no panel — explicitly NOT boxed,
            per follow-up feedback that a gray background/border made it
            read as a separate card rather than the natural continuation
            of the same story. Just plain text at the same width as the
            rest of the section. */}
        <Reveal>
          <div className="mt-12 space-y-4 text-justify font-landing-body text-[17px] leading-[1.7] text-pine-ink/80 md:text-[18px]">
            <p>
              Pertumbuhan tersebut kemudian membawa kami pada pemahaman berikutnya: data yang sah dan sistem yang
              baik tetap bergantung pada manusia yang memiliki kompetensi untuk menjalankannya. Karena itu,
              pembangunan ekosistem tidak cukup berhenti pada konsultansi dan pengujian. Pada 19 Desember 2025, PT
              LSP Praktisi Lingkungan Indonesia memperoleh lisensi BNSP sebagai Lembaga Sertifikasi Profesi Pihak
              Ketiga. Kehadiran LSP menjadi bagian penting dalam melengkapi mata rantai kompetensi, dari kebutuhan
              perizinan dan konsultansi, pengumpulan serta pengujian data, hingga pengakuan atas kompetensi para
              profesional yang menjalankannya.
            </p>
            <p>
              Sepuluh tahun perjalanan Environesia pada akhirnya bukanlah cerita tentang menambah sebanyak
              mungkin lini usaha. Ini adalah cerita tentang bagaimana satu kebutuhan membawa kami menemukan
              kebutuhan berikutnya, dan bagaimana setiap kebutuhan mendorong kami membangun kemampuan baru. Dari
              satu layanan konsultansi, kemudian berkembang menjadi pengujian, apparel dan perlengkapan kerja,
              jangkauan proyek yang semakin luas, hingga penguatan kompetensi manusia.{' '}
              <strong className="font-bold text-pine-ink">
                Satu per satu, mata rantai tersebut kami bangun dan hubungkan hingga membentuk ekosistem
                Environesia Group seperti yang kami jalankan hari ini. Dan seperti perjalanan sebelumnya,
                ekosistem ini masih akan terus bertumbuh.
              </strong>
            </p>
          </div>
        </Reveal>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-landing-body text-[14px] font-semibold tracking-[0.04em]" style={{ color: '#01B3A1' }}>
              Perjalanan
            </p>
            <h2
              className="mx-auto mt-2 max-w-[620px] font-landing-display text-display font-extrabold"
              style={{ color: '#111111', lineHeight: 1.15 }}
            >
              Rekam Jejak & Tonggak Environesia Group
            </h2>
            <p className="mt-3 text-[15px] leading-[1.6] text-pine-ink/70 md:text-[16px]">
              Jelajahi perjalanan Environesia dari tahun ke tahun dan lihat bagaimana setiap tahap membentuk
              ekosistem yang kami jalankan hari ini.
            </p>
          </div>
        </Reveal>
        {milestones.length > 0 ? (
          <div className="mt-4">
            <PerjalananTimeline milestones={milestones} />
          </div>
        ) : (
          <div className="mt-6 rounded-[14px] border border-line bg-paper p-8">
            <p className="text-body text-ink">{t.common.pendingContent}</p>
          </div>
        )}
      </Section>
    </>
  );
}
