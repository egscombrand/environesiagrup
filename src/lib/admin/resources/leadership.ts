import { z } from 'zod';
import type { ResourceConfig } from './types';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export const leadershipResource: ResourceConfig = {
  slug: 'leadership',
  table: 'leadership',
  title: 'Leadership',
  singular: 'Leader',
  titleField: 'name',
  slugSource: 'name',
  hasStatus: true,
  hasSortOrder: true,
  softDelete: false,
  authorScoped: false,
  defaultSort: { column: 'sort_order', ascending: true },
  columns: [
    { key: 'photo_path', label: '', kind: 'image' },
    { key: 'name', label: 'Nama' },
    { key: 'position', label: 'Jabatan' },
    { key: 'type', label: 'Tipe' },
    { key: 'status', label: 'Status', kind: 'status' },
  ],
  fields: [
    { name: 'name', label: 'Nama', type: 'text', required: true, section: 'Basic Information' },
    { name: 'slug', label: 'Slug', type: 'text', section: 'Basic Information' },
    { name: 'position', label: 'Jabatan', type: 'text', required: true, section: 'Basic Information' },
    {
      name: 'type',
      label: 'Tipe',
      type: 'select',
      required: true,
      options: [
        { value: 'direksi', label: 'Direksi' },
        { value: 'komisaris', label: 'Komisaris' },
        { value: 'lainnya', label: 'Lainnya' },
      ],
      section: 'Basic Information',
    },
    { name: 'photo_path', label: 'Foto', type: 'image', mediaFolder: 'leadership', section: 'Media' },
    { name: 'bio', label: 'Bio', type: 'textarea', section: 'Details' },
    { name: 'entity_id', label: 'Entitas', type: 'entity-select', section: 'Relations' },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, required: true, section: 'Publishing' },
    { name: 'sort_order', label: 'Urutan', type: 'number', section: 'Publishing' },
  ],
  schema: z.object({
    name: z.string().min(1),
    slug: z.string().optional(),
    position: z.string().min(1),
    type: z.enum(['direksi', 'komisaris', 'lainnya']),
    photo_path: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    entity_id: z.string().uuid().optional().nullable().or(z.literal('')),
    status: z.enum(['draft', 'published', 'archived']),
    sort_order: z.coerce.number().int().default(0),
  }),
};
