# Fase 3 — Entitas & Bisnis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the entity and business sections — `/entitas` (overview with the group-structure diagram), five `/entitas/[slug]` detail pages, `/bisnis` (pillar overview), and four `/bisnis/[pilar]` detail pages — and close Fase 2's outstanding `generateMetadata` gap before eleven new pages make retrofitting it expensive.

**Architecture:** All eleven pages are Server Components rendering from the `entities` and `pillars` collections already populated in Fase 2 — no new content authoring is required for the pages to work. Two dynamic routes (`/entitas/[slug]`, `/bisnis/[pilar]`) use `generateStaticParams` so every page prerenders. A shared `src/lib/metadata.ts` helper builds per-page `Metadata` objects (title, description, canonical, hreflang), used by every page including the homepage. The group-structure diagram is a static inline SVG Server Component — no client JS, consistent with the spec's preference for a static SVG map over a mapping library.

**Tech Stack:** Unchanged from Fase 2 (Next.js 15, Tailwind v4, next-intl, framer-motion via `Reveal`, MDX-in-repo via `getCollection`, Vitest/RTL). No new dependencies.

**Spec:** `/home/doly/company-profile-egc/project.md` — §2 (group structure and the entity table), §3 (sitemap), §4 (design direction: entity accent colors used only as chips / a 3px accent line / project tags, never full section backgrounds), §7 (content model), §8 (SEO: "metadata per halaman via generateMetadata").

## Global Constraints

- Next.js 15, App Router, TypeScript strict mode.
- **Default Server Component. This entire plan adds ZERO `'use client'` files.** Every page and component here is a Server Component; motion comes from reusing the existing `Reveal` client primitive, never from new client code.
- All section vertical padding comes from the existing `<Section>` component. No ad-hoc `py-*` on page-level containers.
- Entity accent colors (`warnaAksen`) may be used ONLY as: a small chip/dot, a 3px accent line on that entity's own page, and tags. **Never as a full section background** (project.md §4).
- **Writing rule (project.md §2, non-negotiable):** Bikin Indonesia Berdaya (`lini: penunjang`) must never appear in the same visual row or sequence as the four core environmental entities, and no narrative may claim it is part of the "rantai terpadu". On its own page it stands fully as a konveksi business.
- Cards: `border: 1px solid var(--line)`, `border-radius: 14px`, no `box-shadow` except a subtle hover one.
- Never render heading text below 20px.
- Locale-prefixed links use the established hand-rolled convention (`next/link` + `/${locale}${path}` interpolation), NOT next-intl's `createNavigation` — that migration is standing Fase 1 technical debt, deliberately out of scope here.
- **Content honesty rule:** `layanan: []` is empty for every entity and pillar, and `legalitas` numbers are marked "menyusul". Pages must render honest empty states for missing data — never invented service lists, accreditation numbers, client names, or history.
- **MDX bodies are NOT rendered in this phase.** `getCollection` returns a `content` string, but every content file currently has an empty body and no MDX renderer is installed. Adding `next-mdx-remote`/`@next/mdx` for content that does not exist is scope creep; the pages read frontmatter only. Wire body rendering in the phase that first authors real body copy.

---

### Task 1: Per-page metadata infrastructure

**Files:**
- Create: `src/lib/metadata.ts`
- Test: `src/lib/metadata.test.ts`
- Modify: `src/app/[locale]/layout.tsx` (replace the static `metadata` export with a `generateMetadata` that sets a title template)
- Modify: `src/app/[locale]/page.tsx` (add `generateMetadata`)

**Interfaces:**
- Consumes: `routing` from `@/i18n/routing` (Fase 1)
- Produces: `buildMetadata({ title, description, locale, path })` from `@/lib/metadata`, returning a Next `Metadata` object with `title`, `description`, `alternates.canonical`, `alternates.languages` (both locales), and `openGraph`. Every page in Tasks 2–5 uses it.

This closes the gap Fase 2's final review flagged: project.md §8 requires "metadata per halaman via generateMetadata", and the layout currently exports only a static, non-locale-aware title. Doing it now costs one task; doing it after eleven more pages exist means editing twelve files.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/metadata.test.ts
import { describe, expect, it } from 'vitest';
import { buildMetadata } from './metadata';

describe('buildMetadata', () => {
  it('builds title, description, and canonical for a locale-prefixed path', () => {
    const meta = buildMetadata({
      title: 'Entitas Kami',
      description: 'Lima entitas dalam satu grup.',
      locale: 'id',
      path: '/entitas',
    });

    expect(meta.title).toBe('Entitas Kami');
    expect(meta.description).toBe('Lima entitas dalam satu grup.');
    expect(meta.alternates?.canonical).toBe('/id/entitas');
  });

  it('lists both locales as hreflang alternates for the same path', () => {
    const meta = buildMetadata({
      title: 'T',
      description: 'D',
      locale: 'en',
      path: '/bisnis',
    });

    expect(meta.alternates?.languages).toEqual({
      id: '/id/bisnis',
      en: '/en/bisnis',
    });
  });

  it('treats the site root as a bare locale path, not a trailing slash', () => {
    const meta = buildMetadata({ title: 'T', description: 'D', locale: 'id', path: '/' });
    expect(meta.alternates?.canonical).toBe('/id');
  });

  it('carries title and description into openGraph', () => {
    const meta = buildMetadata({ title: 'T', description: 'D', locale: 'id', path: '/entitas' });
    expect(meta.openGraph?.title).toBe('T');
    expect(meta.openGraph?.description).toBe('D');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/metadata.test.ts`
Expected: FAIL — `Cannot find module './metadata'`.

- [ ] **Step 3: Implement the helper**

```ts
// src/lib/metadata.ts
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

export const SITE_NAME = 'Environesia Company Group';

function localePath(locale: string, path: string) {
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

export function buildMetadata({
  title,
  description,
  locale,
  path,
}: {
  title: string;
  description: string;
  locale: string;
  path: string;
}): Metadata {
  const languages = Object.fromEntries(
    routing.locales.map((candidate) => [candidate, localePath(candidate, path)])
  );

  return {
    title,
    description,
    alternates: {
      canonical: localePath(locale, path),
      languages,
    },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      locale,
      type: 'website',
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/metadata.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Give the layout a title template**

In `src/app/[locale]/layout.tsx`, replace the existing static `export const metadata: Metadata = { title: 'Environesia Company Group' };` with:

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: {
      default: SITE_NAME,
      template: `%s — ${SITE_NAME}`,
    },
    description:
      'Grup layanan lingkungan terintegrasi: konsultasi, pengujian, pelatihan, dan sertifikasi.',
    openGraph: {
      siteName: SITE_NAME,
      locale,
      type: 'website',
    },
  };
}
```

Add `import { SITE_NAME } from '@/lib/metadata';` to the layout's imports. Keep the existing `Metadata` type import.

- [ ] **Step 6: Add homepage metadata**

In `src/app/[locale]/page.tsx`, add above the default export:

```tsx
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: 'Beranda',
    description:
      'Environesia Company Group menaungi empat entitas layanan lingkungan dan satu unit penunjang.',
    locale,
    path: '/',
  });
}
```

- [ ] **Step 7: Verify the rendered metadata**

```bash
npm run build
grep -o '<title>[^<]*</title>' .next/server/app/id.html
grep -o 'rel="canonical" href="[^"]*"' .next/server/app/id.html
```

Expected: the title contains `Beranda — Environesia Company Group`, and the canonical is `/id`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add per-page metadata via generateMetadata"
```

---

### Task 2: Group structure diagram

**Files:**
- Create: `src/components/entitas/group-structure-diagram.tsx`
- Test: `src/components/entitas/group-structure-diagram.test.tsx`

**Interfaces:**
- Consumes: `EntityEntry` from `@/lib/content-types`
- Produces: `GroupStructureDiagram({ entities }: { entities: EntityEntry[] })` from `@/components/entitas/group-structure-diagram` — a static inline SVG, no client JS. Used by Task 3.

Renders project.md §2's structure. The four core entities sit on one branch row connected by solid lines; Bikin Indonesia Berdaya hangs below on a **dashed** connector in its own row, visually encoding the writing rule that it is a supporting unit and not a fifth link in the chain.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/entitas/group-structure-diagram.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GroupStructureDiagram } from './group-structure-diagram';
import type { EntityEntry } from '@/lib/content-types';

const entities: EntityEntry[] = [
  { nama: 'Environesia', slug: 'environesia', lini: 'inti', warnaAksen: '#0F4C3A', deskripsi: 'Konsultasi lingkungan.', layanan: [], legalitas: [], urutan: 1 },
  { nama: 'GreenLab', slug: 'greenlab', lini: 'inti', warnaAksen: '#1E7A6B', deskripsi: 'Laboratorium & sampling.', layanan: [], legalitas: [], urutan: 2 },
  { nama: 'GreenSkill', slug: 'greenskill', lini: 'inti', warnaAksen: '#B07C25', deskripsi: 'Pelatihan kompetensi.', layanan: [], legalitas: [], urutan: 3 },
  { nama: 'LSP PLI', slug: 'lsp-praktisi-lingkungan', lini: 'inti', warnaAksen: '#454A85', deskripsi: 'Sertifikasi profesi.', layanan: [], legalitas: [], urutan: 4 },
  { nama: 'Bikin Indonesia Berdaya', slug: 'bikin-indonesia-berdaya', lini: 'penunjang', warnaAksen: '#A8482D', deskripsi: 'Konveksi custom apparel.', layanan: [], legalitas: [], urutan: 5 },
];

describe('GroupStructureDiagram', () => {
  it('renders the group name and every entity name', () => {
    render(<GroupStructureDiagram entities={entities} />);
    expect(screen.getByText('Environesia Group')).toBeInTheDocument();
    entities.forEach((entity) => {
      expect(screen.getByText(entity.nama)).toBeInTheDocument();
    });
  });

  it('has an accessible description of the structure', () => {
    render(<GroupStructureDiagram entities={entities} />);
    expect(screen.getByRole('img', { name: /struktur grup/i })).toBeInTheDocument();
  });

  it('connects the supporting entity with a dashed line, unlike the core entities', () => {
    const { container } = render(<GroupStructureDiagram entities={entities} />);
    const dashed = container.querySelectorAll('[stroke-dasharray]');
    expect(dashed).toHaveLength(1);
  });

  it('labels the supporting entity as a supporting unit', () => {
    render(<GroupStructureDiagram entities={entities} />);
    expect(screen.getByText('Unit Penunjang')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/entitas/group-structure-diagram.test.tsx`
Expected: FAIL — `Cannot find module './group-structure-diagram'`.

- [ ] **Step 3: Implement the diagram**

```tsx
// src/components/entitas/group-structure-diagram.tsx
import type { EntityEntry } from '@/lib/content-types';

const WIDTH = 960;
const CORE_Y = 150;
const BOX_W = 190;
const BOX_H = 74;

export function GroupStructureDiagram({ entities }: { entities: EntityEntry[] }) {
  const core = entities.filter((entity) => entity.lini === 'inti').sort((a, b) => a.urutan - b.urutan);
  const supporting = entities.filter((entity) => entity.lini === 'penunjang');

  const gap = (WIDTH - core.length * BOX_W) / (core.length + 1);
  const coreX = core.map((_, index) => gap + index * (BOX_W + gap));
  const centerX = WIDTH / 2;
  const supportingY = CORE_Y + BOX_H + 70;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${supportingY + BOX_H + 20}`}
      className="h-auto w-full"
      role="img"
      aria-label="Diagram struktur grup: Environesia Group membawahi empat entitas layanan lingkungan, dengan satu unit penunjang di bawahnya"
    >
      <rect
        x={centerX - BOX_W / 2}
        y={20}
        width={BOX_W}
        height={48}
        rx={10}
        className="fill-forest"
      />
      <text
        x={centerX}
        y={49}
        textAnchor="middle"
        className="fill-paper text-[15px] font-medium"
      >
        Environesia Group
      </text>

      <line x1={centerX} y1={68} x2={centerX} y2={104} className="stroke-line" strokeWidth={1.5} />
      <line
        x1={coreX[0] + BOX_W / 2}
        y1={104}
        x2={coreX[core.length - 1] + BOX_W / 2}
        y2={104}
        className="stroke-line"
        strokeWidth={1.5}
      />

      {core.map((entity, index) => (
        <g key={entity.slug}>
          <line
            x1={coreX[index] + BOX_W / 2}
            y1={104}
            x2={coreX[index] + BOX_W / 2}
            y2={CORE_Y}
            className="stroke-line"
            strokeWidth={1.5}
          />
          <rect
            x={coreX[index]}
            y={CORE_Y}
            width={BOX_W}
            height={BOX_H}
            rx={10}
            className="fill-paper stroke-line"
            strokeWidth={1}
          />
          <rect x={coreX[index]} y={CORE_Y} width={4} height={BOX_H} rx={2} fill={entity.warnaAksen} />
          <text x={coreX[index] + 18} y={CORE_Y + 30} className="fill-ink text-[14px] font-medium">
            {entity.nama}
          </text>
          <text x={coreX[index] + 18} y={CORE_Y + 52} className="fill-slate text-[12px]">
            {entity.deskripsi}
          </text>
        </g>
      ))}

      {supporting.map((entity) => (
        <g key={entity.slug}>
          <line
            x1={centerX}
            y1={CORE_Y + BOX_H}
            x2={centerX}
            y2={supportingY}
            className="stroke-line"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <rect
            x={centerX - BOX_W / 2}
            y={supportingY}
            width={BOX_W}
            height={BOX_H}
            rx={10}
            className="fill-paper stroke-line"
            strokeWidth={1}
          />
          <rect
            x={centerX - BOX_W / 2}
            y={supportingY}
            width={4}
            height={BOX_H}
            rx={2}
            fill={entity.warnaAksen}
          />
          <text x={centerX - BOX_W / 2 + 18} y={supportingY + 26} className="fill-slate text-[10px] uppercase tracking-[0.08em]">
            Unit Penunjang
          </text>
          <text x={centerX - BOX_W / 2 + 18} y={supportingY + 46} className="fill-ink text-[13px] font-medium">
            {entity.nama}
          </text>
          <text x={centerX - BOX_W / 2 + 18} y={supportingY + 64} className="fill-slate text-[11px]">
            {entity.deskripsi}
          </text>
        </g>
      ))}
    </svg>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/entitas/group-structure-diagram.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add group structure diagram"
```

---

### Task 3: `/entitas` overview page

**Files:**
- Create: `src/app/[locale]/entitas/page.tsx`
- Test: `src/app/[locale]/entitas/page.test.tsx`

**Interfaces:**
- Consumes: `getCollection`, `EntityEntry`, `Section`, `Reveal`, `buildMetadata` (Task 1), `GroupStructureDiagram` (Task 2)
- Produces: the `/[locale]/entitas` route

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/[locale]/entitas/page.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EntitasPage from './page';

describe('EntitasPage', () => {
  it('renders the heading, the diagram, and all five entities', async () => {
    render(await EntitasPage({ params: Promise.resolve({ locale: 'id' }) }));

    expect(screen.getByRole('heading', { level: 1, name: 'Entitas Kami' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /struktur grup/i })).toBeInTheDocument();

    ['Environesia', 'GreenLab', 'GreenSkill', 'LSP Praktisi Lingkungan Indonesia', 'Bikin Indonesia Berdaya'].forEach(
      (nama) => {
        expect(screen.getAllByText(nama).length).toBeGreaterThan(0);
      }
    );
  });

  it('links every entity to its locale-prefixed detail page', async () => {
    render(await EntitasPage({ params: Promise.resolve({ locale: 'en' }) }));
    const link = screen.getByRole('link', { name: /GreenLab/ });
    expect(link).toHaveAttribute('href', '/en/entitas/greenlab');
  });

  it('separates the supporting unit from the four core entities', async () => {
    render(await EntitasPage({ params: Promise.resolve({ locale: 'id' }) }));
    expect(screen.getAllByText('Unit Penunjang').length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/[locale]/entitas/page.test.tsx`
Expected: FAIL — `Cannot find module './page'`.

- [ ] **Step 3: Implement the page**

```tsx
// src/app/[locale]/entitas/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCollection } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { GroupStructureDiagram } from '@/components/entitas/group-structure-diagram';
import type { EntityEntry } from '@/lib/content-types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: 'Entitas Kami',
    description:
      'Empat entitas layanan lingkungan yang membentuk satu rantai terpadu, ditambah satu unit penunjang.',
    locale,
    path: '/entitas',
  });
}

export default async function EntitasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const entities = getCollection<EntityEntry>('entities')
    .map((entry) => entry.data)
    .sort((a, b) => a.urutan - b.urutan);

  const core = entities.filter((entity) => entity.lini === 'inti');
  const supporting = entities.filter((entity) => entity.lini === 'penunjang');

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">Struktur Grup</p>
          <h1 className="mt-4 font-display text-display text-ink">Entitas Kami</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">
            Empat entitas layanan lingkungan membentuk satu rantai berurutan: konsultasi, pengujian
            dan sampling, pelatihan kompetensi, lalu sertifikasi profesi. Satu unit penunjang
            menopang kebutuhan operasional grup.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <GroupStructureDiagram entities={entities} />
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <h2 className="font-display text-h2 text-ink">Lini Inti</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {core.map((entity) => (
              <EntityRow key={entity.slug} entity={entity} locale={locale} />
            ))}
          </div>

          {supporting.length > 0 ? (
            <div className="mt-12 border-t border-line pt-8">
              <p className="font-mono text-label uppercase text-slate">Unit Penunjang</p>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {supporting.map((entity) => (
                  <EntityRow key={entity.slug} entity={entity} locale={locale} />
                ))}
              </div>
            </div>
          ) : null}
        </Reveal>
      </Section>
    </>
  );
}

function EntityRow({ entity, locale }: { entity: EntityEntry; locale: string }) {
  return (
    <Link
      href={`/${locale}/entitas/${entity.slug}`}
      className="block rounded-[14px] border border-line p-6 transition-shadow hover:shadow-sm"
      aria-label={entity.nama}
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: entity.warnaAksen }}
        aria-hidden="true"
      />
      <p className="mt-3 font-display text-h3 text-ink">{entity.nama}</p>
      <p className="mt-1 text-small text-slate">{entity.deskripsi}</p>
    </Link>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/[locale]/entitas/page.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add entitas overview page"
```

---

### Task 4: `/entitas/[slug]` entity detail pages

**Files:**
- Create: `src/app/[locale]/entitas/[slug]/page.tsx`
- Test: `src/app/[locale]/entitas/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `getCollection`, `EntityEntry`, `Section`, `Reveal`, `buildMetadata`, `routing`
- Produces: five prerendered detail routes via `generateStaticParams`

Implements project.md §4's "garis aksen 3px di halaman entitas" — the entity's `warnaAksen` appears as a 3px rule under the page header and nowhere else. `layanan` is empty for every entity today, so the services block renders an honest empty state; the same code renders a real list the moment content is added.

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/[locale]/entitas/[slug]/page.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EntityDetailPage, { generateStaticParams } from './page';

describe('generateStaticParams', () => {
  it('returns a param set for every entity in both locales', () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(10);
    expect(params).toContainEqual({ locale: 'id', slug: 'greenlab' });
    expect(params).toContainEqual({ locale: 'en', slug: 'bikin-indonesia-berdaya' });
  });
});

describe('EntityDetailPage', () => {
  it('renders the entity name, description, and its accreditation', async () => {
    render(
      await EntityDetailPage({ params: Promise.resolve({ locale: 'id', slug: 'greenlab' }) })
    );

    expect(screen.getByRole('heading', { level: 1, name: 'GreenLab' })).toBeInTheDocument();
    expect(screen.getByText('Laboratorium & sampling.')).toBeInTheDocument();
    expect(screen.getByText(/KAN ISO\/IEC 17025/)).toBeInTheDocument();
  });

  it('renders an honest empty state when the services list is empty', async () => {
    render(
      await EntityDetailPage({ params: Promise.resolve({ locale: 'id', slug: 'greenskill' }) })
    );
    expect(screen.getByText('Rincian layanan akan segera hadir.')).toBeInTheDocument();
  });

  it('renders an honest empty state when there is no accreditation on file', async () => {
    render(
      await EntityDetailPage({ params: Promise.resolve({ locale: 'id', slug: 'environesia' }) })
    );
    expect(screen.getByText('Data legalitas akan segera hadir.')).toBeInTheDocument();
  });

  it('shows the website only for an entity that has one', async () => {
    render(
      await EntityDetailPage({ params: Promise.resolve({ locale: 'id', slug: 'greenlab' }) })
    );
    expect(screen.getByRole('link', { name: 'toolsgl.my.id' })).toHaveAttribute(
      'href',
      'https://toolsgl.my.id'
    );
  });

  it('links back to the entity overview with the active locale', async () => {
    render(
      await EntityDetailPage({ params: Promise.resolve({ locale: 'en', slug: 'greenlab' }) })
    );
    expect(screen.getByRole('link', { name: /Semua entitas/ })).toHaveAttribute(
      'href',
      '/en/entitas'
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "src/app/[locale]/entitas/[slug]/page.test.tsx"`
Expected: FAIL — `Cannot find module './page'`.

- [ ] **Step 3: Implement the page**

```tsx
// src/app/[locale]/entitas/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCollection } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import type { EntityEntry } from '@/lib/content-types';

function allEntities() {
  return getCollection<EntityEntry>('entities').map((entry) => entry.data);
}

function findEntity(slug: string) {
  return allEntities().find((entity) => entity.slug === slug);
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    allEntities().map((entity) => ({ locale, slug: entity.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const entity = findEntity(slug);

  if (!entity) {
    return buildMetadata({
      title: 'Entitas tidak ditemukan',
      description: 'Halaman entitas yang Anda cari tidak tersedia.',
      locale,
      path: `/entitas/${slug}`,
    });
  }

  return buildMetadata({
    title: entity.nama,
    description: entity.deskripsi,
    locale,
    path: `/entitas/${entity.slug}`,
  });
}

export default async function EntityDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const entity = findEntity(slug);

  if (!entity) {
    notFound();
  }

  return (
    <>
      <Section>
        <Reveal>
          <Link
            href={`/${locale}/entitas`}
            className="font-mono text-label uppercase text-slate hover:text-forest"
          >
            ← Semua entitas
          </Link>
          <h1 className="mt-6 font-display text-display text-ink">{entity.nama}</h1>
          <div
            className="mt-5 h-[3px] w-24 rounded-full"
            style={{ backgroundColor: entity.warnaAksen }}
            aria-hidden="true"
          />
          <p className="mt-6 max-w-2xl text-body text-slate">{entity.deskripsi}</p>
          {entity.website ? (
            <p className="mt-4">
              <a
                href={`https://${entity.website}`}
                className="font-mono text-label uppercase text-forest underline underline-offset-4"
                rel="noreferrer"
                target="_blank"
              >
                {entity.website}
              </a>
            </p>
          ) : null}
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-h3 text-ink">Layanan</h2>
              {entity.layanan.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {entity.layanan.map((layanan) => (
                    <li key={layanan} className="border-b border-line pb-2 text-small text-slate">
                      {layanan}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-small text-slate">Rincian layanan akan segera hadir.</p>
              )}
            </div>

            <div>
              <h2 className="font-display text-h3 text-ink">Legalitas & Akreditasi</h2>
              {entity.legalitas.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {entity.legalitas.map((item) => (
                    <li key={item} className="border-b border-line pb-2 text-small text-slate">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-small text-slate">Data legalitas akan segera hadir.</p>
              )}
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "src/app/[locale]/entitas/[slug]/page.test.tsx"`
Expected: PASS (6 tests).

- [ ] **Step 5: Verify all five pages prerender**

```bash
npm run build
ls .next/server/app/id/entitas/
```

Expected: HTML output for all five entity slugs.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add entity detail pages"
```

---

### Task 5: `/bisnis` overview and `/bisnis/[pilar]` detail pages

**Files:**
- Create: `src/app/[locale]/bisnis/page.tsx`
- Create: `src/app/[locale]/bisnis/[pilar]/page.tsx`
- Test: `src/app/[locale]/bisnis/page.test.tsx`
- Test: `src/app/[locale]/bisnis/[pilar]/page.test.tsx`

**Interfaces:**
- Consumes: `getCollection`, `PillarEntry`, `EntityEntry`, `Section`, `Reveal`, `buildMetadata`, `routing`
- Produces: the `/[locale]/bisnis` route plus four prerendered `/[locale]/bisnis/[pilar]` routes

The pillar detail page cross-links to the entity that delivers that pillar, using `entitasTerkait` (populated in Fase 2). Both pages are built in one task because the detail page's link target is defined by the overview's data shape — splitting them would put a reviewer in the position of approving a link scheme without seeing where it lands.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/app/[locale]/bisnis/page.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BisnisPage from './page';

describe('BisnisPage', () => {
  it('renders all four pillars in chain order with numbered labels', async () => {
    render(await BisnisPage({ params: Promise.resolve({ locale: 'id' }) }));

    expect(screen.getByRole('heading', { level: 1, name: 'Pilar Bisnis' })).toBeInTheDocument();
    ['Konsultasi Lingkungan', 'Pengujian & Sampling', 'Pelatihan Kompetensi', 'Sertifikasi Profesi'].forEach(
      (nama) => expect(screen.getByText(nama)).toBeInTheDocument()
    );
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
  });

  it('links each pillar to its locale-prefixed detail page', async () => {
    render(await BisnisPage({ params: Promise.resolve({ locale: 'en' }) }));
    expect(screen.getByRole('link', { name: /Pengujian & Sampling/ })).toHaveAttribute(
      'href',
      '/en/bisnis/pengujian-sampling'
    );
  });
});
```

```tsx
// src/app/[locale]/bisnis/[pilar]/page.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PillarDetailPage, { generateStaticParams } from './page';

describe('generateStaticParams', () => {
  it('returns a param set for every pillar in both locales', () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(8);
    expect(params).toContainEqual({ locale: 'id', pilar: 'konsultasi' });
    expect(params).toContainEqual({ locale: 'en', pilar: 'sertifikasi-profesi' });
  });
});

describe('PillarDetailPage', () => {
  it('renders the pillar name and description', async () => {
    render(
      await PillarDetailPage({
        params: Promise.resolve({ locale: 'id', pilar: 'pengujian-sampling' }),
      })
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Pengujian & Sampling' })
    ).toBeInTheDocument();
    expect(screen.getByText('Pengujian laboratorium dan sampling lapangan.')).toBeInTheDocument();
  });

  it('cross-links to the entity that delivers this pillar', async () => {
    render(
      await PillarDetailPage({
        params: Promise.resolve({ locale: 'id', pilar: 'pengujian-sampling' }),
      })
    );

    expect(screen.getByRole('link', { name: /GreenLab/ })).toHaveAttribute(
      'href',
      '/id/entitas/greenlab'
    );
  });

  it('renders an honest empty state when the services list is empty', async () => {
    render(
      await PillarDetailPage({ params: Promise.resolve({ locale: 'id', pilar: 'konsultasi' }) })
    );
    expect(screen.getByText('Rincian layanan akan segera hadir.')).toBeInTheDocument();
  });

  it('links back to the business overview with the active locale', async () => {
    render(
      await PillarDetailPage({ params: Promise.resolve({ locale: 'en', pilar: 'konsultasi' }) })
    );
    expect(screen.getByRole('link', { name: /Semua pilar/ })).toHaveAttribute('href', '/en/bisnis');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run "src/app/[locale]/bisnis/page.test.tsx" "src/app/[locale]/bisnis/[pilar]/page.test.tsx"`
Expected: FAIL — both modules missing.

- [ ] **Step 3: Implement the overview page**

```tsx
// src/app/[locale]/bisnis/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCollection } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import type { PillarEntry } from '@/lib/content-types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: 'Pilar Bisnis',
    description:
      'Empat pilar layanan lingkungan: konsultasi, pengujian dan sampling, pelatihan kompetensi, dan sertifikasi profesi.',
    locale,
    path: '/bisnis',
  });
}

export default async function BisnisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pillars = getCollection<PillarEntry>('pillars')
    .map((entry) => entry.data)
    .sort((a, b) => a.urutan - b.urutan);

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">Layanan</p>
          <h1 className="mt-4 font-display text-display text-ink">Pilar Bisnis</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">
            Empat pilar yang membentuk satu rantai layanan berurutan, dari perencanaan hingga
            pengakuan kompetensi.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {pillars.map((pillar) => (
              <Link
                key={pillar.slug}
                href={`/${locale}/bisnis/${pillar.slug}`}
                className="block rounded-[14px] border border-line bg-paper p-6 transition-shadow hover:shadow-sm"
              >
                <p className="font-mono text-label uppercase text-slate">
                  {String(pillar.urutan).padStart(2, '0')}
                </p>
                <p className="mt-2 font-display text-h3 text-ink">{pillar.nama}</p>
                <p className="mt-1 text-small text-slate">{pillar.deskripsi}</p>
              </Link>
            ))}
          </div>
        </Reveal>
      </Section>
    </>
  );
}
```

- [ ] **Step 4: Implement the detail page**

```tsx
// src/app/[locale]/bisnis/[pilar]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCollection } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import type { PillarEntry, EntityEntry } from '@/lib/content-types';

function allPillars() {
  return getCollection<PillarEntry>('pillars').map((entry) => entry.data);
}

function findPillar(slug: string) {
  return allPillars().find((pillar) => pillar.slug === slug);
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    allPillars().map((pillar) => ({ locale, pilar: pillar.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pilar: string }>;
}): Promise<Metadata> {
  const { locale, pilar } = await params;
  const pillar = findPillar(pilar);

  if (!pillar) {
    return buildMetadata({
      title: 'Pilar tidak ditemukan',
      description: 'Halaman pilar yang Anda cari tidak tersedia.',
      locale,
      path: `/bisnis/${pilar}`,
    });
  }

  return buildMetadata({
    title: pillar.nama,
    description: pillar.deskripsi,
    locale,
    path: `/bisnis/${pillar.slug}`,
  });
}

export default async function PillarDetailPage({
  params,
}: {
  params: Promise<{ locale: string; pilar: string }>;
}) {
  const { locale, pilar } = await params;
  const pillar = findPillar(pilar);

  if (!pillar) {
    notFound();
  }

  const entities = getCollection<EntityEntry>('entities').map((entry) => entry.data);
  const related = pillar.entitasTerkait
    .map((slug) => entities.find((entity) => entity.slug === slug))
    .filter((entity): entity is EntityEntry => Boolean(entity));

  return (
    <>
      <Section>
        <Reveal>
          <Link
            href={`/${locale}/bisnis`}
            className="font-mono text-label uppercase text-slate hover:text-forest"
          >
            ← Semua pilar
          </Link>
          <p className="mt-6 font-mono text-label uppercase text-slate">
            {String(pillar.urutan).padStart(2, '0')}
          </p>
          <h1 className="mt-2 font-display text-display text-ink">{pillar.nama}</h1>
          <p className="mt-6 max-w-2xl text-body text-slate">{pillar.deskripsi}</p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-h3 text-ink">Layanan</h2>
              {pillar.layanan.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {pillar.layanan.map((layanan) => (
                    <li key={layanan} className="border-b border-line pb-2 text-small text-slate">
                      {layanan}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-small text-slate">Rincian layanan akan segera hadir.</p>
              )}
            </div>

            <div>
              <h2 className="font-display text-h3 text-ink">Dijalankan Oleh</h2>
              {related.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {related.map((entity) => (
                    <Link
                      key={entity.slug}
                      href={`/${locale}/entitas/${entity.slug}`}
                      className="block rounded-[14px] border border-line bg-paper p-4 transition-shadow hover:shadow-sm"
                    >
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: entity.warnaAksen }}
                        aria-hidden="true"
                      />
                      <p className="mt-2 font-display text-h3 text-ink">{entity.nama}</p>
                      <p className="mt-1 text-small text-slate">{entity.deskripsi}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-small text-slate">Entitas terkait akan segera hadir.</p>
              )}
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run "src/app/[locale]/bisnis/page.test.tsx" "src/app/[locale]/bisnis/[pilar]/page.test.tsx"`
Expected: PASS (6 tests).

- [ ] **Step 6: Full verification**

```bash
npm run build
npm run test
ls .next/server/app/id/bisnis/
```

Expected: build succeeds with all eleven new routes prerendered; the full suite passes with every Fase 1 and Fase 2 suite still green.

- [ ] **Step 7: Runtime check**

```bash
npm run dev &
sleep 4
curl -s http://localhost:3000/id/entitas | grep -o 'Entitas Kami'
curl -s http://localhost:3000/id/entitas/greenlab | grep -o 'KAN ISO/IEC 17025'
curl -s http://localhost:3000/id/bisnis | grep -o 'Pilar Bisnis'
curl -s http://localhost:3000/id/bisnis/pengujian-sampling | grep -o 'Dijalankan Oleh'
kill %1
```

Expected: every grep prints a match. Kill the dev server afterwards — a leaked server has caused false-positive failures before.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add bisnis overview and pillar detail pages"
```

---

## Fase 3 exit criteria

- `npm run build` and `npm run test` both pass, with every Fase 1 and Fase 2 suite still green.
- Eleven new routes prerender in both locales: `/entitas`, five `/entitas/[slug]`, `/bisnis`, four `/bisnis/[pilar]`.
- Every page has its own title, description, canonical URL, and both-locale hreflang alternates via `generateMetadata` — closing the project.md §8 gap Fase 2 left open.
- The group-structure diagram renders the four core entities on one row and Bikin Indonesia Berdaya on a separate dashed branch, honoring project.md §2's writing rule.
- Entity accent colors appear only as chips, the 3px page rule, and the diagram's edge bars — never as a section background.
- Every field that has no confirmed data (`layanan`, missing `legalitas`) renders an honest empty state; nothing is invented.
- Zero new `'use client'` files.
