import { z } from 'zod';
import type { ResourceConfig } from './types';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

/**
 * Press clippings: coverage other media published about the company. Shares
 * the "posts" table with Berita Perusahaan (./berita-perusahaan.ts) but is
 * kept to its own rows via `scope` — see crud.ts. Its own fields
 * (owner/media/source_url) and its thumbnail, which is scraped from
 * `source_url` by the dedicated import/thumbnail tools under
 * content/siaran-pers/, are what set it apart from a self-authored article:
 * there's no `content` body here, the external link is the actual story.
 */
export const siaranPersResource: ResourceConfig = {
  slug: 'siaran-pers',
  table: 'posts',
  title: 'Siaran Pers',
  singular: 'Siaran Pers',
  titleField: 'title',
  slugSource: 'title',
  description: 'Liputan media eksternal tentang Environesia — bukan artikel yang ditulis sendiri.',
  scope: { column: 'post_type', value: 'siaran_pers' },
  hasStatus: true,
  hasSortOrder: false,
  softDelete: true,
  authorScoped: true,
  defaultSort: { column: 'published_at', ascending: false },
  columns: [
    { key: 'title', label: 'Judul' },
    { key: 'owner', label: 'Owner' },
    { key: 'media', label: 'Media' },
    { key: 'published_at', label: 'Tanggal Rilis', kind: 'date' },
    { key: 'status', label: 'Status', kind: 'status' },
  ],
  fields: [
    { name: 'title', label: 'Judul Press Release', type: 'text', required: true, section: 'Basic Information' },
    { name: 'slug', label: 'Slug', type: 'slug', section: 'Basic Information' },
    { name: 'owner', label: 'Owner (brand)', type: 'text', section: 'Basic Information' },
    { name: 'media', label: 'Media', type: 'text', section: 'Basic Information' },
    {
      name: 'source_url',
      label: 'Link Berita',
      type: 'url',
      required: true,
      help: 'URL artikel asli di media eksternal — thumbnail diambil otomatis dari halaman ini.',
      section: 'Basic Information',
    },
    { name: 'published_at', label: 'Tanggal Rilis', type: 'date', section: 'Basic Information' },
    { name: 'category', label: 'Kategori', type: 'text', section: 'Details' },
    { name: 'tags', label: 'Tags', type: 'tags', section: 'Details' },
    { name: 'seo_title', label: 'SEO Title', type: 'text', section: 'SEO' },
    { name: 'seo_description', label: 'SEO Description', type: 'textarea', section: 'SEO' },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, required: true, section: 'Publishing' },
  ],
  schema: z.object({
    title: z.string().min(1),
    slug: z.string().optional(),
    owner: z.string().optional().nullable(),
    media: z.string().optional().nullable(),
    source_url: z.string().min(1, 'Link berita wajib diisi.'),
    published_at: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    tags: z.array(z.string()).default([]),
    seo_title: z.string().optional().nullable(),
    seo_description: z.string().optional().nullable(),
    status: z.enum(['draft', 'published', 'archived']),
  }),
};
