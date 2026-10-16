'use client';

import { useActionState, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { FieldConfig } from '@/lib/admin/resources/types';
import { ImageUploadField } from './image-upload-field';
import { EditorFrameContent, EditorFrameFooter, EditorSection, FIELD_WIDE, FieldGrid } from './editor-layout';
import { IconPicker } from './icon-picker';
import { RichTextEditor } from './rich-text-editor';
import { SlugField } from './slug-field';
import { useRequiredFieldsValidation } from './use-required-fields';
import { ValidationModal } from './validation-modal';
import { useToast } from './toast-provider';

type FormState = { error?: string };
const DEFAULT_SECTION = 'Details';

/**
 * No native `required` attribute anywhere in this file, on purpose — the
 * browser's own constraint validation would otherwise block the 'submit'
 * event (and the toast/modal that responds to it) before any of our own
 * code runs, popping its own inconsistent bubble instead. `field.required`
 * still drives the "*" label, the required-fields list passed to
 * useRequiredFieldsValidation below, and this error-state border.
 */
function fieldClass(hasError: boolean) {
  return `mt-2 w-full rounded-[10px] border ${
    hasError ? 'border-danger focus:border-danger' : 'border-[#e3e8ee] focus:border-[#2a7793]'
  } bg-white px-4 py-2.5 text-body text-ink outline-none`;
}

function Field({
  field,
  initialValues,
  entities,
  hasError,
  onChange,
}: {
  field: FieldConfig;
  initialValues: Record<string, unknown>;
  entities: { id: string; name: string }[];
  hasError: boolean;
  /** Fired on every keystroke — only wired for the field that drives the live slug preview. */
  onChange?: (value: string) => void;
}) {
  const value = initialValues[field.name];
  const inputClass = fieldClass(hasError);

  switch (field.type) {
    case 'textarea':
      return (
        <textarea id={field.name} name={field.name} defaultValue={(value as string) ?? ''} rows={3} className={inputClass} />
      );
    case 'richtext':
      return (
        <div>
          <textarea
            id={field.name}
            name={field.name}
            defaultValue={(value as string) ?? ''}
            rows={10}
            className={`${inputClass} font-mono text-small`}
          />
          <p className="mt-1 text-small text-[#64748b]">Markdown supported (headings, lists, bold, links).</p>
        </div>
      );
    case 'html':
      return <RichTextEditor name={field.name} initialValue={(value as string) ?? ''} />;
    case 'number':
      return (
        <input
          id={field.name}
          type="number"
          name={field.name}
          defaultValue={value === null || value === undefined ? '' : String(value)}
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
        <select id={field.name} name={field.name} defaultValue={(value as string) ?? ''} className={inputClass}>
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
      return <textarea id={field.name} name={field.name} defaultValue={lines} rows={4} className={inputClass} />;
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
            id={field.name}
            type="text"
            name={field.name}
            defaultValue={(value as string) ?? ''}
            placeholder="#0F4C3A"
            className="w-full rounded-[10px] border border-[#e3e8ee] bg-white px-4 py-2.5 text-body text-ink outline-none focus:border-[#2a7793]"
          />
          <span
            className="h-9 w-9 shrink-0 rounded-[8px] border border-[#e3e8ee]"
            style={{ backgroundColor: (value as string) || 'transparent' }}
            aria-hidden="true"
          />
        </div>
      );
    case 'date':
      return (
        <input
          id={field.name}
          type="date"
          name={field.name}
          defaultValue={value ? String(value).slice(0, 10) : ''}
          className={inputClass}
        />
      );
    case 'entity-select':
      return (
        <select id={field.name} name={field.name} defaultValue={(value as string) ?? ''} className={inputClass}>
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
              className="flex items-center gap-2 rounded-[8px] border border-[#e3e8ee] px-3 py-1.5 text-small has-[:checked]:border-[#2a7793] has-[:checked]:bg-[#2a7793]/5"
            >
              <input type="checkbox" name={field.name} value={entity.id} defaultChecked={selected.has(entity.id)} />
              {entity.name}
            </label>
          ))}
        </div>
      );
    }
    case 'icon':
      return <IconPicker name={field.name} initialValue={value as string | null} />;
    case 'url':
    default:
      return (
        <input
          id={field.name}
          type="text"
          name={field.name}
          defaultValue={(value as string) ?? ''}
          placeholder={field.placeholder}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className={inputClass}
        />
      );
  }
}

/** Fields that need the full row: long text, lists, and uploads. */
const WIDE_FIELD_TYPES = new Set<FieldConfig['type']>([
  'textarea',
  'richtext',
  'html',
  'tags',
  'entity-multiselect',
  'image',
  'file',
  'icon',
]);

export function ResourceForm({
  fields,
  initialValues,
  entities = [],
  slugSource,
  action,
  cancelHref,
}: {
  fields: FieldConfig[];
  initialValues: Record<string, unknown>;
  entities?: { id: string; name: string }[];
  /** Name of the field this resource's slug derives from (e.g. 'name', 'title'). */
  slugSource?: string;
  action: (formData: FormData) => Promise<FormState | void>;
  cancelHref: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [state, formAction, pending] = useActionState<FormState, FormData>(async (_prev, formData) => {
    const result = await action(formData);
    if (result?.error) return result;
    toast('success', 'Data berhasil disimpan.');
    router.push(cancelHref);
    router.refresh();
    return {};
  }, {});

  const requiredFields = useMemo(
    () => fields.filter((field) => field.required).map((field) => ({ name: field.name, label: field.label })),
    [fields]
  );
  const { formRef, errors, missing, modalOpen, validate, closeModal, goToField, handleFieldActivity } =
    useRequiredFieldsValidation(requiredFields);

  const slugField = useMemo(() => fields.find((field) => field.type === 'slug'), [fields]);
  // Tracks the primary field (name/title/…) on every keystroke, so the slug
  // preview updates live rather than waiting for blur or submit.
  const [sourceLive, setSourceLive] = useState((initialValues[slugSource ?? ''] as string) ?? '');

  const sections = useMemo(() => {
    const map = new Map<string, FieldConfig[]>();
    for (const field of fields) {
      if (field.type === 'slug') continue; // rendered separately, as a small action — see slugField above
      const key = field.section ?? DEFAULT_SECTION;
      map.set(key, [...(map.get(key) ?? []), field]);
    }
    return Array.from(map.entries());
  }, [fields]);

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={(e) => {
        if (!validate()) {
          e.preventDefault();
          toast('error', 'Mohon lengkapi field yang wajib diisi.');
        }
      }}
      onInput={handleFieldActivity}
      onChange={handleFieldActivity}
      className="flex h-full min-h-0 w-full flex-col"
    >
      {slugField ? (
        <div className="shrink-0 pb-6">
          <SlugField
            name={slugField.name}
            initialSlug={(initialValues[slugField.name] as string) ?? ''}
            sourceValue={sourceLive}
          />
        </div>
      ) : null}

      {/* The ONLY scrolling region in this form — see EditorFrameContent in editor-layout.tsx. */}
      <EditorFrameContent className="space-y-6 pb-6">
        {sections.map(([sectionTitle, sectionFields]) => (
          <EditorSection key={sectionTitle} title={sectionTitle}>
            <FieldGrid>
              {sectionFields.map((field) => {
                const hasError = errors.has(field.name);
                return (
                  <div key={field.name} className={WIDE_FIELD_TYPES.has(field.type) ? FIELD_WIDE : ''}>
                    {field.type !== 'boolean' ? (
                      <label
                        htmlFor={field.name}
                        className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]"
                      >
                        {field.label}
                        {field.required ? <span className="text-danger"> *</span> : null}
                      </label>
                    ) : null}
                    <Field
                      field={field}
                      initialValues={initialValues}
                      entities={entities}
                      hasError={hasError}
                      onChange={field.name === slugSource ? setSourceLive : undefined}
                    />
                    {hasError ? (
                      <p className="mt-1 text-small text-danger">Field ini wajib diisi.</p>
                    ) : field.help && field.type !== 'boolean' ? (
                      <p className="mt-1 text-small text-[#64748b]">{field.help}</p>
                    ) : null}
                  </div>
                );
              })}
            </FieldGrid>
          </EditorSection>
        ))}

        {state.error ? (
          <p role="alert" className="text-small text-danger">
            {state.error}
          </p>
        ) : null}
      </EditorFrameContent>

      {/* Never scrolls, never floats over content, never leaves the form's own box — a plain flex child, not `sticky`/`fixed`. */}
      <EditorFrameFooter>
        <button
          type="submit"
          disabled={pending}
          className="rounded-[10px] bg-[#2a7793] px-5 py-2.5 text-small font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={() => router.push(cancelHref)}
          className="rounded-[10px] border border-[#e3e8ee] px-5 py-2.5 text-small text-ink hover:bg-[#f4f6f9]"
        >
          Cancel
        </button>
      </EditorFrameFooter>

      <ValidationModal open={modalOpen} missing={missing} onSelectField={goToField} onClose={closeModal} />
    </form>
  );
}
