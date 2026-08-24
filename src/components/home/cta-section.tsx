import Link from 'next/link';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';

export function CTASection({ locale }: { locale: string }) {
  return (
    <Section className="bg-forest">
      <Reveal>
        <div className="text-center">
          <h2 className="font-display text-h2 text-paper">
            Mari berdiskusi tentang kebutuhan Anda
          </h2>
          <p className="mt-3 text-body text-paper/80">
            Hubungi tim kami untuk konsultasi, pengujian, pelatihan, atau sertifikasi.
          </p>
          <Link
            href={`/${locale}/kontak`}
            className="mt-6 inline-block rounded-[14px] bg-paper px-6 py-3 text-small font-medium text-forest hover:bg-stone"
          >
            Hubungi Kami
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
