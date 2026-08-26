// Shared, cross-referenced fixtures mirroring the real migrated content
// (content/entities, content/pillars) — reused across page-level tests so
// entity <-> pillar relations (by id) stay consistent everywhere they're used.
import { makeEntity, makePillar } from '@/lib/cms/fixtures';

export const ENTITIES = [
  makeEntity({
    name: 'Environesia',
    slug: 'environesia',
    lini: 'inti',
    accent_color: '#0F4C3A',
    short_description: 'Konsultasi lingkungan.',
    services: [],
    legalitas: [],
    sort_order: 1,
  }),
  makeEntity({
    name: 'GreenLab',
    slug: 'greenlab',
    lini: 'inti',
    accent_color: '#1E7A6B',
    short_description: 'Laboratorium & sampling.',
    services: [],
    legalitas: ['KAN ISO/IEC 17025 (nomor akreditasi menyusul)'],
    website: 'toolsgl.my.id',
    sort_order: 2,
  }),
  makeEntity({
    name: 'GreenSkill',
    slug: 'greenskill',
    lini: 'inti',
    accent_color: '#B07C25',
    short_description: 'Pelatihan kompetensi.',
    services: [],
    legalitas: [],
    sort_order: 3,
  }),
  makeEntity({
    name: 'LSP Praktisi Lingkungan Indonesia',
    slug: 'lsp-praktisi-lingkungan',
    lini: 'inti',
    accent_color: '#454A85',
    short_description: 'Sertifikasi profesi.',
    services: [],
    legalitas: ['Lisensi BNSP (nomor menyusul)'],
    sort_order: 4,
  }),
  makeEntity({
    name: 'Bikin Indonesia Berdaya',
    slug: 'bikin-indonesia-berdaya',
    lini: 'penunjang',
    accent_color: '#A8482D',
    short_description: 'Konveksi custom apparel.',
    services: [],
    legalitas: [],
    sort_order: 5,
  }),
];

const entityIdBySlug = (slug: string) => ENTITIES.find((e) => e.slug === slug)!.id;

export const PILLARS = [
  makePillar({
    name: 'Konsultasi Lingkungan',
    slug: 'konsultasi',
    icon: 'leaf',
    short_description: 'Konsultasi lingkungan untuk klien korporat dan instansi pemerintah.',
    services: [],
    sort_order: 1,
    relatedEntityIds: [entityIdBySlug('environesia')],
  }),
  makePillar({
    name: 'Pengujian & Sampling',
    slug: 'pengujian-sampling',
    icon: 'flask',
    short_description: 'Pengujian laboratorium dan sampling lapangan.',
    services: [],
    sort_order: 2,
    relatedEntityIds: [entityIdBySlug('greenlab')],
  }),
  makePillar({
    name: 'Pelatihan Kompetensi',
    slug: 'pelatihan-kompetensi',
    icon: 'graduation-cap',
    short_description: 'Pelatihan kompetensi bidang lingkungan.',
    services: [],
    sort_order: 3,
    relatedEntityIds: [entityIdBySlug('greenskill')],
  }),
  makePillar({
    name: 'Sertifikasi Profesi',
    slug: 'sertifikasi-profesi',
    icon: 'badge-check',
    short_description: 'Sertifikasi profesi lingkungan.',
    services: [],
    sort_order: 4,
    relatedEntityIds: [entityIdBySlug('lsp-praktisi-lingkungan')],
  }),
];
