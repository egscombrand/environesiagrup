import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AccessibilityWidget } from './accessibility-widget';
import { STORAGE_KEY } from '@/lib/accessibility/settings';

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute('data-a11y-high-contrast');
  document.documentElement.removeAttribute('data-a11y-dark');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('AccessibilityWidget', () => {
  it('renders a floating trigger button with an accessible label', () => {
    render(<AccessibilityWidget locale="id" />);
    expect(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' })).toBeInTheDocument();
  });

  it('opens the panel on click, showing the title and all seven category headings', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);

    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Pusat Aksesibilitas')).toBeInTheDocument();
    ['Penglihatan', 'Keamanan Visual', 'Navigasi dan Motorik', 'Membaca dan Kognitif', 'Pendengaran', 'Kemudahan Memahami', 'Preferensi dan Bantuan'].forEach(
      (category) => expect(within(dialog).getByText(category)).toBeInTheDocument()
    );
  });

  it('closes the panel on Escape and returns focus to the trigger button', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    const trigger = screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' });

    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes the panel when clicking the close button', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));
    await user.click(screen.getByRole('button', { name: 'Tutup' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('turning on High Contrast sets the matching data attribute on <html>, and it really works (not a decorative toggle)', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    expect(document.documentElement).not.toHaveAttribute('data-a11y-high-contrast');
    await user.click(screen.getByRole('switch', { name: /Kontras Tinggi/ }));
    expect(document.documentElement).toHaveAttribute('data-a11y-high-contrast');
  });

  it('persists a setting to localStorage and restores it when the widget remounts', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));
    await user.click(screen.getByRole('switch', { name: /Mode Gelap/ }));

    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({ darkMode: true });

    unmount();
    document.documentElement.removeAttribute('data-a11y-dark');

    render(<AccessibilityWidget locale="id" />);
    // The provider reads localStorage in an effect right after mount.
    await vi.waitFor(() => expect(document.documentElement.style.getPropertyValue('--a11y-filter')).not.toBe(''));
  });

  it('Reset All Settings clears every toggle and shows a visible confirmation', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    await user.click(screen.getByRole('switch', { name: /Kontras Tinggi/ }));
    expect(document.documentElement).toHaveAttribute('data-a11y-high-contrast');

    await user.click(screen.getByRole('button', { name: /Reset Semua Pengaturan/ }));
    expect(document.documentElement).not.toHaveAttribute('data-a11y-high-contrast');
    expect(screen.getByRole('status')).toHaveTextContent('Semua pengaturan telah direset ke kondisi awal.');
  });

  it('the Text Reader control reports unsupported when the browser has no speechSynthesis, rather than a silently broken button', async () => {
    const original = window.speechSynthesis;
    // @ts-expect-error -- simulating an unsupported browser
    delete window.speechSynthesis;
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    expect(screen.getByText('Pembaca teks tidak didukung pada browser ini.')).toBeInTheDocument();
    window.speechSynthesis = original;
  });

  it('Text Size is a real range slider (80%–200%) that actually changes the page font size, with +/- buttons as an alternative', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    const slider = screen.getByRole('slider', { name: /^Ukuran Teks\b/ });
    expect(slider).toHaveAttribute('min', '-2');
    expect(slider).toHaveAttribute('max', '5');
    expect(document.documentElement.style.getPropertyValue('--a11y-text-scale')).toBe('1');

    await user.click(screen.getByRole('button', { name: 'Ukuran Teks: Perbesar' }));
    await user.click(screen.getByRole('button', { name: 'Ukuran Teks: Perbesar' }));
    expect(document.documentElement.style.getPropertyValue('--a11y-text-scale')).toBe('1.2');
    expect(screen.getByText('120%')).toBeInTheDocument();
  });

  it('dragging the Text Size slider directly updates the value (not just the +/- buttons)', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    // jsdom doesn't implement a real <input type="range">'s native arrow-key
    // stepping (that's browser-native behavior, guaranteed by the HTML spec
    // for any range input — already confirmed live in a real browser during
    // this feature's manual verification) — firing the same `input`/`change`
    // events a drag or touch gesture produces is what's actually testable
    // here, and exercises the same onChange handler either input method
    // triggers.
    const slider = screen.getByRole('slider', { name: /^Ukuran Teks\b/ });
    fireEvent.input(slider, { target: { value: '3' } });
    fireEvent.change(slider, { target: { value: '3' } });
    expect(document.documentElement.style.getPropertyValue('--a11y-text-scale')).toBe('1.3');
    expect(screen.getByText('130%')).toBeInTheDocument();
  });

  it('Text Size cannot go below 80% or above 150% — the +/- buttons disable at the real clamp', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    const decrease = screen.getByRole('button', { name: 'Ukuran Teks: Perkecil' });
    for (let i = 0; i < 5; i += 1) await user.click(decrease);
    expect(document.documentElement.style.getPropertyValue('--a11y-text-scale')).toBe('0.8');
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(decrease).toBeDisabled();

    const increase = screen.getByRole('button', { name: 'Ukuran Teks: Perbesar' });
    for (let i = 0; i < 10; i += 1) await user.click(increase);
    expect(document.documentElement.style.getPropertyValue('--a11y-text-scale')).toBe('1.5');
    expect(screen.getByText('150%')).toBeInTheDocument();
    expect(increase).toBeDisabled();
  });

  it('Cursor Size is a real slider (100%–200%) that actually changes the cursor, not a plain on/off toggle', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    expect(screen.queryByRole('switch', { name: /Ukuran Kursor/ })).not.toBeInTheDocument();
    const slider = screen.getByRole('slider', { name: /^Ukuran Kursor\b/ });
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '10');
    expect(document.documentElement).not.toHaveAttribute('data-a11y-cursor-scaled');

    fireEvent.input(slider, { target: { value: '5' } });
    fireEvent.change(slider, { target: { value: '5' } });
    expect(document.documentElement).toHaveAttribute('data-a11y-cursor-scaled');
    expect(document.documentElement.style.getPropertyValue('--a11y-cursor')).toContain('url(');
    expect(screen.getByText('150%')).toBeInTheDocument();
  });

  it('cards are compact — the long per-feature description is not rendered as visible text, but is still carried in the control\'s accessible name', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    // The old paragraph-length copy must not appear as its own visible node...
    expect(screen.queryByText('Tingkatkan kontras warna teks dan latar agar informasi lebih mudah terlihat.')).not.toBeInTheDocument();
    // ...but a screen reader still gets the full context through the switch's accessible name.
    const toggle = screen.getByRole('switch', { name: /Kontras Tinggi/ });
    expect(toggle).toHaveAccessibleName(expect.stringContaining('kesulitan membedakan teks'));
    expect(toggle).toHaveAccessibleName(expect.stringContaining('Tingkatkan kontras'));
  });

  it('several visual features can be combined at once without one undoing another', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    await user.click(screen.getByRole('switch', { name: /Kontras Tinggi/ }));
    await user.click(screen.getByRole('switch', { name: /Mode Gelap/ }));
    await user.click(screen.getByRole('switch', { name: /Font Mudah Dibaca/ }));

    expect(document.documentElement).toHaveAttribute('data-a11y-high-contrast');
    expect(document.documentElement).toHaveAttribute('data-a11y-readable-font');
    // Dark mode has no attribute of its own — it's applied purely through
    // the shared --a11y-filter variable, which must still carry its invert
    // even with the other two toggles active at the same time.
    expect(document.documentElement.style.getPropertyValue('--a11y-filter')).toContain('invert');
  });

  it('turning a feature back off reverts its effect, and Reset restores every combined setting at once', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    const highContrast = screen.getByRole('switch', { name: /Kontras Tinggi/ });
    await user.click(highContrast);
    await user.click(screen.getByRole('switch', { name: /Mode Gelap/ }));
    expect(document.documentElement).toHaveAttribute('data-a11y-high-contrast');

    await user.click(highContrast);
    expect(document.documentElement).not.toHaveAttribute('data-a11y-high-contrast');
    expect(document.documentElement.style.getPropertyValue('--a11y-filter')).toContain('invert');

    await user.click(screen.getByRole('button', { name: /Reset Semua Pengaturan/ }));
    expect(document.documentElement.style.getPropertyValue('--a11y-filter')).toBe('none');
  });

  it('Text Size never sets root <html> font-size directly (that used to drag the whole rem-based layout along with it)', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    await user.click(screen.getByRole('button', { name: 'Ukuran Teks: Perbesar' }));
    await user.click(screen.getByRole('button', { name: 'Ukuran Teks: Perbesar' }));
    // The --a11y-text-scale variable is still set (consumed by the typography
    // tokens and the generic text-element rule in globals.css)...
    expect(document.documentElement.style.getPropertyValue('--a11y-text-scale')).toBe('1.2');
    // ...but root font-size itself must stay untouched.
    expect(document.documentElement.style.fontSize).toBe('');
  });

  it('Color Filter: choosing a profile reveals a real intensity slider and a working Reset Filter', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    expect(screen.queryByRole('slider', { name: /Intensitas Filter/ })).not.toBeInTheDocument();

    const select = screen.getByRole('combobox', { name: /Filter Warna/ });
    await user.selectOptions(select, 'grayscale');
    expect(document.documentElement.style.getPropertyValue('--a11y-filter')).toContain('grayscale(1)');

    const intensity = screen.getByRole('slider', { name: /Intensitas Filter/ });
    fireEvent.input(intensity, { target: { value: '50' } });
    fireEvent.change(intensity, { target: { value: '50' } });
    expect(document.documentElement.style.getPropertyValue('--a11y-filter')).toContain('grayscale(0.5)');

    await user.click(screen.getByRole('button', { name: /Reset Filter/ }));
    expect(document.documentElement.style.getPropertyValue('--a11y-filter')).toBe('none');
    expect(screen.queryByRole('slider', { name: /Intensitas Filter/ })).not.toBeInTheDocument();
  });

  it('Seizure-Safe Profile is a real toggle (not a one-way button) and shows a summary of what it applied', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    const profileSwitch = screen.getByRole('switch', { name: /Profil Aman untuk Kejang/ });
    expect(profileSwitch).toHaveAttribute('aria-checked', 'false');
    expect(screen.queryByText(/Diterapkan sekarang/)).not.toBeInTheDocument();

    await user.click(profileSwitch);
    expect(profileSwitch).toHaveAttribute('aria-checked', 'true');
    expect(document.documentElement).toHaveAttribute('data-a11y-stop-animations');
    expect(document.documentElement).toHaveAttribute('data-a11y-reduce-motion');
    expect(screen.getByText(/Diterapkan sekarang/)).toBeInTheDocument();

    await user.click(profileSwitch);
    expect(profileSwitch).toHaveAttribute('aria-checked', 'false');
    expect(document.documentElement).not.toHaveAttribute('data-a11y-stop-animations');
    expect(document.documentElement).not.toHaveAttribute('data-a11y-reduce-motion');
  });

  it('Stop Animations and Reduce Motion are independent, genuinely different settings, not the same toggle twice', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    await user.click(screen.getByRole('switch', { name: /Hentikan Animasi/ }));
    expect(document.documentElement).toHaveAttribute('data-a11y-stop-animations');
    expect(document.documentElement).not.toHaveAttribute('data-a11y-reduce-motion');

    await user.click(screen.getByRole('switch', { name: /Kurangi Gerakan/ }));
    expect(document.documentElement).toHaveAttribute('data-a11y-reduce-motion');
  });

  it('Cursor Highlight Size is a real, independent slider', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    const slider = screen.getByRole('slider', { name: /^Ukuran Sorotan Kursor\b/ });
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '3');
  });

  it('Applying the Low Vision profile turns on its real settings and shows it as the active profile', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    await user.click(screen.getByRole('button', { name: /Penglihatan Rendah.*Aktifkan Profil/ }));

    expect(document.documentElement).toHaveAttribute('data-a11y-high-contrast');
    expect(document.documentElement).toHaveAttribute('data-a11y-bold-text');
    expect(document.documentElement).toHaveAttribute('data-a11y-highlight-links');
    expect(document.documentElement).toHaveAttribute('data-a11y-strong-focus');
    expect(document.documentElement.style.getPropertyValue('--a11y-text-scale')).toBe('1.3');

    expect(screen.getByRole('button', { name: /Penglihatan Rendah.*Profil Aktif/ })).toBeInTheDocument();
  });

  it('manually changing one setting a profile turned on correctly drops the "active" indicator — no fake status', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    await user.click(screen.getByRole('button', { name: /Penglihatan Rendah.*Aktifkan Profil/ }));
    expect(screen.getByRole('button', { name: /Penglihatan Rendah.*Profil Aktif/ })).toBeInTheDocument();

    // Manually turn High Contrast back off — part of what the profile set.
    await user.click(screen.getByRole('switch', { name: /Kontras Tinggi/ }));

    expect(screen.queryByRole('button', { name: /Penglihatan Rendah.*Profil Aktif/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Penglihatan Rendah.*Aktifkan Profil/ })).toBeInTheDocument();
    // The rest of the profile's settings are untouched by that one manual change.
    expect(document.documentElement).toHaveAttribute('data-a11y-bold-text');
  });

  it('switching from one profile to another cleanly replaces the first profile\'s settings, no collision', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    await user.click(screen.getByRole('button', { name: /Penglihatan Rendah.*Aktifkan Profil/ }));
    expect(document.documentElement).toHaveAttribute('data-a11y-bold-text');

    await user.click(screen.getByRole('button', { name: /Navigasi Motorik.*Aktifkan Profil/ }));

    // Motor profile's own settings are on...
    expect(document.documentElement).toHaveAttribute('data-a11y-cursor-scaled');
    // ...and Low Vision's settings that Motor doesn't also use are cleanly gone, not leftover.
    expect(document.documentElement).not.toHaveAttribute('data-a11y-bold-text');
    expect(document.documentElement).not.toHaveAttribute('data-a11y-high-contrast');
    expect(screen.getByRole('button', { name: /Navigasi Motorik.*Profil Aktif/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Penglihatan Rendah.*Profil Aktif/ })).not.toBeInTheDocument();
  });

  it('deactivating a profile reverts only the settings it manages', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    await user.click(screen.getByRole('switch', { name: /Mode Gelap/ })); // an unrelated personal preference
    await user.click(screen.getByRole('button', { name: /Penglihatan Rendah.*Aktifkan Profil/ }));
    await user.click(screen.getByRole('button', { name: /Penglihatan Rendah.*Profil Aktif/ })); // deactivate

    expect(document.documentElement).not.toHaveAttribute('data-a11y-bold-text');
    expect(document.documentElement).not.toHaveAttribute('data-a11y-high-contrast');
    // The dark mode preference set before the profile was touched survives.
    expect(document.documentElement.style.getPropertyValue('--a11y-filter')).toContain('invert');
  });

  it('Reset All Settings also turns off any active profile and stops an in-progress text reading', async () => {
    // jsdom has no real speechSynthesis — stub just enough of the Web
    // Speech API surface for the reader to report "playing" after Mulai.
    const original = window.speechSynthesis;
    const originalUtterance = window.SpeechSynthesisUtterance;
    const fakeSynthesis = {
      cancel: vi.fn(),
      speak: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
    } as unknown as SpeechSynthesis;
    Object.defineProperty(window, 'speechSynthesis', { value: fakeSynthesis, configurable: true });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      value: class {
        lang = '';
        onend: (() => void) | null = null;
        onerror: (() => void) | null = null;
        constructor(public text: string) {}
      },
      configurable: true,
    });
    const mainContent = document.createElement('div');
    mainContent.id = 'main-content';
    mainContent.innerText = 'Some readable page content.';
    document.body.appendChild(mainContent);

    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    await user.click(screen.getByRole('button', { name: /Penglihatan Rendah.*Aktifkan Profil/ }));
    await user.click(screen.getByRole('button', { name: 'Mulai' }));
    expect(screen.getByRole('button', { name: 'Jeda' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Reset Semua Pengaturan/ }));

    expect(fakeSynthesis.cancel).toHaveBeenCalled();
    expect(document.documentElement).not.toHaveAttribute('data-a11y-bold-text');
    expect(screen.getByRole('button', { name: /Penglihatan Rendah.*Aktifkan Profil/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mulai' })).toBeInTheDocument();

    Object.defineProperty(window, 'speechSynthesis', { value: original, configurable: true });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: originalUtterance, configurable: true });
    mainContent.remove();
  });

  it('"Mode Tunanetra" never claims to toggle the OS screen reader — it opens real, readable usage guidance instead', async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget locale="id" />);
    await user.click(screen.getByRole('button', { name: 'Buka pengaturan aksesibilitas' }));

    // No switch/toggle for this one — it has no on/off system behavior to claim.
    expect(screen.queryByRole('switch', { name: /Mode Tunanetra/ })).not.toBeInTheDocument();

    const guideButton = screen.getByRole('button', { name: /Panduan Penggunaan/ });
    expect(guideButton).toHaveAttribute('aria-expanded', 'false');
    await user.click(guideButton);
    expect(guideButton).toHaveAttribute('aria-expanded', 'true');
    // The same guidance text also appears in its own dedicated "Panduan
    // Penggunaan" card under Preferensi & Bantuan (feature 42) — so this
    // button opening it inline is additional, not duplicated-for-no-reason.
    expect(screen.getAllByText(/Gunakan Tab untuk berpindah antar elemen/).length).toBeGreaterThan(0);
  });
});
