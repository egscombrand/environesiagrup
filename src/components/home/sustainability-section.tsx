import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { RevealStagger, RevealItem } from '@/components/motion/reveal-stagger';
import { resolveServerIcon } from '@/components/icons/server-icon';
import { messagesFor } from '@/i18n/messages';

// Nothing ESG-related exists anywhere in the CMS yet. Environmental/Social/
// Governance is a standard, neutral taxonomy — not a fabricated claim — so
// one generic, non-numeric sentence per pillar is honest framing rather than
// an empty "coming soon" box. No specific numbers, certifications, or scores
// are used here; those only appear once real data exists.
export async function SustainabilitySection({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);

  const pillars = await Promise.all(
    [
      { icon: 'leaf', label: t.beranda.sustainabilityEnvLabel, copy: t.beranda.sustainabilityEnvCopy },
      { icon: 'users', label: t.beranda.sustainabilitySocialLabel, copy: t.beranda.sustainabilitySocialCopy },
      { icon: 'scale', label: t.beranda.sustainabilityGovLabel, copy: t.beranda.sustainabilityGovCopy },
    ].map(async (pillar) => ({
      ...pillar,
      iconNode: await resolveServerIcon({ name: pillar.icon, className: 'h-5 w-5 text-sky-aqua', strokeWidth: 1.75 }),
    }))
  );

  return (
    <Section className="bg-sage-mist/40">
      <Reveal>
        <h2 className="font-landing-display text-h2 text-pine-ink">{title ?? t.beranda.sustainabilityEyebrow}</h2>
      </Reveal>
      <RevealStagger className="mt-8 grid gap-6 md:grid-cols-3">
        {pillars.map((pillar) => (
          <RevealItem key={pillar.label} className="h-full">
            <div className="h-full rounded-[14px] border border-sage-mist bg-canvas p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-aqua/10">
                {pillar.iconNode}
              </span>
              <p className="mt-4 font-landing-display text-h3 text-pine-ink">{pillar.label}</p>
              <p className="mt-2 font-landing-body text-small text-pine-ink/70">{pillar.copy}</p>
            </div>
          </RevealItem>
        ))}
      </RevealStagger>
    </Section>
  );
}
