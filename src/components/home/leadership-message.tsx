import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { resolveServerIcon } from '@/components/icons/server-icon';
import { messagesFor } from '@/i18n/messages';

// No CMS field exists yet for an actual leadership message/quote (the
// `leadership` table is a flat person roster — name/position/type/photo/bio,
// no message field, no featured flag). This is an honest, structural
// skeleton per the brief: a portrait placeholder and quote-shaped text that
// is explicitly labeled as a placeholder rather than styled to look like a
// real quote. Only the copy changes once Phase 2 adds the real field — the
// markup stays the same.
export async function LeadershipMessage({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);
  const portraitIcon = await resolveServerIcon({ name: 'user-round', className: 'h-12 w-12 text-slate/40' });

  return (
    <Section>
      <Reveal>
        <p className="font-mono text-label uppercase text-slate">{title ?? t.beranda.pesanPimpinanEyebrow}</p>
        <div className="mt-6 grid gap-8 md:grid-cols-[280px_1fr] md:items-center">
          <div
            className="flex aspect-[3/4] w-full items-center justify-center rounded-[14px] border border-line bg-stone"
            aria-hidden="true"
          >
            {portraitIcon}
          </div>
          <div>
            <span aria-hidden="true" className="font-display text-h2 leading-none text-line">
              &ldquo;
            </span>
            <p className="mt-2 font-display text-h3 italic text-slate">{t.beranda.pesanPimpinanKosong}</p>
            <p className="mt-6 font-mono text-label uppercase text-slate">{t.beranda.pesanPimpinanNamaMenyusul}</p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
