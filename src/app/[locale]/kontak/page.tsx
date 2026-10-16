import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { getSiteSettings } from '@/lib/cms/settings';
import { messagesFor } from '@/i18n/messages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: 'Kontak',
    description: 'Hubungi Environesia di kantor pusat kami di Sleman, Yogyakarta.',
    locale,
    path: '/kontak',
  });
}

export default async function KontakPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = messagesFor(locale);
  const settings = await getSiteSettings();
  const addressLines = settings.address?.split('\n') ?? [];
  const [officeBuilding, ...restAddressLines] = addressLines;

  return (
    <>
      <Section className="grid min-h-[50vh] items-center">
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">{t.kontak.eyebrow}</p>
          <h1 className="mt-4 font-display text-display text-ink">{t.kontak.judul}</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">{t.kontak.intro}</p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[14px] border border-line bg-paper p-8">
              <p className="font-mono text-label uppercase text-slate">{t.kontak.kantorPusat}</p>
              <p className="mt-3 font-display text-h3 text-ink">{officeBuilding}</p>
              <address className="mt-2 text-small not-italic text-slate">
                {restAddressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              {settings.phone ? <p className="mt-4 text-small text-slate">{settings.phone}</p> : null}
              {settings.email ? <p className="mt-1 text-small text-slate">{settings.email}</p> : null}
            </div>

            <div className="rounded-[14px] border border-line bg-paper p-8">
              <p className="font-mono text-label uppercase text-slate">{t.kontak.formulir}</p>
              <p className="mt-3 text-body text-ink">{t.kontak.formulirPending}</p>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
