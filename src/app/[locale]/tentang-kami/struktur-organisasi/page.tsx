import type { Metadata } from 'next';
import { getPublishedEntities } from '@/lib/cms/entities';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { GroupStructureDiagram } from '@/components/entitas/group-structure-diagram';
import { findTentangKamiRoute } from '@/lib/tentang-kami-routes';
import { messagesFor } from '@/i18n/messages';

const ROUTE = findTentangKamiRoute('struktur-organisasi');

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: ROUTE.label,
    description: ROUTE.metaDescription,
    locale,
    path: `/tentang-kami/${ROUTE.slug}`,
  });
}

export default async function StrukturOrganisasiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = messagesFor(locale);
  const entities = await getPublishedEntities();

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">{t.tentangKami.judul}</p>
          <h1 className="mt-4 font-display text-display text-ink">{ROUTE.label}</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">
            Susunan grup dan entitas yang berada di bawahnya.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <GroupStructureDiagram entities={entities} locale={locale} />
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <div className="rounded-[14px] border border-line bg-paper p-8">
            <p className="text-body text-ink">{t.tentangKami.strukturPending}</p>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
