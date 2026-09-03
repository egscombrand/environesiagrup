import { getPublishedDocuments } from '@/lib/cms/documents';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { RevealStagger, RevealItem } from '@/components/motion/reveal-stagger';
import { messagesFor } from '@/i18n/messages';

// Reuses the exact same query /unduhan already uses — no new data function.
// Kept visually and semantically separate from News & Perspectives: this is
// formal legal/accreditation paperwork, not editorial content.
export async function CorporateInformation({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);
  const documents = await getPublishedDocuments();

  return (
    <Section className="bg-sage-mist/40">
      <Reveal>
        <h2 className="font-landing-display text-h2 text-pine-ink">{title ?? t.beranda.corporateInfoEyebrow}</h2>
      </Reveal>

      {documents.length === 0 ? (
        <Reveal>
          <p className="mt-6 text-small text-pine-ink/60">{t.beranda.corporateInfoKosong}</p>
        </Reveal>
      ) : (
        <RevealStagger className="mt-8 divide-y divide-sage-mist border-y border-sage-mist">
          {documents.map((document) => (
            <RevealItem key={document.id}>
              <a
                href={document.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-4 bg-canvas px-5 py-4 hover:bg-sage-mist/20"
              >
                <div>
                  <p className="font-mono text-label uppercase text-sky-aqua">{document.category}</p>
                  <p className="mt-1 font-landing-display text-h3 text-pine-ink">{document.title}</p>
                  {document.description ? (
                    <p className="mt-1 font-landing-body text-small text-pine-ink/70">{document.description}</p>
                  ) : null}
                </div>
                <span className="shrink-0 text-small font-medium text-emerald-pulse">↓</span>
              </a>
            </RevealItem>
          ))}
        </RevealStagger>
      )}
    </Section>
  );
}
