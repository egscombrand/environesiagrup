import { getPublishedEntities } from '@/lib/cms/entities';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { EcosystemMap } from '@/components/bisnis-layanan/ecosystem-map';

export async function EcosystemSection() {
  const entities = await getPublishedEntities();

  return (
    <Section>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.22fr_1fr] md:gap-14">
        <Reveal className="max-w-[740px]">
          <h2 className="font-landing-display text-[28px] font-bold leading-[1.2] text-[#2A7793] md:text-[36px]">
            Ekosistem Hijau Terintegrasi Berstandar Global
          </h2>
          <div className="mt-6 space-y-5 text-[16px] leading-[1.8] text-justify text-[#444444]">
            <p>
              Environesia memulai perjalanan di Yogyakarta pada 2016 sebagai perusahaan yang bergerak di bidang
              konsultansi lingkungan. Dari pekerjaan-pekerjaan awal tersebut, kami belajar bahwa kebutuhan industri
              tidak pernah berdiri sendiri. Sebuah pekerjaan dapat membutuhkan konsultansi, data pengujian, tenaga
              profesional yang kompeten, hingga berbagai kebutuhan pendukung di lapangan.
            </p>
            <p>
              Pemahaman tersebut menjadi dasar bagaimana Environesia berkembang. Kami membangun dan mengembangkan
              perusahaan serta kapabilitas baru bukan semata-mata untuk memperluas lini usaha, tetapi untuk
              menjawab kebutuhan yang kami temukan sepanjang perjalanan. Dari konsultansi lingkungan dan pengujian
              laboratorium, hingga sertifikasi kompetensi, apparel, dan kebutuhan pendukung lainnya, setiap bagian
              tumbuh dengan peran dan keahliannya masing-masing.
            </p>
            <p>
              Hari ini,{' '}
              <strong className="font-bold text-[#2A7793]">
                Environesia Company Group menjadi sebuah ekosistem yang menghubungkan berbagai keahlian dan bidang
                usaha dalam satu grup.
              </strong>{' '}
              Perjalanan selama satu dekade membawa kami dari satu layanan menjadi organisasi dengan cakupan yang
              lebih luas, pengalaman lintas sektor, serta jaringan yang terus berkembang.
            </p>
            <p className="font-bold text-[#2A7793]">
              Kami percaya pertumbuhan bukan hanya tentang menjadi lebih besar, tetapi tentang menjadi lebih
              lengkap dalam memberikan nilai.
            </p>
          </div>
        </Reveal>

        <div className="flex items-center justify-center">
          <EcosystemMap entities={entities} />
        </div>
      </div>
    </Section>
  );
}
