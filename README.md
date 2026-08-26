# Environesia Company Group — Company Profile

Corporate website for Environesia Company Group, a group of five
environmental-services entities. Built with Next.js 15 (App Router),
Tailwind CSS v4, and next-intl for `id`/`en` locale routing.


## Environment setup

Content now lives in Supabase, so the app needs credentials before it will
build — a bare `npm run build` fails at page-data collection with
`Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL`.

Copy `.env.example` to `.env.local` and fill in the real values:

```bash
cp .env.example .env.local
```

`SUPABASE_SERVICE_ROLE_KEY` bypasses row level security entirely. Keep it
server-side, never prefix it with `NEXT_PUBLIC_`, and rotate it in the
Supabase dashboard if it is ever exposed.

## Tech stack

- **Next.js 15** (App Router, Turbopack)
- **Tailwind CSS v4** (`@theme` design tokens in `src/app/globals.css`)
- **next-intl** for locale-prefixed routing (`/id/...`, `/en/...`, `id` default)
- **MDX-in-repo** content collections, read at build time via `getCollection`
  (`src/lib/content.ts`) — no external CMS
- **Vitest** + Testing Library for unit/component tests

## Getting started

Requires Node `^20.19.0` or `>=22.12.0` (see `engines` in `package.json`).

```bash
npm install
npm run dev     # start the dev server
npm run build   # production build
npm run test    # run the Vitest suite
npm run lint    # eslint
```

## Route structure

Every route lives under `src/app/[locale]/`, statically generated for both
`id` (default) and `en` (scaffolded, not yet fully translated) via
`generateStaticParams()` in `src/app/[locale]/layout.tsx`.

## Further reading

- `project.md` — product/design brief for the site
- `docs/superpowers/plans/2026-08-24-fase-1-fondasi.md` — Fase 1 implementation plan
- `content/README.md` — content collection conventions
