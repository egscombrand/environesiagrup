# Fase 1 — Fondasi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Next.js foundation for the Environesia Company Group site — project scaffold, design tokens, fonts, i18n routing, the shared `<Section>` layout primitive, the MDX content pipeline, and the header/footer shell — so every later phase (homepage, entity pages, etc.) builds on working, tested infrastructure.

**Architecture:** Next.js 15 App Router with a `src/` directory and a single `[locale]` segment (`id` default, `en` scaffolded but untranslated) driven by `next-intl` middleware. Tailwind CSS v4 tokens live in `src/app/globals.css` via `@theme`, consumed by a small set of Server Components (`Section`, `Header`, `Footer`); the only Client Component in this phase is the mobile nav toggle. Content (for later phases) is read from `content/<collection>/*.mdx` at build time through a single typed `getCollection` reader — no external CMS.

**Tech Stack:** Next.js 15 (App Router, TypeScript strict), Tailwind CSS v4, next-intl, next/font/google (Bricolage Grotesque, Plus Jakarta Sans, IBM Plex Mono), gray-matter, Vitest + React Testing Library.

**Spec:** `/home/doly/company-profile-egc/project.md` (sections 3, 4, 6, 7, 9 govern this plan; section 10 records what's confirmed vs. still placeholder).

## Global Constraints

- Next.js 15, App Router, TypeScript strict mode.
- Tailwind CSS v4 tokens defined via `@theme` in CSS — never a `tailwind.config.js` theme object.
- Default Server Component everywhere; `'use client'` only for hero, interactive map, project filter, form, and mobile nav (this phase only touches the last one).
- One `<Section>` component owns all section vertical padding — no ad-hoc per-page padding.
- Container max-width 1280px; horizontal padding 24px mobile / 48px desktop.
- Section vertical padding 96px desktop / 56px mobile, no exceptions.
- Color tokens: `--ink #10221C`, `--forest #0F4C3A`, `--moss #2F7D5E`, `--paper #FBFBF9`, `--stone #EDEEEA`, `--slate #5C635E`, `--line rgba(16,34,28,0.10)`. Entity accent colors are never used as full section backgrounds.
- Fonts: Bricolage Grotesque (display), Plus Jakarta Sans (body), IBM Plex Mono (utility/label) — all via `next/font/google`, self-hosted.
- Never render heading text below 20px.
- `next-intl` with `/[locale]/...` routing is required from day one (locales: `id` default, `en` scaffolded, no English copy yet).
- CMS decision: MDX-in-repo, read via a single `lib/content.ts` reader — no external CMS service in this phase.
- Target WCAG 2.1 AA; keyboard focus must stay visible on every interactive element.

---

### Task 1: Project scaffold

**Files:**
- Create: entire Next.js project skeleton in the repo root (`/home/doly/company-profile-egc`), via `create-next-app`
- Modify: none (repo currently contains only `project.md` and `docs/`)

**Interfaces:**
- Consumes: nothing
- Produces: npm scripts `dev`, `build`, `start`, `lint`; `tsconfig.json` with `strict: true` and the `@/*` path alias resolving to `src/*`; a git repository with an initial commit

- [ ] **Step 1: Initialize git (repo doesn't exist yet)**

```bash
cd /home/doly/company-profile-egc
git init
git add project.md docs
git commit -m "chore: add project spec and plans directory"
```

- [ ] **Step 2: Scaffold Next.js without Tailwind (v4 is wired manually in Task 2)**

```bash
npx create-next-app@latest . \
  --typescript \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-tailwind \
  --use-npm
```

When prompted about the non-empty directory (it contains `project.md` and `docs/`), confirm continuing.

- [ ] **Step 3: Verify the scaffold builds**

Run: `npm run build`
Expected: build succeeds, ends with a route summary listing `/` as a static page.

- [ ] **Step 4: Verify strict mode and the path alias are set**

Open `tsconfig.json` and confirm `"strict": true` and `"paths": { "@/*": ["./src/*"] }` are present (create-next-app sets both by default with the flags above — if either is missing, add it).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 15 project"
```

---

### Task 2: Tailwind CSS v4 tokens

**Files:**
- Create: `postcss.config.mjs`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `src/app/globals.css` from Task 1
- Produces: Tailwind utility classes `bg-{ink,forest,moss,paper,stone,slate}`, `text-{ink,forest,moss,paper,stone,slate}`, `border-line`, `text-{display,h2,h3,body,small,label}`, `font-{display,body,mono}` (font utilities resolve once Task 3 defines the `--font-*-src` variables)

- [ ] **Step 1: Install Tailwind v4**

```bash
npm install -D tailwindcss @tailwindcss/postcss postcss
```

- [ ] **Step 2: Configure PostCSS**

```js
// postcss.config.mjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
```

- [ ] **Step 3: Replace `src/app/globals.css` with the token theme**

```css
@import "tailwindcss";

@theme {
  --color-ink: #10221C;
  --color-forest: #0F4C3A;
  --color-moss: #2F7D5E;
  --color-paper: #FBFBF9;
  --color-stone: #EDEEEA;
  --color-slate: #5C635E;
  --color-line: rgba(16, 34, 28, 0.10);

  --font-display: var(--font-display-src), ui-sans-serif, sans-serif;
  --font-body: var(--font-body-src), ui-sans-serif, sans-serif;
  --font-mono: var(--font-mono-src), ui-monospace, monospace;

  --text-display: 56px;
  --text-display--line-height: 1.05;
  --text-display--letter-spacing: -0.02em;

  --text-h2: 36px;
  --text-h2--line-height: 1.15;
  --text-h2--letter-spacing: -0.01em;

  --text-h3: 24px;
  --text-h3--line-height: 1.3;

  --text-body: 16px;
  --text-body--line-height: 1.7;

  --text-small: 14px;
  --text-small--line-height: 1.6;

  --text-label: 12px;
  --text-label--line-height: 1.4;
  --text-label--letter-spacing: 0.08em;
}

body {
  background-color: var(--color-paper);
  color: var(--color-ink);
}
```

(The `--font-*-src` variables referenced above don't exist yet — they're defined in Task 3 by `next/font`. Until then the `font-*` utilities fall back to `ui-sans-serif`/`ui-monospace`, which is fine since nothing uses them yet.)

- [ ] **Step 4: Verify the tokens compile**

Run: `npm run build`
Expected: build succeeds. Then check the emitted CSS contains the custom properties:

```bash
grep -r "color-forest" .next/static/css/*.css
```

Expected: at least one match showing `--color-forest:#0F4C3A` (Tailwind may hex-shorten or reformat, but the property name and value must appear).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Tailwind v4 design tokens"
```

---

### Task 3: i18n routing, fonts, and the locale layout

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`
- Create: `src/middleware.ts`
- Create: `src/lib/fonts.ts`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`
- Create: `messages/id.json`
- Create: `messages/en.json`
- Modify: `next.config.ts`
- Delete: `src/app/layout.tsx`, `src/app/page.tsx` (generated by create-next-app; superseded by the `[locale]` segment)

**Interfaces:**
- Consumes: `--color-*` and `--text-*` tokens from Task 2
- Produces: `routing` (default export from `@/i18n/routing`, `.locales: readonly ['id', 'en']`, `.defaultLocale: 'id'`); `fontDisplay`, `fontBody`, `fontMono` from `@/lib/fonts`, each a `next/font` object with `.variable` and `.className`; `LocaleLayout` at `src/app/[locale]/layout.tsx` accepting `{ children, params: Promise<{ locale: string }> }`

- [ ] **Step 1: Install next-intl**

```bash
npm install next-intl
```

- [ ] **Step 2: Define the routing config**

```ts
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['id', 'en'],
  defaultLocale: 'id',
});
```

- [ ] **Step 3: Define the request config**

```ts
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  return { locale };
});
```

- [ ] **Step 4: Add the middleware**

```ts
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

- [ ] **Step 5: Wrap the Next.js config with the next-intl plugin**

```ts
// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 6: Add empty message catalogs**

```json
// messages/id.json
{}
```

```json
// messages/en.json
{}
```

- [ ] **Step 7: Define the fonts**

```ts
// src/lib/fonts.ts
import { Bricolage_Grotesque, Plus_Jakarta_Sans, IBM_Plex_Mono } from 'next/font/google';

export const fontDisplay = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display-src',
  display: 'swap',
});

export const fontBody = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body-src',
  display: 'swap',
});

export const fontMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-src',
  display: 'swap',
});
```

- [ ] **Step 8: Delete the default root layout and page**

```bash
rm src/app/layout.tsx src/app/page.tsx
```

- [ ] **Step 9: Create the locale layout**

```tsx
// src/app/[locale]/layout.tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { fontDisplay, fontBody, fontMono } from '@/lib/fonts';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Environesia Company Group',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}
    >
      <body className="font-body antialiased">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

(Header/Footer are added around `{children}` in Task 8, once they exist.)

- [ ] **Step 10: Create a minimal placeholder page**

```tsx
// src/app/[locale]/page.tsx
export default function Home() {
  return <p className="p-12">Environesia Company Group</p>;
}
```

(Replaced with the real `<Section>`-based version in Task 8.)

- [ ] **Step 11: Verify the build**

Run: `npm run build`
Expected: succeeds, prerenders both `/id` and `/en` as static routes.

- [ ] **Step 12: Verify locale redirect and rendering at runtime**

```bash
npm run dev &
sleep 3
curl -sI http://localhost:3000/ | grep -i location
curl -s http://localhost:3000/id | grep -o '<html[^>]*lang="id"'
kill %1
```

Expected: first curl shows a `location: /id` (or `/id/`) redirect header; second curl prints `<html lang="id"`.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: add next-intl routing, fonts, and locale layout"
```

---

### Task 4: Test tooling and the `<Section>` component

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/components/layout/section.tsx`
- Test: `src/components/layout/section.test.tsx`
- Modify: `package.json` (add `test` script)

**Interfaces:**
- Consumes: `--text-*`/`--color-*` tokens from Task 2 (used implicitly via Tailwind utility classes, not directly referenced in code)
- Produces: `Section` component from `@/components/layout/section`, props `{ children: ReactNode; className?: string; as?: 'section' | 'div'; id?: string }`

- [ ] **Step 1: Install test tooling**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Configure Vitest**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 3: Add the test script**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run"
```

- [ ] **Step 4: Write the failing test**

```tsx
// src/components/layout/section.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Section } from './section';

describe('Section', () => {
  it('renders children inside a max-width container', () => {
    render(
      <Section>
        <p>Hello</p>
      </Section>
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies standard vertical padding by default', () => {
    render(
      <Section>
        <p>Hello</p>
      </Section>
    );

    const section = screen.getByText('Hello').closest('section');
    expect(section).toHaveClass('py-14', 'md:py-24');
  });

  it('renders as a div when as="div"', () => {
    render(
      <Section as="div" id="test-section">
        <p>Hello</p>
      </Section>
    );

    expect(document.getElementById('test-section')?.tagName).toBe('DIV');
  });

  it('merges a custom className onto the section element', () => {
    render(
      <Section className="bg-stone">
        <p>Hello</p>
      </Section>
    );

    const section = screen.getByText('Hello').closest('section');
    expect(section).toHaveClass('bg-stone');
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npx vitest run src/components/layout/section.test.tsx`
Expected: FAIL — `Cannot find module './section'`.

- [ ] **Step 6: Implement `<Section>`**

```tsx
// src/components/layout/section.tsx
import type { ReactNode } from 'react';

type SectionProps = {
  children: ReactNode;
  className?: string;
  as?: 'section' | 'div';
  id?: string;
};

export function Section({ children, className = '', as: Tag = 'section', id }: SectionProps) {
  return (
    <Tag id={id} className={`py-14 md:py-24 ${className}`.trim()}>
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">{children}</div>
    </Tag>
  );
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npx vitest run src/components/layout/section.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add Vitest tooling and the Section component"
```

---

### Task 5: Content pipeline (CMS decision)

**Files:**
- Create: `src/lib/content.ts`
- Test: `src/lib/content.test.ts`
- Create fixtures: `src/lib/__fixtures__/sample-collection/first-item.mdx`, `src/lib/__fixtures__/sample-collection/second-item.mdx`
- Create: `content/README.md`

**Interfaces:**
- Consumes: `gray-matter` package
- Produces: `getCollection<T>(collection: string, baseDir?: string)` from `@/lib/content`, returning `Array<{ slug: string; data: T; content: string }>`, sorted by `slug`

- [ ] **Step 1: Install gray-matter**

```bash
npm install gray-matter
```

- [ ] **Step 2: Write the fixtures**

```mdx
{/* src/lib/__fixtures__/sample-collection/first-item.mdx */}
---
title: First item
order: 1
---

Sample body content.
```

```mdx
{/* src/lib/__fixtures__/sample-collection/second-item.mdx */}
---
title: Second item
order: 2
---

Another body.
```

- [ ] **Step 3: Write the failing test**

```ts
// src/lib/content.test.ts
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { getCollection } from './content';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = path.join(__dirname, '__fixtures__');

type SampleEntry = { title: string; order: number };

describe('getCollection', () => {
  it('parses frontmatter and content from every .mdx file in the collection', () => {
    const entries = getCollection<SampleEntry>('sample-collection', FIXTURES_DIR);

    expect(entries).toHaveLength(2);
    expect(entries[0]).toEqual({
      slug: 'first-item',
      data: { title: 'First item', order: 1 },
      content: 'Sample body content.',
    });
    expect(entries[1].slug).toBe('second-item');
  });

  it('returns an empty array when the collection directory does not exist', () => {
    expect(getCollection('missing-collection', FIXTURES_DIR)).toEqual([]);
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npx vitest run src/lib/content.test.ts`
Expected: FAIL — `Cannot find module './content'`.

- [ ] **Step 5: Implement `getCollection`**

```ts
// src/lib/content.ts
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type CollectionEntry<T> = {
  slug: string;
  data: T;
  content: string;
};

export function getCollection<T>(
  collection: string,
  baseDir: string = path.join(process.cwd(), 'content')
): CollectionEntry<T>[] {
  const dir = path.join(baseDir, collection);

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx$/, ''),
        data: data as T,
        content: content.trim(),
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run src/lib/content.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 7: Document the collection convention**

```md
{/* content/README.md */}
# Content collections

MDX-in-repo. Each collection is a folder under `content/<collection>/`,
one `.mdx` file per entry, read at build time via `getCollection` in
`src/lib/content.ts`. No external CMS service.

## entities
nama, slug, tagline, lini (inti | penunjang), warna aksen, deskripsi, layanan[], legalitas[], website, logo, urutan

## projects
judul, slug, entitas[], sektor, negara, kota, tahun, klien (opsional), clientAnonymous (opsional), ringkasan, isi, galeri[], koordinat

## leadership
nama, jabatan, entitas, foto, bio, urutan, tipe (direksi | komisaris)

## posts
judul, slug, kategori, tanggal, penulis, cover, ringkasan, isi

## milestones
tahun, judul, deskripsi, gambar

## pillars
nama, slug, ikon, deskripsi, layanan[], entitas terkait[]

## stats
label, nilai, satuan, urutan

## documents
judul, tipe, file, tanggal terbit

## jobs
posisi, entitas, lokasi, tipe, deskripsi, batas lamaran

Collections are populated starting Fase 2 (`stats`, `entities`) and
Fase 3/5 (`projects`, `leadership`, `posts`, `milestones`, `pillars`,
`jobs`, `documents`). Fase 1 only wires the reader (`getCollection`)
and this convention — no collection folders are created yet.
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add MDX content pipeline"
```

---

### Task 6: Header and mobile nav

**Files:**
- Create: `src/components/layout/header.tsx`
- Create: `src/components/layout/header-mobile-nav.tsx`
- Test: `src/components/layout/header.test.tsx`
- Test: `src/components/layout/header-mobile-nav.test.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks directly (uses plain Tailwind utility classes and `next/link`)
- Produces: `Header` from `@/components/layout/header`, props `{ locale: string }`; `MobileNav` from `@/components/layout/header-mobile-nav`, props `{ locale: string; items: readonly { label: string; href: string }[] }`

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/layout/header.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './header';

describe('Header', () => {
  it('links the group name to the locale home', () => {
    render(<Header locale="id" />);
    expect(screen.getByRole('link', { name: 'Environesia Group' })).toHaveAttribute('href', '/id');
  });

  it('renders every top-level sitemap link in the desktop nav', () => {
    render(<Header locale="id" />);
    const nav = screen.getByRole('navigation', { name: 'Navigasi utama' });
    expect(nav.querySelectorAll('a')).toHaveLength(9);
  });

  it('prefixes links with the active locale', () => {
    render(<Header locale="en" />);
    const nav = screen.getByRole('navigation', { name: 'Navigasi utama' });
    const projectLink = Array.from(nav.querySelectorAll('a')).find((a) => a.textContent === 'Proyek');
    expect(projectLink).toHaveAttribute('href', '/en/proyek');
  });
});
```

```tsx
// src/components/layout/header-mobile-nav.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MobileNav } from './header-mobile-nav';

const items = [
  { label: 'Beranda', href: '/' },
  { label: 'Kontak', href: '/kontak' },
] as const;

describe('MobileNav', () => {
  it('hides the menu until the toggle is clicked', () => {
    render(<MobileNav locale="id" items={items} />);
    expect(screen.queryByRole('navigation', { name: 'Navigasi mobile' })).not.toBeInTheDocument();
  });

  it('shows locale-prefixed links after clicking the toggle', async () => {
    const user = userEvent.setup();
    render(<MobileNav locale="id" items={items} />);

    await user.click(screen.getByRole('button', { name: 'Menu' }));

    expect(screen.getByRole('navigation', { name: 'Navigasi mobile' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Kontak' })).toHaveAttribute('href', '/id/kontak');
  });

  it('closes the menu after a link is clicked', async () => {
    const user = userEvent.setup();
    render(<MobileNav locale="id" items={items} />);

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    await user.click(screen.getByRole('link', { name: 'Kontak' }));

    expect(screen.queryByRole('navigation', { name: 'Navigasi mobile' })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/layout/header.test.tsx src/components/layout/header-mobile-nav.test.tsx`
Expected: FAIL — both modules missing.

- [ ] **Step 3: Implement `MobileNav`**

```tsx
// src/components/layout/header-mobile-nav.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

type NavItem = { label: string; href: string };

export function MobileNav({ locale, items }: { locale: string; items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        className="p-2 text-small text-ink"
      >
        {open ? 'Tutup' : 'Menu'}
      </button>
      {open ? (
        <nav
          id="mobile-nav-menu"
          aria-label="Navigasi mobile"
          className="absolute inset-x-0 top-full border-b border-line bg-paper px-6 py-4"
        >
          <ul className="flex flex-col gap-4">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={`/${locale}${item.href === '/' ? '' : item.href}`}
                  className="text-small text-ink hover:text-forest"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Implement `Header`**

```tsx
// src/components/layout/header.tsx
import Link from 'next/link';
import { MobileNav } from './header-mobile-nav';

const NAV_ITEMS = [
  { label: 'Beranda', href: '/' },
  { label: 'Entitas', href: '/entitas' },
  { label: 'Pimpinan', href: '/pimpinan' },
  { label: 'Bisnis', href: '/bisnis' },
  { label: 'Tentang Kami', href: '/tentang-kami' },
  { label: 'Proyek', href: '/proyek' },
  { label: 'Berita', href: '/berita' },
  { label: 'Karier', href: '/karier' },
  { label: 'Kontak', href: '/kontak' },
] as const;

export function Header({ locale }: { locale: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 md:px-12">
        <Link href={`/${locale}`} className="font-display text-h3 font-semibold text-forest">
          Environesia Group
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigasi utama">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href === '/' ? '' : item.href}`}
              className="text-small text-ink hover:text-forest"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <MobileNav locale={locale} items={NAV_ITEMS} />
      </div>
    </header>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/components/layout/header.test.tsx src/components/layout/header-mobile-nav.test.tsx`
Expected: PASS (6 tests).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Header and mobile nav"
```

---

### Task 7: Footer

**Files:**
- Create: `src/components/layout/footer.tsx`
- Test: `src/components/layout/footer.test.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks directly
- Produces: `Footer` from `@/components/layout/footer`, props `{ locale: string }`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/layout/footer.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './footer';

describe('Footer', () => {
  it('renders the head office address', () => {
    render(<Footer locale="id" />);
    expect(screen.getByText(/Jl\. Jati Mataram No\. 284B/)).toBeInTheDocument();
    expect(screen.getByText(/55284/)).toBeInTheDocument();
  });

  it('renders locale-prefixed footer links', () => {
    render(<Footer locale="en" />);
    expect(screen.getByRole('link', { name: 'Kontak' })).toHaveAttribute('href', '/en/kontak');
  });

  it('renders the current year in the copyright line', () => {
    render(<Footer locale="id" />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/layout/footer.test.tsx`
Expected: FAIL — `Cannot find module './footer'`.

- [ ] **Step 3: Implement `Footer`**

```tsx
// src/components/layout/footer.tsx
import Link from 'next/link';

const FOOTER_LINKS = [
  { label: 'Entitas', href: '/entitas' },
  { label: 'Proyek', href: '/proyek' },
  { label: 'Berita', href: '/berita' },
  { label: 'Karier', href: '/karier' },
  { label: 'Unduhan', href: '/unduhan' },
  { label: 'Kontak', href: '/kontak' },
] as const;

export function Footer({ locale }: { locale: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-stone">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-h3 font-semibold text-forest">Environesia Group</p>
            <p className="mt-3 font-mono text-label uppercase text-slate">Grha Environesia (Lantai 2)</p>
            <address className="mt-1 text-small not-italic text-slate">
              Jl. Jati Mataram No. 284B, Karangjati
              <br />
              Sinduadi, Mlati, Sleman
              <br />
              Daerah Istimewa Yogyakarta 55284
            </address>
          </div>
          <nav aria-label="Navigasi footer">
            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={`/${locale}${item.href}`} className="text-small text-ink hover:text-forest">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-12 font-mono text-label uppercase text-slate">
          © {year} Environesia Company Group
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/layout/footer.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Footer with head office address"
```

---

### Task 8: Wire the layout together

**Files:**
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `Header` (Task 6), `Footer` (Task 7), `Section` (Task 4), `fontDisplay`/`fontBody`/`fontMono` (Task 3), `routing` (Task 3)
- Produces: the finished Fase 1 deliverable — a locale-aware page shell with header, footer, and a token-driven homepage placeholder

- [ ] **Step 1: Render Header and Footer around the page content**

```tsx
// src/app/[locale]/layout.tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { fontDisplay, fontBody, fontMono } from '@/lib/fonts';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Environesia Company Group',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}
    >
      <body className="font-body antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          {children}
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Replace the placeholder page with a `<Section>`-based homepage stub**

```tsx
// src/app/[locale]/page.tsx
import { Section } from '@/components/layout/section';

export default function Home() {
  return (
    <Section>
      <p className="font-mono text-label uppercase text-slate">Environesia Company Group</p>
      <h1 className="mt-4 font-display text-display text-ink">
        Satu grup, lima entitas, satu tujuan lingkungan.
      </h1>
    </Section>
  );
}
```

- [ ] **Step 3: Full verification — build**

Run: `npm run build`
Expected: succeeds, both `/id` and `/en` prerendered.

- [ ] **Step 4: Full verification — all tests**

Run: `npm run test`
Expected: PASS — all suites from Tasks 4, 5, 6, 7 (Section, content, Header, MobileNav, Footer) green, no failures.

- [ ] **Step 5: Full verification — runtime check**

```bash
npm run dev &
sleep 3
curl -s http://localhost:3000/id | grep -o 'Satu grup, lima entitas'
curl -s http://localhost:3000/id | grep -o 'Jl\. Jati Mataram'
kill %1
```

Expected: both greps print a match — the headline and the footer address both render on the live page.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: wire Header, Footer, and Section into the locale layout"
```

---

## Fase 1 exit criteria

- `npm run build` and `npm run test` both pass.
- Visiting `/` redirects to `/id`; `/en` also resolves (untranslated).
- Header shows all 9 top-level sitemap links, collapses to a working mobile toggle under `md`.
- Footer shows the confirmed Grha Environesia address and links.
- `<Section>` is the only component applying section padding.
- `content/README.md` documents all 9 collections; `getCollection` is ready for Fase 2 to start populating `content/stats/` and `content/entities/`.
