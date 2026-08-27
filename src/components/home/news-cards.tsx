import { getFeaturedPublishedPosts } from '@/lib/cms/posts';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { RevealStagger, RevealItem } from '@/components/motion/reveal-stagger';
import { messagesFor } from '@/i18n/messages';

const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' });

export async function NewsCards({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);
  const posts = await getFeaturedPublishedPosts(3);

  return (
    <Section>
      <Reveal>
        <h2 className="font-display text-h2 text-ink">{title ?? t.beranda.beritaJudul}</h2>
      </Reveal>

      {posts.length === 0 ? (
        <Reveal>
          <p className="mt-6 text-small text-slate">{t.beranda.beritaKosong}</p>
        </Reveal>
      ) : (
        <RevealStagger className="mt-8 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <RevealItem key={post.slug} className="h-full">
              <a
                href={`/${locale}/berita/${post.slug}`}
                className="block h-full rounded-[14px] border border-line p-6 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-sm motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <p className="font-mono text-label uppercase text-slate">
                  {post.published_at ? dateFormatter.format(new Date(post.published_at)) : ''}
                </p>
                <p className="mt-2 font-display text-h3 text-ink">{post.title}</p>
                <p className="mt-1 text-small text-slate">{post.excerpt}</p>
              </a>
            </RevealItem>
          ))}
        </RevealStagger>
      )}
    </Section>
  );
}
