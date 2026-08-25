import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';

const SUB_PAGES = [
  { label: 'Direksi', href: '/pimpinan/direksi', deskripsi: 'Jajaran direksi grup.' },
  { label: 'Komisaris', href: '/pimpinan/komisaris', deskripsi: 'Dewan komisaris grup.' },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: 'Pimpinan',
    description: 'Jajaran kepemimpinan Environesia Company Group.',
    locale,
    path: '/pimpinan',
  });
}

export default async function PimpinanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">Kepemimpinan</p>
          <h1 className="mt-4 font-display text-display text-ink">Pimpinan</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">
            Jajaran kepemimpinan yang mengarahkan grup dan entitas di bawahnya.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {SUB_PAGES.map((page) => (
              <Link
                key={page.href}
                href={`/${locale}${page.href}`}
                className="block rounded-[14px] border border-line bg-paper p-6 transition-shadow hover:shadow-sm"
              >
                <p className="font-display text-h3 text-ink">{page.label}</p>
                <p className="mt-1 text-small text-slate">{page.deskripsi}</p>
              </Link>
            ))}
          </div>
        </Reveal>
      </Section>
    </>
  );
}
