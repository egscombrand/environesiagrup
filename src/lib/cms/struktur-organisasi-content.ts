import { LEGACY_MEDIA } from './legacy-media';

/**
 * The Struktur Organisasi copy and chart as the tab shows it today. Pure, so the
 * seed (migration 0036) is generated from it.
 *
 * The page shows one heading and one organisational chart image. The chart is
 * stored under the key `bagan` with its alt text. The entity list belongs to the
 * Entitas & Kapabilitas editor and is not shown on this page.
 */

export const STRUKTUR_IMAGE_KEY = 'bagan';

/** The chart's Storage path, copied from /public by the import script. */
export const STRUKTUR_IMAGE_PATH = LEGACY_MEDIA['/Struktur EGS 2026.jpg.jpeg'].path;

export const STRUKTUR_FALLBACK = {
  title: 'Environesia',
  imageAlt: 'Struktur Organisasi dan Tata Kerja PT Environesia Global Saraya',
  /** The public-folder copy, used when no chart is stored. */
  defaultImageSrc: '/Struktur EGS 2026.jpg.jpeg',
  metaTitle: 'Struktur Organisasi',
  metaDescription: 'Susunan Environesia dan entitas di bawahnya.',
};
