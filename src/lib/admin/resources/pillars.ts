import { z } from 'zod';
import type { ResourceConfig } from './types';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export const pillarsResource: ResourceConfig = {
  slug: 'pillars',
  table: 'business_pillars',
  title: 'Business Pillars',
  singular: 'Pillar',
  titleField: 'name',
  slugSource: 'name',
  hasStatus: true,
  hasSortOrder: true,
  softDelete: false,
  authorScoped: false,
  defaultSort: { column: 'sort_order', ascending: true },
  relation: { table: 'pillar_entities', thisKey: 'pillar_id', otherKey: 'entity_id', fieldName: 'relatedEntities' },
  columns: [
    { key: 'name', label: 'Nama' },
    { key: 'slug', label: 'Slug' },
    { key: 'status', label: 'Status', kind: 'status' },
    { key: 'sort_order', label: 'Urutan' },
  ],
  fields: [
    { name: 'name', label: 'Nama', type: 'text', required: true, section: 'Basic Information' },
    { name: 'slug', label: 'Slug', type: 'text', section: 'Basic Information' },
    { name: 'icon', label: 'Ikon', type: 'text', help: 'Nama ikon (mis. leaf, flask, graduation-cap).', section: 'Basic Information' },
    { name: 'short_description', label: 'Deskripsi Singkat', type: 'textarea', section: 'Details' },
    { name: 'description', label: 'Deskripsi Lengkap', type: 'richtext', section: 'Details' },
    { name: 'services', label: 'Layanan', type: 'tags', section: 'Details' },
    { name: 'relatedEntities', label: 'Entitas Terkait', type: 'entity-multiselect', section: 'Relations' },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, required: true, section: 'Publishing' },
    { name: 'sort_order', label: 'Urutan', type: 'number', section: 'Publishing' },
  ],
  schema: z.object({
    name: z.string().min(1),
    slug: z.string().optional(),
    icon: z.string().optional().nullable(),
    short_description: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    services: z.array(z.string()).default([]),
    relatedEntities: z.array(z.string()).default([]),
    status: z.enum(['draft', 'published', 'archived']),
    sort_order: z.coerce.number().int().default(0),
  }),
};
