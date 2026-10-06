import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/cms/posts';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { LoadMoreGrid } from './load-more-grid';

const PRIMARY = '#2A7793';
const ACCENT = '#01B3A1';
const TEXT = '#444444';
const MUTED = '#666666';
const BORDER = '#E5E7EB';
const SURFACE = '#F8FAFA';

const dateFormatter = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** The thumbnail the lookup stored from the article's own page, or null — never a stand-in. */
function thumbnailOf(post: Post): string | null {
  return post.thumbnail_status === 'found' && post.thumbnail_url ? post.thumbnail_url : null;
}

function isExternalUrl(value: string | null): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Initials for the media panel: "Radar Tuban" → "RT", "TribunNews" → "T". */
function mediaInitials(name: string | null | undefined): string {
  if (!name) return 'P';
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? words.slice(0, 2).map((w) => w[0]) : [words[0]?.[0] ?? 'P'];
  return letters.join('').toUpperCase();
}

/**
 * Stands in for a cover image when a story has none. Only the stored media
 * name and initials are shown — no logo is invented.
 */
function MediaPanel({ media, owner, className = '' }: { media: string | null; owner: string | null; className?: string }) {
  const label = media ?? owner ?? 'Pemberitaan';
  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden ${className}`}
      style={{ backgroundColor: SURFACE, borderBottom: `1px solid ${BORDER}` }}
      aria-hidden="true"
    >
      <span className="absolute -right-12 -top-12 h-44 w-44 rounded-full border" style={{ borderColor: `${PRIMARY}1A` }} />
      <span className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full border" style={{ borderColor: `${ACCENT}33` }} />
      <span className="relative p-5 text-[64px] font-bold leading-none" style={{ color: `${PRIMARY}26` }}>
        {mediaInitials(media ?? owner)}
      </span>
      <div className="relative p-5">
        <p className="text-[13px] font-bold uppercase tracking-[0.08em]" style={{ color: PRIMARY }}>
          {label}
        </p>
        <span className="mt-2 block h-[2px] w-10" style={{ backgroundColor: ACCENT }} />
      </div>
    </div>
  );
}

function Attribution({ owner, media }: { owner: string | null; media: string | null }) {
  if (!owner && !media) return null;
  return (
    <p className="text-[13px] leading-[1.4]" style={{ color: MUTED }}>
      {owner ? <span className="font-semibold" style={{ color: TEXT }}>{owner}</span> : null}
      {owner && media ? ' · ' : null}
      {media ? (
        <>
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.08em]">Media</span>
          {media}
        </>
      ) : null}
    </p>
  );
}

function ReadLink({ href, external, label }: { href: string; external: boolean; label: string }) {
  const className = 'group/link inline-flex items-center gap-1.5 text-[14px] font-semibold underline-offset-4 hover:underline';
  const arrow = (
    <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-1" aria-hidden="true">
      {external ? '↗' : '→'}
    </span>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={{ color: ACCENT }}>
      {label}
      {arrow}
      <span className="sr-only">(membuka situs media, tab baru)</span>
    </a>
  ) : (
    <Link href={href} className={className} style={{ color: ACCENT }}>
      {label}
      {arrow}
    </Link>
  );
}

function FeaturedStory({ locale, post }: { locale: string; post: Post }) {
  const external = isExternalUrl(post.source_url) ? post.source_url : null;
  const href = external ?? `/${locale}/berita/${post.slug}`;
  const thumb = thumbnailOf(post);

  return (
    <article className="grid overflow-hidden rounded-[18px] border bg-white md:grid-cols-[45fr_55fr]" style={{ borderColor: BORDER }}>
      {thumb ? (
        <div className="relative aspect-video overflow-hidden md:aspect-auto md:min-h-full">
          <Image src={thumb} alt="" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
        </div>
      ) : (
        <MediaPanel media={post.media} owner={post.owner} className="aspect-video md:aspect-auto md:min-h-full" />
      )}

      <div className="flex flex-col justify-center gap-4 p-6 sm:p-10">
        <p className="text-[12px] font-medium uppercase tracking-[0.06em]" style={{ color: MUTED }}>
          {post.published_at ? dateFormatter.format(new Date(post.published_at)) : ''}
        </p>
        <h3 className="text-[22px] font-bold leading-[1.25] sm:text-[28px] md:text-[32px]" style={{ color: PRIMARY }}>
          {post.title}
        </h3>
        <Attribution owner={post.owner} media={post.media} />
        <div className="pt-2">
          <ReadLink href={href} external={!!external} label="Baca Berita" />
        </div>
      </div>
    </article>
  );
}

function CoverageCard({ locale, post }: { locale: string; post: Post }) {
  const external = isExternalUrl(post.source_url) ? post.source_url : null;
  const href = external ?? `/${locale}/berita/${post.slug}`;
  const thumb = thumbnailOf(post);

  return (
    <article className="group flex flex-col overflow-hidden rounded-[14px] border bg-white transition-[border-color] duration-300 hover:border-[#01B3A1]/60" style={{ borderColor: BORDER }}>
      {thumb ? (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={thumb}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <MediaPanel media={post.media} owner={post.owner} className="aspect-video" />
      )}

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <p className="text-[12px] font-medium uppercase tracking-[0.06em]" style={{ color: MUTED }}>
          {post.published_at ? dateFormatter.format(new Date(post.published_at)) : ''}
        </p>
        <h3
          className="text-[18px] font-semibold leading-[1.4] transition-colors duration-200 group-hover:text-[#01B3A1] sm:text-[19px]"
          style={{ color: PRIMARY }}
        >
          {post.title}
        </h3>
        <Attribution owner={post.owner} media={post.media} />
        <div className="mt-auto pt-2">
          <ReadLink href={href} external={!!external} label="Baca Berita" />
        </div>
      </div>
    </article>
  );
}

/**
 * Siaran Pers: news about Environesia that other media published. The newest
 * story leads as a featured piece, the rest follow as a coverage grid. Every
 * value comes from the stored record. The thumbnail is the article's own lead
 * image, fetched from its link; when none was found, a typographic media panel
 * is shown instead. Nothing is generated.
 */
export function SiaranPersList({ locale, posts, emptyMessage }: { locale: string; posts: Post[]; emptyMessage: string }) {
  const [featured, ...rest] = posts;

  return (
    <Section>
      <Reveal>
        <header>
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
            Pemberitaan Media
          </p>
          <h2 className="mt-3 text-[clamp(32px,4.5vw,48px)] font-bold leading-[1.1]" style={{ color: PRIMARY }}>
            Siaran Pers
          </h2>
          <p className="mt-4 text-[clamp(18px,2.2vw,22px)] font-semibold leading-[1.35]" style={{ color: TEXT }}>
            Aktivitas Environesia yang Mendapat <span style={{ color: ACCENT }}>Sorotan Media</span>
          </p>
          <p className="mt-3 max-w-[650px] text-[16px] leading-[1.6]" style={{ color: MUTED }}>
            Berbagai kegiatan, kolaborasi, dan aktivitas Environesia Company Group yang telah diberitakan oleh media
            eksternal.
          </p>
        </header>

        {!featured ? (
          <p className="mt-10 text-[15px]" style={{ color: MUTED }}>
            {emptyMessage}
          </p>
        ) : (
          <>
            <div className="mt-10">
              <FeaturedStory locale={locale} post={featured} />
            </div>

            {rest.length > 0 ? (
              <>
                <p className="mt-14 text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
                  Liputan Lainnya
                </p>
                <div className="mt-5">
                  <LoadMoreGrid className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((post) => (
                      <CoverageCard key={post.id} locale={locale} post={post} />
                    ))}
                  </LoadMoreGrid>
                </div>
              </>
            ) : null}
          </>
        )}
      </Reveal>
    </Section>
  );
}
