import { getPublishedEntities } from '@/lib/cms/entities';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { EntityCard } from '@/components/entitas/entity-card';

export async function EntityCards({ locale, title = 'Entitas Kami' }: { locale: string; title?: string }) {
  const entities = await getPublishedEntities();

  return (
    <Section>
      <Reveal>
        <h2 className="font-display text-h2 text-ink">{title}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {entities.map((entity) => (
            <EntityCard key={entity.slug} entity={entity} locale={locale} />
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
