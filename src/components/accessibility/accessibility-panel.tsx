'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Eye,
  ShieldAlert,
  MousePointer2,
  BookOpen,
  Ear,
  Lightbulb,
  Settings2,
  Type,
  ZoomIn,
  Contrast,
  RefreshCcw,
  Moon,
  CaseSensitive,
  AlignJustify,
  Link2,
  Palette,
  PauseCircle,
  Wind,
  VideoOff,
  Sparkles,
  MousePointerClick,
  Keyboard,
  Focus,
  Maximize2,
  MousePointer,
  BookOpenCheck,
  Ruler,
  Highlighter,
  Rows3,
  Columns3,
  Volume2,
  Captions,
  FileText,
  BellRing,
  Headphones,
  MessageCircle,
  Minimize2,
  ListTree,
  ClipboardList,
  AlertCircle,
  Navigation,
  Minus,
  Plus,
  Check,
  RotateCcw,
  Info,
  BookOpenText,
  Bold,
  BookA,
  ScanEye,
  type LucideIcon,
} from 'lucide-react';
import { messagesFor, type Messages } from '@/i18n/messages';
import { useAccessibility } from './accessibility-context';
import { useTextReader } from './use-text-reader';
import {
  TEXT_SIZE_STEP_MIN,
  TEXT_SIZE_STEP_LIMIT,
  ZOOM_STEP_LIMIT,
  LETTER_SPACING_STEP_LIMIT,
  LINE_HEIGHT_STEP_LIMIT,
  CURSOR_SIZE_STEP_LIMIT,
  CURSOR_HIGHLIGHT_SIZE_STEP_LIMIT,
  COLOR_FILTER_INTENSITY_MIN,
  COLOR_FILTER_INTENSITY_MAX,
  isSeizureSafeActive,
  type ColorFilter,
} from '@/lib/accessibility/settings';
import { ACCESSIBILITY_PROFILES, type AccessibilityProfileId } from '@/lib/accessibility/profiles';

const PRIMARY = '#2A7793';
const ACCENT = '#01B3A1';
const BORDER = '#E5E7EB';

function FeatureIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]"
      style={{ backgroundColor: 'rgba(42,119,147,0.08)' }}
    >
      <Icon className="h-4 w-4" style={{ color: PRIMARY }} aria-hidden="true" />
    </div>
  );
}

function FeatureCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-[12px] border p-2.5" style={{ borderColor: BORDER }}>
      {children}
    </div>
  );
}

/**
 * The full "who this helps + what it does" copy still exists — screen
 * reader users get it via `srText` (visually hidden, read as part of the
 * control's accessible name/description) — but sighted users no longer
 * see a paragraph of prose per card. One line: icon, name, and the
 * control or current value. This is a deliberate simplification requested
 * after the fuller-copy version shipped; dropping the visible text is not
 * a loss of function, since every control below still carries the same
 * context through its own `aria-label`.
 */
function FeatureHeader({ icon, title, valueLabel }: { icon: LucideIcon; title: string; valueLabel?: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <FeatureIcon icon={icon} />
      <p className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-[#1A1A1A]">{title}</p>
      {valueLabel}
    </div>
  );
}

function a11yDescribe(untuk: string | undefined, description: string): string {
  return [untuk, description].filter(Boolean).join('. ');
}

function ToggleRow({
  icon,
  title,
  untuk,
  description,
  active,
  onToggle,
  activeLabel,
  inactiveLabel,
}: {
  icon: LucideIcon;
  title: string;
  untuk?: string;
  description: string;
  active: boolean;
  onToggle: () => void;
  activeLabel: string;
  inactiveLabel: string;
}) {
  return (
    <FeatureCard>
      <div className="flex items-center gap-2.5">
        <FeatureIcon icon={icon} />
        <p className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-[#1A1A1A]">{title}</p>
        <button
          type="button"
          role="switch"
          aria-checked={active}
          aria-label={`${title}. ${a11yDescribe(untuk, description)}. ${active ? activeLabel : inactiveLabel}`}
          onClick={onToggle}
          className="relative flex h-6 w-10 shrink-0 items-center rounded-full border transition-colors duration-150 motion-reduce:transition-none"
          style={{ backgroundColor: active ? ACCENT : '#E5E7EB', borderColor: active ? ACCENT : '#D1D5DB' }}
        >
          <span
            className="absolute h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-150 motion-reduce:transition-none"
            style={{ transform: active ? 'translateX(18px)' : 'translateX(3px)' }}
          />
        </button>
      </div>
    </FeatureCard>
  );
}

/**
 * A real draggable range slider (mouse, touch, and keyboard arrow keys all
 * work on a native <input type="range"> with no extra code) plus +/−
 * buttons as the stated alternative for anyone who'd rather click than
 * drag. `formatValue` keeps the displayed value honest per feature: text
 * size and zoom genuinely are percentages of the page; letter/line spacing
 * are stepped levels, not percentages, so they're labeled as levels
 * instead of a fabricated "%" figure.
 */
function SliderRow({
  icon,
  title,
  untuk,
  description,
  value,
  min,
  max,
  onChange,
  formatValue,
  decreaseLabel,
  increaseLabel,
  sliderLabel,
  minLabel,
  maxLabel,
}: {
  icon: LucideIcon;
  title: string;
  untuk?: string;
  description: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
  decreaseLabel: string;
  increaseLabel: string;
  sliderLabel: string;
  minLabel: string;
  maxLabel: string;
}) {
  return (
    <FeatureCard>
      <FeatureHeader
        icon={icon}
        title={title}
        valueLabel={
          <span className="shrink-0 text-[12.5px] font-semibold tabular-nums" style={{ color: PRIMARY }}>
            {formatValue(value)}
          </span>
        }
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={decreaseLabel}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[#444444] transition-colors duration-150 hover:border-[#2A7793]/40 hover:text-[#2A7793] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
          style={{ borderColor: BORDER }}
        >
          <Minus className="h-3 w-3" aria-hidden="true" />
        </button>
        <span className="shrink-0 text-[10px] text-[#94a3b8]" aria-hidden="true">
          {minLabel}
        </span>
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={`${sliderLabel}. ${a11yDescribe(untuk, description)}`}
          aria-valuetext={formatValue(value)}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-[#01B3A1]"
          style={{
            background: `linear-gradient(to right, ${ACCENT} ${((value - min) / (max - min)) * 100}%, ${BORDER} ${((value - min) / (max - min)) * 100}%)`,
          }}
        />
        <span className="shrink-0 text-[10px] text-[#94a3b8]" aria-hidden="true">
          {maxLabel}
        </span>
        <button
          type="button"
          aria-label={increaseLabel}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[#444444] transition-colors duration-150 hover:border-[#2A7793]/40 hover:text-[#2A7793] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
          style={{ borderColor: BORDER }}
        >
          <Plus className="h-3 w-3" aria-hidden="true" />
        </button>
      </div>
    </FeatureCard>
  );
}

/**
 * Not a control — these 11 features describe site behavior that's already
 * true (e.g. keyboard navigation already works everywhere), so there's
 * nothing to toggle. A static "already on" checkmark instead of a switch
 * that would do nothing if clicked — the spec explicitly warns against
 * buttons on purely informational items. Full copy is still reachable via
 * the native `title` tooltip and screen-reader-only text, just not shown
 * as a paragraph on every card.
 */
function InfoRow({
  icon,
  title,
  untuk,
  description,
}: {
  icon: LucideIcon;
  title: string;
  untuk?: string;
  description: string;
}) {
  return (
    <FeatureCard>
      <div className="flex items-center gap-2.5" title={a11yDescribe(untuk, description)}>
        <FeatureIcon icon={icon} />
        <p className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-[#1A1A1A]">{title}</p>
        <span className="sr-only">{a11yDescribe(untuk, description)}</span>
        <Check className="h-4 w-4 shrink-0 text-[#94a3b8]" aria-hidden="true" />
      </div>
    </FeatureCard>
  );
}

/**
 * "Mode Tunanetra" — deliberately not a toggle. This website cannot turn a
 * visitor's own screen reader on or off (no website can); claiming
 * otherwise would be the "magic toggle" the spec explicitly forbids. What
 * it CAN really do: open real, readable usage guidance right where the
 * visitor is looking, rather than a line of description with no action
 * behind it. Expands inline (not a separate dialog) so the guidance opens
 * instantly without stacking another focus trap on top of this one.
 */
function ScreenReaderGuideCard({
  a,
  expanded,
  onToggleExpanded,
}: {
  a: Messages['aksesibilitas'];
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  return (
    <FeatureCard>
      <div className="flex items-center gap-2.5" title={a11yDescribe(a.fitur.modeTunanetra.untuk, a.fitur.modeTunanetra.deskripsi)}>
        <FeatureIcon icon={Eye} />
        <p className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-[#1A1A1A]">{a.fitur.modeTunanetra.judul}</p>
        <span className="sr-only">{a11yDescribe(a.fitur.modeTunanetra.untuk, a.fitur.modeTunanetra.deskripsi)}</span>
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={a.panduan.judul}
          onClick={onToggleExpanded}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-150 motion-reduce:transition-none"
          style={{ borderColor: PRIMARY, color: PRIMARY }}
        >
          <BookOpenText className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
      {expanded ? (
        <p className="rounded-[8px] p-3 text-[12.5px] leading-[1.6] text-[#444444]" style={{ backgroundColor: '#f8fafc' }}>
          {a.fitur.modeTunanetra.deskripsi} {a.panduan.isi}
        </p>
      ) : null}
    </FeatureCard>
  );
}

function Category({
  icon: Icon,
  name,
  description,
  count,
  children,
}: {
  icon: LucideIcon;
  name: string;
  description: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <details className="group border-b border-[#eef2f6] py-3 last:border-0" open>
      <summary className="flex cursor-pointer list-none items-start gap-3 [&::-webkit-details-marker]:hidden">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
          style={{ backgroundColor: 'rgba(42,119,147,0.1)' }}
        >
          <Icon className="h-5 w-5" style={{ color: PRIMARY }} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-bold text-[#1A1A1A]">{name}</p>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{ backgroundColor: 'rgba(1,179,161,0.1)', color: ACCENT }}
            >
              {count}
            </span>
          </div>
          <p className="mt-0.5 text-[12.5px] leading-[1.4] text-[#666666]">{description}</p>
        </div>
        <svg
          className="mt-2 h-3.5 w-3.5 shrink-0 text-[#94a3b8] transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </summary>
      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">{children}</div>
    </details>
  );
}

const COLOR_FILTER_OPTIONS: ColorFilter[] = ['none', 'protanopia', 'deuteranopia', 'tritanopia', 'grayscale'];

const PROFILE_ICONS: Record<AccessibilityProfileId, LucideIcon> = {
  lowVision: ScanEye,
  focusDistraction: Minimize2,
  reading: BookA,
  motor: MousePointer2,
  visualSensitivity: ShieldAlert,
  colorPerception: Palette,
};

/**
 * One card per ready-made profile (see src/lib/accessibility/profiles.ts).
 * `active` is computed live from real settings by the caller — never a
 * stored "I was clicked" flag — so a manual change to any one of a
 * profile's settings after activating it correctly drops the active
 * indicator here instead of lying about it.
 */
function ProfileCard({
  icon,
  name,
  description,
  active,
  onToggle,
  activateLabel,
  activeLabel,
}: {
  icon: LucideIcon;
  name: string;
  description: string;
  active: boolean;
  onToggle: () => void;
  activateLabel: string;
  activeLabel: string;
}) {
  return (
    <div
      className="flex flex-col gap-2 rounded-[12px] border p-3"
      style={{ borderColor: active ? ACCENT : BORDER, backgroundColor: active ? 'rgba(1,179,161,0.06)' : '#ffffff' }}
    >
      <div className="flex items-start gap-2.5">
        <FeatureIcon icon={icon} />
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold text-[#1A1A1A]">{name}</p>
          <p className="mt-0.5 text-[11.5px] leading-[1.4] text-[#666666]">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={active}
        aria-label={`${name}. ${description}. ${active ? activeLabel : activateLabel}`}
        className="flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors duration-150 motion-reduce:transition-none"
        style={{
          backgroundColor: active ? PRIMARY : 'transparent',
          color: active ? '#ffffff' : PRIMARY,
          border: `1px solid ${PRIMARY}`,
        }}
      >
        {active ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
        {active ? activeLabel : activateLabel}
      </button>
    </div>
  );
}

export function AccessibilityPanel({ locale, open, onClose, triggerRef }: {
  locale: string;
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const t = messagesFor(locale);
  const a = t.aksesibilitas;
  const { settings, ready, toggle, update, toggleSeizureSafe, toggleProfile, activeProfileId, reset } = useAccessibility();
  const seizureSafeActive = isSeizureSafeActive(settings);
  const reader = useTextReader(locale);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [justReset, setJustReset] = useState(false);
  const [guideExpanded, setGuideExpanded] = useState(false);

  // A focus-trapping, Escape-closing, backdrop-click-closing modal dialog —
  // the native <dialog> element (used elsewhere in this codebase's own
  // admin modals) would be the simpler choice, but it sits awkwardly with
  // this panel's own responsive sizing, so this mirrors the same
  // showModal()-style focus/return/restore guarantees by hand instead.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const trigger = triggerRef.current;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      (previouslyFocused ?? trigger)?.focus();
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  function handleReset() {
    reset();
    reader.stop(); // a running text-to-speech session is real, ongoing state Reset All must actually stop, not just settings
    setJustReset(true);
    window.setTimeout(() => setJustReset(false), 2500);
  }

  return (
    <div className="fixed inset-0 z-[9998] flex items-end justify-center p-0 sm:items-center sm:p-4" role="presentation">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-panel-title"
        aria-describedby="a11y-panel-desc"
        className="relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-[20px] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.4)] sm:max-h-[88vh] sm:w-[640px] sm:rounded-[20px]"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[#eef2f6] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id="a11y-panel-title" className="text-[18px] font-bold text-[#1A1A1A]">
              {a.judul}
            </h2>
            <p id="a11y-panel-desc" className="mt-0.5 text-[13px] text-[#666666]">
              {a.deskripsi}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={a.tutup}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#64748b] hover:bg-[#f4f6f9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: PRIMARY }}
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {!ready ? (
          <div className="flex-1 px-5 py-8 text-center text-[13px] text-[#94a3b8]">…</div>
        ) : (
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6">
            <section aria-labelledby="a11y-profiles-heading" className="border-b border-[#eef2f6] py-3">
              <h3 id="a11y-profiles-heading" className="text-[15px] font-bold text-[#1A1A1A]">
                {a.profil.judul}
              </h3>
              <p className="mt-0.5 text-[12.5px] leading-[1.4] text-[#666666]">{a.profil.intro}</p>
              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {ACCESSIBILITY_PROFILES.map((profile) => {
                  const copy = a.profil.daftar[profile.id];
                  return (
                    <ProfileCard
                      key={profile.id}
                      icon={PROFILE_ICONS[profile.id]}
                      name={copy.nama}
                      description={copy.deskripsi}
                      active={activeProfileId === profile.id}
                      onToggle={() => toggleProfile(profile.id)}
                      activateLabel={a.profil.aktifkanProfil}
                      activeLabel={a.profil.profilAktif}
                    />
                  );
                })}
              </div>
            </section>
            <Category
              icon={Eye}
              name={a.kategori.penglihatan.nama}
              description={a.kategori.penglihatan.deskripsi}
              count={11}
            >
              {/* Mode Tunanetra is its own standalone group, set apart from
                  the visual-display settings below — it's a bundle of
                  screen-reader guidance, not a visual-tweak control, so it
                  must never look like one more item in the same group. */}
              <div className="sm:col-span-2">
                <ScreenReaderGuideCard a={a} expanded={guideExpanded} onToggleExpanded={() => setGuideExpanded((v) => !v)} />
              </div>
              <div className="flex items-center gap-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8] sm:col-span-2">
                <Settings2 className="h-3 w-3" aria-hidden="true" />
                {a.pengaturanTampilan}
              </div>
              <SliderRow
                icon={Type}
                title={a.fitur.ukuranTeks.judul}
                untuk={a.fitur.ukuranTeks.untuk}
                description={a.fitur.ukuranTeks.deskripsi}
                value={settings.textSizeStep}
                min={TEXT_SIZE_STEP_MIN}
                max={TEXT_SIZE_STEP_LIMIT}
                onChange={(v) => update('textSizeStep', v)}
                formatValue={(v) => `${Math.round((1 + v * 0.1) * 100)}%`}
                decreaseLabel={`${a.fitur.ukuranTeks.judul}: ${a.perkecil}`}
                increaseLabel={`${a.fitur.ukuranTeks.judul}: ${a.perbesar}`}
                sliderLabel={a.fitur.ukuranTeks.judul}
                minLabel={a.min}
                maxLabel={a.maks}
              />
              <SliderRow
                icon={ZoomIn}
                title={a.fitur.zoomHalaman.judul}
                untuk={a.fitur.zoomHalaman.untuk}
                description={a.fitur.zoomHalaman.deskripsi}
                value={settings.zoomStep}
                min={0}
                max={ZOOM_STEP_LIMIT}
                onChange={(v) => update('zoomStep', v)}
                formatValue={(v) => `${Math.round((1 + v * 0.1) * 100)}%`}
                decreaseLabel={`${a.fitur.zoomHalaman.judul}: ${a.perkecil}`}
                increaseLabel={`${a.fitur.zoomHalaman.judul}: ${a.perbesar}`}
                sliderLabel={a.fitur.zoomHalaman.judul}
                minLabel={a.min}
                maxLabel={a.maks}
              />
              <ToggleRow
                icon={Contrast}
                title={a.fitur.kontrasTinggi.judul}
                untuk={a.fitur.kontrasTinggi.untuk}
                description={a.fitur.kontrasTinggi.deskripsi}
                active={settings.highContrast}
                onToggle={() => toggle('highContrast')}
                activeLabel={a.aktif}
                inactiveLabel={a.nonaktif}
              />
              <ToggleRow
                icon={RefreshCcw}
                title={a.fitur.kontrasTerbalik.judul}
                untuk={a.fitur.kontrasTerbalik.untuk}
                description={a.fitur.kontrasTerbalik.deskripsi}
                active={settings.invertContrast}
                onToggle={() => toggle('invertContrast')}
                activeLabel={a.aktif}
                inactiveLabel={a.nonaktif}
              />
              <ToggleRow
                icon={Moon}
                title={a.fitur.modeGelap.judul}
                untuk={a.fitur.modeGelap.untuk}
                description={a.fitur.modeGelap.deskripsi}
                active={settings.darkMode}
                onToggle={() => toggle('darkMode')}
                activeLabel={a.aktif}
                inactiveLabel={a.nonaktif}
              />
              <ToggleRow
                icon={CaseSensitive}
                title={a.fitur.fontMudahDibaca.judul}
                untuk={a.fitur.fontMudahDibaca.untuk}
                description={a.fitur.fontMudahDibaca.deskripsi}
                active={settings.readableFont}
                onToggle={() => toggle('readableFont')}
                activeLabel={a.aktif}
                inactiveLabel={a.nonaktif}
              />
              <ToggleRow
                icon={Bold}
                title={a.fitur.tebalkanTeks.judul}
                untuk={a.fitur.tebalkanTeks.untuk}
                description={a.fitur.tebalkanTeks.deskripsi}
                active={settings.boldText}
                onToggle={() => toggle('boldText')}
                activeLabel={a.aktif}
                inactiveLabel={a.nonaktif}
              />
              <SliderRow
                icon={AlignJustify}
                title={a.fitur.jarakTeks.judul}
                untuk={a.fitur.jarakTeks.untuk}
                description={a.fitur.jarakTeks.deskripsi}
                value={settings.letterSpacingStep}
                min={0}
                max={LETTER_SPACING_STEP_LIMIT}
                onChange={(v) => update('letterSpacingStep', v)}
                formatValue={(v) => `${a.level} ${v + 1}/${LETTER_SPACING_STEP_LIMIT + 1}`}
                decreaseLabel={`${a.fitur.jarakTeks.judul}: ${a.perkecil}`}
                increaseLabel={`${a.fitur.jarakTeks.judul}: ${a.perbesar}`}
                sliderLabel={a.fitur.jarakTeks.judul}
                minLabel={a.min}
                maxLabel={a.maks}
              />
              <ToggleRow
                icon={Link2}
                title={a.fitur.penyorotanTautan.judul}
                untuk={a.fitur.penyorotanTautan.untuk}
                description={a.fitur.penyorotanTautan.deskripsi}
                active={settings.highlightLinks}
                onToggle={() => toggle('highlightLinks')}
                activeLabel={a.aktif}
                inactiveLabel={a.nonaktif}
              />
              <div className="sm:col-span-2">
                <FeatureCard>
                  <FeatureHeader icon={Palette} title={a.fitur.filterWarna.judul} />
                  <select
                    value={settings.colorFilter}
                    onChange={(e) => update('colorFilter', e.target.value as ColorFilter)}
                    aria-label={`${a.fitur.filterWarna.judul}. ${a11yDescribe(a.fitur.filterWarna.untuk, a.fitur.filterWarna.deskripsi)}`}
                    className="w-full rounded-[8px] border bg-white px-3 py-2 text-[13px] text-[#1A1A1A] outline-none focus-visible:border-[#2A7793]"
                    style={{ borderColor: BORDER }}
                  >
                    {COLOR_FILTER_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {a.fitur.filterWarna.opsi[opt]}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11.5px] leading-[1.4] text-[#94a3b8]">{a.fitur.filterWarna.opsiDeskripsi[settings.colorFilter]}</p>
                  {settings.colorFilter !== 'none' ? (
                    <div className="flex items-center gap-2 border-t pt-2" style={{ borderColor: '#f1f5f9' }}>
                      <span className="shrink-0 text-[12px] text-[#444444]">{a.fitur.filterWarna.intensitas}</span>
                      <input
                        type="range"
                        min={COLOR_FILTER_INTENSITY_MIN}
                        max={COLOR_FILTER_INTENSITY_MAX}
                        step={5}
                        value={settings.colorFilterIntensity}
                        onChange={(e) => update('colorFilterIntensity', Number(e.target.value))}
                        aria-label={a.fitur.filterWarna.intensitas}
                        aria-valuetext={`${settings.colorFilterIntensity}%`}
                        className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-[#01B3A1]"
                        style={{
                          background: `linear-gradient(to right, ${ACCENT} ${settings.colorFilterIntensity}%, ${BORDER} ${settings.colorFilterIntensity}%)`,
                        }}
                      />
                      <span className="shrink-0 text-[12px] font-semibold tabular-nums" style={{ color: PRIMARY }}>
                        {settings.colorFilterIntensity}%
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          update('colorFilter', 'none' as ColorFilter);
                          update('colorFilterIntensity', 100);
                        }}
                        className="shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold text-[#444444] hover:border-[#2A7793]/40 hover:text-[#2A7793]"
                        style={{ borderColor: BORDER }}
                      >
                        {a.fitur.filterWarna.reset}
                      </button>
                    </div>
                  ) : null}
                </FeatureCard>
              </div>
            </Category>

            <Category
              icon={ShieldAlert}
              name={a.kategori.keamananVisual.nama}
              description={a.kategori.keamananVisual.deskripsi}
              count={5}
            >
              <div className="sm:col-span-2">
                <FeatureCard>
                  <div className="flex items-center gap-2.5">
                    <FeatureIcon icon={ShieldAlert} />
                    <p className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-[#1A1A1A]">{a.fitur.profilKejang.judul}</p>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={seizureSafeActive}
                      aria-label={`${a.fitur.profilKejang.judul}. ${a11yDescribe(a.fitur.profilKejang.untuk, a.fitur.profilKejang.deskripsi)}. ${seizureSafeActive ? a.aktif : a.nonaktif}`}
                      onClick={toggleSeizureSafe}
                      className="relative flex h-6 w-10 shrink-0 items-center rounded-full border transition-colors duration-150 motion-reduce:transition-none"
                      style={{
                        backgroundColor: seizureSafeActive ? ACCENT : '#E5E7EB',
                        borderColor: seizureSafeActive ? ACCENT : '#D1D5DB',
                      }}
                    >
                      <span
                        className="absolute h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-150 motion-reduce:transition-none"
                        style={{ transform: seizureSafeActive ? 'translateX(18px)' : 'translateX(3px)' }}
                      />
                    </button>
                  </div>
                  {seizureSafeActive ? (
                    <p className="rounded-[8px] p-2 text-[11.5px] leading-[1.5] text-[#444444]" style={{ backgroundColor: '#f8fafc' }}>
                      {a.fitur.profilKejang.diterapkan}: {a.fitur.hentikanAnimasi.judul}, {a.fitur.kurangiGerakan.judul},{' '}
                      {a.fitur.nonaktifkanVideo.judul}, {a.fitur.kurangiEfekVisual.judul}.
                    </p>
                  ) : null}
                </FeatureCard>
              </div>
              <ToggleRow
                icon={PauseCircle}
                title={a.fitur.hentikanAnimasi.judul}
                untuk={a.fitur.hentikanAnimasi.untuk}
                description={a.fitur.hentikanAnimasi.deskripsi}
                active={settings.stopAnimations}
                onToggle={() => toggle('stopAnimations')}
                activeLabel={a.aktif}
                inactiveLabel={a.nonaktif}
              />
              <ToggleRow
                icon={Wind}
                title={a.fitur.kurangiGerakan.judul}
                untuk={a.fitur.kurangiGerakan.untuk}
                description={a.fitur.kurangiGerakan.deskripsi}
                active={settings.reduceMotion}
                onToggle={() => toggle('reduceMotion')}
                activeLabel={a.aktif}
                inactiveLabel={a.nonaktif}
              />
              <ToggleRow
                icon={VideoOff}
                title={a.fitur.nonaktifkanVideo.judul}
                untuk={a.fitur.nonaktifkanVideo.untuk}
                description={a.fitur.nonaktifkanVideo.deskripsi}
                active={settings.disableAutoplayVideo}
                onToggle={() => toggle('disableAutoplayVideo')}
                activeLabel={a.aktif}
                inactiveLabel={a.nonaktif}
              />
              <ToggleRow
                icon={Sparkles}
                title={a.fitur.kurangiEfekVisual.judul}
                untuk={a.fitur.kurangiEfekVisual.untuk}
                description={a.fitur.kurangiEfekVisual.deskripsi}
                active={settings.reduceVisualEffects}
                onToggle={() => toggle('reduceVisualEffects')}
                activeLabel={a.aktif}
                inactiveLabel={a.nonaktif}
              />
            </Category>

            <Category
              icon={MousePointer2}
              name={a.kategori.navigasiMotorik.nama}
              description={a.kategori.navigasiMotorik.deskripsi}
              count={7}
            >
              <SliderRow
                icon={MousePointer2}
                title={a.fitur.kursorBesar.judul}
                untuk={a.fitur.kursorBesar.untuk}
                description={a.fitur.kursorBesar.deskripsi}
                value={settings.cursorSizeStep}
                min={0}
                max={CURSOR_SIZE_STEP_LIMIT}
                onChange={(v) => update('cursorSizeStep', v)}
                formatValue={(v) => `${Math.round(100 * (1 + v / 10))}%`}
                decreaseLabel={`${a.fitur.kursorBesar.judul}: ${a.perkecil}`}
                increaseLabel={`${a.fitur.kursorBesar.judul}: ${a.perbesar}`}
                sliderLabel={a.fitur.kursorBesar.judul}
                minLabel={a.min}
                maxLabel={a.maks}
              />
              <ToggleRow
                icon={MousePointerClick}
                title={a.fitur.sorotanKursor.judul}
                untuk={a.fitur.sorotanKursor.untuk}
                description={a.fitur.sorotanKursor.deskripsi}
                active={settings.cursorHighlight}
                onToggle={() => toggle('cursorHighlight')}
                activeLabel={a.aktif}
                inactiveLabel={a.nonaktif}
              />
              <SliderRow
                icon={MousePointerClick}
                title={a.fitur.ukuranSorotanKursor.judul}
                untuk={a.fitur.ukuranSorotanKursor.untuk}
                description={a.fitur.ukuranSorotanKursor.deskripsi}
                value={settings.cursorHighlightSizeStep}
                min={0}
                max={CURSOR_HIGHLIGHT_SIZE_STEP_LIMIT}
                onChange={(v) => update('cursorHighlightSizeStep', v)}
                formatValue={(v) => `${a.level} ${v + 1}/${CURSOR_HIGHLIGHT_SIZE_STEP_LIMIT + 1}`}
                decreaseLabel={`${a.fitur.ukuranSorotanKursor.judul}: ${a.perkecil}`}
                increaseLabel={`${a.fitur.ukuranSorotanKursor.judul}: ${a.perbesar}`}
                sliderLabel={a.fitur.ukuranSorotanKursor.judul}
                minLabel={a.min}
                maxLabel={a.maks}
              />
              <InfoRow
                icon={Keyboard}
                title={a.fitur.navigasiKeyboard.judul}
                untuk={a.fitur.navigasiKeyboard.untuk}
                description={a.fitur.navigasiKeyboard.deskripsi}
              />
              <ToggleRow
                icon={Focus}
                title={a.fitur.fokusJelas.judul}
                untuk={a.fitur.fokusJelas.untuk}
                description={a.fitur.fokusJelas.deskripsi}
                active={settings.strongFocus}
                onToggle={() => toggle('strongFocus')}
                activeLabel={a.aktif}
                inactiveLabel={a.nonaktif}
              />
              <ToggleRow
                icon={Maximize2}
                title={a.fitur.areaKlik.judul}
                untuk={a.fitur.areaKlik.untuk}
                description={a.fitur.areaKlik.deskripsi}
                active={settings.largeClickTargets}
                onToggle={() => toggle('largeClickTargets')}
                activeLabel={a.aktif}
                inactiveLabel={a.nonaktif}
              />
              <InfoRow
                icon={MousePointer}
                title={a.fitur.sederhanakanInteraksi.judul}
                untuk={a.fitur.sederhanakanInteraksi.untuk}
                description={a.fitur.sederhanakanInteraksi.deskripsi}
              />
            </Category>

            <Category
              icon={BookOpen}
              name={a.kategori.membacaKognitif.nama}
              description={a.kategori.membacaKognitif.deskripsi}
              count={6}
            >
              <ToggleRow
                icon={BookOpenCheck}
                title={a.fitur.modeFokusMembaca.judul}
                untuk={a.fitur.modeFokusMembaca.untuk}
                description={a.fitur.modeFokusMembaca.deskripsi}
                active={settings.readingFocusMode}
                onToggle={() => toggle('readingFocusMode')}
                activeLabel={a.aktif}
                inactiveLabel={a.nonaktif}
              />
              <ToggleRow
                icon={Ruler}
                title={a.fitur.garisBantu.judul}
                untuk={a.fitur.garisBantu.untuk}
                description={a.fitur.garisBantu.deskripsi}
                active={settings.readingGuideLine}
                onToggle={() => toggle('readingGuideLine')}
                activeLabel={a.aktif}
                inactiveLabel={a.nonaktif}
              />
              <ToggleRow
                icon={Highlighter}
                title={a.fitur.penyorotanArea.judul}
                untuk={a.fitur.penyorotanArea.untuk}
                description={a.fitur.penyorotanArea.deskripsi}
                active={settings.readingAreaHighlight}
                onToggle={() => toggle('readingAreaHighlight')}
                activeLabel={a.aktif}
                inactiveLabel={a.nonaktif}
              />
              <SliderRow
                icon={Rows3}
                title={a.fitur.jarakBaris.judul}
                untuk={a.fitur.jarakBaris.untuk}
                description={a.fitur.jarakBaris.deskripsi}
                value={settings.lineHeightStep}
                min={0}
                max={LINE_HEIGHT_STEP_LIMIT}
                onChange={(v) => update('lineHeightStep', v)}
                formatValue={(v) => `${a.level} ${v + 1}/${LINE_HEIGHT_STEP_LIMIT + 1}`}
                decreaseLabel={`${a.fitur.jarakBaris.judul}: ${a.perkecil}`}
                increaseLabel={`${a.fitur.jarakBaris.judul}: ${a.perbesar}`}
                sliderLabel={a.fitur.jarakBaris.judul}
                minLabel={a.min}
                maxLabel={a.maks}
              />
              <ToggleRow
                icon={Columns3}
                title={a.fitur.lebarTeks.judul}
                untuk={a.fitur.lebarTeks.untuk}
                description={a.fitur.lebarTeks.deskripsi}
                active={settings.textWidthConstrained}
                onToggle={() => toggle('textWidthConstrained')}
                activeLabel={a.aktif}
                inactiveLabel={a.nonaktif}
              />
              <TextReaderRow a={a} reader={reader} />
            </Category>

            <Category icon={Ear} name={a.kategori.pendengaran.nama} description={a.kategori.pendengaran.deskripsi} count={4}>
              <InfoRow icon={Captions} title={a.fitur.takarir.judul} untuk={a.fitur.takarir.untuk} description={a.fitur.takarir.deskripsi} />
              <InfoRow
                icon={FileText}
                title={a.fitur.transkrip.judul}
                untuk={a.fitur.transkrip.untuk}
                description={a.fitur.transkrip.deskripsi}
              />
              <InfoRow
                icon={BellRing}
                title={a.fitur.indikatorSuara.judul}
                untuk={a.fitur.indikatorSuara.untuk}
                description={a.fitur.indikatorSuara.deskripsi}
              />
              <InfoRow
                icon={Headphones}
                title={a.fitur.alternatifAudio.judul}
                untuk={a.fitur.alternatifAudio.untuk}
                description={a.fitur.alternatifAudio.deskripsi}
              />
            </Category>

            <Category
              icon={Lightbulb}
              name={a.kategori.kemudahanMemahami.nama}
              description={a.kategori.kemudahanMemahami.deskripsi}
              count={6}
            >
              <InfoRow
                icon={MessageCircle}
                title={a.fitur.bahasaSederhana.judul}
                untuk={a.fitur.bahasaSederhana.untuk}
                description={a.fitur.bahasaSederhana.deskripsi}
              />
              <ToggleRow
                icon={Minimize2}
                title={a.fitur.pengurangDistraksi.judul}
                untuk={a.fitur.pengurangDistraksi.untuk}
                description={a.fitur.pengurangDistraksi.deskripsi}
                active={settings.reduceDistraction}
                onToggle={() => toggle('reduceDistraction')}
                activeLabel={a.aktif}
                inactiveLabel={a.nonaktif}
              />
              <InfoRow
                icon={ListTree}
                title={a.fitur.strukturKonten.judul}
                untuk={a.fitur.strukturKonten.untuk}
                description={a.fitur.strukturKonten.deskripsi}
              />
              <InfoRow
                icon={ClipboardList}
                title={a.fitur.petunjukFormulir.judul}
                untuk={a.fitur.petunjukFormulir.untuk}
                description={a.fitur.petunjukFormulir.deskripsi}
              />
              <InfoRow
                icon={AlertCircle}
                title={a.fitur.pesanKesalahan.judul}
                untuk={a.fitur.pesanKesalahan.untuk}
                description={a.fitur.pesanKesalahan.deskripsi}
              />
              <InfoRow
                icon={Navigation}
                title={a.fitur.bantuanNavigasi.judul}
                untuk={a.fitur.bantuanNavigasi.untuk}
                description={a.fitur.bantuanNavigasi.deskripsi}
              />
            </Category>

            <Category
              icon={Settings2}
              name={a.kategori.preferensiBantuan.nama}
              description={a.kategori.preferensiBantuan.deskripsi}
              count={5}
            >
              <InfoRow icon={Info} title={a.info.judul} description={a.info.isi} />
              <InfoRow icon={Info} title={a.panduan.judul} description={a.panduan.isi} />
            </Category>
          </div>
        )}

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-[#eef2f6] px-5 py-3.5 sm:px-6">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748b] hover:text-[#1A1A1A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: PRIMARY }}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            {a.resetSemua}
          </button>
          {justReset ? (
            <span className="inline-flex items-center gap-1 text-[12px] font-medium" style={{ color: ACCENT }} role="status">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              {a.resetTerkonfirmasi}
            </span>
          ) : null}
        </footer>
      </div>
    </div>
  );
}

function TextReaderRow({ a, reader }: { a: Messages['aksesibilitas']; reader: ReturnType<typeof useTextReader> }) {
  return (
    <FeatureCard>
      <div title={a11yDescribe(a.fitur.pembacaTeks.untuk, a.fitur.pembacaTeks.deskripsi)}>
        <FeatureHeader icon={Volume2} title={a.fitur.pembacaTeks.judul} />
        <span className="sr-only">{a11yDescribe(a.fitur.pembacaTeks.untuk, a.fitur.pembacaTeks.deskripsi)}</span>
      </div>
      {reader.state === 'unsupported' ? (
        <p className="text-[12px] text-[#94a3b8]">{a.fitur.pembacaTeks.tidakDidukung}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {reader.state !== 'playing' ? (
            <button
              type="button"
              onClick={reader.play}
              className="rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-white"
              style={{ backgroundColor: PRIMARY }}
            >
              {reader.state === 'paused' ? a.fitur.pembacaTeks.lanjutkan : a.fitur.pembacaTeks.mulai}
            </button>
          ) : (
            <button
              type="button"
              onClick={reader.pause}
              className="rounded-full border px-3.5 py-1.5 text-[12px] font-semibold text-[#1A1A1A]"
              style={{ borderColor: BORDER }}
            >
              {a.fitur.pembacaTeks.jeda}
            </button>
          )}
          {reader.state !== 'idle' ? (
            <button
              type="button"
              onClick={reader.stop}
              className="rounded-full border px-3.5 py-1.5 text-[12px] font-semibold text-[#64748b]"
              style={{ borderColor: BORDER }}
            >
              {a.fitur.pembacaTeks.berhenti}
            </button>
          ) : null}
        </div>
      )}
    </FeatureCard>
  );
}
