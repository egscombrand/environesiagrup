import { z } from 'zod';
import type { ResourceConfig } from './types';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export const jobsResource: ResourceConfig = {
  slug: 'jobs',
  table: 'jobs',
  title: 'Jobs',
  singular: 'Job',
  titleField: 'title',
  slugSource: 'title',
  hasStatus: true,
  hasSortOrder: false,
  softDelete: true,
  authorScoped: true,
  defaultSort: { column: 'created_at', ascending: false },
  columns: [
    { key: 'title', label: 'Posisi' },
    { key: 'location', label: 'Lokasi' },
    { key: 'employment_type', label: 'Tipe' },
    { key: 'status', label: 'Status', kind: 'status' },
  ],
  fields: [
    { name: 'title', label: 'Posisi', type: 'text', required: true, section: 'Basic Information' },
    { name: 'slug', label: 'Slug', type: 'text', section: 'Basic Information' },
    { name: 'entity_id', label: 'Entitas', type: 'entity-select', section: 'Basic Information' },
    { name: 'location', label: 'Lokasi', type: 'text', section: 'Basic Information' },
    { name: 'employment_type', label: 'Tipe Pekerjaan', type: 'text', placeholder: 'Full-time, Kontrak, ...', section: 'Basic Information' },
    { name: 'deadline', label: 'Batas Lamaran', type: 'date', section: 'Basic Information' },
    { name: 'description', label: 'Deskripsi', type: 'richtext', section: 'Details' },
    { name: 'requirements', label: 'Persyaratan', type: 'richtext', section: 'Details' },
    { name: 'responsibilities', label: 'Tanggung Jawab', type: 'richtext', section: 'Details' },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, required: true, section: 'Publishing' },
  ],
  schema: z.object({
    title: z.string().min(1),
    slug: z.string().optional(),
    entity_id: z.string().uuid().optional().nullable().or(z.literal('')),
    location: z.string().optional().nullable(),
    employment_type: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    requirements: z.string().optional().nullable(),
    responsibilities: z.string().optional().nullable(),
    deadline: z.string().optional().nullable(),
    status: z.enum(['draft', 'published', 'archived']),
  }),
};
