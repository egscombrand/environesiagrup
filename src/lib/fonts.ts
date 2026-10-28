import { Plus_Jakarta_Sans, Atkinson_Hyperlegible } from 'next/font/google';

// Single global typography system — every semantic font role on the site
// (display headings, body copy, mono-style labels/index numbers, and the
// separate "landing" display/body roles the homepage + Tentang Kami pages
// used to load Fraunces/Inter/Bricolage Grotesque for) now resolves to
// this one family. Loaded once, at exactly the weights actually used
// across the site (400/500/600/700, plus 800 for the one or two headings
// that explicitly ask for extra-bold — see globals.css's font-* tokens),
// rather than five separate Google Fonts requests for five names that all
// render the same face.
export const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans-src',
  display: 'swap',
});

// Accessibility Center's "Font Mudah Dibaca" (readable font) feature —
// Atkinson Hyperlegible is purpose-built by the Braille Institute for
// readers with low vision, distinguishing easily-confused characters
// (1/l/I, O/0) more clearly than Plus Jakarta Sans. Only loaded as a CSS
// variable here; it costs nothing unless the toggle is actually turned on
// (see globals.css's [data-a11y-readable-font] rule).
export const fontReadable = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-a11y-readable-src',
  display: 'swap',
});
