'use client';

import { useEffect, useRef, useState } from 'react';



/**
 * The principles block, shown on the Tata Kelola pages after the navigation
 * (Section 4+). The heading and the principles come in as props. Five principles
 * in one row on desktop, two per row on small tablets, one per row on phones. Each principle
 * fades up once, one after another, when the section enters the viewport. Hover
 * only changes the top border and the number. Reduced motion turns it all off.
 */
export function TataKelolaGovernanceSection({
  heading,
  principles,
}: {
  heading: string | null;
  principles: readonly { label?: string; title: string; description: string }[];
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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stateClass = `${ready ? 'gov-ready' : ''} ${inView ? 'gov-in' : ''}`;

  if (principles.length === 0) return null;

  return (
    <section ref={ref} className={`w-full bg-white px-6 py-12 font-landing-body md:px-8 md:py-16 ${stateClass}`}>
      <div className="mx-auto max-w-[1200px]">
      <div>
        {heading ? <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#666666]">{heading}</p> : null}

        <ol className={`${heading ? 'mt-6' : ''} grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-5`}>
          {principles.map((principle, index) => (
            <li
              key={`${index}-${principle.title}`}
              className="gov-principle group relative min-w-0 border-t border-[#DDE5E7] pt-4"
              style={{ animationDelay: `${80 * index}ms` }}
            >
              <span
                className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-[#01B3A1] transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none"
                aria-hidden="true"
              />
              <div className="flex items-baseline gap-2">
                <span className="text-[12px] font-semibold tabular-nums tracking-[0.1em] text-[#01B3A1] transition-colors duration-300 group-hover:text-[#2A7793] motion-reduce:transition-none">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {principle.label ? (
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#666666]">{principle.label}</p>
                ) : null}
              </div>
              <h3 className="mt-2 break-words font-landing-display text-h3 font-bold text-[#0B2B22] transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none">
                {principle.title}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.6] text-[#444444]">{principle.description}</p>
            </li>
          ))}
        </ol>
      </div>
      </div>
    </section>
  );
}
