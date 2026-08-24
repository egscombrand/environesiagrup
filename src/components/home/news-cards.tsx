import { getCollection } from '@/lib/content';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import type { PostSummary } from '@/lib/content-types';

export function NewsCards({ locale }: { locale: string }) {
  const posts = getCollection<PostSummary>('posts').map((entry) => entry.data);

  return (
    <Section>
      <Reveal>
        <h2 className="font-display text-h2 text-ink">Berita & Insight</h2>
        {posts.length === 0 ? (
          <p className="mt-6 text-small text-slate">Belum ada berita terbaru.</p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <a
                key={post.slug}
                href={`/${locale}/berita/${post.slug}`}
                className="block rounded-[14px] border border-line p-6 transition-shadow hover:shadow-sm"
              >
                <p className="font-mono text-label uppercase text-slate">{post.tanggal}</p>
                <p className="mt-2 font-display text-h3 text-ink">{post.judul}</p>
                <p className="mt-1 text-small text-slate">{post.ringkasan}</p>
              </a>
            ))}
          </div>
        )}
      </Reveal>
    </Section>
  );
}
