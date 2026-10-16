import Link from 'next/link';
import type { Post } from '@/lib/cms/posts';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';

const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'UTC' });

function isExternalUrl(value: string | null): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// The "Berita Perusahaan" list — self-authored company news only (post_type
// = 'berita_perusahaan'), never a press clipping. Same `posts` table and the
// same real detail route (/berita/[slug], unchanged) as the standalone
// /berita page, which still spans both content types.
export function PostsListSection({ locale, posts, emptyMessage }: { locale: string; posts: Post[]; emptyMessage: string }) {
  return (
    <Section className="bg-stone">
      <Reveal>
        {posts.length === 0 ? (
          <p className="text-small text-slate">{emptyMessage}</p>
        ) : (
          <ul>
            {posts.map((post) => {
              const external = isExternalUrl(post.source_url) ? post.source_url : null;
              const meta = [post.owner, post.media].filter(Boolean).join(' · ');
              return (
                <li key={post.slug} className="border-b border-line py-5">
                  <p className="font-mono text-label uppercase text-slate">
                    {post.published_at ? dateFormatter.format(new Date(post.published_at)) : ''}
                  </p>
                  <p className="mt-1 font-display text-h3 text-ink">{post.title}</p>
                  {meta ? <p className="mt-1 text-small text-slate">{meta}</p> : null}
                  {post.excerpt ? <p className="mt-1 text-small text-slate">{post.excerpt}</p> : null}
                  <div className="mt-3">
                    {external ? (
                      <a
                        href={external}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-small font-medium text-forest hover:underline"
                      >
                        Baca Berita
                      </a>
                    ) : (
                      <Link href={`/${locale}/berita/${post.slug}`} className="text-small font-medium text-forest hover:underline">
                        Baca Berita
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Reveal>
    </Section>
  );
}
