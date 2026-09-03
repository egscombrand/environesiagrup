'use client';

import { useActionState, useEffect, useRef } from 'react';
import type { SiteSettings } from '@/lib/cms/settings';
import { updateSettingsAction, type SettingsFormState } from '@/app/wp-admin/(protected)/site/settings/actions';
import { ImageUploadField } from './image-upload-field';
import { useToast } from './toast-provider';

const inputClass =
  'mt-2 w-full rounded-[10px] border border-line bg-paper px-4 py-2.5 text-body text-ink outline-none focus:border-forest';

function TextField({ name, label, defaultValue, textarea }: { name: string; label: string; defaultValue: string; textarea?: boolean }) {
  return (
    <div>
      <label className="font-mono text-label uppercase text-slate">{label}</label>
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
    <section id={id} className="scroll-mt-24 rounded-[14px] border border-line bg-paper p-6">
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
    <form action={formAction} className="max-w-3xl space-y-6">
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

      <Section title="Company Group Experience" id="company-group-experience">
        <p className="text-small text-slate sm:col-span-2">
          The opening scene plays as a short auto-paced sequence: the intro line appears alone first, then the
          heading and each statement line cascade in one at a time, and the CTA appears only once that&apos;s
          finished. For the two statement fields, each line of text becomes its own beat in that sequence.
        </p>
        <TextField name="ecosystem_eyebrow" label="Eyebrow" defaultValue={s('ecosystem_eyebrow')} />
        <TextField name="ecosystem_opening_cta_label" label="Opening CTA Label" defaultValue={s('ecosystem_opening_cta_label')} />
        <div className="sm:col-span-2">
          <TextField
            name="ecosystem_opening_question"
            label="Opening Intro Line (shown alone, first)"
            defaultValue={s('ecosystem_opening_question')}
          />
        </div>
        <TextField
          name="ecosystem_opening_statement_1"
          label="Opening Statement Lines 1 (one line per row)"
          defaultValue={s('ecosystem_opening_statement_1')}
          textarea
        />
        <TextField
          name="ecosystem_opening_statement_2"
          label="Opening Statement Lines 2 (one line per row)"
          defaultValue={s('ecosystem_opening_statement_2')}
          textarea
        />
        <TextField
          name="ecosystem_discovery_intro_1"
          label="Discovery Transition — Line 1"
          defaultValue={s('ecosystem_discovery_intro_1')}
        />
        <TextField
          name="ecosystem_discovery_intro_2"
          label="Discovery Transition — Line 2"
          defaultValue={s('ecosystem_discovery_intro_2')}
        />
        <TextField
          name="ecosystem_closing_heading"
          label="Closing Heading (one line per row)"
          defaultValue={s('ecosystem_closing_heading')}
          textarea
        />
        <TextField
          name="ecosystem_closing_cta_label"
          label="Closing CTA Label"
          defaultValue={s('ecosystem_closing_cta_label')}
        />
        <div className="sm:col-span-2">
          <TextField
            name="ecosystem_closing_subtext"
            label="Closing Subtext"
            defaultValue={s('ecosystem_closing_subtext')}
            textarea
          />
        </div>
      </Section>

      <Section title="Company History / Our Journey" id="company-history">
        <p className="text-small text-slate sm:col-span-2">
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

      <div className="sticky bottom-0 -mx-6 flex items-center gap-3 border-t border-line bg-paper/95 px-6 py-4 backdrop-blur">
        <button
          type="submit"
          disabled={pending}
          className="rounded-[10px] bg-forest px-5 py-2.5 text-small font-medium text-paper hover:opacity-90 disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
