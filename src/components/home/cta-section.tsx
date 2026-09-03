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
    <Section className="bg-pine-ink">
      <Reveal>
        <div className="text-center">
          <h2 className="font-landing-display text-h2 text-canvas">{title ?? t.beranda.ctaJudul}</h2>
          <p className="mt-3 font-landing-body text-body text-canvas/80">{subtitle ?? t.beranda.ctaDeskripsi}</p>
          <Link
            href={`/${locale}/kontak`}
            className="mt-6 inline-block rounded-[14px] bg-emerald-pulse px-6 py-3 text-small font-medium text-canvas hover:opacity-90"
          >
            {t.beranda.ctaTombol}
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
