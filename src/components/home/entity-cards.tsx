import { getPublishedEntities } from '@/lib/cms/entities';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { RevealStagger, RevealItem } from '@/components/motion/reveal-stagger';
import { EntityCard } from '@/components/entitas/entity-card';
import { messagesFor } from '@/i18n/messages';

export async function EntityCards({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);
  const entities = await getPublishedEntities();

  return (
    <Section>
      <Reveal>
        <h2 className="font-display text-h2 text-ink">{title ?? t.beranda.entitasKami}</h2>
      </Reveal>

      <RevealStagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {entities.map((entity) => (
          <RevealItem key={entity.slug} className="h-full">
            <EntityCard entity={entity} locale={locale} className="h-full" />
          </RevealItem>
        ))}
      </RevealStagger>
    </Section>
  );
}
