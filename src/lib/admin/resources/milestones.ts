import { z } from 'zod';
import type { ResourceConfig } from './types';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export const milestonesResource: ResourceConfig = {
  slug: 'milestones',
  table: 'milestones',
  title: 'Milestones',
  singular: 'Milestone',
  titleField: 'title',
  hasStatus: true,
  hasSortOrder: true,
  softDelete: false,
  authorScoped: false,
  defaultSort: { column: 'sort_order', ascending: true },
  columns: [
    { key: 'year', label: 'Tahun' },
    { key: 'title', label: 'Judul' },
    { key: 'status', label: 'Status', kind: 'status' },
    { key: 'sort_order', label: 'Urutan' },
  ],
  fields: [
    { name: 'year', label: 'Tahun', type: 'number', required: true, section: 'Basic Information' },
    { name: 'date_label', label: 'Tanggal (opsional, mis. "13 Januari 2018")', type: 'text', section: 'Basic Information' },
    { name: 'title', label: 'Judul', type: 'text', required: true, section: 'Basic Information' },
    { name: 'description', label: 'Cerita / Narasi', type: 'textarea', section: 'Details' },
    { name: 'image_path', label: 'Gambar', type: 'image', mediaFolder: 'general', section: 'Media' },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, required: true, section: 'Publishing' },
    { name: 'sort_order', label: 'Urutan', type: 'number', section: 'Publishing' },
  ],
  schema: z.object({
    year: z.coerce.number().int(),
    date_label: z.string().optional().nullable(),
    title: z.string().min(1),
    description: z.string().optional().nullable(),
    image_path: z.string().optional().nullable(),
    status: z.enum(['draft', 'published', 'archived']),
    sort_order: z.coerce.number().int().default(0),
  }),
};
