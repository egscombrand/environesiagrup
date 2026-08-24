# Fase 2 — Beranda Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the homepage (`Beranda`) — hero slider, key-stat counters, entity cards, business pillars, a country-footprint map teaser, the Green Business/CEO split, news cards, and a contact CTA — wired into `src/app/[locale]/page.tsx` in the exact section order the spec defines, using real confirmed data where it exists and honest empty-states everywhere it doesn't.

**Architecture:** Every section is a `*-section.tsx` (or bare) Server Component that reads its data via Fase 1's `getCollection` and renders inside the shared `<Section>` primitive, wrapped in a single shared `<Reveal>` Client Component that implements the spec's one scroll-triggered motion pattern. The only other Client Components are `HeroSlider` (autoplay/crossfade/Ken Burns), `CountryMap` (hover/focus pin interaction), and `KeyStatsCounters` (count-up animation) — each an explicit, spec-justified exception to "Server Component by default," mirroring how Fase 1 isolated `MobileNav` as its one exception.

**Tech Stack:** Same as Fase 1 (Next.js 15, Tailwind v4, next-intl, Vitest/RTL, MDX-in-repo via `getCollection`), plus `framer-motion` (already an approved dependency per the spec, not yet installed) for the two allowed motion patterns.

**Spec:** `/home/doly/company-profile-egc/project.md` — §3 "Struktur beranda" (section order), §5 "Spesifikasi hero" (slide behavior), §7 "Content model" (collection fields), §4 "Motion" (the two allowed patterns).

## Global Constraints

- Next.js 15, App Router, TypeScript strict mode (carried from Fase 1).
- Default Server Component everywhere. The ONLY `'use client'` files in this plan are: `Reveal` (shared fade-up wrapper), `HeroSlider`, `CountryMap`, `KeyStatsCounters`. Every `*-section.tsx` data-reading wrapper stays a Server Component.
- Motion: exactly the two patterns from project.md §4 — fade-up 24px / 500ms / easing `[0.16, 1, 0.3, 1]` / `whileInView` / `viewport={{ once: true }}` (implemented once, in `<Reveal>`, reused everywhere) and hero crossfade 800ms (implemented once, in `HeroSlider`). No ad-hoc framer-motion usage outside these two components. Everything respects `prefers-reduced-motion`.
- Count-up stat animation: never runs longer than 1.5s total; shows the final value immediately when `prefers-reduced-motion` is set.
- Cards: `border: 1px solid var(--line)`, `border-radius: 14px`, no `box-shadow` except a subtle one on hover — same rule as Fase 1.
- **Content honesty rule (explicit decision this session):** sections lacking confirmed data render a short, honest empty-state notice ("data belum tersedia" / "akan segera hadir") — never a fabricated specific claim (no invented country names, no invented CEO name/quote, no invented news headlines). Hero and pillar copy is grounded only in facts already confirmed in `project.md` (group name, 5-entity structure, the "10 negara" fact stated in the sitemap itself) and is flagged below as placeholder marketing copy pending brand approval.
- Content model deviation (documented, additive): `PillarEntry` gets an `urutan: number` field beyond project.md §7's listed fields (`nama, slug, ikon, deskripsi, layanan[], entitas terkait[]`). Alphabetical slug sort does not reproduce the intended konsultasi→pengujian→pelatihan→sertifikasi order, so an explicit order field is added — the same pattern every other collection in §7 already uses.
- Locale-prefixed links in new components (`/${locale}/entitas/...`, `/${locale}/proyek`, etc.) follow Fase 1's existing hand-rolled convention (plain `next/link`/`<a>` + string interpolation) — NOT `next-intl`'s `createNavigation`. Switching to it is Fase-1-deferred technical debt, out of scope here unless raised separately.
- Several links in this plan point at routes that don't exist until later phases (`/entitas/[slug]` → Fase 3, `/proyek`, `/berita/[slug]` → Fase 5, `/kontak` → Fase 6). This is normal incremental build-out, not a defect — no task here needs to verify those targets resolve.

---

### Task 1: Shared motion primitive, content types, test polyfills

**Files:**
- Create: `src/components/motion/reveal.tsx`
- Test: `src/components/motion/reveal.test.tsx`
- Create: `src/lib/content-types.ts`
- Modify: `vitest.setup.ts` (add `IntersectionObserver` and `window.matchMedia` polyfills)

**Interfaces:**
- Consumes: nothing
- Produces: `Reveal` from `@/components/motion/reveal`, props `{ children: ReactNode; className?: string }`. Type exports from `@/lib/content-types`: `StatEntry`, `EntityLini` (`'inti' | 'penunjang'`), `EntityEntry`, `PillarEntry`, `HeroSlideEntry`, `ProjectPin`, `PostSummary`. Global jsdom polyfills for `IntersectionObserver` and `window.matchMedia`, available to every later test in this plan.

- [ ] **Step 1: Install framer-motion**

```bash
npm install framer-motion
```

- [ ] **Step 2: Add content types**

```ts
// src/lib/content-types.ts
export type StatEntry = {
  label: string;
  nilai: number;
  satuan: string;
  urutan: number;
};

export type EntityLini = 'inti' | 'penunjang';

export type EntityEntry = {
  nama: string;
  slug: string;
  tagline?: string;
  lini: EntityLini;
  warnaAksen: string;
  deskripsi: string;
  layanan: string[];
  legalitas: string[];
  website?: string;
  logo?: string;
  urutan: number;
};

export type PillarEntry = {
  nama: string;
  slug: string;
  ikon: string;
  deskripsi: string;
  layanan: string[];
  entitasTerkait: string[];
  urutan: number;
};

export type HeroSlideEntry = {
  type: 'image' | 'video';
  src: string;
  srcMobile?: string;
  poster?: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaUrl: string;
  accentColor?: string;
  urutan: number;
};

export type ProjectPin = {
  judul: string;
  negara: string;
  kota?: string;
  koordinat: [number, number];
};

export type PostSummary = {
  judul: string;
  slug: string;
  tanggal: string;
  ringkasan: string;
};
```

- [ ] **Step 3: Add jsdom polyfills for tests**

Append to `vitest.setup.ts`:

```ts
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this);
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

// @ts-expect-error jsdom has no IntersectionObserver
global.IntersectionObserver = MockIntersectionObserver;

if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
```

- [ ] **Step 4: Write the failing test for Reveal**

```tsx
// src/components/motion/reveal.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Reveal } from './reveal';

describe('Reveal', () => {
  it('renders its children', () => {
    render(
      <Reveal>
        <p>Hello</p>
      </Reveal>
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies a custom className to the wrapper', () => {
    render(
      <Reveal className="test-class">
        <p>Hello</p>
      </Reveal>
    );
    expect(screen.getByText('Hello').parentElement).toHaveClass('test-class');
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npx vitest run src/components/motion/reveal.test.tsx`
Expected: FAIL — `Cannot find module './reveal'`.

- [ ] **Step 6: Implement Reveal**

```tsx
// src/components/motion/reveal.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npx vitest run src/components/motion/reveal.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add Reveal motion primitive and Fase 2 content types"
```

---

### Task 2: Populate real content collections (stats, entities, pillars)

**Files:**
- Create: `content/stats/pengalaman.mdx`, `content/stats/negara.mdx`
- Create: `content/entities/environesia.mdx`, `content/entities/greenlab.mdx`, `content/entities/greenskill.mdx`, `content/entities/lsp-praktisi-lingkungan.mdx`, `content/entities/bikin-indonesia-berdaya.mdx`
- Create: `content/pillars/konsultasi.mdx`, `content/pillars/pengujian-sampling.mdx`, `content/pillars/pelatihan-kompetensi.mdx`, `content/pillars/sertifikasi-profesi.mdx`
- Test: `src/lib/homepage-content.test.ts`

**Interfaces:**
- Consumes: `getCollection` from `@/lib/content` (Fase 1), types from `@/lib/content-types` (Task 1)
- Produces: real content read by Tasks 3, 4, 5

Every field below is transcribed directly from `project.md` §2 (entity table) and §3 (pillar chain) — nothing invented. `legalitas`/`website`/`tagline`/`logo` are left empty/omitted wherever project.md itself marks them TBD.

- [ ] **Step 1: Stats**

```yaml
# content/stats/pengalaman.mdx
---
label: Tahun Pengalaman
nilai: 10
satuan: "+"
urutan: 1
---

Grup berdiri sejak sekitar 2016.
```

```yaml
# content/stats/negara.mdx
---
label: Negara
nilai: 10
satuan: ""
urutan: 2
---

Jejak proyek grup tersebar di 10 negara.
```

- [ ] **Step 2: Entities**

```yaml
# content/entities/environesia.mdx
---
nama: Environesia
slug: environesia
lini: inti
warnaAksen: "#0F4C3A"
deskripsi: Konsultasi lingkungan.
layanan: []
legalitas: []
urutan: 1
---
```

```yaml
# content/entities/greenlab.mdx
---
nama: GreenLab
slug: greenlab
lini: inti
warnaAksen: "#1E7A6B"
deskripsi: Laboratorium & sampling.
layanan: []
legalitas:
  - "KAN ISO/IEC 17025 (nomor akreditasi menyusul)"
website: toolsgl.my.id
urutan: 2
---
```

```yaml
# content/entities/greenskill.mdx
---
nama: GreenSkill
slug: greenskill
lini: inti
warnaAksen: "#B07C25"
deskripsi: Pelatihan kompetensi.
layanan: []
legalitas: []
urutan: 3
---
```

```yaml
# content/entities/lsp-praktisi-lingkungan.mdx
---
nama: LSP Praktisi Lingkungan Indonesia
slug: lsp-praktisi-lingkungan
lini: inti
warnaAksen: "#454A85"
deskripsi: Sertifikasi profesi.
layanan: []
legalitas:
  - "Lisensi BNSP (nomor menyusul)"
urutan: 4
---
```

```yaml
# content/entities/bikin-indonesia-berdaya.mdx
---
nama: Bikin Indonesia Berdaya
slug: bikin-indonesia-berdaya
lini: penunjang
warnaAksen: "#A8482D"
deskripsi: Konveksi custom apparel.
layanan: []
legalitas: []
urutan: 5
---
```

- [ ] **Step 3: Pillars**

```yaml
# content/pillars/konsultasi.mdx
---
nama: Konsultasi Lingkungan
slug: konsultasi
ikon: leaf
deskripsi: Konsultasi lingkungan untuk klien korporat dan instansi pemerintah.
layanan: []
entitasTerkait:
  - environesia
urutan: 1
---
```

```yaml
# content/pillars/pengujian-sampling.mdx
---
nama: Pengujian & Sampling
slug: pengujian-sampling
ikon: flask
deskripsi: Pengujian laboratorium dan sampling lapangan.
layanan: []
entitasTerkait:
  - greenlab
urutan: 2
---
```

```yaml
# content/pillars/pelatihan-kompetensi.mdx
---
nama: Pelatihan Kompetensi
slug: pelatihan-kompetensi
ikon: graduation-cap
deskripsi: Pelatihan kompetensi bidang lingkungan.
layanan: []
entitasTerkait:
  - greenskill
urutan: 3
---
```

```yaml
# content/pillars/sertifikasi-profesi.mdx
---
nama: Sertifikasi Profesi
slug: sertifikasi-profesi
ikon: badge-check
deskripsi: Sertifikasi profesi lingkungan.
layanan: []
entitasTerkait:
  - lsp-praktisi-lingkungan
urutan: 4
---
```

- [ ] **Step 4: Write the test proving the real content reads correctly**

```ts
// src/lib/homepage-content.test.ts
import { describe, expect, it } from 'vitest';
import { getCollection } from './content';
import type { StatEntry, EntityEntry, PillarEntry } from './content-types';

describe('Fase 2 content collections', () => {
  it('reads 2 real stats, sorted by urutan', () => {
    const stats = getCollection<StatEntry>('stats')
      .map((e) => e.data)
      .sort((a, b) => a.urutan - b.urutan);
    expect(stats).toEqual([
      { label: 'Tahun Pengalaman', nilai: 10, satuan: '+', urutan: 1 },
      { label: 'Negara', nilai: 10, satuan: '', urutan: 2 },
    ]);
  });

  it('reads 4 core entities and 1 supporting entity', () => {
    const entities = getCollection<EntityEntry>('entities').map((e) => e.data);
    expect(entities.filter((e) => e.lini === 'inti')).toHaveLength(4);
    expect(entities.filter((e) => e.lini === 'penunjang')).toHaveLength(1);
    expect(entities.map((e) => e.nama)).toContain('Bikin Indonesia Berdaya');
  });

  it('reads 4 pillars in chain order', () => {
    const pillars = getCollection<PillarEntry>('pillars')
      .map((e) => e.data)
      .sort((a, b) => a.urutan - b.urutan);
    expect(pillars.map((p) => p.slug)).toEqual([
      'konsultasi',
      'pengujian-sampling',
      'pelatihan-kompetensi',
      'sertifikasi-profesi',
    ]);
  });
});
```

- [ ] **Step 5: Run and verify**

Run: `npx vitest run src/lib/homepage-content.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: populate stats, entities, and pillars content"
```

---

### Task 3: Key stats section (count-up)

**Files:**
- Create: `src/components/home/key-stats-section.tsx`
- Create: `src/components/home/key-stats-counters.tsx`
- Test: `src/components/home/key-stats-section.test.tsx`
- Test: `src/components/home/key-stats-counters.test.tsx`

**Interfaces:**
- Consumes: `Section` (Fase 1), `Reveal`, `StatEntry` (Task 1), real `content/stats` (Task 2)
- Produces: `KeyStatsSection` (no props) from `@/components/home/key-stats-section`, used by Task 12

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/home/key-stats-counters.test.tsx
import { act } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KeyStatsCounters } from './key-stats-counters';

const stats = [
  { label: 'Tahun Pengalaman', nilai: 10, satuan: '+', urutan: 1 },
  { label: 'Negara', nilai: 10, satuan: '', urutan: 2 },
];

describe('KeyStatsCounters', () => {
  it('renders a label for every stat', () => {
    render(<KeyStatsCounters stats={stats} />);
    expect(screen.getByText('Tahun Pengalaman')).toBeInTheDocument();
    expect(screen.getByText('Negara')).toBeInTheDocument();
  });

  it('counts up to the target value within 1.5s', async () => {
    render(<KeyStatsCounters stats={stats} />);

    await waitFor(
      () => {
        expect(screen.getByText('10+')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
```

```tsx
// src/components/home/key-stats-section.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KeyStatsSection } from './key-stats-section';

describe('KeyStatsSection', () => {
  it('renders both real stats from content/stats', () => {
    render(<KeyStatsSection />);
    expect(screen.getByText('Tahun Pengalaman')).toBeInTheDocument();
    expect(screen.getByText('Negara')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/home/key-stats-counters.test.tsx src/components/home/key-stats-section.test.tsx`
Expected: FAIL — both modules missing.

- [ ] **Step 3: Implement KeyStatsCounters**

```tsx
// src/components/home/key-stats-counters.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import type { StatEntry } from '@/lib/content-types';

const DURATION_MS = 1500;
const STEPS = 30;

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    let step = 0;
    const increment = target / STEPS;
    const interval = setInterval(() => {
      step += 1;
      if (step >= STEPS) {
        setValue(target);
        clearInterval(interval);
      } else {
        setValue(Math.round(increment * step));
      }
    }, DURATION_MS / STEPS);

    return () => clearInterval(interval);
  }, [target, active]);

  return value;
}

function Counter({ stat }: { stat: StatEntry }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const value = useCountUp(stat.nilai, active);

  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-display text-forest">
        {value}
        {stat.satuan}
      </p>
      <p className="mt-2 font-mono text-label uppercase text-slate">{stat.label}</p>
    </div>
  );
}

export function KeyStatsCounters({ stats }: { stats: StatEntry[] }) {
  return (
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
      {stats.map((stat) => (
        <Counter key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Implement KeyStatsSection**

```tsx
// src/components/home/key-stats-section.tsx
import { getCollection } from '@/lib/content';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { KeyStatsCounters } from './key-stats-counters';
import type { StatEntry } from '@/lib/content-types';

export function KeyStatsSection() {
  const stats = getCollection<StatEntry>('stats')
    .map((entry) => entry.data)
    .sort((a, b) => a.urutan - b.urutan);

  if (stats.length === 0) {
    return null;
  }

  return (
    <Section className="bg-stone">
      <Reveal>
        <KeyStatsCounters stats={stats} />
      </Reveal>
    </Section>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/components/home/key-stats-counters.test.tsx src/components/home/key-stats-section.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add key stats count-up section"
```

---

### Task 4: Entity cards

**Files:**
- Create: `src/components/home/entity-cards.tsx`
- Test: `src/components/home/entity-cards.test.tsx`

**Interfaces:**
- Consumes: `Section`, `Reveal`, `EntityEntry`, real `content/entities` (Task 2)
- Produces: `EntityCards({ locale: string })` from `@/components/home/entity-cards`, used by Task 12

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/home/entity-cards.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EntityCards } from './entity-cards';

describe('EntityCards', () => {
  it('renders all 5 entities, with the supporting one visually separated', () => {
    render(<EntityCards locale="id" />);

    expect(screen.getByText('Environesia')).toBeInTheDocument();
    expect(screen.getByText('GreenLab')).toBeInTheDocument();
    expect(screen.getByText('GreenSkill')).toBeInTheDocument();
    expect(screen.getByText('LSP Praktisi Lingkungan Indonesia')).toBeInTheDocument();
    expect(screen.getByText('Bikin Indonesia Berdaya')).toBeInTheDocument();
    expect(screen.getByText('Unit Penunjang')).toBeInTheDocument();
  });

  it('links each entity card to its locale-prefixed detail page', () => {
    render(<EntityCards locale="en" />);
    expect(screen.getByText('GreenLab').closest('a')).toHaveAttribute(
      'href',
      '/en/entitas/greenlab'
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/home/entity-cards.test.tsx`
Expected: FAIL — `Cannot find module './entity-cards'`.

- [ ] **Step 3: Implement EntityCards**

```tsx
// src/components/home/entity-cards.tsx
import { getCollection } from '@/lib/content';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import type { EntityEntry } from '@/lib/content-types';

export function EntityCards({ locale }: { locale: string }) {
  const entities = getCollection<EntityEntry>('entities')
    .map((entry) => entry.data)
    .sort((a, b) => a.urutan - b.urutan);

  const core = entities.filter((entity) => entity.lini === 'inti');
  const supporting = entities.filter((entity) => entity.lini === 'penunjang');

  return (
    <Section>
      <Reveal>
        <h2 className="font-display text-h2 text-ink">Entitas Kami</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {core.map((entity) => (
            <EntityCard key={entity.slug} entity={entity} locale={locale} />
          ))}
        </div>
        {supporting.length > 0 ? (
          <div className="mt-6 border-t border-line pt-6">
            <p className="font-mono text-label uppercase text-slate">Unit Penunjang</p>
            <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {supporting.map((entity) => (
                <EntityCard key={entity.slug} entity={entity} locale={locale} />
              ))}
            </div>
          </div>
        ) : null}
      </Reveal>
    </Section>
  );
}

function EntityCard({ entity, locale }: { entity: EntityEntry; locale: string }) {
  return (
    <a
      href={`/${locale}/entitas/${entity.slug}`}
      className="block rounded-[14px] border border-line p-6 transition-shadow hover:shadow-sm"
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: entity.warnaAksen }}
        aria-hidden="true"
      />
      <p className="mt-3 font-display text-h3 text-ink">{entity.nama}</p>
      <p className="mt-1 text-small text-slate">{entity.deskripsi}</p>
    </a>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/home/entity-cards.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add entity cards section"
```

---

### Task 5: Business pillars

**Files:**
- Create: `src/components/home/business-pillars.tsx`
- Test: `src/components/home/business-pillars.test.tsx`

**Interfaces:**
- Consumes: `Section`, `Reveal`, `PillarEntry`, real `content/pillars` (Task 2)
- Produces: `BusinessPillars()` from `@/components/home/business-pillars`, used by Task 12

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/home/business-pillars.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BusinessPillars } from './business-pillars';

describe('BusinessPillars', () => {
  it('renders all 4 pillars in chain order with numbered labels', () => {
    render(<BusinessPillars />);
    const order = [
      'Konsultasi Lingkungan',
      'Pengujian & Sampling',
      'Pelatihan Kompetensi',
      'Sertifikasi Profesi',
    ];
    order.forEach((name) => expect(screen.getByText(name)).toBeInTheDocument());
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/home/business-pillars.test.tsx`
Expected: FAIL — `Cannot find module './business-pillars'`.

- [ ] **Step 3: Implement BusinessPillars**

```tsx
// src/components/home/business-pillars.tsx
import { getCollection } from '@/lib/content';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import type { PillarEntry } from '@/lib/content-types';

export function BusinessPillars() {
  const pillars = getCollection<PillarEntry>('pillars')
    .map((entry) => entry.data)
    .sort((a, b) => a.urutan - b.urutan);

  return (
    <Section className="bg-stone">
      <Reveal>
        <h2 className="font-display text-h2 text-ink">Pilar Bisnis</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div key={pillar.slug} className="rounded-[14px] border border-line bg-paper p-6">
              <p className="font-mono text-label uppercase text-slate">
                {String(pillar.urutan).padStart(2, '0')}
              </p>
              <p className="mt-2 font-display text-h3 text-ink">{pillar.nama}</p>
              <p className="mt-1 text-small text-slate">{pillar.deskripsi}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/home/business-pillars.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add business pillars section"
```

---

### Task 6: Country map teaser (empty-state-first)

**Files:**
- Create: `src/components/home/country-map.tsx`
- Create: `src/components/home/country-map-section.tsx`
- Test: `src/components/home/country-map.test.tsx`
- Test: `src/components/home/country-map-section.test.tsx`

**Interfaces:**
- Consumes: `Section`, `Reveal`, `ProjectPin` (Task 1)
- Produces: `CountryMapSection()` from `@/components/home/country-map-section`, used by Task 12. `CountryMap({ pins: ProjectPin[] })` from `@/components/home/country-map` is the reusable pin-plotting primitive Fase 5's `/proyek` page will also use.

`content/projects` doesn't exist yet (that collection is populated in Fase 5, per project.md's roadmap). `getCollection` already returns `[]` for a missing directory (built in Fase 1), so this section will show its empty state on the live site today — by design, not as a bug. The pin-rendering mechanism itself is built and tested now against fixture coordinates so Fase 5 only needs to add content files.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/home/country-map.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CountryMap } from './country-map';

describe('CountryMap', () => {
  it('renders an honest empty state when there are no pins', () => {
    render(<CountryMap pins={[]} />);
    expect(
      screen.getByText('Peta jejak proyek akan tersedia setelah data 10 negara lengkap.')
    ).toBeInTheDocument();
  });

  it('renders a pin per project and shows a tooltip on hover', async () => {
    const user = userEvent.setup();
    render(
      <CountryMap
        pins={[{ judul: 'Proyek Uji', negara: 'Negara Uji', koordinat: [106.8, -6.2] }]}
      />
    );

    const pin = screen.getByRole('button', { name: 'Proyek Uji, Negara Uji' });
    await user.hover(pin);

    expect(screen.getByText('Proyek Uji')).toBeInTheDocument();
    expect(screen.getByText('Negara Uji')).toBeInTheDocument();
  });
});
```

```tsx
// src/components/home/country-map-section.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CountryMapSection } from './country-map-section';

describe('CountryMapSection', () => {
  it('shows the honest empty state since content/projects has no entries yet', () => {
    render(<CountryMapSection />);
    expect(
      screen.getByText('Peta jejak proyek akan tersedia setelah data 10 negara lengkap.')
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/home/country-map.test.tsx src/components/home/country-map-section.test.tsx`
Expected: FAIL — both modules missing.

- [ ] **Step 3: Implement CountryMap**

```tsx
// src/components/home/country-map.tsx
'use client';

import { useState } from 'react';
import type { ProjectPin } from '@/lib/content-types';

function project([lng, lat]: [number, number]) {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 60;
  return { x, y };
}

export function CountryMap({ pins }: { pins: ProjectPin[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (pins.length === 0) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-[14px] border border-line bg-stone px-6 text-center">
        <p className="text-small text-slate">
          Peta jejak proyek akan tersedia setelah data 10 negara lengkap.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[280px] overflow-hidden rounded-[14px] border border-line bg-stone">
      <svg viewBox="0 0 100 60" className="h-full w-full" role="img" aria-label="Peta jejak proyek">
        {pins.map((pin, index) => {
          const { x, y } = project(pin.koordinat);
          return (
            <circle
              key={`${pin.negara}-${index}`}
              cx={x}
              cy={y}
              r={1.2}
              className="cursor-pointer fill-forest"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
              tabIndex={0}
              role="button"
              aria-label={`${pin.judul}, ${pin.negara}`}
            />
          );
        })}
      </svg>
      {activeIndex !== null ? (
        <div className="absolute bottom-4 left-4 rounded border border-line bg-paper px-3 py-2 text-small text-ink shadow-sm">
          <p className="font-medium">{pins[activeIndex].judul}</p>
          <p className="text-slate">{pins[activeIndex].negara}</p>
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Implement CountryMapSection**

```tsx
// src/components/home/country-map-section.tsx
import { getCollection } from '@/lib/content';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { CountryMap } from './country-map';
import type { ProjectPin } from '@/lib/content-types';

export function CountryMapSection() {
  const pins = getCollection<ProjectPin>('projects').map((entry) => entry.data);

  return (
    <Section>
      <Reveal>
        <h2 className="font-display text-h2 text-ink">Jejak di 10 Negara</h2>
        <div className="mt-8">
          <CountryMap pins={pins} />
        </div>
      </Reveal>
    </Section>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/components/home/country-map.test.tsx src/components/home/country-map-section.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add country map teaser section"
```

---

### Task 7: Green Business / CEO split (honest empty-state)

**Files:**
- Create: `src/components/home/green-business-split.tsx`
- Test: `src/components/home/green-business-split.test.tsx`

**Interfaces:**
- Consumes: `Section`, `Reveal`
- Produces: `GreenBusinessSplit()` from `@/components/home/green-business-split`, used by Task 12

Neither the Green Business manifesto text nor a CEO quote exists yet (confirmed earlier this session). Per the content honesty rule, this renders an honest placeholder notice rather than invented brand copy or a fabricated quote attributed to a real person.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/home/green-business-split.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GreenBusinessSplit } from './green-business-split';

describe('GreenBusinessSplit', () => {
  it('renders honest placeholders for both the manifesto and the CEO quote', () => {
    render(<GreenBusinessSplit />);
    expect(
      screen.getByText('Manifesto Green Business akan segera hadir di sini.')
    ).toBeInTheDocument();
    expect(screen.getByText('Kutipan pesan CEO menyusul.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/home/green-business-split.test.tsx`
Expected: FAIL — `Cannot find module './green-business-split'`.

- [ ] **Step 3: Implement GreenBusinessSplit**

```tsx
// src/components/home/green-business-split.tsx
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';

export function GreenBusinessSplit() {
  return (
    <Section className="bg-stone">
      <Reveal>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-[14px] border border-line bg-paper p-8">
            <p className="font-mono text-label uppercase text-slate">Green Business</p>
            <p className="mt-3 text-body text-ink">
              Manifesto Green Business akan segera hadir di sini.
            </p>
          </div>
          <div className="rounded-[14px] border border-line bg-paper p-8">
            <p className="font-mono text-label uppercase text-slate">Pesan Pimpinan</p>
            <p className="mt-3 text-body text-ink">Kutipan pesan CEO menyusul.</p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/home/green-business-split.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Green Business / CEO split section"
```

---

### Task 8: News cards (honest empty-state)

**Files:**
- Create: `src/components/home/news-cards.tsx`
- Test: `src/components/home/news-cards.test.tsx`

**Interfaces:**
- Consumes: `Section`, `Reveal`, `PostSummary` (Task 1)
- Produces: `NewsCards({ locale: string })` from `@/components/home/news-cards`, used by Task 12

`content/posts` doesn't exist yet — Fase 5 populates it. This renders an honest empty state today, and a real 3-card grid once posts exist, with no code changes needed later.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/home/news-cards.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NewsCards } from './news-cards';

describe('NewsCards', () => {
  it('renders an honest empty state since content/posts has no entries yet', () => {
    render(<NewsCards locale="id" />);
    expect(screen.getByText('Belum ada berita terbaru.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/home/news-cards.test.tsx`
Expected: FAIL — `Cannot find module './news-cards'`.

- [ ] **Step 3: Implement NewsCards**

```tsx
// src/components/home/news-cards.tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/home/news-cards.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add news cards section"
```

---

### Task 9: Contact CTA

**Files:**
- Create: `src/components/home/cta-section.tsx`
- Test: `src/components/home/cta-section.test.tsx`

**Interfaces:**
- Consumes: `Section`, `Reveal`, `next/link`
- Produces: `CTASection({ locale: string })` from `@/components/home/cta-section`, used by Task 12

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/home/cta-section.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CTASection } from './cta-section';

describe('CTASection', () => {
  it('renders the headline and a locale-prefixed contact link', () => {
    render(<CTASection locale="en" />);
    expect(
      screen.getByText('Mari berdiskusi tentang kebutuhan Anda')
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Hubungi Kami' })).toHaveAttribute(
      'href',
      '/en/kontak'
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/home/cta-section.test.tsx`
Expected: FAIL — `Cannot find module './cta-section'`.

- [ ] **Step 3: Implement CTASection**

```tsx
// src/components/home/cta-section.tsx
import Link from 'next/link';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';

export function CTASection({ locale }: { locale: string }) {
  return (
    <Section className="bg-forest">
      <Reveal>
        <div className="text-center">
          <h2 className="font-display text-h2 text-paper">
            Mari berdiskusi tentang kebutuhan Anda
          </h2>
          <p className="mt-3 text-body text-paper/80">
            Hubungi tim kami untuk konsultasi, pengujian, pelatihan, atau sertifikasi.
          </p>
          <Link
            href={`/${locale}/kontak`}
            className="mt-6 inline-block rounded-[14px] bg-paper px-6 py-3 text-small font-medium text-forest hover:bg-stone"
          >
            Hubungi Kami
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/home/cta-section.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add contact CTA section"
```

---

### Task 10: Hero slide content + placeholder assets

**Files:**
- Create: `content/hero/slide-1.mdx`, `content/hero/slide-2.mdx`
- Create: `public/hero/slide-1.svg`, `public/hero/slide-2.svg`
- Test: `src/lib/hero-content.test.ts`

**Interfaces:**
- Consumes: `getCollection`, `HeroSlideEntry` (Task 1)
- Produces: real `content/hero` data and placeholder image assets consumed by Task 11

No real hero photography/video exists yet (confirmed earlier this session — production is a separate, non-technical workstream). These two slides use plain gradient-fill SVGs in the brand palette as an honest visual placeholder — clearly abstract, not pretending to be photography — so the slider mechanism (Task 11) has real files to render against. Copy is grounded only in facts already confirmed in `project.md`: the group name, its 5-entity structure, and the "10 negara" fact stated in the sitemap itself (§3) — no invented numbers, client names, or claims. Flag this copy for marketing/brand review before real launch.

- [ ] **Step 1: Hero slide content**

```yaml
# content/hero/slide-1.mdx
---
type: image
src: /hero/slide-1.svg
eyebrow: Environesia Company Group
headline: Satu grup, lima entitas, satu tujuan lingkungan
subheadline: Konsultasi, pengujian, pelatihan, dan sertifikasi lingkungan dalam satu rantai layanan terintegrasi.
ctaLabel: Lihat Entitas Kami
ctaUrl: /entitas
urutan: 1
---
```

```yaml
# content/hero/slide-2.mdx
---
type: image
src: /hero/slide-2.svg
eyebrow: Jejak di 10 Negara
headline: Mendukung proyek lingkungan lintas negara
subheadline: Dari konsultasi hingga sertifikasi, tim kami hadir di berbagai lokasi proyek klien korporat dan instansi.
ctaLabel: Lihat Proyek
ctaUrl: /proyek
urutan: 2
---
```

- [ ] **Step 2: Placeholder gradient assets**

```xml
<!-- public/hero/slide-1.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0F4C3A" />
      <stop offset="100%" stop-color="#10221C" />
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#g1)" />
</svg>
```

```xml
<!-- public/hero/slide-2.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2F7D5E" />
      <stop offset="100%" stop-color="#0F4C3A" />
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#g2)" />
</svg>
```

- [ ] **Step 3: Write the test proving the content reads correctly**

```ts
// src/lib/hero-content.test.ts
import { describe, expect, it } from 'vitest';
import { getCollection } from './content';
import type { HeroSlideEntry } from './content-types';

describe('hero content', () => {
  it('reads 2 slides sorted by urutan with the expected fields', () => {
    const slides = getCollection<HeroSlideEntry>('hero')
      .map((e) => e.data)
      .sort((a, b) => a.urutan - b.urutan);

    expect(slides).toHaveLength(2);
    expect(slides[0]).toMatchObject({
      type: 'image',
      src: '/hero/slide-1.svg',
      ctaUrl: '/entitas',
    });
    expect(slides[1]).toMatchObject({
      type: 'image',
      src: '/hero/slide-2.svg',
      ctaUrl: '/proyek',
    });
  });
});
```

- [ ] **Step 4: Run and verify**

Run: `npx vitest run src/lib/hero-content.test.ts`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add hero slide content and placeholder assets"
```

---

### Task 11: Hero slider component

**Files:**
- Create: `src/components/home/hero-slider.tsx`
- Create: `src/components/home/hero-section.tsx`
- Modify: `src/app/globals.css` (add `@keyframes kenburns`)
- Test: `src/components/home/hero-slider.test.tsx`

**Interfaces:**
- Consumes: `HeroSlideEntry` (Task 1), real `content/hero` (Task 10), `getCollection`
- Produces: `HeroSection({ locale: string })` from `@/components/home/hero-section`, used by Task 12

Implements project.md §5 in full: crossfade 800ms between slides, images display 6s with Ken Burns 1→1.08, video plays to completion or 15s max, a clickable progress bar per slide, pause on hover/focus, the whole slide clickable to `ctaUrl`, `prefers-reduced-motion` → static first slide with manual controls only, `srcMobile` substitution + `navigator.connection.saveData` swaps video for poster on mobile, and only the next slide is preloaded.

- [ ] **Step 1: Add the Ken Burns keyframes**

Append to `src/app/globals.css`:

```css
@keyframes kenburns {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.08);
  }
}
```

- [ ] **Step 2: Write the failing test**

```tsx
// src/components/home/hero-slider.test.tsx
import { act } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { HeroSlider } from './hero-slider';

const slides = [
  {
    type: 'image' as const,
    src: '/hero/slide-1.svg',
    eyebrow: 'Eyebrow Satu',
    headline: 'Headline Satu',
    subheadline: 'Sub satu',
    ctaLabel: 'CTA Satu',
    ctaUrl: '/entitas',
    urutan: 1,
  },
  {
    type: 'image' as const,
    src: '/hero/slide-2.svg',
    eyebrow: 'Eyebrow Dua',
    headline: 'Headline Dua',
    subheadline: 'Sub dua',
    ctaLabel: 'CTA Dua',
    ctaUrl: '/proyek',
    urutan: 2,
  },
];

describe('HeroSlider', () => {
  it('renders nothing when there are no slides', () => {
    const { container } = render(<HeroSlider slides={[]} locale="id" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the first slide as active and the rest hidden from assistive tech', () => {
    render(<HeroSlider slides={slides} locale="id" />);
    expect(screen.getByText('Headline Satu').closest('[aria-hidden]')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
    expect(screen.getByText('Headline Dua').closest('[aria-hidden]')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('has a locale-prefixed CTA link on the active slide', () => {
    render(<HeroSlider slides={slides} locale="id" />);
    expect(screen.getByRole('link', { name: /CTA Satu/ })).toHaveAttribute(
      'href',
      '/id/entitas'
    );
  });

  it('jumps to a slide when its progress control is clicked', async () => {
    const user = userEvent.setup();
    render(<HeroSlider slides={slides} locale="id" />);

    await user.click(screen.getByRole('button', { name: 'Slide 2' }));

    expect(screen.getByText('Headline Dua').closest('[aria-hidden]')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
    expect(screen.getByText('Headline Satu').closest('[aria-hidden]')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('advances to the next slide automatically after the image duration', () => {
    vi.useFakeTimers();
    render(<HeroSlider slides={slides} locale="id" />);

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.getByText('Headline Dua').closest('[aria-hidden]')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
    vi.useRealTimers();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/components/home/hero-slider.test.tsx`
Expected: FAIL — `Cannot find module './hero-slider'`.

- [ ] **Step 4: Implement HeroSlider**

```tsx
// src/components/home/hero-slider.tsx
'use client';

import { useEffect, useState } from 'react';
import type { HeroSlideEntry } from '@/lib/content-types';

const IMAGE_DURATION_MS = 6000;
const MAX_VIDEO_DURATION_MS = 15000;
const CROSSFADE_MS = 800;

export function HeroSlider({ slides, locale }: { slides: HeroSlideEntry[]; locale: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [useMobileSrc, setUseMobileSrc] = useState(false);
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const onMotionChange = () => setReducedMotion(motionQuery.matches);
    motionQuery.addEventListener('change', onMotionChange);

    const widthQuery = window.matchMedia('(max-width: 767px)');
    setUseMobileSrc(widthQuery.matches);
    const onWidthChange = () => setUseMobileSrc(widthQuery.matches);
    widthQuery.addEventListener('change', onWidthChange);

    // @ts-expect-error non-standard API, absent in most browsers
    setSaveData(navigator.connection?.saveData === true);

    return () => {
      motionQuery.removeEventListener('change', onMotionChange);
      widthQuery.removeEventListener('change', onWidthChange);
    };
  }, []);

  const current = slides[index];

  useEffect(() => {
    if (!current || reducedMotion || paused || slides.length <= 1 || current.type === 'video') {
      return;
    }

    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, IMAGE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [index, paused, reducedMotion, slides.length, current]);

  useEffect(() => {
    if (!current || reducedMotion || paused || current.type !== 'video') return;

    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, MAX_VIDEO_DURATION_MS);

    return () => clearTimeout(timer);
  }, [index, paused, reducedMotion, current]);

  if (slides.length === 0) {
    return null;
  }

  const nextSlide = slides[(index + 1) % slides.length];

  return (
    <section
      className="relative h-[80vh] min-h-[480px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <link rel="preload" as="image" href={nextSlide.src} />
      {slides.map((slide, i) => {
        const isActive = i === index;
        const src = useMobileSrc && slide.srcMobile ? slide.srcMobile : slide.src;
        const showVideo = slide.type === 'video' && !(useMobileSrc && saveData);
        const kenBurnsClass =
          !reducedMotion && isActive ? 'animate-[kenburns_6s_ease-out_forwards]' : '';

        return (
          <div
            key={slide.headline}
            className="absolute inset-0 transition-opacity"
            style={{
              opacity: isActive ? 1 : 0,
              transitionDuration: `${CROSSFADE_MS}ms`,
              pointerEvents: isActive ? 'auto' : 'none',
            }}
            aria-hidden={!isActive}
          >
            {showVideo ? (
              <video
                className={`h-full w-full object-cover ${kenBurnsClass}`}
                src={slide.src}
                poster={slide.poster}
                muted
                autoPlay={isActive && !paused && !reducedMotion}
                playsInline
                preload="metadata"
                onEnded={() => setIndex((prev) => (prev + 1) % slides.length)}
              />
            ) : (
              <img src={src} alt="" className={`h-full w-full object-cover ${kenBurnsClass}`} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,20,16,0.45)] to-transparent" />
            <a
              href={`/${locale}${slide.ctaUrl}`}
              className="absolute inset-0 flex flex-col items-start justify-end p-8 md:p-16"
            >
              <p className="font-mono text-label uppercase text-paper">{slide.eyebrow}</p>
              <h1 className="mt-3 max-w-2xl font-display text-display text-paper">
                {slide.headline}
              </h1>
              <p className="mt-3 max-w-xl text-body text-paper/90">{slide.subheadline}</p>
              <span className="mt-6 inline-block rounded-[14px] bg-paper px-6 py-3 text-small font-medium text-forest">
                {slide.ctaLabel}
              </span>
            </a>
          </div>
        );
      })}
      {slides.length > 1 && !reducedMotion ? (
        <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-4">
          {slides.map((slide, i) => (
            <button
              key={slide.headline}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className="h-1 flex-1 rounded-full bg-paper/40"
            >
              <span
                className="block h-full rounded-full bg-paper transition-all"
                style={{ width: i <= index ? '100%' : '0%' }}
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
```

- [ ] **Step 5: Implement HeroSection**

```tsx
// src/components/home/hero-section.tsx
import { getCollection } from '@/lib/content';
import { HeroSlider } from './hero-slider';
import type { HeroSlideEntry } from '@/lib/content-types';

export function HeroSection({ locale }: { locale: string }) {
  const slides = getCollection<HeroSlideEntry>('hero')
    .map((entry) => entry.data)
    .sort((a, b) => a.urutan - b.urutan);

  return <HeroSlider slides={slides} locale={locale} />;
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run src/components/home/hero-slider.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add hero slider component"
```

---

### Task 12: Assemble the homepage

**Files:**
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `HeroSection`, `KeyStatsSection`, `EntityCards`, `BusinessPillars`, `CountryMapSection`, `GreenBusinessSplit`, `NewsCards`, `CTASection` — all previous tasks
- Produces: the finished Fase 2 deliverable

- [ ] **Step 1: Replace the Fase 1 stub with the full section assembly, in spec order**

```tsx
// src/app/[locale]/page.tsx
import { HeroSection } from '@/components/home/hero-section';
import { KeyStatsSection } from '@/components/home/key-stats-section';
import { EntityCards } from '@/components/home/entity-cards';
import { BusinessPillars } from '@/components/home/business-pillars';
import { CountryMapSection } from '@/components/home/country-map-section';
import { GreenBusinessSplit } from '@/components/home/green-business-split';
import { NewsCards } from '@/components/home/news-cards';
import { CTASection } from '@/components/home/cta-section';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <>
      <HeroSection locale={locale} />
      <KeyStatsSection />
      <EntityCards locale={locale} />
      <BusinessPillars />
      <CountryMapSection />
      <GreenBusinessSplit />
      <NewsCards locale={locale} />
      <CTASection locale={locale} />
    </>
  );
}
```

- [ ] **Step 2: Full verification — build**

Run: `npm run build`
Expected: succeeds, `/id` and `/en` both build cleanly.

- [ ] **Step 3: Full verification — all tests**

Run: `npm run test`
Expected: PASS — every suite from Tasks 1–11 green (Reveal, homepage content, hero content, key stats, entity cards, business pillars, country map ×2, green business split, news cards, CTA, hero slider), plus every Fase 1 suite still green.

- [ ] **Step 4: Full verification — runtime check**

```bash
npm run dev &
sleep 3
curl -s http://localhost:3000/id | grep -o 'Satu grup, lima entitas'
curl -s http://localhost:3000/id | grep -o 'Entitas Kami'
curl -s http://localhost:3000/id | grep -o 'Pilar Bisnis'
curl -s http://localhost:3000/id | grep -o 'Berita &amp; Insight\|Berita & Insight'
kill %1
```

Expected: every grep prints a match — hero headline, entity section, pillars section, and news section all render on the live homepage.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: assemble Fase 2 homepage"
```

---

## Fase 2 exit criteria

- `npm run build` and `npm run test` both pass.
- Homepage renders all 8 sections in spec order: Hero, Angka kunci, Entitas kami, Pilar bisnis, Jejak di 10 negara, Split manifesto/CEO, Berita, CTA.
- Real data renders where confirmed: 5 entity cards (4 core + 1 visually separated supporting), 4 pillars in chain order, 2 real key stats.
- Every section without confirmed data shows an honest, specific empty-state message — no fabricated countries, no fabricated CEO quote, no fabricated news.
- Hero slider is fully functional per project.md §5 (crossfade, Ken Burns, progress bar, pause on hover/focus, reduced-motion fallback, mobile/saveData handling, preload-next-only) against 2 placeholder gradient slides.
- `CountryMap` is a proven, tested, reusable primitive ready for Fase 5 to feed real pin data into.
