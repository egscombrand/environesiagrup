import { getPublishedCoreEntities } from '@/lib/cms/entities';
import { getBisnisLayanan } from '@/lib/cms/bisnis-layanan';
import { paragraphsOf, segmentsOf } from '@/lib/cms/rich-text';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { EcosystemMap } from '@/components/bisnis-layanan/ecosystem-map';

export async function EcosystemSection() {
  const [entities, { ekosistem }] = await Promise.all([getPublishedCoreEntities(), getBisnisLayanan()]);

  return (
    <Section>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.22fr_1fr] md:gap-14">
        <Reveal className="max-w-[740px]">
          <h2 className="font-landing-display text-h2 font-bold text-[#1A1A1A]">
            {ekosistem.title}
          </h2>
          <div className="mt-6 space-y-5 text-[16px] leading-[1.8] text-justify text-[#444444]">
            {paragraphsOf(ekosistem.richText).map((paragraph, i) => {
              const segments = segmentsOf(paragraph);
              const wholeParagraphBold = segments.length === 1 && segments[0].bold;
              return (
                <p key={i} className={wholeParagraphBold ? 'font-bold text-[#2A7793]' : undefined}>
                  {segments.map((segment, j) =>
                    segment.bold && !wholeParagraphBold ? (
                      <strong key={j} className="font-bold text-[#2A7793]">
                        {segment.text}
                      </strong>
                    ) : (
                      <span key={j}>{segment.text}</span>
                    )
                  )}
                </p>
              );
            })}
          </div>
        </Reveal>

        <div className="flex items-center justify-center">
          <EcosystemMap entities={entities} />
        </div>
      </div>
    </Section>
  );
}
