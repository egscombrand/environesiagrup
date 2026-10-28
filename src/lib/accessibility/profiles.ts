import { DEFAULT_SETTINGS, type AccessibilitySettings } from './settings';

export type AccessibilityProfileId =
  | 'lowVision'
  | 'focusDistraction'
  | 'reading'
  | 'motor'
  | 'visualSensitivity'
  | 'colorPerception';

export type AccessibilityProfile = {
  id: AccessibilityProfileId;
  /** The exact subset of settings this profile turns on — only these keys are ever touched when applying or deactivating it. */
  target: Partial<AccessibilitySettings>;
};

// Each profile only sets settings that genuinely exist and genuinely do
// something (see accessibility-context.tsx for what each key applies).
// Named and described by need/benefit, never by a diagnosis — see the
// i18n copy under `profil.*` for the user-facing names/descriptions.
export const ACCESSIBILITY_PROFILES: AccessibilityProfile[] = [
  {
    id: 'lowVision',
    target: { textSizeStep: 3, highContrast: true, boldText: true, highlightLinks: true, strongFocus: true },
  },
  {
    id: 'focusDistraction',
    target: { reduceMotion: true, reduceVisualEffects: true, readingFocusMode: true },
  },
  {
    id: 'reading',
    target: { readableFont: true, letterSpacingStep: 1, lineHeightStep: 1, textWidthConstrained: true },
  },
  {
    id: 'motor',
    target: { cursorSizeStep: 4, cursorHighlight: true, strongFocus: true, highlightLinks: true, largeClickTargets: true },
  },
  {
    id: 'visualSensitivity',
    target: { stopAnimations: true, reduceMotion: true, reduceVisualEffects: true, disableAutoplayVideo: true },
  },
  {
    id: 'colorPerception',
    // Deliberately does NOT pick a color filter for the user — that choice
    // stays theirs (see the profil.colorPerception copy). What it can
    // honestly turn on: clarifying links/focus with more than color alone.
    target: { highlightLinks: true, strongFocus: true },
  },
];

/** The union of every key any profile manages — used to cleanly clear a previous profile's settings before applying a new one, so profiles never collide. */
export const PROFILE_MANAGED_KEYS: (keyof AccessibilitySettings)[] = Array.from(
  new Set(ACCESSIBILITY_PROFILES.flatMap((p) => Object.keys(p.target) as (keyof AccessibilitySettings)[]))
);

/**
 * A profile is "active" only if every setting it manages currently matches
 * its target — computed fresh from real state every render, not a stored
 * flag. This is what makes "the user changed one setting after activating
 * a profile" correctly drop the active indicator instead of lying about it.
 */
export function isProfileActive(settings: AccessibilitySettings, profile: AccessibilityProfile): boolean {
  return (Object.keys(profile.target) as (keyof AccessibilitySettings)[]).every((key) => settings[key] === profile.target[key]);
}

/** Applies a profile cleanly: every profile-managed key resets to default first, then this profile's own targets are layered on — so switching profiles never leaves a stray setting from the previous one. */
export function applyProfileToSettings(settings: AccessibilitySettings, profile: AccessibilityProfile): AccessibilitySettings {
  const cleared = { ...settings };
  for (const key of PROFILE_MANAGED_KEYS) {
    (cleared as Record<string, unknown>)[key] = DEFAULT_SETTINGS[key];
  }
  return { ...cleared, ...profile.target };
}

/** Deactivating a profile reverts only the keys IT manages to default — any other setting (profile-managed or not) is left exactly as the user has it. */
export function deactivateProfileInSettings(settings: AccessibilitySettings, profile: AccessibilityProfile): AccessibilitySettings {
  const next = { ...settings };
  for (const key of Object.keys(profile.target) as (keyof AccessibilitySettings)[]) {
    (next as Record<string, unknown>)[key] = DEFAULT_SETTINGS[key];
  }
  return next;
}
