import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedPosts, getPublishedPostBySlug } from '@/lib/cms/posts';
import { buildMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { ARTICLE_HTML_CLASS, SanitizedHtml } from '@/components/cms/sanitized-html';

const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' });

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return routing.locales.flatMap((locale) => posts.map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: 'Berita tidak ditemukan',
      description: 'Halaman berita yang Anda cari tidak tersedia.',
      locale,
      path: `/berita/${slug}`,
    });
  }

  return buildMetadata({
    title: post.seo_title ?? post.title,
    description: post.seo_description ?? post.excerpt,
    locale,
    path: `/berita/${post.slug}`,
  });
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Section>
        <Reveal>
          <Link
            href={`/${locale}/berita`}
            className="font-mono text-label uppercase text-slate hover:text-forest"
          >
            ← Semua berita
          </Link>
          <p className="mt-6 font-mono text-label uppercase text-slate">
            {post.published_at ? dateFormatter.format(new Date(post.published_at)) : ''}
            {post.category ? ` · ${post.category}` : ''}
          </p>
          <h1 className="mt-2 font-display text-display text-ink">{post.title}</h1>
          {post.author ? <p className="mt-4 text-small text-slate">Oleh {post.author}</p> : null}
          {post.coverImageUrl ? (
            <Image
              src={post.coverImageUrl}
              alt=""
              width={1280}
              height={720}
              className="mt-8 h-auto w-full rounded-[14px] object-cover"
              priority
            />
          ) : null}
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <div className="mx-auto max-w-2xl">
            {post.content ? (
              <SanitizedHtml html={post.content} className={ARTICLE_HTML_CLASS} />
            ) : (
              <p className="text-body text-slate">{post.excerpt}</p>
            )}
          </div>
        </Reveal>
      </Section>
    </>
  );
}
