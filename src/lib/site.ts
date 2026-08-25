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
