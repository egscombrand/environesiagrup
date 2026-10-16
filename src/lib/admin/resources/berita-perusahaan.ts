import { z } from 'zod';
import type { ResourceConfig } from './types';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

/**
 * News the company writes and publishes itself — kabar, kegiatan, dan
 * pencapaian. Shares the "posts" table with Siaran Pers (./siaran-pers.ts)
 * but is kept to its own rows via `scope` — see crud.ts. Unlike a press
 * clipping, this has a real authored body and no external source_url, so
 * those press-specific fields (owner/media/source_url, scraped thumbnail)
 * have no place in this editor.
 */
export const beritaPerusahaanResource: ResourceConfig = {
  slug: 'berita-perusahaan',
  table: 'posts',
  title: 'Berita Perusahaan',
  singular: 'Berita',
  titleField: 'title',
  slugSource: 'title',
  description: 'Kabar, kegiatan, dan pencapaian resmi yang ditulis dan dipublikasikan sendiri.',
  scope: { column: 'post_type', value: 'berita_perusahaan' },
  hasStatus: true,
  hasSortOrder: false,
  softDelete: true,
  authorScoped: true,
  defaultSort: { column: 'published_at', ascending: false },
  columns: [
    { key: 'cover_image_path', label: '', kind: 'image' },
    { key: 'title', label: 'Judul' },
    { key: 'featured', label: 'Featured', kind: 'badge' },
    { key: 'status', label: 'Status', kind: 'status' },
  ],
  fields: [
    { name: 'title', label: 'Judul', type: 'text', required: true, section: 'Basic Information' },
    { name: 'slug', label: 'Slug', type: 'slug', section: 'Basic Information' },
    { name: 'excerpt', label: 'Ringkasan', type: 'textarea', section: 'Basic Information' },
    { name: 'published_at', label: 'Tanggal Publikasi', type: 'date', section: 'Basic Information' },
    { name: 'content', label: 'Isi', type: 'html', section: 'Content' },
    { name: 'cover_image_path', label: 'Cover', type: 'image', mediaFolder: 'posts', section: 'Media' },
    { name: 'author', label: 'Penulis', type: 'text', section: 'Details' },
    { name: 'category', label: 'Kategori', type: 'text', section: 'Details' },
    { name: 'tags', label: 'Tags', type: 'tags', section: 'Details' },
    { name: 'featured', label: 'Featured', type: 'boolean', help: 'Tampilkan sebagai berita unggulan.', section: 'Details' },
    { name: 'seo_title', label: 'SEO Title', type: 'text', section: 'SEO' },
    { name: 'seo_description', label: 'SEO Description', type: 'textarea', section: 'SEO' },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, required: true, section: 'Publishing' },
  ],
  schema: z.object({
    title: z.string().min(1),
    slug: z.string().optional(),
    excerpt: z.string().optional().nullable(),
    published_at: z.string().optional().nullable(),
    content: z.string().optional().nullable(),
    cover_image_path: z.string().optional().nullable(),
    author: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    tags: z.array(z.string()).default([]),
    featured: z.coerce.boolean().default(false),
    seo_title: z.string().optional().nullable(),
    seo_description: z.string().optional().nullable(),
    status: z.enum(['draft', 'published', 'archived']),
  }),
};
