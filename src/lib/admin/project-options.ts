// Single source of truth for the two constrained Project dropdowns (Sektor,
// Perusahaan) — shared by the admin resource config (src/lib/admin/resources/projects.ts)
// and the PDF import rule engine (src/lib/admin/pdf-import.ts), so the
// engine is never asked to classify into a list that doesn't match what the
// manual "Add Project" form actually offers.

export const SECTOR_VALUES = [
  'Transportasi',
  'Rumah Sakit',
  'Pengolahan Limbah & Persampahan',
  'Pemerintahan & Fasilitas Publik',
  'Migas & Pertambangan',
  'Industri',
  'Energi & Ketenagalistrikan',
] as const;
export type SectorValue = (typeof SECTOR_VALUES)[number];
export const SECTOR_OPTIONS = SECTOR_VALUES.map((v) => ({ value: v, label: v }));

// "Belum Ditentukan" is listed FIRST — see projects.ts for why: it's the
// honest default a form (or an unsure AI) should land on, never a silent
// assumption that every project belongs to Environesia Consultant.
export const COMPANY_VALUES = [
  'Belum Ditentukan',
  'Environesia Company Group',
  'Environesia Consultant',
  'GreenLab',
  'GreenSkill',
  'LSP Praktisi Lingkungan Indonesia',
  'Bikin Indonesia Berdaya',
] as const;
export const COMPANY_OPTIONS = COMPANY_VALUES.map((v) => ({ value: v, label: v }));
