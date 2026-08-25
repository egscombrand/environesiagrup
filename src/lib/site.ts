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
