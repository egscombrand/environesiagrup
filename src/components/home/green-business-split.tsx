import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';

export function GreenBusinessSplit() {
  return (
    <Section className="bg-stone">
      <Reveal>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-[14px] border border-line bg-paper p-8">
            <p className="font-mono text-label uppercase text-slate">Green Business</p>
            <p className="mt-3 text-body text-ink">
              Manifesto Green Business akan segera hadir di sini.
            </p>
          </div>
          <div className="rounded-[14px] border border-line bg-paper p-8">
            <p className="font-mono text-label uppercase text-slate">Pesan Pimpinan</p>
            <p className="mt-3 text-body text-ink">Kutipan pesan CEO menyusul.</p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
