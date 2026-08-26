import { getFeaturedPublishedPosts } from '@/lib/cms/posts';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { messagesFor } from '@/i18n/messages';

const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' });

export async function NewsCards({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);
  const posts = await getFeaturedPublishedPosts(3);

  return (
    <Section>
      <Reveal>
        <h2 className="font-display text-h2 text-ink">{title ?? t.beranda.beritaJudul}</h2>
        {posts.length === 0 ? (
          <p className="mt-6 text-small text-slate">{t.beranda.beritaKosong}</p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`/${locale}/berita/${post.slug}`}
                className="block rounded-[14px] border border-line p-6 transition-shadow hover:shadow-sm"
              >
                <p className="font-mono text-label uppercase text-slate">
                  {post.published_at ? dateFormatter.format(new Date(post.published_at)) : ''}
                </p>
                <p className="mt-2 font-display text-h3 text-ink">{post.title}</p>
                <p className="mt-1 text-small text-slate">{post.excerpt}</p>
              </a>
            ))}
          </div>
        )}
      </Reveal>
    </Section>
  );
}
