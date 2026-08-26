'use client';

import { useActionState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { FieldConfig } from '@/lib/admin/resources/types';
import { ImageUploadField } from './image-upload-field';
import { useToast } from './toast-provider';

type FormState = { error?: string };
const DEFAULT_SECTION = 'Details';

const inputClass =
  'mt-2 w-full rounded-[10px] border border-line bg-paper px-4 py-2.5 text-body text-ink outline-none focus:border-forest';

function Field({
  field,
  initialValues,
  entities,
}: {
  field: FieldConfig;
  initialValues: Record<string, unknown>;
  entities: { id: string; name: string }[];
}) {
  const value = initialValues[field.name];

  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          name={field.name}
          defaultValue={(value as string) ?? ''}
          required={field.required}
          rows={3}
          className={inputClass}
        />
      );
    case 'richtext':
      return (
        <div>
          <textarea
            name={field.name}
            defaultValue={(value as string) ?? ''}
            required={field.required}
            rows={10}
            className={`${inputClass} font-mono text-small`}
          />
          <p className="mt-1 text-small text-slate">Markdown supported (headings, lists, bold, links).</p>
        </div>
      );
    case 'number':
      return (
        <input
          type="number"
          name={field.name}
          defaultValue={value === null || value === undefined ? '' : String(value)}
          required={field.required}
          step="any"
          className={inputClass}
        />
      );
    case 'boolean':
      return (
        <label className="mt-2 flex items-center gap-2 text-body text-ink">
          <input type="checkbox" name={field.name} defaultChecked={Boolean(value)} />
          {field.help}
        </label>
      );
    case 'select':
      return (
        <select name={field.name} defaultValue={(value as string) ?? ''} required={field.required} className={inputClass}>
          {!field.required ? <option value="">—</option> : null}
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    case 'tags': {
      const lines = Array.isArray(value) ? (value as string[]).join('\n') : '';
      return <textarea name={field.name} defaultValue={lines} rows={4} className={inputClass} />;
    }
    case 'image':
      return (
        <ImageUploadField
          name={field.name}
          label=""
          folder={field.mediaFolder ?? 'general'}
          initialPath={value as string | null}
          accept="image"
        />
      );
    case 'file':
      return (
        <ImageUploadField
          name={field.name}
          label=""
          folder={field.mediaFolder ?? 'documents'}
          initialPath={value as string | null}
          accept="file"
        />
      );
    case 'color':
      return (
        <div className="mt-2 flex items-center gap-3">
          <input
            type="text"
            name={field.name}
            defaultValue={(value as string) ?? ''}
            placeholder="#0F4C3A"
            className="w-full rounded-[10px] border border-line bg-paper px-4 py-2.5 text-body text-ink outline-none focus:border-forest"
          />
          <span
            className="h-9 w-9 shrink-0 rounded-[8px] border border-line"
            style={{ backgroundColor: (value as string) || 'transparent' }}
            aria-hidden="true"
          />
        </div>
      );
    case 'date':
      return (
        <input
          type="date"
          name={field.name}
          defaultValue={value ? String(value).slice(0, 10) : ''}
          className={inputClass}
        />
      );
    case 'entity-select':
      return (
        <select name={field.name} defaultValue={(value as string) ?? ''} className={inputClass}>
          <option value="">—</option>
          {entities.map((entity) => (
            <option key={entity.id} value={entity.id}>
              {entity.name}
            </option>
          ))}
        </select>
      );
    case 'entity-multiselect': {
      const selected = new Set(Array.isArray(value) ? (value as string[]) : []);
      return (
        <div className="mt-2 flex flex-wrap gap-2">
          {entities.map((entity) => (
            <label
              key={entity.id}
              className="flex items-center gap-2 rounded-[8px] border border-line px-3 py-1.5 text-small has-[:checked]:border-forest has-[:checked]:bg-forest/5"
            >
              <input type="checkbox" name={field.name} value={entity.id} defaultChecked={selected.has(entity.id)} />
              {entity.name}
            </label>
          ))}
        </div>
      );
    }
    case 'url':
    default:
      return (
        <input
          type="text"
          name={field.name}
          defaultValue={(value as string) ?? ''}
          required={field.required}
          placeholder={field.placeholder}
          className={inputClass}
        />
      );
  }
}

export function ResourceForm({
  fields,
  initialValues,
  entities = [],
  action,
  cancelHref,
  successMessage = 'Saved successfully.',
}: {
  fields: FieldConfig[];
  initialValues: Record<string, unknown>;
  entities?: { id: string; name: string }[];
  action: (formData: FormData) => Promise<FormState | void>;
  cancelHref: string;
  successMessage?: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [state, formAction, pending] = useActionState<FormState, FormData>(async (_prev, formData) => {
    const result = await action(formData);
    if (result?.error) return result;
    toast('success', successMessage);
    router.push(cancelHref);
    router.refresh();
    return {};
  }, {});

  const sections = useMemo(() => {
    const map = new Map<string, FieldConfig[]>();
    for (const field of fields) {
      const key = field.section ?? DEFAULT_SECTION;
      map.set(key, [...(map.get(key) ?? []), field]);
    }
    return Array.from(map.entries());
  }, [fields]);

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      {sections.map(([sectionTitle, sectionFields]) => (
        <section key={sectionTitle} className="rounded-[14px] border border-line bg-paper p-6">
          <p className="font-display text-h3 text-ink">{sectionTitle}</p>
          <div className="mt-5 space-y-5">
            {sectionFields.map((field) => (
              <div key={field.name}>
                {field.type !== 'boolean' ? (
                  <label className="font-mono text-label uppercase text-slate">
                    {field.label}
                    {field.required ? <span className="text-danger"> *</span> : null}
                  </label>
                ) : null}
                <Field field={field} initialValues={initialValues} entities={entities} />
                {field.help && field.type !== 'boolean' ? (
                  <p className="mt-1 text-small text-slate">{field.help}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ))}

      {state.error ? (
        <p role="alert" className="text-small text-danger">
          {state.error}
        </p>
      ) : null}

      <div className="sticky bottom-0 -mx-6 flex items-center gap-3 border-t border-line bg-paper/95 px-6 py-4 backdrop-blur">
        <button
          type="submit"
          disabled={pending}
          className="rounded-[10px] bg-forest px-5 py-2.5 text-small font-medium text-paper hover:opacity-90 disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={() => router.push(cancelHref)}
          className="rounded-[10px] border border-line px-5 py-2.5 text-small text-ink hover:bg-stone"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
