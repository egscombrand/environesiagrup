'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  DEFAULT_SETTINGS,
  STORAGE_KEY,
  toggleSeizureSafeProfile,
  clampSettings,
  type AccessibilitySettings,
} from '@/lib/accessibility/settings';
import {
  ACCESSIBILITY_PROFILES,
  applyProfileToSettings,
  deactivateProfileInSettings,
  isProfileActive,
  type AccessibilityProfileId,
} from '@/lib/accessibility/profiles';

type AccessibilityContextValue = {
  settings: AccessibilitySettings;
  /** True once the saved preference (if any) has been read — the panel/button use this to avoid a flash of default state. */
  ready: boolean;
  update: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  toggle: (key: { [K in keyof AccessibilitySettings]: AccessibilitySettings[K] extends boolean ? K : never }[keyof AccessibilitySettings]) => void;
  step: (
    key: { [K in keyof AccessibilitySettings]: AccessibilitySettings[K] extends number ? K : never }[keyof AccessibilitySettings],
    delta: number
  ) => void;
  toggleSeizureSafe: () => void;
  /** Applies a ready-made profile, or toggles it off if it's already fully active (computed live — see profiles.ts). */
  toggleProfile: (id: AccessibilityProfileId) => void;
  /** Which profile ID (if any) is currently fully active — recomputed from real settings every render, never a stored flag. */
  activeProfileId: AccessibilityProfileId | null;
  reset: () => void;
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}

/**
 * Builds a `cursor` CSS value at a given pixel size — a real, scaling
 * replacement for the old fixed-size "big cursor" toggle. The hotspot
 * (where the pointer actually "clicks") scales with the cursor so it
 * still points at the right pixel at every size, not just at the default.
 */
function buildCursorValue(sizePx: number): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${sizePx}' height='${sizePx}' viewBox='0 0 24 24'><path d='M4 2l14 8.2-6 1.4 3.4 6.8-2.6 1.3-3.4-6.8L5 17.3V2z' fill='black' stroke='white' stroke-width='1'/></svg>`;
  const hotspot = Math.round((2 / 24) * sizePx);
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hotspot} ${hotspot}, auto`;
}

function readStoredSettings(): AccessibilitySettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AccessibilitySettings>;
    return clampSettings({ ...DEFAULT_SETTINGS, ...parsed });
  } catch {
    // localStorage unavailable (private mode, blocked, quota) or corrupt JSON — fall back silently, never crash the page over a preference.
    return DEFAULT_SETTINGS;
  }
}

/**
 * Applies every setting as a `data-a11y-*` attribute or CSS custom property
 * on <html> — see globals.css's "Accessibility Center" block for what each
 * one actually does. One effect, one place, instead of scattering DOM
 * mutations across every control.
 */
function applyToDocument(settings: AccessibilitySettings) {
  const root = document.documentElement;
  const set = (attr: string, on: boolean) => {
    if (on) root.setAttribute(attr, '');
    else root.removeAttribute(attr);
  };

  set('data-a11y-high-contrast', settings.highContrast);
  set('data-a11y-readable-font', settings.readableFont);
  set('data-a11y-bold-text', settings.boldText);
  set('data-a11y-highlight-links', settings.highlightLinks);
  set('data-a11y-stop-animations', settings.stopAnimations);
  set('data-a11y-reduce-motion', settings.reduceMotion);
  set('data-a11y-reduce-effects', settings.reduceVisualEffects);
  set('data-a11y-strong-focus', settings.strongFocus);
  set('data-a11y-large-targets', settings.largeClickTargets);
  set('data-a11y-reading-focus', settings.readingFocusMode);
  set('data-a11y-text-width', settings.textWidthConstrained);
  set('data-a11y-reduce-distraction', settings.reduceDistraction);

  // Invert / dark mode / color-vision filter all work by setting the CSS
  // `filter` property on <html> — and `filter` doesn't stack across
  // separate attribute-selector rules (the last one matched wins, not a
  // combination of both). Computing one combined filter string here, once,
  // is what lets more than one of these be active together correctly.
  const filterParts: string[] = [];
  if (settings.invertContrast) filterParts.push('invert(1) hue-rotate(180deg)');
  else if (settings.darkMode) filterParts.push('invert(0.92) hue-rotate(180deg) brightness(0.95) contrast(1.05)');
  if (settings.colorFilter !== 'none' && settings.colorFilter !== 'grayscale') {
    filterParts.push(`url(#a11y-${settings.colorFilter})`);
  } else if (settings.colorFilter === 'grayscale') {
    filterParts.push(`grayscale(${Math.min(100, Math.max(0, settings.colorFilterIntensity)) / 100})`);
  }
  root.style.setProperty('--a11y-filter', filterParts.length > 0 ? filterParts.join(' ') : 'none');
  // Images/video/svg get re-inverted so photos and logos don't end up
  // color-negative just because the page's own filter inverted them —
  // only applies when invert/dark is the active mode (a plain color-filter
  // or grayscale alone should still apply to media, not cancel out).
  set('data-a11y-media-reinvert', settings.invertContrast || settings.darkMode);

  root.style.setProperty('--a11y-text-scale', String(1 + settings.textSizeStep * 0.1));
  root.style.setProperty('--a11y-zoom-scale', String(1 + settings.zoomStep * 0.1));
  root.style.setProperty('--a11y-letter-spacing', `${settings.letterSpacingStep * 0.04}em`);
  root.style.setProperty('--a11y-word-spacing', `${settings.letterSpacingStep * 0.12}em`);
  root.style.setProperty('--a11y-line-height-extra', String(settings.lineHeightStep * 0.25));

  // Cursor size — 100% (step 0) leaves the native cursor untouched; only
  // above that does a real, scaled custom cursor kick in, built fresh for
  // the exact size so the pointer hotspot stays accurate at every step.
  const cursorActive = settings.cursorSizeStep > 0;
  set('data-a11y-cursor-scaled', cursorActive);
  if (cursorActive) {
    const sizePx = Math.round(32 * (1 + settings.cursorSizeStep / 10));
    root.style.setProperty('--a11y-cursor', buildCursorValue(sizePx));
  } else {
    root.style.removeProperty('--a11y-cursor');
  }
}

/** Feature 14 — pauses any <video autoplay> already on the page and any added later, without touching a user's own deliberate play action. */
function useAutoplayVideoGuard(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    function stopAutoplay(video: HTMLVideoElement) {
      video.removeAttribute('autoplay');
      if (!video.paused) video.pause();
    }

    function scan(root: ParentNode) {
      root.querySelectorAll<HTMLVideoElement>('video[autoplay]').forEach(stopAutoplay);
    }

    scan(document);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLVideoElement) stopAutoplay(node);
          else if (node instanceof HTMLElement) scan(node);
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [enabled]);
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  // Starts at defaults on both server and first client render (no access to
  // localStorage during SSR) — the real saved value is read in an effect
  // right after mount, same pattern used elsewhere in this app for
  // client-only state that must not cause a hydration mismatch.
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    setSettings(readStoredSettings());
    setReady(true);
    hydrated.current = true;
  }, []);

  useEffect(() => {
    applyToDocument(settings);
    if (!hydrated.current) return; // don't write the defaults back over a not-yet-read preference
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // best-effort only — a blocked/full localStorage never breaks the page
    }
  }, [settings]);

  useAutoplayVideoGuard(settings.disableAutoplayVideo);

  const update = useCallback(
    <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
      setSettings((prev) => clampSettings({ ...prev, [key]: value }));
    },
    []
  );

  const toggle = useCallback(
    (key: Parameters<AccessibilityContextValue['toggle']>[0]) => {
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    []
  );

  const step = useCallback(
    (key: Parameters<AccessibilityContextValue['step']>[0], delta: number) => {
      setSettings((prev) => clampSettings({ ...prev, [key]: (prev[key] as number) + delta }));
    },
    []
  );

  const toggleSeizureSafe = useCallback(() => {
    setSettings((prev) => toggleSeizureSafeProfile(prev));
  }, []);

  const toggleProfile = useCallback((id: AccessibilityProfileId) => {
    setSettings((prev) => {
      const profile = ACCESSIBILITY_PROFILES.find((p) => p.id === id);
      if (!profile) return prev;
      return clampSettings(
        isProfileActive(prev, profile) ? deactivateProfileInSettings(prev, profile) : applyProfileToSettings(prev, profile)
      );
    });
  }, []);

  const activeProfile = ACCESSIBILITY_PROFILES.find((p) => isProfileActive(settings, p));

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        ready,
        update,
        toggle,
        step,
        toggleSeizureSafe,
        toggleProfile,
        activeProfileId: activeProfile?.id ?? null,
        reset,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}
