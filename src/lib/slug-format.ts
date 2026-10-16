/**
 * Pure slug formatting, with no `server-only` dependency, so both server code
 * (src/lib/admin/slug.ts, which re-exports this) and client components (the
 * live "what will my slug be" preview in slug-field.tsx) can use the exact
 * same rule. Lowercases, strips Indonesian/accented diacritics, and turns
 * every run of non-alphanumeric characters into a single hyphen.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}
