import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedPosts } from '@/lib/cms/posts';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { messagesFor } from '@/i18n/messages';

const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' });

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
  const { locale } = await params;
  const t = messagesFor(locale);
  const posts = await getPublishedPosts();

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">{t.berita.eyebrow}</p>
          <h1 className="mt-4 font-display text-display text-ink">{t.berita.judul}</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">{t.berita.intro}</p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          {posts.length === 0 ? (
            <p className="text-small text-slate">{t.berita.kosong}</p>
          ) : (
            <ul>
              {posts.map((post) => (
                <li key={post.slug} className="border-b border-line py-4">
                  <Link href={`/${locale}/berita/${post.slug}`} className="block hover:opacity-80">
                    <p className="font-mono text-label uppercase text-slate">
                      {post.published_at ? dateFormatter.format(new Date(post.published_at)) : ''}
                    </p>
                    <p className="mt-1 font-display text-h3 text-ink">{post.title}</p>
                    <p className="mt-1 text-small text-slate">{post.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </Section>
    </>
  );
}
