// Every field here is a real, independently-working control — never a
// decorative toggle. See accessibility-provider.tsx for how each one is
// actually applied (CSS data-attributes/variables, not just stored state).
export type ColorFilter = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'grayscale';

export type AccessibilitySettings = {
  /** Steps of +10% each, clamped in the provider. 0 = 100%. */
  textSizeStep: number;
  /** Page-wide CSS `zoom` steps of +10% each. 0 = 100%. */
  zoomStep: number;
  highContrast: boolean;
  invertContrast: boolean;
  darkMode: boolean;
  readableFont: boolean;
  boldText: boolean;
  /** Steps of extra letter/word spacing, 0–3. */
  letterSpacingStep: number;
  highlightLinks: boolean;
  colorFilter: ColorFilter;
  /** 0–100. Blends the chosen color filter between no effect (0) and its
   * full strength (100) — meaningful for every filter, including grayscale
   * (maps straight to CSS grayscale()) and the color-matrix ones (blended
   * against the identity matrix). 100 = full effect, the historical default. */
  colorFilterIntensity: number;
  stopAnimations: boolean;
  reduceMotion: boolean;
  disableAutoplayVideo: boolean;
  reduceVisualEffects: boolean;
  /** Steps of +10% cursor size, 0–10. 0 = 100% (native, no override). */
  cursorSizeStep: number;
  cursorHighlight: boolean;
  /** Halo size/intensity steps for the cursor-highlight ring, 0–3. */
  cursorHighlightSizeStep: number;
  strongFocus: boolean;
  largeClickTargets: boolean;
  readingFocusMode: boolean;
  readingGuideLine: boolean;
  readingAreaHighlight: boolean;
  /** Steps of extra line-height, 0–3. */
  lineHeightStep: number;
  textWidthConstrained: boolean;
  reduceDistraction: boolean;
};

export const DEFAULT_SETTINGS: AccessibilitySettings = {
  textSizeStep: 0,
  zoomStep: 0,
  highContrast: false,
  invertContrast: false,
  darkMode: false,
  readableFont: false,
  boldText: false,
  letterSpacingStep: 0,
  highlightLinks: false,
  colorFilter: 'none',
  colorFilterIntensity: 100,
  stopAnimations: false,
  reduceMotion: false,
  disableAutoplayVideo: false,
  reduceVisualEffects: false,
  cursorSizeStep: 0,
  cursorHighlight: false,
  cursorHighlightSizeStep: 1,
  strongFocus: false,
  largeClickTargets: false,
  readingFocusMode: false,
  readingGuideLine: false,
  readingAreaHighlight: false,
  lineHeightStep: 0,
  textWidthConstrained: false,
  reduceDistraction: false,
};

export const STORAGE_KEY = 'environesia-a11y-settings-v1';

export const TEXT_SIZE_STEP_MIN = -2; // 80%
export const TEXT_SIZE_STEP_LIMIT = 5; // 150%
export const ZOOM_STEP_LIMIT = 5; // up to +50%
export const LETTER_SPACING_STEP_LIMIT = 3;
export const LINE_HEIGHT_STEP_LIMIT = 3;
export const CURSOR_SIZE_STEP_LIMIT = 10; // 200%
export const CURSOR_HIGHLIGHT_SIZE_STEP_LIMIT = 3;
export const COLOR_FILTER_INTENSITY_MIN = 10;
export const COLOR_FILTER_INTENSITY_MAX = 100;

export function clampSettings(settings: AccessibilitySettings): AccessibilitySettings {
  return {
    ...settings,
    textSizeStep: Math.min(TEXT_SIZE_STEP_LIMIT, Math.max(TEXT_SIZE_STEP_MIN, settings.textSizeStep)),
    zoomStep: Math.min(ZOOM_STEP_LIMIT, Math.max(0, settings.zoomStep)),
    letterSpacingStep: Math.min(LETTER_SPACING_STEP_LIMIT, Math.max(0, settings.letterSpacingStep)),
    lineHeightStep: Math.min(LINE_HEIGHT_STEP_LIMIT, Math.max(0, settings.lineHeightStep)),
    cursorSizeStep: Math.min(CURSOR_SIZE_STEP_LIMIT, Math.max(0, settings.cursorSizeStep)),
    cursorHighlightSizeStep: Math.min(CURSOR_HIGHLIGHT_SIZE_STEP_LIMIT, Math.max(0, settings.cursorHighlightSizeStep)),
    colorFilterIntensity: Math.min(COLOR_FILTER_INTENSITY_MAX, Math.max(COLOR_FILTER_INTENSITY_MIN, settings.colorFilterIntensity)),
  };
}

/**
 * "Seizure-safe" is active if and only if all four settings it manages are
 * currently on — computed, not stored, so there's no separate flag that
 * could drift out of sync with the real settings (e.g. if a user, or
 * another profile, changes just one of the four). Toggling flips all four
 * together based on that same real check.
 */
export function isSeizureSafeActive(settings: AccessibilitySettings): boolean {
  return settings.stopAnimations && settings.reduceMotion && settings.disableAutoplayVideo && settings.reduceVisualEffects;
}

export function toggleSeizureSafeProfile(settings: AccessibilitySettings): AccessibilitySettings {
  const next = !isSeizureSafeActive(settings);
  return {
    ...settings,
    stopAnimations: next,
    reduceMotion: next,
    disableAutoplayVideo: next,
    reduceVisualEffects: next,
  };
}
