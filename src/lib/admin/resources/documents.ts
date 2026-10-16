import { z } from 'zod';
import type { ResourceConfig } from './types';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

const CATEGORY_OPTIONS = [
  'Company Profile',
  'Legal',
  'Certification',
  'License',
  'Report',
  'Other',
].map((value) => ({ value, label: value }));

export const documentsResource: ResourceConfig = {
  slug: 'documents',
  table: 'documents',
  title: 'Documents',
  singular: 'Document',
  titleField: 'title',
  slugSource: 'title',
  hasStatus: true,
  hasSortOrder: true,
  softDelete: true,
  authorScoped: true,
  defaultSort: { column: 'sort_order', ascending: true },
  columns: [
    { key: 'title', label: 'Judul' },
    { key: 'category', label: 'Kategori', kind: 'badge' },
    { key: 'status', label: 'Status', kind: 'status' },
  ],
  fields: [
    { name: 'title', label: 'Judul', type: 'text', required: true, section: 'Basic Information' },
    { name: 'slug', label: 'Slug', type: 'slug', section: 'Basic Information' },
    { name: 'description', label: 'Deskripsi', type: 'textarea', section: 'Basic Information' },
    { name: 'category', label: 'Kategori', type: 'select', options: CATEGORY_OPTIONS, required: true, section: 'Basic Information' },
    { name: 'file_path', label: 'File', type: 'file', mediaFolder: 'documents', section: 'File' },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, required: true, section: 'Publishing' },
    { name: 'sort_order', label: 'Urutan', type: 'number', section: 'Publishing' },
  ],
  schema: z.object({
    title: z.string().min(1),
    slug: z.string().optional(),
    description: z.string().optional().nullable(),
    category: z.enum(['Company Profile', 'Legal', 'Certification', 'License', 'Report', 'Other']),
    file_path: z.string().optional().nullable(),
    status: z.enum(['draft', 'published', 'archived']),
    sort_order: z.coerce.number().int().default(0),
  }),
};
