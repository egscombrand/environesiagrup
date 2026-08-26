# Trilingual UI — Design

**Status:** approved 2026-08-26
**Scope:** interface strings only. Content stays single-language; see "Out of scope".

## Problem

`next-intl` is installed and routing works (`/id`, `/en`), but it has never
carried a single translated string: both message catalogs are empty `{}` and no
component calls `useTranslations`. `/en` today is a second URL rendering the
same Indonesian text — which also means search engines see two near-duplicate
pages.

The goal is three real languages: Indonesian (default), English, and Simplified
Chinese.

## Decisions taken

| Question | Decision | Why |
|---|---|---|
| Scope | UI strings now, content later | Content lives in Supabase with no locale column; adding one changes the schema, every query, and the admin forms Lutfi just shipped. Splitting keeps this phase deliverable. |
| Chinese variant | Simplified, `zh-CN`, routed as `/zh` | Mainland China and Singapore. Traditional would be a separate locale, doubling translation work. |
| Translation source | Drafted here, reviewed by the owner | These are short functional labels, not brand narrative. Low risk, and the site becomes trilingual today rather than waiting. |
| Brand tagline | Not translated | "The World-Class Integrated Green Ecosystem" is English in the official logo artwork. Brand taglines conventionally survive untranslated. |
| Entity names | Not translated | Proper nouns: GreenLab, Environesia, LSP Praktisi Lingkungan Indonesia. |
| Office address | Not translated | A postal address is routing information, not prose. |

## Approach: typed dictionary, not next-intl's message API

Strings live in a TypeScript module keyed by locale. Components read them
synchronously using the `locale` they already receive:

```tsx
const t = messagesFor(locale);
<h2>{t.entitas.semuaEntitas}</h2>
```

`next-intl` is retained for what it currently does well — routing, locale
detection, middleware — and not used for messages.

### Why not next-intl's message API

It was probed, not assumed. A Server Component calling `getTranslations()`
fails under the test environment:

```
Error: `getTranslations` is not supported in Client Components.
```

All 131 existing tests render components and pages directly; that is what let
them catch real defects repeatedly during this build. Adopting the server API
would require mocking `next-intl` across 42 test files, and mocked tests verify
less than the ones they replace. Its ICU features (pluralisation,
interpolation) are not currently used by any string on the site.

### What the typed dictionary buys

- **The compiler enforces completeness.** The dictionary is typed so that every
  locale must supply every key. A key added to `id` but forgotten in `zh` fails
  the build rather than silently rendering Indonesian on a Chinese page — the
  single most likely failure mode for this kind of work.
- **Synchronous.** No component becomes `async` to display text.
- **Tests keep working.** They pass a locale; nothing else changes.
- **Reversible.** Strings stay centralised, so moving to next-intl later is a
  migration, not a rewrite.

## Structure

```
src/i18n/
  routing.ts        # add 'zh'
  messages.ts       # the dictionary + messagesFor(locale)
```

The dictionary is namespaced by area so keys stay readable and collisions are
structurally impossible:

```ts
type Messages = {
  nav: { beranda: string; entitas: string; /* ... */ };
  common: { pendingContent: string; /* ... */ };
  entitas: { semuaEntitas: string; /* ... */ };
  // ...
};

const id: Messages = { /* ... */ };
const en: Messages = { /* ... */ };
const zh: Messages = { /* ... */ };
```

Each locale is annotated `: Messages`, so a missing or misspelled key is a type
error at that declaration.

`messagesFor(locale: string): Messages` returns the matching locale, falling
back to Indonesian for an unrecognised value. The fallback is a runtime guard
for bad input, not a translation strategy — completeness is the type system's
job.

## Threading

Ten of twenty public components already receive `locale`. Of the ten that do
not, most render no text at all (`Section` is pure layout; `BrandTagline` is
deliberately untranslated). The few that do need `locale` added get it from
their parent page, which always has it.

## Locale metadata

- `routing.locales` becomes `['id', 'en', 'zh']`, default `id`.
- `ogLocale` maps `zh` → `zh_CN` alongside the existing `id_ID` and `en_US`.
- `buildMetadata` already derives `alternates.languages` from `routing.locales`,
  so hreflang picks up Chinese with no change there.
- `sitemap.ts` already iterates `routing.locales`, so every route gains a `/zh`
  entry automatically. Its tests assert specific locales and will need the third.

## Language switcher

A control in the header, listing the three languages and linking to the current
path under each locale. It must preserve the path — a visitor switching language
on `/id/entitas/greenlab` belongs on `/en/entitas/greenlab`, not the homepage.

## Testing

- A test asserting all three locales expose the same key set, so a future key
  added to one locale cannot ship half-translated even if someone bypasses the
  type annotation.
- A test that the language switcher preserves the current path across locales.
- Existing tests updated where they assert Indonesian strings that now come from
  the dictionary.

## Out of scope

- **Content translation.** Entities, pillars, posts, projects, documents, and
  jobs come from Supabase, whose schema has no locale column. Making content
  multilingual means schema changes, query changes, and admin form changes.
  It is a separate phase and should be coordinated with whoever owns the admin
  panel.
- **Traditional Chinese.**
- **Translating brand assets.** The logo artwork carries English text; it is not
  regenerated per locale.

## Consequence to accept

Until content is translated, a visitor on `/zh` sees Chinese navigation, labels,
and empty states wrapped around Indonesian content. That is a deliberate
intermediate state, not a defect — it is the direct consequence of the scope
decision above, and it is visible to the owner rather than hidden.
