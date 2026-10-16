import { z } from 'zod';
import type { FieldConfig, ColumnConfig } from './types';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

// Not a full ResourceConfig / not registered in RESOURCES — story_scenes is
// scoped per-company (entity_id), which the generic top-level `/wp-admin/
// content/[resource]` list route has no notion of (it would flatten every
// company's scenes into one confusingly-interleaved list). This section's
// own bespoke pages/actions under `content/entities/[id]/story/` use these
// field/column/schema definitions directly instead — entity_id is supplied
// by the route, never a form field an admin edits.
export const storySceneFields: FieldConfig[] = [
  { name: 'image_path', label: 'Foto', type: 'image', mediaFolder: 'story-scenes', section: 'Content' },
  { name: 'headline', label: 'Keterangan (opsional)', type: 'text', section: 'Content' },
  { name: 'description', label: 'Deskripsi (opsional)', type: 'textarea', section: 'Content' },
  {
    name: 'cta_label',
    label: 'CTA Label',
    type: 'text',
    section: 'Call to Action (opsional)',
    help: 'Kosongkan jika scene ini tidak butuh CTA sendiri.',
  },
  { name: 'cta_url', label: 'CTA URL', type: 'text', section: 'Call to Action (opsional)' },
  { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, required: true, section: 'Publishing' },
];

export const storySceneColumns: ColumnConfig[] = [
  { key: 'headline', label: 'Headline' },
  { key: 'status', label: 'Status', kind: 'status' },
];

export const storySceneSchema = z.object({
  headline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  image_path: z.string().optional().nullable(),
  cta_label: z.string().optional().nullable(),
  cta_url: z.string().optional().nullable(),
  status: z.enum(['draft', 'published']),
});

export type StorySceneFormValues = z.infer<typeof storySceneSchema>;
