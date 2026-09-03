import Image from 'next/image';
import { getPublishedLeadership } from '@/lib/cms/leadership';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { RevealStagger, RevealItem } from '@/components/motion/reveal-stagger';
import { messagesFor } from '@/i18n/messages';

// Name + position, in large display type, is the primary visual — not a
// portrait. A portrait renders only when a real photo exists; otherwise the
// portrait area is omitted from the layout entirely (no silhouette
// placeholder, no "coming soon"), per this round's corrected instruction.
export async function LeadershipRoster({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);
  const leaders = await getPublishedLeadership();

  return (
    <Section className="bg-canvas">
      <Reveal>
        <h2 className="font-landing-display text-h2 text-pine-ink">{title ?? t.beranda.leadershipEyebrow}</h2>
      </Reveal>

      {leaders.length === 0 ? (
        <Reveal>
          <p className="mt-6 text-small text-pine-ink/60">{t.beranda.leadershipKosong}</p>
        </Reveal>
      ) : (
        <RevealStagger className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {leaders.map((leader) => (
            <RevealItem key={leader.id}>
              <div className="flex items-center gap-4">
                {leader.photoUrl ? (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                    <Image src={leader.photoUrl} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                ) : null}
                <div>
                  <p className="font-landing-display text-h3 text-pine-ink">{leader.name}</p>
                  <p className="font-mono text-label uppercase text-pine-ink/60">{leader.position}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      )}
    </Section>
  );
}
