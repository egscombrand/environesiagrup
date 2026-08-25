# Fase 4 — Tentang Kami & Pimpinan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close project.md §8's remaining SEO gaps (sitemap, robots, JSON-LD Organization) now that 24 pages exist, then build the Tentang Kami and Pimpinan sections — real content where it exists, honest scaffolds with a consistent pending-content treatment where the client has not yet supplied copy.

**Architecture:** Two halves. First, site-wide SEO infrastructure: Next's file-based `sitemap.ts` and `robots.ts` at the app root, plus a JSON-LD `Organization` script injected once in the locale layout. Second, eight new page routes under `/tentang-kami` and `/pimpinan`, all Server Components. Because most of this section's copy does not exist yet, a single shared `<PendingContent>` component owns the "belum tersedia" treatment so eight pages cannot drift into eight different phrasings — the same consolidation the Fase 3 review asked for after the empty-state block was duplicated three times.

**Tech Stack:** Unchanged (Next.js 15, Tailwind v4, next-intl, `getCollection`, Vitest/RTL). No new dependencies.

**Spec:** `/home/doly/company-profile-egc/project.md` — §1 (group summary and audiences: the only real Tentang Kami copy that exists), §3 (sitemap), §7 (content model: `leadership`, `milestones`), §8 (SEO requirements), §10 (what is confirmed vs. pending).

## Global Constraints

- Next.js 15, App Router, TypeScript strict mode.
- **Zero `'use client'` files in this plan.** Every page and component here is a Server Component; motion reuses the existing `Reveal` client primitive.
- All section vertical padding from the shared `<Section>` component. No ad-hoc `py-*`.
- Every page gets `generateMetadata` via `buildMetadata` from `@/lib/metadata` (Fase 3 Task 1).
- Locale-prefixed links use the hand-rolled `next/link` + `/${locale}${path}` convention, NOT next-intl's `createNavigation` — standing Fase 1 technical debt, out of scope.
- **Content honesty rule, and it dominates this phase.** Per project.md §10, none of the following is confirmed: company history/milestones, vision and mission text, logo philosophy, org-chart personnel, awards, the Green Business manifesto, the CEO's message, or any director's name, photo, or biography. Pages for these render an honest pending state and **must not** invent a founding narrative, a mission statement, an executive name, a quote, or an award. Inventing a named person or a fabricated award on a real company's site is the most damaging failure available in this phase.
- `/pimpinan/pemegang-saham` is deliberately absent from the sitemap — the user decided shareholder composition is not published (project.md §3). Do not create it.
- `/pimpinan/komisaris` stays in the sitemap as an optional page pending confirmation that a board of commissioners exists (project.md §10). Build it as a pending scaffold, not as an assertion that the board exists.
- Never render heading text below 20px.
- MDX bodies are still not rendered (no MDX renderer installed, no body copy authored). Pages read frontmatter only.

---

### Task 1: SEO infrastructure — sitemap, robots, JSON-LD

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `src/lib/site.ts`
- Create: `src/components/seo/organization-jsonld.tsx`
- Test: `src/app/sitemap.test.ts`
- Test: `src/components/seo/organization-jsonld.test.tsx`
- Modify: `src/app/[locale]/layout.tsx` (render the JSON-LD once)

**Interfaces:**
- Consumes: `routing` from `@/i18n/routing`, `getCollection` from `@/lib/content`, `EntityEntry`/`PillarEntry` from `@/lib/content-types`
- Produces: `SITE_URL` and `OFFICE_ADDRESS` from `@/lib/site`; a `sitemap()` default export enumerating every static route in both locales; a `robots()` default export; `OrganizationJsonLd()` from `@/components/seo/organization-jsonld`

project.md §8 requires "sitemap.ts, robots.ts, JSON-LD Organization di root". None exist. This is fully actionable with zero new content, and 24 pages already benefit — the same reasoning that put `generateMetadata` into Fase 3's first task.

`SITE_URL` has no confirmed production domain yet (hosting is TBD per project.md §6), so it reads from `NEXT_PUBLIC_SITE_URL` with a clearly-marked placeholder default. That placeholder is a deployment TODO, not invented content — flag it in the report.

- [ ] **Step 1: Add the site constants**

```ts
// src/lib/site.ts

// No production domain is confirmed yet (hosting is TBD in project.md §6).
// Set NEXT_PUBLIC_SITE_URL at deploy time; the fallback is a placeholder that
// must not ship to production unreplaced.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.invalid';

export const OFFICE_ADDRESS = {
  streetAddress: 'Grha Environesia (Lantai 2), Jl. Jati Mataram No. 284B, Karangjati',
  addressLocality: 'Sinduadi, Mlati, Sleman',
  addressRegion: 'Daerah Istimewa Yogyakarta',
  postalCode: '55284',
  addressCountry: 'ID',
} as const;
```

- [ ] **Step 2: Write the failing sitemap test**

```ts
// src/app/sitemap.test.ts
import { describe, expect, it } from 'vitest';
import sitemap from './sitemap';

describe('sitemap', () => {
  it('includes the homepage for both locales', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain('https://example.invalid/id');
    expect(urls).toContain('https://example.invalid/en');
  });

  it('includes every entity detail page in both locales', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain('https://example.invalid/id/entitas/greenlab');
    expect(urls).toContain('https://example.invalid/en/entitas/bikin-indonesia-berdaya');
  });

  it('includes every pillar detail page in both locales', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain('https://example.invalid/id/bisnis/konsultasi');
    expect(urls).toContain('https://example.invalid/en/bisnis/sertifikasi-profesi');
  });

  it('never emits a duplicate url', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('gives the homepage a higher priority than a detail page', () => {
    const entries = sitemap();
    const home = entries.find((entry) => entry.url.endsWith('/id'));
    const detail = entries.find((entry) => entry.url.endsWith('/id/entitas/greenlab'));
    expect(home?.priority).toBeGreaterThan(detail?.priority ?? 1);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/app/sitemap.test.ts`
Expected: FAIL — `Cannot find module './sitemap'`.

- [ ] **Step 4: Implement the sitemap**

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getCollection } from '@/lib/content';
import { SITE_URL } from '@/lib/site';
import type { EntityEntry, PillarEntry } from '@/lib/content-types';

const STATIC_PATHS = [
  '/',
  '/entitas',
  '/bisnis',
  '/tentang-kami',
  '/tentang-kami/sejarah',
  '/tentang-kami/visi-misi',
  '/tentang-kami/makna-logo',
  '/tentang-kami/struktur-organisasi',
  '/tentang-kami/green-business',
  '/tentang-kami/penghargaan',
  '/pimpinan',
  '/pimpinan/direksi',
  '/pimpinan/komisaris',
];

function priorityFor(path: string) {
  if (path === '/') return 1;
  if (path.split('/').filter(Boolean).length === 1) return 0.8;
  return 0.6;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entitySlugs = getCollection<EntityEntry>('entities').map((entry) => entry.data.slug);
  const pillarSlugs = getCollection<PillarEntry>('pillars').map((entry) => entry.data.slug);

  const paths = [
    ...STATIC_PATHS,
    ...entitySlugs.map((slug) => `/entitas/${slug}`),
    ...pillarSlugs.map((slug) => `/bisnis/${slug}`),
  ];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${SITE_URL}/${locale}${path === '/' ? '' : path}`,
      changeFrequency: 'monthly' as const,
      priority: priorityFor(path),
    }))
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/app/sitemap.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 6: Implement robots**

```ts
// src/app/robots.ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 7: Write the failing JSON-LD test**

```tsx
// src/components/seo/organization-jsonld.test.tsx
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OrganizationJsonLd } from './organization-jsonld';

function parsePayload(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]');
  return JSON.parse(script?.textContent ?? '{}');
}

describe('OrganizationJsonLd', () => {
  it('describes the group as an Organization with its real address', () => {
    const { container } = render(<OrganizationJsonLd locale="id" />);
    const payload = parsePayload(container);

    expect(payload['@type']).toBe('Organization');
    expect(payload.name).toBe('Environesia Company Group');
    expect(payload.address.postalCode).toBe('55284');
    expect(payload.address.addressCountry).toBe('ID');
  });

  it('lists the five entities as subOrganizations', () => {
    const { container } = render(<OrganizationJsonLd locale="id" />);
    const payload = parsePayload(container);
    const names = payload.subOrganization.map((sub: { name: string }) => sub.name);

    expect(names).toHaveLength(5);
    expect(names).toContain('GreenLab');
    expect(names).toContain('Bikin Indonesia Berdaya');
  });

  it('points the canonical url at the active locale', () => {
    const { container } = render(<OrganizationJsonLd locale="en" />);
    expect(parsePayload(container).url).toBe('https://example.invalid/en');
  });
});
```

- [ ] **Step 8: Run test to verify it fails**

Run: `npx vitest run src/components/seo/organization-jsonld.test.tsx`
Expected: FAIL — `Cannot find module './organization-jsonld'`.

- [ ] **Step 9: Implement the JSON-LD component**

```tsx
// src/components/seo/organization-jsonld.tsx
import { getCollection } from '@/lib/content';
import { SITE_URL, OFFICE_ADDRESS } from '@/lib/site';
import { SITE_NAME } from '@/lib/metadata';
import type { EntityEntry } from '@/lib/content-types';

export function OrganizationJsonLd({ locale }: { locale: string }) {
  const entities = getCollection<EntityEntry>('entities')
    .map((entry) => entry.data)
    .sort((a, b) => a.urutan - b.urutan);

  const payload = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: `${SITE_URL}/${locale}`,
    address: {
      '@type': 'PostalAddress',
      ...OFFICE_ADDRESS,
    },
    subOrganization: entities.map((entity) => ({
      '@type': 'Organization',
      name: entity.nama,
      description: entity.deskripsi,
      url: `${SITE_URL}/${locale}/entitas/${entity.slug}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
```

`dangerouslySetInnerHTML` is the standard, documented way to emit JSON-LD in React — the payload is built from our own content files, never from user input.

- [ ] **Step 10: Run test to verify it passes**

Run: `npx vitest run src/components/seo/organization-jsonld.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 11: Render the JSON-LD in the layout**

In `src/app/[locale]/layout.tsx`, add `import { OrganizationJsonLd } from '@/components/seo/organization-jsonld';` and render it as the first child inside `<body>`, before the skip link:

```tsx
<OrganizationJsonLd locale={locale} />
```

- [ ] **Step 12: Verify the generated routes**

```bash
npm run build
curl -s http://localhost:3000/sitemap.xml >/dev/null 2>&1 || true
ls .next/server/app/sitemap.xml* .next/server/app/robots.txt* 2>&1
grep -o 'application/ld+json' .next/server/app/id.html
```

Expected: the sitemap and robots route files exist in the build output, and the JSON-LD script tag appears in the prerendered homepage.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: add sitemap, robots, and Organization JSON-LD"
```

---

### Task 2: Pending-content primitive and content types

**Files:**
- Create: `src/components/layout/pending-content.tsx`
- Test: `src/components/layout/pending-content.test.tsx`
- Modify: `src/lib/content-types.ts` (add `LeadershipEntry`, `MilestoneEntry`)

**Interfaces:**
- Consumes: `Section`, `Reveal`
- Produces: `PendingContent({ eyebrow, title, description, note })` from `@/components/layout/pending-content`; `LeadershipEntry` and `MilestoneEntry` types. Used by Tasks 3, 4, and 5.

Most of this phase's pages have no confirmed copy. One shared component owns that treatment so eight pages cannot drift into eight different phrasings — directly answering the Fase 3 review's finding that the list-or-empty-state block had already been duplicated three times.

- [ ] **Step 1: Add the content types**

Append to `src/lib/content-types.ts`:

```ts
export type LeadershipTipe = 'direksi' | 'komisaris';

export type LeadershipEntry = {
  nama: string;
  jabatan: string;
  entitas?: string;
  foto?: string;
  bio?: string;
  tipe: LeadershipTipe;
  urutan: number;
};

export type MilestoneEntry = {
  tahun: number;
  judul: string;
  deskripsi: string;
  gambar?: string;
  urutan: number;
};
```

- [ ] **Step 2: Write the failing test**

```tsx
// src/components/layout/pending-content.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PendingContent } from './pending-content';

describe('PendingContent', () => {
  it('renders the eyebrow, heading, and description', () => {
    render(
      <PendingContent
        eyebrow="Tentang Kami"
        title="Sejarah"
        description="Perjalanan grup dari tahun ke tahun."
      />
    );

    expect(screen.getByText('Tentang Kami')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Sejarah' })).toBeInTheDocument();
    expect(screen.getByText('Perjalanan grup dari tahun ke tahun.')).toBeInTheDocument();
  });

  it('states plainly that the content is not available yet', () => {
    render(<PendingContent eyebrow="E" title="T" description="D" />);
    expect(screen.getByText('Konten halaman ini sedang disiapkan.')).toBeInTheDocument();
  });

  it('renders an extra note when one is given', () => {
    render(
      <PendingContent eyebrow="E" title="T" description="D" note="Menunggu konfirmasi struktur." />
    );
    expect(screen.getByText('Menunggu konfirmasi struktur.')).toBeInTheDocument();
  });

  it('omits the note element entirely when none is given', () => {
    const { container } = render(<PendingContent eyebrow="E" title="T" description="D" />);
    expect(container.querySelectorAll('[data-pending-note]')).toHaveLength(0);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/components/layout/pending-content.test.tsx`
Expected: FAIL — `Cannot find module './pending-content'`.

- [ ] **Step 4: Implement PendingContent**

```tsx
// src/components/layout/pending-content.tsx
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';

export function PendingContent({
  eyebrow,
  title,
  description,
  note,
}: {
  eyebrow: string;
  title: string;
  description: string;
  note?: string;
}) {
  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">{eyebrow}</p>
          <h1 className="mt-4 font-display text-display text-ink">{title}</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">{description}</p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <div className="rounded-[14px] border border-line bg-paper p-8">
            <p className="text-body text-ink">Konten halaman ini sedang disiapkan.</p>
            {note ? (
              <p data-pending-note className="mt-2 text-small text-slate">
                {note}
              </p>
            ) : null}
          </div>
        </Reveal>
      </Section>
    </>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/layout/pending-content.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add PendingContent primitive and leadership/milestone types"
```

---

### Task 3: `/tentang-kami` overview

**Files:**
- Create: `src/app/[locale]/tentang-kami/page.tsx`
- Test: `src/app/[locale]/tentang-kami/page.test.tsx`

**Interfaces:**
- Consumes: `Section`, `Reveal`, `buildMetadata`, `getCollection`, `EntityEntry`
- Produces: the `/[locale]/tentang-kami` route

This is the one page in this phase with real content: project.md §1's group summary and §2's structure are confirmed facts. Every sentence below traces to the spec — the four environmental service lines, the one supporting unit, and the group's stated purpose. Nothing is invented.

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/[locale]/tentang-kami/page.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TentangKamiPage from './page';

describe('TentangKamiPage', () => {
  it('renders the heading and the group summary', async () => {
    render(await TentangKamiPage({ params: Promise.resolve({ locale: 'id' }) }));

    expect(screen.getByRole('heading', { level: 1, name: 'Tentang Kami' })).toBeInTheDocument();
    expect(screen.getByText(/empat lini layanan lingkungan/i)).toBeInTheDocument();
  });

  it('links to every sub-page with the active locale', async () => {
    render(await TentangKamiPage({ params: Promise.resolve({ locale: 'en' }) }));

    expect(screen.getByRole('link', { name: /Sejarah/ })).toHaveAttribute(
      'href',
      '/en/tentang-kami/sejarah'
    );
    expect(screen.getByRole('link', { name: /Green Business/ })).toHaveAttribute(
      'href',
      '/en/tentang-kami/green-business'
    );
  });

  it('reports the real entity count rather than a hardcoded number', async () => {
    render(await TentangKamiPage({ params: Promise.resolve({ locale: 'id' }) }));
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "src/app/[locale]/tentang-kami/page.test.tsx"`
Expected: FAIL — `Cannot find module './page'`.

- [ ] **Step 3: Implement the page**

```tsx
// src/app/[locale]/tentang-kami/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCollection } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import type { EntityEntry } from '@/lib/content-types';

const SUB_PAGES = [
  { label: 'Sejarah', href: '/tentang-kami/sejarah', deskripsi: 'Perjalanan grup dari tahun ke tahun.' },
  { label: 'Visi & Misi', href: '/tentang-kami/visi-misi', deskripsi: 'Arah dan komitmen jangka panjang.' },
  { label: 'Makna Logo', href: '/tentang-kami/makna-logo', deskripsi: 'Filosofi di balik identitas visual grup.' },
  { label: 'Struktur Organisasi', href: '/tentang-kami/struktur-organisasi', deskripsi: 'Susunan organisasi grup.' },
  { label: 'Green Business', href: '/tentang-kami/green-business', deskripsi: 'Manifesto keberlanjutan grup.' },
  { label: 'Penghargaan', href: '/tentang-kami/penghargaan', deskripsi: 'Pengakuan dan apresiasi untuk grup.' },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: 'Tentang Kami',
    description:
      'Environesia Company Group menaungi empat lini layanan lingkungan dan satu unit penunjang.',
    locale,
    path: '/tentang-kami',
  });
}

export default async function TentangKamiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const entities = getCollection<EntityEntry>('entities').map((entry) => entry.data);
  const coreCount = entities.filter((entity) => entity.lini === 'inti').length;

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">Profil</p>
          <h1 className="mt-4 font-display text-display text-ink">Tentang Kami</h1>
          <p className="mt-6 max-w-2xl text-body text-slate">
            Environesia Company Group adalah holding yang membawahi empat lini layanan lingkungan
            dan satu unit manufaktur apparel. Keempat lini lingkungan bekerja sebagai satu rantai
            berurutan — konsultasi, pengujian dan sampling, pelatihan kompetensi, lalu sertifikasi
            profesi — sementara unit penunjang menopang kebutuhan operasional grup.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="rounded-[14px] border border-line bg-paper p-8">
              <p className="font-display text-display text-forest">{entities.length}</p>
              <p className="mt-2 font-mono text-label uppercase text-slate">Entitas dalam grup</p>
            </div>
            <div className="rounded-[14px] border border-line bg-paper p-8">
              <p className="font-display text-display text-forest">{coreCount}</p>
              <p className="mt-2 font-mono text-label uppercase text-slate">Lini layanan lingkungan</p>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <h2 className="font-display text-h2 text-ink">Selengkapnya</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {SUB_PAGES.map((page) => (
              <Link
                key={page.href}
                href={`/${locale}${page.href}`}
                className="block rounded-[14px] border border-line bg-paper p-6 transition-shadow hover:shadow-sm"
              >
                <p className="font-display text-h3 text-ink">{page.label}</p>
                <p className="mt-1 text-small text-slate">{page.deskripsi}</p>
              </Link>
            ))}
          </div>
        </Reveal>
      </Section>
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "src/app/[locale]/tentang-kami/page.test.tsx"`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add tentang kami overview page"
```

---

### Task 4: The six Tentang Kami sub-pages

**Files:**
- Create: `src/app/[locale]/tentang-kami/sejarah/page.tsx`
- Create: `src/app/[locale]/tentang-kami/visi-misi/page.tsx`
- Create: `src/app/[locale]/tentang-kami/makna-logo/page.tsx`
- Create: `src/app/[locale]/tentang-kami/struktur-organisasi/page.tsx`
- Create: `src/app/[locale]/tentang-kami/green-business/page.tsx`
- Create: `src/app/[locale]/tentang-kami/penghargaan/page.tsx`
- Test: `src/app/[locale]/tentang-kami/sub-pages.test.tsx`

**Interfaces:**
- Consumes: `PendingContent` (Task 2), `buildMetadata`, `GroupStructureDiagram` (Fase 3 Task 2), `getCollection`
- Produces: six routes under `/[locale]/tentang-kami/`

Five of these are pure `PendingContent` scaffolds — none of that copy exists (project.md §10). `struktur-organisasi` is the exception: the *group* structure is a confirmed fact and already has a tested diagram from Fase 3, so that page renders the real diagram above a pending note explaining that the personnel-level org chart is still to come. That distinction matters — showing a real diagram is honest; implying it depicts staffing would not be.

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/[locale]/tentang-kami/sub-pages.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SejarahPage from './sejarah/page';
import VisiMisiPage from './visi-misi/page';
import MaknaLogoPage from './makna-logo/page';
import StrukturOrganisasiPage from './struktur-organisasi/page';
import GreenBusinessPage from './green-business/page';
import PenghargaanPage from './penghargaan/page';

const params = Promise.resolve({ locale: 'id' });

describe('Tentang Kami sub-pages', () => {
  it('renders each page with its own h1 and the pending notice', async () => {
    const cases: Array<[string, React.ReactElement]> = [
      ['Sejarah', await SejarahPage()],
      ['Visi & Misi', await VisiMisiPage()],
      ['Makna Logo', await MaknaLogoPage()],
      ['Green Business', await GreenBusinessPage()],
      ['Penghargaan', await PenghargaanPage()],
    ];

    for (const [title, element] of cases) {
      const { unmount } = render(element);
      expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
      expect(screen.getByText('Konten halaman ini sedang disiapkan.')).toBeInTheDocument();
      unmount();
    }
  });

  it('shows the real group diagram on the org structure page', async () => {
    render(await StrukturOrganisasiPage({ params }));

    expect(
      screen.getByRole('heading', { level: 1, name: 'Struktur Organisasi' })
    ).toBeInTheDocument();
    expect(screen.getByText('Environesia Group')).toBeInTheDocument();
  });

  it('says plainly that the personnel org chart is still pending', async () => {
    render(await StrukturOrganisasiPage({ params }));
    expect(
      screen.getByText('Susunan organisasi tingkat personel sedang disiapkan.')
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "src/app/[locale]/tentang-kami/sub-pages.test.tsx"`
Expected: FAIL — the six page modules are missing.

- [ ] **Step 3: Implement the five pending scaffolds**

Each follows the identical shape. `sejarah/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { PendingContent } from '@/components/layout/pending-content';
import { buildMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: 'Sejarah',
    description: 'Perjalanan Environesia Company Group dari tahun ke tahun.',
    locale,
    path: '/tentang-kami/sejarah',
  });
}

export default async function SejarahPage() {
  return (
    <PendingContent
      eyebrow="Tentang Kami"
      title="Sejarah"
      description="Perjalanan grup dari tahun ke tahun."
    />
  );
}
```

`visi-misi/page.tsx` — same shape, with:
- metadata title `'Visi & Misi'`, description `'Arah dan komitmen jangka panjang Environesia Company Group.'`, path `'/tentang-kami/visi-misi'`
- `eyebrow="Tentang Kami"`, `title="Visi & Misi"`, `description="Arah dan komitmen jangka panjang."`

`makna-logo/page.tsx` — same shape, with:
- metadata title `'Makna Logo'`, description `'Filosofi di balik identitas visual Environesia Company Group.'`, path `'/tentang-kami/makna-logo'`
- `eyebrow="Tentang Kami"`, `title="Makna Logo"`, `description="Filosofi di balik identitas visual grup."`

`green-business/page.tsx` — same shape, with:
- metadata title `'Green Business'`, description `'Manifesto keberlanjutan Environesia Company Group.'`, path `'/tentang-kami/green-business'`
- `eyebrow="Tentang Kami"`, `title="Green Business"`, `description="Manifesto keberlanjutan grup."`

`penghargaan/page.tsx` — same shape, with:
- metadata title `'Penghargaan'`, description `'Pengakuan dan apresiasi untuk Environesia Company Group.'`, path `'/tentang-kami/penghargaan'`
- `eyebrow="Tentang Kami"`, `title="Penghargaan"`, `description="Pengakuan dan apresiasi untuk grup."`

- [ ] **Step 4: Implement the org structure page**

```tsx
// src/app/[locale]/tentang-kami/struktur-organisasi/page.tsx
import type { Metadata } from 'next';
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
    title: 'Struktur Organisasi',
    description: 'Susunan Environesia Company Group dan entitas di bawahnya.',
    locale,
    path: '/tentang-kami/struktur-organisasi',
  });
}

export default async function StrukturOrganisasiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const entities = getCollection<EntityEntry>('entities')
    .map((entry) => entry.data)
    .sort((a, b) => a.urutan - b.urutan);

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">Tentang Kami</p>
          <h1 className="mt-4 font-display text-display text-ink">Struktur Organisasi</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">
            Susunan grup dan entitas yang berada di bawahnya.
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
          <div className="rounded-[14px] border border-line bg-paper p-8">
            <p className="text-body text-ink">
              Susunan organisasi tingkat personel sedang disiapkan.
            </p>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run "src/app/[locale]/tentang-kami/sub-pages.test.tsx"`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add tentang kami sub-pages"
```

---

### Task 5: The Pimpinan section

**Files:**
- Create: `src/app/[locale]/pimpinan/page.tsx`
- Create: `src/app/[locale]/pimpinan/direksi/page.tsx`
- Create: `src/app/[locale]/pimpinan/komisaris/page.tsx`
- Create: `src/components/pimpinan/leadership-grid.tsx`
- Test: `src/components/pimpinan/leadership-grid.test.tsx`
- Test: `src/app/[locale]/pimpinan/pages.test.tsx`

**Interfaces:**
- Consumes: `PendingContent`, `Section`, `Reveal`, `buildMetadata`, `getCollection`, `LeadershipEntry` (Task 2)
- Produces: three routes under `/[locale]/pimpinan/`, plus `LeadershipGrid({ people, emptyLabel })`

No director's name, photo, or biography is confirmed (project.md §10), and whether a board of commissioners exists at all is still unconfirmed. `LeadershipGrid` is built and tested against fixture data so the moment a `content/leadership` collection is authored the pages fill in with no code change — but today all three routes render honest pending states. **Do not create a `content/leadership` directory and do not invent a single name.**

The commissioners page carries a note that the board's existence is itself unconfirmed, rather than presenting an empty board as fact.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/pimpinan/leadership-grid.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LeadershipGrid } from './leadership-grid';
import type { LeadershipEntry } from '@/lib/content-types';

const people: LeadershipEntry[] = [
  { nama: 'Contoh Satu', jabatan: 'Direktur Utama', tipe: 'direksi', urutan: 1 },
  { nama: 'Contoh Dua', jabatan: 'Direktur Operasional', tipe: 'direksi', urutan: 2 },
];

describe('LeadershipGrid', () => {
  it('renders a card per person, ordered by urutan', () => {
    render(<LeadershipGrid people={people} emptyLabel="Belum ada data." />);

    expect(screen.getByText('Contoh Satu')).toBeInTheDocument();
    expect(screen.getByText('Direktur Operasional')).toBeInTheDocument();
  });

  it('shows the empty label instead of an empty grid when there is nobody', () => {
    render(<LeadershipGrid people={[]} emptyLabel="Belum ada data." />);

    expect(screen.getByText('Belum ada data.')).toBeInTheDocument();
    expect(screen.queryByText('Contoh Satu')).not.toBeInTheDocument();
  });
});
```

```tsx
// src/app/[locale]/pimpinan/pages.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PimpinanPage from './page';
import DireksiPage from './direksi/page';
import KomisarisPage from './komisaris/page';

const params = Promise.resolve({ locale: 'id' });

describe('Pimpinan pages', () => {
  it('renders the overview with links to both sub-pages', async () => {
    render(await PimpinanPage({ params: Promise.resolve({ locale: 'en' }) }));

    expect(screen.getByRole('heading', { level: 1, name: 'Pimpinan' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Direksi/ })).toHaveAttribute(
      'href',
      '/en/pimpinan/direksi'
    );
    expect(screen.getByRole('link', { name: /Komisaris/ })).toHaveAttribute(
      'href',
      '/en/pimpinan/komisaris'
    );
  });

  it('shows an honest empty state on the direksi page, naming no one', async () => {
    render(await DireksiPage({ params }));

    expect(screen.getByRole('heading', { level: 1, name: 'Direksi' })).toBeInTheDocument();
    expect(screen.getByText('Profil jajaran direksi sedang disiapkan.')).toBeInTheDocument();
  });

  it('states that the commissioners board is unconfirmed rather than empty', async () => {
    render(await KomisarisPage({ params }));

    expect(
      screen.getByText('Keberadaan dewan komisaris belum dikonfirmasi.')
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/pimpinan/leadership-grid.test.tsx "src/app/[locale]/pimpinan/pages.test.tsx"`
Expected: FAIL — modules missing.

- [ ] **Step 3: Implement LeadershipGrid**

```tsx
// src/components/pimpinan/leadership-grid.tsx
import type { LeadershipEntry } from '@/lib/content-types';

export function LeadershipGrid({
  people,
  emptyLabel,
}: {
  people: LeadershipEntry[];
  emptyLabel: string;
}) {
  if (people.length === 0) {
    return <p className="text-body text-ink">{emptyLabel}</p>;
  }

  const ordered = [...people].sort((a, b) => a.urutan - b.urutan);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {ordered.map((person) => (
        <div
          key={`${person.nama}-${person.urutan}`}
          className="rounded-[14px] border border-line bg-paper p-6"
        >
          <p className="font-display text-h3 text-ink">{person.nama}</p>
          <p className="mt-1 font-mono text-label uppercase text-slate">{person.jabatan}</p>
          {person.bio ? <p className="mt-3 text-small text-slate">{person.bio}</p> : null}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Implement the overview page**

```tsx
// src/app/[locale]/pimpinan/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';

const SUB_PAGES = [
  { label: 'Direksi', href: '/pimpinan/direksi', deskripsi: 'Jajaran direksi grup.' },
  { label: 'Komisaris', href: '/pimpinan/komisaris', deskripsi: 'Dewan komisaris grup.' },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: 'Pimpinan',
    description: 'Jajaran kepemimpinan Environesia Company Group.',
    locale,
    path: '/pimpinan',
  });
}

export default async function PimpinanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">Kepemimpinan</p>
          <h1 className="mt-4 font-display text-display text-ink">Pimpinan</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">
            Jajaran kepemimpinan yang mengarahkan grup dan entitas di bawahnya.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {SUB_PAGES.map((page) => (
              <Link
                key={page.href}
                href={`/${locale}${page.href}`}
                className="block rounded-[14px] border border-line bg-paper p-6 transition-shadow hover:shadow-sm"
              >
                <p className="font-display text-h3 text-ink">{page.label}</p>
                <p className="mt-1 text-small text-slate">{page.deskripsi}</p>
              </Link>
            ))}
          </div>
        </Reveal>
      </Section>
    </>
  );
}
```

- [ ] **Step 5: Implement the direksi page**

```tsx
// src/app/[locale]/pimpinan/direksi/page.tsx
import type { Metadata } from 'next';
import { getCollection } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { LeadershipGrid } from '@/components/pimpinan/leadership-grid';
import type { LeadershipEntry } from '@/lib/content-types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: 'Direksi',
    description: 'Jajaran direksi Environesia Company Group.',
    locale,
    path: '/pimpinan/direksi',
  });
}

export default async function DireksiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const people = getCollection<LeadershipEntry>('leadership')
    .map((entry) => entry.data)
    .filter((person) => person.tipe === 'direksi');

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">Pimpinan</p>
          <h1 className="mt-4 font-display text-display text-ink">Direksi</h1>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <LeadershipGrid people={people} emptyLabel="Profil jajaran direksi sedang disiapkan." />
        </Reveal>
      </Section>
    </>
  );
}
```

- [ ] **Step 6: Implement the komisaris page**

Identical to `direksi/page.tsx` except:
- metadata title `'Komisaris'`, description `'Dewan komisaris Environesia Company Group.'`, path `'/pimpinan/komisaris'`
- the filter is `person.tipe === 'komisaris'`
- the `<h1>` reads `Komisaris`
- `emptyLabel="Keberadaan dewan komisaris belum dikonfirmasi."`

- [ ] **Step 7: Run tests to verify they pass**

Run: `npx vitest run src/components/pimpinan/leadership-grid.test.tsx "src/app/[locale]/pimpinan/pages.test.tsx"`
Expected: PASS (5 tests).

- [ ] **Step 8: Full verification**

```bash
npm run build
npm run test
find .next/server/app/id -name "*.html" | sort
```

Expected: build succeeds; the full suite passes with every earlier suite still green; the eight new pages appear for both locales.

- [ ] **Step 9: Runtime check**

```bash
npm run dev &
sleep 4
curl -s http://localhost:3000/id/tentang-kami | grep -o 'Tentang Kami'
curl -s http://localhost:3000/id/tentang-kami/sejarah | grep -o 'sedang disiapkan'
curl -s http://localhost:3000/id/pimpinan/komisaris | grep -o 'belum dikonfirmasi'
curl -s http://localhost:3000/sitemap.xml | grep -o 'tentang-kami' | head -1
kill %1
```

Expected: every grep matches. **Kill the dev server** — a leaked one has caused false-positive failures in this project before.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add pimpinan section"
```

---

## Fase 4 exit criteria

- `npm run build` and `npm run test` pass, with every Fase 1–3 suite still green.
- `sitemap.xml` and `robots.txt` are generated and list every route in both locales; the JSON-LD `Organization` block renders on every page.
- Eight new routes prerender in both locales: `/tentang-kami` plus its six sub-pages, and `/pimpinan` plus `direksi` and `komisaris`.
- The `/tentang-kami` overview and `/tentang-kami/struktur-organisasi` show real, spec-traceable content; every other new page shows an honest pending state through the shared `PendingContent` component.
- No invented person, award, milestone, mission statement, or logo philosophy appears anywhere.
- `content/leadership` and `content/milestones` are NOT created — `LeadershipGrid` is proven against fixtures and waits for real data.
- Zero new `'use client'` files.
