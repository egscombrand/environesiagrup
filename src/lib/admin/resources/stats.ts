import { z } from 'zod';
import type { ResourceConfig } from './types';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export const statsResource: ResourceConfig = {
  slug: 'stats',
  table: 'stats',
  title: 'Statistics',
  singular: 'Stat',
  titleField: 'label',
  hasStatus: true,
  hasSortOrder: true,
  softDelete: false,
  authorScoped: false,
  defaultSort: { column: 'sort_order', ascending: true },
  columns: [
    { key: 'label', label: 'Label' },
    { key: 'value', label: 'Nilai' },
    { key: 'status', label: 'Status', kind: 'status' },
    { key: 'sort_order', label: 'Urutan' },
  ],
  fields: [
    { name: 'label', label: 'Label', type: 'text', required: true, section: 'Basic Information' },
    { name: 'value', label: 'Nilai', type: 'number', required: true, section: 'Basic Information' },
    { name: 'prefix', label: 'Prefix', type: 'text', section: 'Basic Information' },
    { name: 'suffix', label: 'Suffix', type: 'text', section: 'Basic Information' },
    { name: 'description', label: 'Deskripsi', type: 'textarea', section: 'Details' },
    { name: 'icon', label: 'Ikon', type: 'text', section: 'Details' },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, required: true, section: 'Publishing' },
    { name: 'sort_order', label: 'Urutan', type: 'number', section: 'Publishing' },
  ],
  schema: z.object({
    label: z.string().min(1),
    value: z.coerce.number(),
    prefix: z.string().optional().nullable(),
    suffix: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    icon: z.string().optional().nullable(),
    status: z.enum(['draft', 'published', 'archived']),
    sort_order: z.coerce.number().int().default(0),
  }),
};
