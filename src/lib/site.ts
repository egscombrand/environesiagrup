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

// The address as rendered to humans, derived from the structured OFFICE_ADDRESS
// above so the footer, the contact page, and the JSON-LD can never disagree.
export const OFFICE_ADDRESS_LINES = [
  'Jl. Jati Mataram No. 284B, Karangjati',
  'Sinduadi, Mlati, Sleman',
  'Daerah Istimewa Yogyakarta 55284',
] as const;

export const OFFICE_BUILDING = 'Grha Environesia (Lantai 2)';

// Tagline as it appears beneath the wordmark in the official logo artwork.
// Kept as text rather than baked into the image so it stays legible at small
// sizes, indexable, and translatable when the English locale gets real copy.
// The lead is set in a heavier weight in the artwork; BRAND_TAGLINE is the
// flat string for metadata and structured data.
export const BRAND_TAGLINE_LEAD = 'The World-Class';
export const BRAND_TAGLINE_REST = 'Integrated Green Ecosystem';
export const BRAND_TAGLINE = `${BRAND_TAGLINE_LEAD} ${BRAND_TAGLINE_REST}`;
