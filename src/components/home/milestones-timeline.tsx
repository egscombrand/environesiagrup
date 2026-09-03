import { getPublishedMilestones } from '@/lib/cms/milestones';
import { getSiteSettings } from '@/lib/cms/settings';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { messagesFor } from '@/i18n/messages';
import { MilestonesJourney } from './milestones-journey';

export async function MilestonesTimeline({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);
  const [milestones, settings] = await Promise.all([getPublishedMilestones(), getSiteSettings()]);

  if (milestones.length === 0) {
    return (
      <Section className="bg-canvas">
        <Reveal>
          <p className="font-mono text-label uppercase tracking-[0.14em] text-emerald-pulse">
            {settings.milestones_eyebrow || t.beranda.milestonesJourneyEyebrow}
          </p>
          <h2 className="mt-2 font-landing-display text-h2 text-pine-ink">{title ?? t.beranda.milestonesEyebrow}</h2>
          <p className="mt-6 text-small text-pine-ink/60">{t.beranda.milestonesKosong}</p>
        </Reveal>
      </Section>
    );
  }

  return (
    <Section className="bg-canvas">
      <MilestonesJourney
        milestones={milestones}
        heading={title ?? t.beranda.milestonesEyebrow}
        eyebrow={settings.milestones_eyebrow || t.beranda.milestonesJourneyEyebrow}
        intro={settings.milestones_intro || t.beranda.milestonesIntroFallback}
        previousLabel={t.beranda.milestonesPrevious}
        nextLabel={t.beranda.milestonesNext}
      />
    </Section>
  );
}
