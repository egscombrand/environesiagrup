import { z } from 'zod';
import type { ResourceConfig } from './types';

// Klien & Mitra: the logos shown on the Proyek & Insight page and the homepage
// trust wall. Each row is one client, shown or hidden with `active`.
export const clientsResource: ResourceConfig = {
  slug: 'clients',
  table: 'clients',
  title: 'Klien & Mitra',
  singular: 'Klien',
  titleField: 'client_name',
  description: 'Klien dan mitra yang logonya tampil di halaman Proyek & Insight dan beranda.',
  searchPlaceholder: 'Cari klien atau mitra…',
  hasStatus: false,
  hasSortOrder: true,
  softDelete: false,
  authorScoped: false,
  defaultSort: { column: 'sort_order', ascending: true },
  columns: [
    { key: 'client_name', label: 'Nama' },
    { key: 'active', label: 'Tampil', kind: 'badge' },
    { key: 'sort_order', label: 'Urutan' },
  ],
  fields: [
    { name: 'client_name', label: 'Nama klien / mitra', type: 'text', required: true, section: 'Basic Information' },
    { name: 'logo_path', label: 'Logo', type: 'image', mediaFolder: 'general', section: 'Media' },
    { name: 'active', label: 'Tampilkan di website', type: 'boolean', section: 'Publishing' },
    { name: 'sort_order', label: 'Urutan', type: 'number', section: 'Publishing' },
  ],
  schema: z.object({
    client_name: z.string().min(1),
    logo_path: z.string().optional().nullable(),
    active: z.coerce.boolean().default(false),
    sort_order: z.coerce.number().int().default(0),
  }),
};
