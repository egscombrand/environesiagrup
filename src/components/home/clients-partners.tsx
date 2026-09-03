import Image from 'next/image';
import { getClientsAndPartners } from '@/lib/landing/clients-adapter';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { RevealStagger, RevealItem } from '@/components/motion/reveal-stagger';
import { messagesFor } from '@/i18n/messages';

export async function ClientsPartners({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);
  const clients = await getClientsAndPartners();

  if (clients.length === 0) {
    return (
      <Section className="bg-canvas">
        <Reveal>
          <h2 className="font-landing-display text-h2 text-pine-ink">{title ?? t.beranda.clientsEyebrow}</h2>
          <p className="mt-6 text-small text-pine-ink/60">{t.beranda.clientsKosong}</p>
        </Reveal>
      </Section>
    );
  }

  return (
    <Section className="bg-canvas">
      <Reveal>
        <h2 className="font-landing-display text-h2 text-pine-ink">{title ?? t.beranda.clientsEyebrow}</h2>
      </Reveal>
      <RevealStagger className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
        {clients.map((client) => (
          <RevealItem key={client.id}>
            <div className="flex h-16 items-center justify-center grayscale transition-all duration-300 ease-out hover:grayscale-0 motion-reduce:transition-none">
              {client.logoUrl ? (
                <Image src={client.logoUrl} alt={client.name} width={140} height={48} className="h-8 w-auto object-contain" />
              ) : (
                <span className="font-landing-body text-small text-pine-ink">{client.name}</span>
              )}
            </div>
          </RevealItem>
        ))}
      </RevealStagger>
    </Section>
  );
}
