import { z } from 'zod';
import { LEGALITAS_CATEGORIES } from '@/lib/legalitas-data';

/**
 * Helpers for the legal editor. Field lists (Nomor, Tanggal, Notaris, …) are
 * typed as one "Label: value" per line, which is how an admin reads and writes
 * them. They are stored as a jsonb list of {label, value}.
 */
export type FieldPair = { label: string; value: string };

/** Turns "Nomor: 29\nTanggal: 26 Januari 2017" into [{label, value}, …]. */
export function parseFieldLines(text: string): FieldPair[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const colon = line.indexOf(':');
      if (colon === -1) return { label: line, value: '' };
      return { label: line.slice(0, colon).trim(), value: line.slice(colon + 1).trim() };
    })
    .filter((pair) => pair.label.length > 0);
}

/** The reverse of parseFieldLines, for showing stored fields in a textarea. */
export function formatFieldLines(fields: FieldPair[] | null | undefined): string {
  return (fields ?? []).map((f) => (f.value ? `${f.label}: ${f.value}` : f.label)).join('\n');
}

const fieldPairSchema = z.object({ label: z.string().min(1), value: z.string() });

export const legalCardSchema = z.object({
  category: z.enum(LEGALITAS_CATEGORIES as unknown as [string, ...string[]]),
  logo: z.string().trim().optional().nullable(),
  logo_alt: z.string().trim().min(1, 'Teks alt logo tidak boleh kosong.'),
  title: z.string().trim().min(1, 'Judul kartu tidak boleh kosong.'),
  subtitle: z.string().trim().optional().nullable(),
  intro: z.array(fieldPairSchema),
});

export const legalDocumentSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, 'Judul dokumen tidak boleh kosong.'),
  issuer: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(),
  fields: z.array(fieldPairSchema),
  external_url: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine((v) => !v || /^https?:\/\//i.test(v), 'Tautan harus diawali http:// atau https://.'),
  cta_label: z.string().trim().optional().nullable(),
});

export const legalDocumentsSchema = z.array(legalDocumentSchema);
