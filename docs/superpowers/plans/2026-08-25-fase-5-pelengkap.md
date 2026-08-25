# Fase 5 — Proyek, Berita & Pelengkap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close every remaining route so no navigation link 404s — `/kontak` with the group's real, confirmed contact details, and `/proyek`, `/berita`, `/karier`, `/unduhan`, `/kebijakan-privasi` as working pages whose mechanisms are built and tested but whose content honestly reports as pending.

**Architecture:** Six new Server Component routes. `/kontak` is the only one with real content — it renders the confirmed head-office address already used by the footer and JSON-LD, sourced from the same `OFFICE_ADDRESS` constant so the three can never disagree. `/proyek` reuses Fase 2's tested `CountryMap` primitive, feeding it the (currently empty) `projects` collection. `/berita` reuses the news-card shape. The remaining three are `PendingContent` scaffolds. A final task audits that every header and footer link now resolves.

**Tech Stack:** Unchanged (Next.js 15, Tailwind v4, next-intl, `getCollection`, Vitest/RTL). No new dependencies.

**Spec:** `/home/doly/company-profile-egc/project.md` — §3 (sitemap), §7 (content model: `projects`, `posts`, `jobs`, `documents`), §8 (SEO and the legal requirement that a privacy policy exist before the contact form goes live), §10 (what is confirmed vs. pending).

## Global Constraints

- Next.js 15, App Router, TypeScript strict mode.
- **Zero `'use client'` files in this plan.** `/proyek` reuses the existing `CountryMap` client component; nothing new goes client-side.
- All section vertical padding from the shared `<Section>` component.
- Every page gets `generateMetadata` via `buildMetadata` from `@/lib/metadata`.
- Locale-prefixed links use the hand-rolled `next/link` + `/${locale}${path}` convention — standing Fase 1 debt, out of scope.
- Never render heading text below 20px.
- **Content honesty.** Per project.md §10, the ten-country project list, all project records, all news posts, job openings, and downloadable documents are unconfirmed or unauthored. Those pages render honest pending states. **Do not invent a project, a client name, a country, a headline, a job opening, or a document.** The office address on `/kontak` is the one fully-confirmed fact in this phase and must be reused from `OFFICE_ADDRESS`, never retyped.
- **`/kontak` ships WITHOUT an active contact form.** project.md §8 states plainly: "halaman kebijakan privasi wajib ada sebelum form kontak aktif." The privacy policy text is legal content the client has not supplied and that must not be invented, so the form is deliberately deferred. The page instead surfaces the real address and directs enquiries to the office. Wiring the Server Action + hCaptcha form belongs to whichever phase first has approved privacy copy.
- **Detail routes (`/proyek/[slug]`, `/berita/[slug]`) are deliberately NOT built.** No project or post content exists, so `generateStaticParams` would return an empty array and the route would exist purely on speculation. Build them in the phase that first authors real records — the listing pages already render the card shape those records will fill.

---

### Task 1: `/kontak` with real contact details

**Files:**
- Create: `src/app/[locale]/kontak/page.tsx`
- Test: `src/app/[locale]/kontak/page.test.tsx`
- Modify: `src/lib/site.ts` (add a formatted address-lines export)
- Modify: `src/components/layout/footer.tsx` (consume the shared address lines instead of its own hardcoded copy)

**Interfaces:**
- Consumes: `Section`, `Reveal`, `buildMetadata`, `OFFICE_ADDRESS` from `@/lib/site`
- Produces: `OFFICE_ADDRESS_LINES` from `@/lib/site`; the `/[locale]/kontak` route

The address currently exists in three places — `OFFICE_ADDRESS` (structured, for JSON-LD), the footer's hardcoded JSX, and soon this page. Two of those are hand-typed. Adding a shared `OFFICE_ADDRESS_LINES` and pointing the footer at it means the address is authored once; a future correction can't leave one copy stale. This is the same consolidation the Fase 4 review asked for on route lists.

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/[locale]/kontak/page.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import KontakPage from './page';

describe('KontakPage', () => {
  it('renders the heading and the confirmed office address', async () => {
    render(await KontakPage({ params: Promise.resolve({ locale: 'id' }) }));

    expect(screen.getByRole('heading', { level: 1, name: 'Kontak' })).toBeInTheDocument();
    expect(screen.getByText(/Jl\. Jati Mataram No\. 284B/)).toBeInTheDocument();
    expect(screen.getByText(/55284/)).toBeInTheDocument();
  });

  it('renders the address inside a semantic address element', async () => {
    const { container } = render(await KontakPage({ params: Promise.resolve({ locale: 'id' }) }));
    expect(container.querySelector('address')).toBeInTheDocument();
  });

  it('explains that the contact form is not yet available', async () => {
    render(await KontakPage({ params: Promise.resolve({ locale: 'id' }) }));
    expect(
      screen.getByText('Formulir kontak akan tersedia setelah kebijakan privasi terbit.')
    ).toBeInTheDocument();
  });

  it('does not render a form', async () => {
    const { container } = render(await KontakPage({ params: Promise.resolve({ locale: 'id' }) }));
    expect(container.querySelector('form')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "src/app/[locale]/kontak/page.test.tsx"`
Expected: FAIL — `Cannot find module './page'`.

- [ ] **Step 3: Add the shared address lines**

Append to `src/lib/site.ts`:

```ts
// The address as rendered to humans, derived from the structured OFFICE_ADDRESS
// above so the footer, the contact page, and the JSON-LD can never disagree.
export const OFFICE_ADDRESS_LINES = [
  'Jl. Jati Mataram No. 284B, Karangjati',
  'Sinduadi, Mlati, Sleman',
  'Daerah Istimewa Yogyakarta 55284',
] as const;

export const OFFICE_BUILDING = 'Grha Environesia (Lantai 2)';
```

- [ ] **Step 4: Implement the page**

```tsx
// src/app/[locale]/kontak/page.tsx
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { OFFICE_ADDRESS_LINES, OFFICE_BUILDING } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: 'Kontak',
    description: 'Hubungi Environesia Company Group di kantor pusat kami di Sleman, Yogyakarta.',
    locale,
    path: '/kontak',
  });
}

export default async function KontakPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">Hubungi Kami</p>
          <h1 className="mt-4 font-display text-display text-ink">Kontak</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">
            Untuk kebutuhan konsultasi, pengujian, pelatihan, atau sertifikasi lingkungan, tim kami
            dapat dihubungi melalui kantor pusat.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[14px] border border-line bg-paper p-8">
              <p className="font-mono text-label uppercase text-slate">Kantor Pusat</p>
              <p className="mt-3 font-display text-h3 text-ink">{OFFICE_BUILDING}</p>
              <address className="mt-2 text-small not-italic text-slate">
                {OFFICE_ADDRESS_LINES.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>

            <div className="rounded-[14px] border border-line bg-paper p-8">
              <p className="font-mono text-label uppercase text-slate">Formulir</p>
              <p className="mt-3 text-body text-ink">
                Formulir kontak akan tersedia setelah kebijakan privasi terbit.
              </p>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
```

- [ ] **Step 5: Point the footer at the shared lines**

In `src/components/layout/footer.tsx`, add `import { OFFICE_ADDRESS_LINES, OFFICE_BUILDING } from '@/lib/site';`. Replace the hardcoded building name with `{OFFICE_BUILDING}` and replace the hardcoded `<address>` body with the same `OFFICE_ADDRESS_LINES.map(...)` block used above. **The footer's existing tests must pass unchanged** — the rendered text is identical. If one breaks, the refactor changed real output: report it rather than editing the test.

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run "src/app/[locale]/kontak/page.test.tsx" src/components/layout/footer.test.tsx`
Expected: PASS — 4 new tests plus the 3 pre-existing footer tests, all green.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add kontak page and share the office address"
```

---

### Task 2: `/proyek` and `/berita` listing pages

**Files:**
- Create: `src/app/[locale]/proyek/page.tsx`
- Create: `src/app/[locale]/berita/page.tsx`
- Test: `src/app/[locale]/proyek/page.test.tsx`
- Test: `src/app/[locale]/berita/page.test.tsx`

**Interfaces:**
- Consumes: `Section`, `Reveal`, `buildMetadata`, `getCollection`, `CountryMap` (Fase 2), `ProjectPin`/`PostSummary` from `@/lib/content-types`
- Produces: the `/[locale]/proyek` and `/[locale]/berita` routes

Neither `content/projects` nor `content/posts` exists — Fase 2 built both consuming components against that reality, and `getCollection` returns `[]` for a missing directory. So both pages render honest empty states today and fill in with no code change once records are authored. `/proyek` reuses the already-tested `CountryMap`, which means the map appears in two places (homepage teaser and this listing) from one implementation.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/app/[locale]/proyek/page.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProyekPage from './page';

describe('ProyekPage', () => {
  it('renders the heading and the map', async () => {
    render(await ProyekPage({ params: Promise.resolve({ locale: 'id' }) }));

    expect(screen.getByRole('heading', { level: 1, name: 'Proyek' })).toBeInTheDocument();
    expect(
      screen.getByText('Peta jejak proyek akan tersedia setelah data 10 negara lengkap.')
    ).toBeInTheDocument();
  });

  it('reports honestly that no project records exist yet', async () => {
    render(await ProyekPage({ params: Promise.resolve({ locale: 'id' }) }));
    expect(screen.getByText('Daftar proyek sedang disiapkan.')).toBeInTheDocument();
  });
});
```

```tsx
// src/app/[locale]/berita/page.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BeritaPage from './page';

describe('BeritaPage', () => {
  it('renders the heading', async () => {
    render(await BeritaPage({ params: Promise.resolve({ locale: 'id' }) }));
    expect(screen.getByRole('heading', { level: 1, name: 'Berita & Insight' })).toBeInTheDocument();
  });

  it('reports honestly that no posts exist yet', async () => {
    render(await BeritaPage({ params: Promise.resolve({ locale: 'id' }) }));
    expect(screen.getByText('Belum ada berita terbaru.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run "src/app/[locale]/proyek/page.test.tsx" "src/app/[locale]/berita/page.test.tsx"`
Expected: FAIL — both modules missing.

- [ ] **Step 3: Implement `/proyek`**

```tsx
// src/app/[locale]/proyek/page.tsx
import type { Metadata } from 'next';
import { getCollection } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { CountryMap } from '@/components/home/country-map';
import type { ProjectPin } from '@/lib/content-types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: 'Proyek',
    description: 'Rekam jejak proyek Environesia Company Group.',
    locale,
    path: '/proyek',
  });
}

export default async function ProyekPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const pins = getCollection<ProjectPin>('projects').map((entry) => entry.data);

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">Portofolio</p>
          <h1 className="mt-4 font-display text-display text-ink">Proyek</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">
            Rekam jejak pekerjaan grup bersama klien korporat dan instansi.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          <CountryMap pins={pins} />
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <h2 className="font-display text-h2 text-ink">Daftar Proyek</h2>
          {pins.length === 0 ? (
            <p className="mt-6 text-small text-slate">Daftar proyek sedang disiapkan.</p>
          ) : (
            <ul className="mt-8">
              {pins.map((pin) => (
                <li key={`${pin.negara}-${pin.judul}`} className="border-b border-line py-4">
                  <p className="font-display text-h3 text-ink">{pin.judul}</p>
                  <p className="mt-1 font-mono text-label uppercase text-slate">
                    {pin.kota ? `${pin.kota}, ${pin.negara}` : pin.negara}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </Section>
    </>
  );
}
```

- [ ] **Step 4: Implement `/berita`**

```tsx
// src/app/[locale]/berita/page.tsx
import type { Metadata } from 'next';
import { getCollection } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import type { PostSummary } from '@/lib/content-types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: 'Berita & Insight',
    description: 'Kabar dan wawasan dari Environesia Company Group.',
    locale,
    path: '/berita',
  });
}

export default async function BeritaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const posts = getCollection<PostSummary>('posts').map((entry) => entry.data);

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">Publikasi</p>
          <h1 className="mt-4 font-display text-display text-ink">Berita &amp; Insight</h1>
          <p className="mt-4 max-w-2xl text-body text-slate">
            Kabar terbaru dan wawasan dari tim grup.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-stone">
        <Reveal>
          {posts.length === 0 ? (
            <p className="text-small text-slate">Belum ada berita terbaru.</p>
          ) : (
            <ul>
              {posts.map((post) => (
                <li key={post.slug} className="border-b border-line py-4">
                  <p className="font-mono text-label uppercase text-slate">{post.tanggal}</p>
                  <p className="mt-1 font-display text-h3 text-ink">{post.judul}</p>
                  <p className="mt-1 text-small text-slate">{post.ringkasan}</p>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </Section>
    </>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run "src/app/[locale]/proyek/page.test.tsx" "src/app/[locale]/berita/page.test.tsx"`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add proyek and berita listing pages"
```

---

### Task 3: `/karier`, `/unduhan`, and `/kebijakan-privasi`

**Files:**
- Create: `src/app/[locale]/karier/page.tsx`
- Create: `src/app/[locale]/unduhan/page.tsx`
- Create: `src/app/[locale]/kebijakan-privasi/page.tsx`
- Test: `src/app/[locale]/pelengkap-pages.test.tsx`

**Interfaces:**
- Consumes: `PendingContent` (Fase 4 Task 2), `buildMetadata`
- Produces: three routes

All three are `PendingContent` scaffolds. Job openings and downloadable documents are unauthored (project.md §7 lists the collections; §10 confirms no records). The privacy policy is legal text the client must supply — **inventing privacy-policy language would be the worst possible content-honesty failure here**, since it would make binding-sounding legal claims on a real company's behalf. Its pending note says explicitly that the text is being prepared, so nobody mistakes an empty page for an absent obligation.

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/[locale]/pelengkap-pages.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import KarierPage from './karier/page';
import UnduhanPage from './unduhan/page';
import KebijakanPrivasiPage from './kebijakan-privasi/page';

describe('Pelengkap pages', () => {
  it('renders each page with its own h1 and the pending notice', async () => {
    const cases: Array<[string, React.ReactElement]> = [
      ['Karier', await KarierPage()],
      ['Unduhan', await UnduhanPage()],
      ['Kebijakan Privasi', await KebijakanPrivasiPage()],
    ];

    for (const [title, element] of cases) {
      const { unmount } = render(element);
      expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
      expect(screen.getByText('Konten halaman ini sedang disiapkan.')).toBeInTheDocument();
      unmount();
    }
  });

  it('notes on the privacy page that the policy text is still being prepared', async () => {
    render(await KebijakanPrivasiPage());
    expect(
      screen.getByText('Naskah kebijakan privasi sedang disusun bersama tim legal.')
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "src/app/[locale]/pelengkap-pages.test.tsx"`
Expected: FAIL — the three modules are missing.

- [ ] **Step 3: Implement the three pages**

`karier/page.tsx`:

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
    title: 'Karier',
    description: 'Peluang berkarier bersama Environesia Company Group.',
    locale,
    path: '/karier',
  });
}

export default async function KarierPage() {
  return (
    <PendingContent
      eyebrow="Karier"
      title="Karier"
      description="Peluang berkarier bersama grup."
    />
  );
}
```

`unduhan/page.tsx` — same shape, with:
- metadata title `'Unduhan'`, description `'Dokumen resmi Environesia Company Group.'`, path `'/unduhan'`
- `eyebrow="Unduhan"`, `title="Unduhan"`, `description="Dokumen resmi grup untuk keperluan tender dan prakualifikasi."`

`kebijakan-privasi/page.tsx` — same shape, with:
- metadata title `'Kebijakan Privasi'`, description `'Kebijakan privasi Environesia Company Group.'`, path `'/kebijakan-privasi'`
- `eyebrow="Legal"`, `title="Kebijakan Privasi"`, `description="Bagaimana kami menangani data yang Anda berikan."`, and `note="Naskah kebijakan privasi sedang disusun bersama tim legal."`

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "src/app/[locale]/pelengkap-pages.test.tsx"`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add karier, unduhan, and privacy policy pages"
```

---

### Task 4: Close the navigation and extend the sitemap

**Files:**
- Modify: `src/app/sitemap.ts` (add the six new paths)
- Modify: `src/components/layout/footer.tsx` (add the privacy policy link)
- Test: `src/app/nav-coverage.test.ts`

**Interfaces:**
- Consumes: `NAV_ITEMS` from the header, `FOOTER_LINKS` from the footer, `sitemap`
- Produces: a regression test proving every navigation link corresponds to a real route

Until now, five header links and several footer links pointed at routes that did not exist — including the homepage's own contact CTA. This task closes that and adds a test that fails if a future task adds a nav entry without a page, or removes a page a nav entry still points at.

For that test to work, the header and footer must export their link lists. Both currently declare them as module-private constants.

- [ ] **Step 1: Export the nav lists**

In `src/components/layout/header.tsx`, change `const NAV_ITEMS = [...]` to `export const NAV_ITEMS = [...]`. In `src/components/layout/footer.tsx`, change `const FOOTER_LINKS = [...]` to `export const FOOTER_LINKS = [...]`. No other change — both stay used exactly as before.

- [ ] **Step 2: Add the privacy policy to the footer**

Append to `FOOTER_LINKS`:

```ts
{ label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
```

- [ ] **Step 3: Extend the sitemap**

In `src/app/sitemap.ts`, add the six new paths to `STATIC_PATHS`, after the `/pimpinan` entries:

```ts
  '/proyek',
  '/berita',
  '/karier',
  '/kontak',
  '/unduhan',
  '/kebijakan-privasi',
```

- [ ] **Step 4: Write the failing test**

```ts
// src/app/nav-coverage.test.ts
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { NAV_ITEMS } from '@/components/layout/header';
import { FOOTER_LINKS } from '@/components/layout/footer';
import sitemap from './sitemap';

const APP_DIR = path.join(process.cwd(), 'src/app/[locale]');

function routeExists(href: string) {
  if (href === '/') {
    return fs.existsSync(path.join(APP_DIR, 'page.tsx'));
  }
  return fs.existsSync(path.join(APP_DIR, href.replace(/^\//, ''), 'page.tsx'));
}

describe('navigation coverage', () => {
  it('has a real page for every header link', () => {
    const missing = NAV_ITEMS.filter((item) => !routeExists(item.href)).map((item) => item.href);
    expect(missing).toEqual([]);
  });

  it('has a real page for every footer link', () => {
    const missing = FOOTER_LINKS.filter((item) => !routeExists(item.href)).map(
      (item) => item.href
    );
    expect(missing).toEqual([]);
  });

  it('lists every header link in the sitemap', () => {
    const urls = sitemap().map((entry) => entry.url);
    const missing = NAV_ITEMS.filter(
      (item) => !urls.includes(`https://example.invalid/id${item.href === '/' ? '' : item.href}`)
    ).map((item) => item.href);
    expect(missing).toEqual([]);
  });
});
```

- [ ] **Step 5: Run test to verify it fails, then passes**

Run: `npx vitest run src/app/nav-coverage.test.ts`

Run it once **before** Steps 1–3 are applied if you want a genuine RED — the test cannot even import `NAV_ITEMS` until the export exists, which is itself the failure. Since Steps 1–3 are prerequisites for the module to load at all, capture RED by temporarily reverting Step 3's sitemap addition and observing the third test fail on missing sitemap entries, then restore.

Expected after all steps: PASS (3 tests).

- [ ] **Step 6: Full verification**

```bash
npm run build
npm run test
```

Expected: build succeeds with every new route prerendered in both locales; the full suite passes with every earlier suite still green.

- [ ] **Step 7: Runtime check — no navigation link 404s**

```bash
npm run dev &
sleep 4
for p in / /entitas /pimpinan /bisnis /tentang-kami /proyek /berita /karier /kontak /unduhan /kebijakan-privasi; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/id${p}")
  echo "$code  /id${p}"
done
kill %1
```

Expected: every line reports `200`. **Kill the dev server** — a leaked one has caused false-positive failures in this project before.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: close navigation coverage and extend the sitemap"
```

---

## Fase 5 exit criteria

- `npm run build` and `npm run test` pass, with every Fase 1–4 suite still green.
- Every header and footer link resolves to a real page — no 404s anywhere in the site navigation, including the homepage's contact CTA.
- `nav-coverage.test.ts` fails if a future change adds a nav entry without a page or removes a page a nav entry points at.
- `/kontak` shows the confirmed head-office address, sourced from the same `OFFICE_ADDRESS_LINES` constant the footer uses, and explains plainly why the contact form is not yet live.
- `/proyek` reuses the tested `CountryMap`; `/berita` renders the post-card shape. Both show honest empty states pending real records.
- `/kebijakan-privasi` exists as an honest scaffold with **no invented legal text**.
- The sitemap lists all six new routes in both locales.
- Zero new `'use client'` files.
