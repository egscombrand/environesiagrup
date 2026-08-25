import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';

export function PendingContent({
  eyebrow,
  title,
  description,
  note,
}: {
  eyebrow: string;
  title: string;
  description: string;
  note?: string;
}) {
  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">{eyebrow}</p>
          <h1 className="mt-4 font-display text-display text-ink">{title}</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">{description}</p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <div className="rounded-[14px] border border-line bg-paper p-8">
            <p className="text-body text-ink">Konten halaman ini sedang disiapkan.</p>
            {note ? (
              <p data-pending-note className="mt-2 text-small text-slate">
                {note}
              </p>
            ) : null}
          </div>
        </Reveal>
      </Section>
    </>
  );
}
