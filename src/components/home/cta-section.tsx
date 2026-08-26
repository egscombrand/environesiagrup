import Link from 'next/link';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { messagesFor } from '@/i18n/messages';

export function CTASection({
  locale,
  title,
  subtitle,
}: {
  locale: string;
  title?: string;
  subtitle?: string;
}) {
  const t = messagesFor(locale);

  return (
    <Section className="bg-forest">
      <Reveal>
        <div className="text-center">
          <h2 className="font-display text-h2 text-paper">{title ?? t.beranda.ctaJudul}</h2>
          <p className="mt-3 text-body text-paper/80">{subtitle ?? t.beranda.ctaDeskripsi}</p>
          <Link
            href={`/${locale}/kontak`}
            className="mt-6 inline-block rounded-[14px] bg-paper px-6 py-3 text-small font-medium text-forest hover:bg-stone"
          >
            {t.beranda.ctaTombol}
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
