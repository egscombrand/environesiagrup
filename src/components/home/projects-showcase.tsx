import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedPublishedProjects } from '@/lib/cms/projects';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { RevealStagger, RevealItem } from '@/components/motion/reveal-stagger';
import { messagesFor } from '@/i18n/messages';

export async function ProjectsShowcase({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);
  const projects = await getFeaturedPublishedProjects(5);
  const [featured, ...rest] = projects;

  return (
    <Section className="bg-canvas">
      <Reveal>
        <h2 className="font-landing-display text-h2 text-pine-ink">{title ?? t.beranda.proyekUnggulan}</h2>
      </Reveal>

      {!featured ? (
        <Reveal>
          <p className="mt-6 text-small text-pine-ink/60">{t.beranda.proyekKosong}</p>
        </Reveal>
      ) : (
        <>
          <Reveal className="mt-8">
            <Link
              href={`/${locale}/proyek/${featured.slug}`}
              className="group grid overflow-hidden rounded-[14px] border border-sage-mist bg-canvas md:grid-cols-2"
            >
              <div className="relative aspect-[4/3] md:aspect-auto">
                {featured.featuredImageUrl ? (
                  <Image
                    src={featured.featuredImageUrl}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                ) : null}
                <span className="absolute left-4 top-4 rounded-full bg-sunrise-amber px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-pine-ink">
                  {t.beranda.proyekUnggulan}
                </span>
              </div>
              <div className="flex flex-col justify-center p-6 md:p-10">
                <p className="font-mono text-label uppercase text-pine-ink/60">
                  {[featured.sector, featured.year, featured.city].filter(Boolean).join(' · ')}
                </p>
                <p className="mt-3 font-landing-display text-h2 text-pine-ink">{featured.title}</p>
                <p className="mt-3 font-landing-body text-body text-pine-ink/70">{featured.summary}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-small font-medium text-emerald-pulse">
                  {t.common.selengkapnya} →
                </span>
              </div>
            </Link>
          </Reveal>

          {rest.length > 0 ? (
            <RevealStagger className="mt-6 divide-y divide-sage-mist border-y border-sage-mist">
              {rest.map((project) => (
                <RevealItem key={project.slug}>
                  <Link
                    href={`/${locale}/proyek/${project.slug}`}
                    className="flex items-center gap-4 py-5 hover:bg-sage-mist/30"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[10px] bg-sage-mist/40">
                      {project.featuredImageUrl ? (
                        <Image src={project.featuredImageUrl} alt="" fill sizes="64px" className="object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-label uppercase text-pine-ink/60">
                        {[project.sector, project.year].filter(Boolean).join(' · ')}
                      </p>
                      <p className="mt-1 truncate font-landing-display text-h3 text-pine-ink">{project.title}</p>
                    </div>
                    <span aria-hidden="true" className="text-pine-ink/50">
                      →
                    </span>
                  </Link>
                </RevealItem>
              ))}
            </RevealStagger>
          ) : null}
        </>
      )}
    </Section>
  );
}
