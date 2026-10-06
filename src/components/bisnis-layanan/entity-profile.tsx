'use client';

import Image from 'next/image';
import type { Entity } from '@/lib/cms/entities';
import { ENTITY_PROFILES } from './entity-profile-data';

const PRIMARY = '#2A7793';
const ACCENT = '#01B3A1';

// All 5 real entity logos share an identical 640×200 canvas (measured
// directly, PIL bounding-box, during Section 2's ecosystem map work) — four
// of five draw content across ~94% of that canvas width, but GreenLab's
// only reaches ~78%, so at an identical rendered height it visibly reads
// smaller. Reusing that same measured compensation here keeps the five
// logos optically balanced in this panel too.
const LOGO_OPTICAL_SCALE: Record<string, number> = { greenlab: 1.18 };

function Label({ children }: { children: string }) {
  return <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#666666]">{children}</p>;
}

// Visual-first entity profile: LOGO → category → one short description →
// a real photo → scannable FOCUS/WHO-IT-HELPS chips → one role-in-group
// line → CTA to the real external site. Deliberately not a full company
// profile — no service-by-service breakdown, no history, no stats — that
// lives on each brand's own website, which the CTA leads straight to.
export function EntityProfile({ entity }: { entity: Entity }) {
  const profile = ENTITY_PROFILES[entity.slug];
  if (!profile) return null;

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1fr] md:items-center md:gap-14">
      <div>
        {entity.logoUrl ? (
          <div
            style={{ transform: `scale(${LOGO_OPTICAL_SCALE[entity.slug] ?? 1})`, transformOrigin: 'left center' }}
          >
            <Image src={entity.logoUrl} alt="" width={640} height={200} className="h-11 w-auto object-contain" />
          </div>
        ) : null}

        <p className="mt-4 text-[14px] font-semibold uppercase tracking-[0.04em]" style={{ color: ACCENT }}>
          {profile.category}
        </p>
        <h3 className="mt-2 text-left text-[clamp(26px,2.6vw,36px)] font-bold leading-[1.2]" style={{ color: PRIMARY }}>
          {entity.name}
        </h3>
        <p className="mt-3 max-w-[520px] text-[15px] leading-[1.7] text-[#444444]">{profile.description}</p>

        <div className="mt-6">
          <Label>Fokus</Label>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {profile.focus.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-[12px] text-[#444444]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <Label>Siapa yang Dibantu</Label>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {profile.whoItHelps.map((item, index) => (
              <span key={item} className="text-[13px] font-medium text-[#444444]">
                {item}
                {index < profile.whoItHelps.length - 1 ? (
                  <span className="ml-2 text-[#E5E7EB]" aria-hidden="true">
                    ·
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <Label>Peran dalam Group</Label>
          <p className="mt-2 max-w-[520px] text-[14px] leading-[1.6] text-[#444444]">{profile.roleInGroup}</p>
        </div>

        <a
          href={profile.ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-6 inline-flex items-center gap-1 text-[16px] font-semibold"
          style={{ color: PRIMARY }}
        >
          {profile.ctaLabel}
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-200 motion-reduce:transition-none group-hover:translate-x-1"
          >
            →
          </span>
        </a>
      </div>

      {entity.coverImageUrl ? (
        <div className="aspect-[4/3] overflow-hidden rounded-[18px] border border-[#E5E7EB] transition-transform duration-300 motion-reduce:transition-none hover:scale-[1.02]">
          <Image src={entity.coverImageUrl} alt="" width={960} height={720} className="h-full w-full object-cover" />
        </div>
      ) : null}
    </div>
  );
}
