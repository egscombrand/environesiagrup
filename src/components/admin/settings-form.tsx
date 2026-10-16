'use client';

import { useActionState, useEffect, useRef } from 'react';
import type { SiteSettings } from '@/lib/cms/settings';
import { updateSettingsAction, type SettingsFormState } from '@/app/wp-admin/(protected)/site/settings/actions';
import { EditorFrameContent, EditorFrameFooter } from './editor-layout';
import { ImageUploadField } from './image-upload-field';
import { useToast } from './toast-provider';

const inputClass =
  'mt-2 w-full rounded-[10px] border border-[#e3e8ee] bg-white px-4 py-2.5 text-body text-ink outline-none focus:border-[#2a7793]';

function TextField({ name, label, defaultValue, textarea }: { name: string; label: string; defaultValue: string; textarea?: boolean }) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">{label}</label>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue} rows={3} className={inputClass} />
      ) : (
        <input type="text" name={name} defaultValue={defaultValue} className={inputClass} />
      )}
    </div>
  );
}

function Section({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-[16px] border border-[#e3e8ee] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <h2 className="font-display text-h3 text-ink">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState<SettingsFormState, FormData>(updateSettingsAction, {});
  const s = (key: keyof SiteSettings) => (settings[key] as string) ?? '';
  const toast = useToast();
  const lastState = useRef(state);

  useEffect(() => {
    if (state === lastState.current) return;
    lastState.current = state;
    if (state.error) toast('error', state.error);
    else if (state.success) toast('success', 'Settings saved successfully.');
  }, [state, toast]);

  return (
    <form action={formAction} className="flex h-full min-h-0 w-full flex-col">
      {/* The ONLY scrolling region in this form — see EditorFrameContent in editor-layout.tsx. */}
      <EditorFrameContent className="space-y-6 pb-6">
      <Section title="General">
        <TextField name="site_name" label="Site Name" defaultValue={s('site_name')} />
        <TextField name="tagline" label="Tagline" defaultValue={s('tagline')} />
        <TextField name="email" label="Email" defaultValue={s('email')} />
        <TextField name="phone" label="Phone" defaultValue={s('phone')} />
        <TextField name="whatsapp" label="WhatsApp" defaultValue={s('whatsapp')} />
        <TextField name="map_url" label="Map URL" defaultValue={s('map_url')} />
        <TextField name="google_maps_url" label="Google Maps URL" defaultValue={s('google_maps_url')} />
        <div className="sm:col-span-2">
          <TextField name="address" label="Address" defaultValue={s('address')} textarea />
        </div>
        <ImageUploadField name="logo_path" label="Logo" folder="general" initialPath={settings.logo_path} accept="image" />
        <ImageUploadField name="favicon_path" label="Favicon" folder="general" initialPath={settings.favicon_path} accept="image" />
      </Section>

      <Section title="Social Media">
        <TextField name="social_instagram" label="Instagram" defaultValue={s('social_instagram')} />
        <TextField name="social_linkedin" label="LinkedIn" defaultValue={s('social_linkedin')} />
        <TextField name="social_facebook" label="Facebook" defaultValue={s('social_facebook')} />
        <TextField name="social_youtube" label="YouTube" defaultValue={s('social_youtube')} />
        <TextField name="social_tiktok" label="TikTok" defaultValue={s('social_tiktok')} />
        <TextField name="social_twitter" label="X / Twitter" defaultValue={s('social_twitter')} />
      </Section>

      <Section title="SEO">
        <TextField name="seo_default_title" label="Default Title" defaultValue={s('seo_default_title')} />
        <TextField name="seo_keywords" label="Keywords" defaultValue={s('seo_keywords')} />
        <div className="sm:col-span-2">
          <TextField name="seo_default_description" label="Default Description" defaultValue={s('seo_default_description')} textarea />
        </div>
        <TextField name="seo_robots" label="Robots" defaultValue={s('seo_robots')} />
        <ImageUploadField
          name="seo_default_og_image"
          label="Default OG Image"
          folder="general"
          initialPath={settings.seo_default_og_image}
          accept="image"
        />
      </Section>

      <Section title="Capabilities Grid (Section 02)" id="capabilities-grid">
        <p className="text-small text-[#64748b] sm:col-span-2">
          Shown as the heading&apos;s supporting line, next to the capability cards. Each card&apos;s own logo, title,
          and description are edited per entity under Content → Entities.
        </p>
        <div className="sm:col-span-2">
          <TextField name="capabilities_subtext" label="Subtext" defaultValue={s('capabilities_subtext')} textarea />
        </div>
      </Section>

      <Section title="Company History / Our Journey" id="company-history">
        <p className="text-small text-[#64748b] sm:col-span-2">
          Shown above the milestones timeline. The individual milestones themselves (year, title, story, image) are
          managed under Content → Milestones, not here.
        </p>
        <TextField name="milestones_eyebrow" label="Eyebrow (e.g. Our Journey)" defaultValue={s('milestones_eyebrow')} />
        <div className="sm:col-span-2">
          <TextField name="milestones_intro" label="Intro Narrative" defaultValue={s('milestones_intro')} textarea />
        </div>
      </Section>

      <Section title="Footer">
        <TextField name="footer_copyright" label="Copyright" defaultValue={s('footer_copyright')} />
        <div className="sm:col-span-2">
          <TextField name="footer_description" label="Footer Description" defaultValue={s('footer_description')} textarea />
        </div>
      </Section>

      </EditorFrameContent>

      <EditorFrameFooter>
        <button
          type="submit"
          disabled={pending}
          className="rounded-[10px] bg-[#2a7793] px-5 py-2.5 text-small font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save Settings'}
        </button>
      </EditorFrameFooter>
    </form>
  );
}
