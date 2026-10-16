import { z } from 'zod';
import type { ResourceConfig } from './types';

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'internship', label: 'Internship' },
  { value: 'fulltime', label: 'Fulltime' },
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

/** '' (the select's blank option) must become null, never reach a uuid/enum column as an empty string. */
const emptyToNull = (v: string) => (v === '' ? null : v);

export const jobsResource: ResourceConfig = {
  slug: 'jobs',
  table: 'jobs',
  title: 'Jobs',
  singular: 'Lowongan',
  titleField: 'title',
  slugSource: 'title',
  hasStatus: true,
  hasSortOrder: false,
  softDelete: true,
  authorScoped: true,
  defaultSort: { column: 'created_at', ascending: false },
  columns: [
    { key: 'cover_image_path', label: '', kind: 'image' },
    { key: 'title', label: 'Posisi' },
    { key: 'location', label: 'Lokasi' },
    { key: 'employment_type', label: 'Status Job', kind: 'badge' },
    { key: 'status', label: 'Status', kind: 'status' },
  ],
  fields: [
    { name: 'title', label: 'Posisi', type: 'text', required: true, section: 'Informasi Posisi' },
    { name: 'slug', label: 'Slug', type: 'slug', section: 'Informasi Posisi' },

    {
      name: 'employment_type',
      label: 'Status Job',
      type: 'select',
      options: EMPLOYMENT_TYPE_OPTIONS,
      section: 'Detail Pekerjaan',
    },
    { name: 'division', label: 'Divisi', type: 'text', section: 'Detail Pekerjaan' },
    { name: 'location', label: 'Lokasi', type: 'text', section: 'Detail Pekerjaan' },
    { name: 'entity_id', label: 'Company', type: 'entity-select', section: 'Detail Pekerjaan' },

    {
      name: 'deadline',
      label: 'Tanggal Tutup (Close Date)',
      type: 'date',
      help: 'Lowongan otomatis berhenti tampil di Front End setelah tanggal ini, apa pun status-nya.',
      section: 'Periode Lowongan',
    },

    {
      name: 'general_recruitment',
      label: 'General Recruitment',
      type: 'html',
      help: 'Informasi umum proses rekrutmen: tahapan, cara melamar, kontak, dll.',
      section: 'Recruitment Content',
    },
    {
      name: 'specific_recruitment',
      label: 'Specific Recruitment',
      type: 'html',
      help: 'Detail spesifik posisi ini: kualifikasi, tanggung jawab, dan persyaratan.',
      section: 'Recruitment Content',
    },

    {
      name: 'google_form_url',
      label: 'Google Form',
      type: 'url',
      placeholder: 'https://forms.google.com/...',
      help: 'Tombol "Lamar Sekarang" di Front End mengarah ke URL ini.',
      section: 'Application / Google Form',
    },

    {
      name: 'cover_image_path',
      label: 'Gambar',
      type: 'image',
      mediaFolder: 'jobs',
      help: 'Tanpa gambar, Front End memakai gambar bawaan halaman Karier.',
      section: 'Image',
    },

    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, required: true, section: 'Publishing' },
  ],
  schema: z.object({
    title: z.string().min(1),
    slug: z.string().optional(),
    entity_id: z
      .string()
      .uuid()
      .optional()
      .nullable()
      .or(z.literal(''))
      .transform((v) => (v ? emptyToNull(v) : null)),
    division: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    employment_type: z
      .enum(['internship', 'fulltime'])
      .optional()
      .or(z.literal(''))
      .transform((v) => (v ? emptyToNull(v) : null)),
    deadline: z.string().optional().nullable(),
    general_recruitment: z.string().optional().nullable(),
    specific_recruitment: z.string().optional().nullable(),
    google_form_url: z
      .string()
      .trim()
      .url('URL Google Form tidak valid.')
      .optional()
      .or(z.literal(''))
      .transform((v) => (v ? v : null)),
    cover_image_path: z.string().optional().nullable(),
    status: z.enum(['draft', 'published', 'archived']),
  }),
};
