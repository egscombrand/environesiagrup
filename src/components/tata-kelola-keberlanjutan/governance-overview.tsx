'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Building2, ClipboardCheck, HandHeart, HeartHandshake, ShieldAlert, ShieldCheck, Target, type LucideIcon } from 'lucide-react';

/** Icons for the seven pillars, matched by position. The copy comes from the database. */
const ICONS: readonly LucideIcon[] = [Building2, ShieldCheck, ClipboardCheck, ShieldAlert, HeartHandshake, HandHeart, Target];

/**
 * Section 2 of every Tata Kelola & Keberlanjutan page: an overview of the seven
 * governance pillars as cards. It is context, not navigation. Section 3 is the
 * only navigation, so the cards carry no links and no active state. The heading
 * and the pillars come in as props. Icons follow the order of the pillars.
 *
 * Layout: on desktop the cards form two rows, four then three, with the second
 * row centered under the first. The row is a flex-wrap with a fixed card width
 * of one quarter of the row (less the gaps), so every card has the same size
 * and the three-card row centers itself. Tablet uses three per row, phones one.
 *
 * Motion uses the shared `gov-*` reveal: the heading fades in on
 * mount, and the cards rise in one after another, left to right, once when the
 * section enters the viewport. Reduced motion turns it all off.
 */
export function GovernanceOverview({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: readonly { title: string; description: string }[];
}) {
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    setReady(true);
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stateClass = `${ready ? 'gov-ready' : ''} ${inView ? 'gov-in' : ''}`;

  return (
    <section
      ref={ref}
      className={`governance-overview gov-nav-root w-full bg-[#F6F8F7] px-6 py-12 font-landing-body md:px-8 md:py-16 ${stateClass}`}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="gov-nav-heading">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2A7793] md:text-[12px]">{eyebrow}</p>
          <h2 className="mt-2.5 font-landing-display text-h2 font-bold text-[#0B2B22] md:max-w-[1000px]">
            {title}
          </h2>
          <p className="mt-3 text-body text-[#444444] md:max-w-[1000px]">{description}</p>
        </div>

        <ol className="mt-8 flex flex-wrap justify-center gap-4 md:mt-10 md:gap-4">
          {items.map((pillar, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <li
                key={`${index}-${pillar.title}`}
                className="gov-principle flex w-full md:w-[calc((100%-32px)/3)] lg:w-[calc((100%-48px)/4)]"
                style={{ animationDelay: `${90 * index}ms` }}
              >
                <article className="group flex w-full flex-col rounded-[14px] border border-[#E5E7EB] bg-white p-6 transition-colors duration-300 hover:border-[#2A7793]/60 motion-reduce:transition-none md:p-7">
                  <div className="flex items-start justify-between">
                    <span className="font-landing-display text-[44px] font-light leading-none tabular-nums text-[#2A7793]/30 transition-colors duration-300 group-hover:text-[#2A7793]/60 motion-reduce:transition-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Icon
                      className="h-7 w-7 text-[#2A7793] transition-transform duration-300 motion-reduce:transition-none"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-5 text-h3 font-semibold text-[#0B2B22]">{pillar.title}</h3>
                  <p className="mt-2 text-small text-[#444444]">{pillar.description}</p>
                  <ArrowRight
                    className="mt-5 h-4 w-4 text-[#2A7793] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
