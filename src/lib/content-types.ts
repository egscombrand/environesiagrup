export type StatEntry = {
  label: string;
  nilai: number;
  satuan: string;
  urutan: number;
};

export type EntityLini = 'inti' | 'penunjang';

export type EntityEntry = {
  nama: string;
  slug: string;
  tagline?: string;
  lini: EntityLini;
  warnaAksen: string;
  deskripsi: string;
  layanan: string[];
  legalitas: string[];
  website?: string;
  logo?: string;
  urutan: number;
};

export type PillarEntry = {
  nama: string;
  slug: string;
  ikon: string;
  deskripsi: string;
  layanan: string[];
  entitasTerkait: string[];
  urutan: number;
};

export type HeroSlideEntry = {
  type: 'image' | 'video';
  src: string;
  srcMobile?: string;
  poster?: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaUrl: string;
  accentColor?: string;
  urutan: number;
};

export type ProjectPin = {
  judul: string;
  negara: string;
  kota?: string;
  koordinat: [number, number];
};

export type PostSummary = {
  judul: string;
  slug: string;
  tanggal: string;
  ringkasan: string;
};
