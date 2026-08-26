import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { messagesFor } from '@/i18n/messages';

export function GreenBusinessSplit({ locale }: { locale: string }) {
  const t = messagesFor(locale);

  return (
    <Section className="bg-stone">
      <Reveal>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-[14px] border border-line bg-paper p-8">
            <p className="font-mono text-label uppercase text-slate">{t.beranda.greenBusiness}</p>
            <p className="mt-3 text-body text-ink">{t.beranda.manifestoPending}</p>
          </div>
          <div className="rounded-[14px] border border-line bg-paper p-8">
            <p className="font-mono text-label uppercase text-slate">{t.beranda.pesanPimpinan}</p>
            <p className="mt-3 text-body text-ink">{t.beranda.pesanCeoPending}</p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
