import type { Metadata } from 'next';
import { getCollection } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import type { PostSummary } from '@/lib/content-types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: 'Berita & Insight',
    description: 'Kabar dan wawasan dari Environesia Company Group.',
    locale,
    path: '/berita',
  });
}

export default async function BeritaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const posts = getCollection<PostSummary>('posts').map((entry) => entry.data);

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">Publikasi</p>
          <h1 className="mt-4 font-display text-display text-ink">Berita &amp; Insight</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">
            Kabar terbaru dan wawasan dari tim grup.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          {posts.length === 0 ? (
            <p className="text-small text-slate">Belum ada berita terbaru.</p>
          ) : (
            <ul>
              {posts.map((post) => (
                <li key={post.slug} className="border-b border-line py-4">
                  <p className="font-mono text-label uppercase text-slate">{post.tanggal}</p>
                  <p className="mt-1 font-display text-h3 text-ink">{post.judul}</p>
                  <p className="mt-1 text-small text-slate">{post.ringkasan}</p>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </Section>
    </>
  );
}
