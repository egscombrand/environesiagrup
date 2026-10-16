'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EditorFrameContent, EditorFrameFooter } from './editor-layout';
import { useRequiredFieldsValidation } from './use-required-fields';
import { ValidationModal } from './validation-modal';
import { useToast } from './toast-provider';

const REQUIRED_FIELDS = [
  { name: 'label', label: 'Label' },
  { name: 'url', label: 'URL' },
];

function inputClass(hasError: boolean) {
  return `mt-2 w-full rounded-[10px] border ${
    hasError ? 'border-danger focus:border-danger' : 'border-[#e3e8ee] focus:border-[#2a7793]'
  } bg-white px-4 py-2.5 text-body text-ink outline-none`;
}

export type NavigationItemValues = {
  id?: string;
  label: string;
  label_en: string | null;
  label_zh: string | null;
  url: string;
  slug: string | null;
  parent_id: string | null;
  menu: string;
  status: string;
  open_new_tab: boolean;
  sort_order: number;
};

export function NavigationForm({
  initialValues,
  siblingOptions,
  disableParentSelect = false,
  action,
}: {
  initialValues: NavigationItemValues;
  siblingOptions: { id: string; label: string }[];
  /** True when this item already has its own submenu — the public site only
   * renders one level of dropdown, so nesting it under another item would
   * silently drop its children from the live menu. */
  disableParentSelect?: boolean;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}) {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const { formRef, errors, missing, modalOpen, validate, closeModal, goToField, handleFieldActivity } =
    useRequiredFieldsValidation(REQUIRED_FIELDS);

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        if (!validate()) {
          e.preventDefault();
          toast('error', 'Mohon lengkapi field yang wajib diisi.');
        }
      }}
      onInput={handleFieldActivity}
      onChange={handleFieldActivity}
      action={async (formData) => {
        setPending(true);
        const result = await action(formData);
        setPending(false);
        if (result?.error) {
          setError(result.error);
          toast('error', result.error);
          return;
        }
        toast('success', 'Data berhasil disimpan.');
        router.push('/wp-admin/site/navigation');
        router.refresh();
      }}
      className="flex h-full min-h-0 w-full flex-col"
    >
      <EditorFrameContent className="space-y-6 pb-6">
      <section className="rounded-[16px] border border-[#e3e8ee] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <p className="font-display text-h3 text-ink">Menu Item</p>
        <div className="mt-5 space-y-5">
          <div>
            <label htmlFor="label" className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
              Label<span className="text-danger"> *</span>
            </label>
            <input
              id="label"
              type="text"
              name="label"
              defaultValue={initialValues.label}
              className={inputClass(errors.has('label'))}
            />
            {errors.has('label') ? <p className="mt-1.5 text-small text-danger">Field ini wajib diisi.</p> : null}
          </div>
          {/* English/Chinese labels aren't editable here — there's no
              translation pipeline yet, so they stay unset and the public
              site falls back to the Indonesian label (navigationLabel). */}
          <div>
            <label htmlFor="url" className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
              URL<span className="text-danger"> *</span>
            </label>
            <input
              id="url"
              type="text"
              name="url"
              defaultValue={initialValues.url}
              className={inputClass(errors.has('url'))}
            />
            {errors.has('url') ? <p className="mt-1.5 text-small text-danger">Field ini wajib diisi.</p> : null}
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Slug</label>
            <input type="text" name="slug" defaultValue={initialValues.slug ?? ''} className={inputClass(false)} />
            <p className="mt-1.5 text-small text-[#64748b]">
              Sets which CMS record (e.g. an entity&rsquo;s own slug) this menu item links to — a page that only
              knows its own content can look up this URL by that identifier. Leave blank if this item doesn&rsquo;t
              need to be looked up that way.
            </p>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
              Menu<span className="text-danger"> *</span>
            </label>
            <select name="menu" defaultValue={initialValues.menu} className={inputClass(false)}>
              <option value="header">Header</option>
              <option value="footer">Footer</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Parent Menu</label>
            {/* Disabled fields aren't included in FormData on submit, so this
                intentionally sends no parent_id — which is exactly right
                here, since a disableParentSelect item is always already
                top-level and must stay that way. */}
            <select
              name="parent_id"
              defaultValue={initialValues.parent_id ?? ''}
              disabled={disableParentSelect}
              className={`${inputClass(false)} disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <option value="">— None (top-level) —</option>
              {siblingOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            {disableParentSelect ? (
              <p className="mt-1.5 text-small text-[#64748b]">
                This item has submenus and can&rsquo;t be nested under another item.
              </p>
            ) : null}
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
              Status<span className="text-danger"> *</span>
            </label>
            <select name="status" defaultValue={initialValues.status} className={inputClass(false)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-body text-ink">
            <input type="checkbox" name="open_new_tab" defaultChecked={initialValues.open_new_tab} />
            Open in new tab
          </label>
          <input type="hidden" name="sort_order" value={initialValues.sort_order} />
        </div>
      </section>

      {error ? (
        <p role="alert" className="text-small text-danger">
          {error}
        </p>
      ) : null}
      </EditorFrameContent>

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
          onClick={() => router.push('/wp-admin/site/navigation')}
          className="rounded-[10px] border border-[#e3e8ee] px-5 py-2.5 text-small text-ink hover:bg-[#f4f6f9]"
        >
          Cancel
        </button>
      </EditorFrameFooter>

      <ValidationModal open={modalOpen} missing={missing} onSelectField={goToField} onClose={closeModal} />
    </form>
  );
}
