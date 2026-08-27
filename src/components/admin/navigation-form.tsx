'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './toast-provider';

const inputClass =
  'mt-2 w-full rounded-[10px] border border-line bg-paper px-4 py-2.5 text-body text-ink outline-none focus:border-forest';

export type NavigationItemValues = {
  id?: string;
  label: string;
  label_en: string | null;
  label_zh: string | null;
  url: string;
  parent_id: string | null;
  menu: string;
  status: string;
  open_new_tab: boolean;
  sort_order: number;
};

export function NavigationForm({
  initialValues,
  siblingOptions,
  action,
}: {
  initialValues: NavigationItemValues;
  siblingOptions: { id: string; label: string }[];
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}) {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      action={async (formData) => {
        setPending(true);
        const result = await action(formData);
        setPending(false);
        if (result?.error) {
          setError(result.error);
          return;
        }
        toast('success', 'Menu item saved successfully.');
        router.push('/wp-admin/site/navigation');
        router.refresh();
      }}
      className="max-w-lg space-y-6"
    >
      <section className="rounded-[14px] border border-line bg-paper p-6">
        <p className="font-display text-h3 text-ink">Menu Item</p>
        <div className="mt-5 space-y-5">
          <div>
            <label className="font-mono text-label uppercase text-slate">
              Label<span className="text-danger"> *</span>
            </label>
            <input type="text" name="label" required defaultValue={initialValues.label} className={inputClass} />
          </div>
          <div>
            <label className="font-mono text-label uppercase text-slate">Label (English)</label>
            <input type="text" name="label_en" defaultValue={initialValues.label_en ?? ''} className={inputClass} />
          </div>
          <div>
            <label className="font-mono text-label uppercase text-slate">Label (中文)</label>
            <input type="text" name="label_zh" defaultValue={initialValues.label_zh ?? ''} className={inputClass} />
          </div>
          <div>
            <label className="font-mono text-label uppercase text-slate">
              URL<span className="text-danger"> *</span>
            </label>
            <input type="text" name="url" required defaultValue={initialValues.url} className={inputClass} />
          </div>
          <div>
            <label className="font-mono text-label uppercase text-slate">
              Menu<span className="text-danger"> *</span>
            </label>
            <select name="menu" defaultValue={initialValues.menu} className={inputClass}>
              <option value="header">Header</option>
              <option value="footer">Footer</option>
            </select>
          </div>
          <div>
            <label className="font-mono text-label uppercase text-slate">Parent Menu</label>
            <select name="parent_id" defaultValue={initialValues.parent_id ?? ''} className={inputClass}>
              <option value="">— None (top-level) —</option>
              {siblingOptions
                .filter((s) => s.id !== initialValues.id)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="font-mono text-label uppercase text-slate">
              Status<span className="text-danger"> *</span>
            </label>
            <select name="status" defaultValue={initialValues.status} className={inputClass}>
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
          onClick={() => router.push('/wp-admin/site/navigation')}
          className="rounded-[10px] border border-line px-5 py-2.5 text-small text-ink hover:bg-stone"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
