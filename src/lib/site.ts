// No production domain is confirmed yet (hosting is TBD in project.md §6).
// Set NEXT_PUBLIC_SITE_URL at deploy time; the fallback is a placeholder that
// must not ship to production unreplaced.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.invalid';

// Office address moved to site_settings.address (managed from
// /wp-admin/site/settings) — see src/lib/cms/settings.ts. Header, footer,
// the contact page, and JSON-LD all read it from there now.

// Tagline as it appears beneath the wordmark in the official logo artwork.
// Kept as text rather than baked into the image so it stays legible at small
// sizes, indexable, and translatable when the English locale gets real copy.
// The lead is set in a heavier weight in the artwork; BRAND_TAGLINE is the
// flat string for metadata and structured data.
export const BRAND_TAGLINE_LEAD = 'The World-Class';
export const BRAND_TAGLINE_REST = 'Integrated Green Ecosystem';
export const BRAND_TAGLINE = `${BRAND_TAGLINE_LEAD} ${BRAND_TAGLINE_REST}`;
