import Link from 'next/link';
import { getPublishedPillars } from '@/lib/cms/pillars';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { RevealStagger, RevealItem } from '@/components/motion/reveal-stagger';
import { resolveServerIcon } from '@/components/icons/server-icon';
import { messagesFor } from '@/i18n/messages';

export async function BusinessPillars({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);
  const pillars = await getPublishedPillars();
  const pillarsWithIcons = await Promise.all(
    pillars.map(async (pillar) => ({
      pillar,
      icon: await resolveServerIcon({ name: pillar.icon, className: 'h-5 w-5 text-sky-aqua', strokeWidth: 1.75 }),
    }))
  );

  if (pillarsWithIcons.length === 0) {
    return null;
  }

  return (
    <Section className="bg-canvas">
      <Reveal>
        <h2 className="font-landing-display text-h2 text-pine-ink">{title ?? t.beranda.pilarBisnis}</h2>
      </Reveal>

      <RevealStagger className="mt-8 divide-y divide-sage-mist border-y border-sage-mist">
        {pillarsWithIcons.map(({ pillar, icon }) => (
          <RevealItem key={pillar.slug}>
            <div className="grid grid-cols-1 gap-4 py-8 md:grid-cols-12 md:items-center md:gap-8">
              <p className="font-mono text-label text-sky-aqua md:col-span-1">
                {String(pillar.sort_order).padStart(2, '0')}
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-aqua/10 md:col-span-1">
                {icon}
              </span>
              <p className="font-landing-display text-h3 text-pine-ink md:col-span-3">{pillar.name}</p>
              <p className="font-landing-body text-body text-pine-ink/70 md:col-span-5">{pillar.short_description}</p>
              <Link
                href={`/${locale}/bisnis/${pillar.slug}`}
                className="text-small font-medium text-emerald-pulse hover:underline md:col-span-2 md:text-right"
              >
                {t.common.selengkapnya} →
              </Link>
            </div>
          </RevealItem>
        ))}
      </RevealStagger>
    </Section>
  );
}
