import { Bricolage_Grotesque, Plus_Jakarta_Sans, IBM_Plex_Mono, Fraunces, Inter } from 'next/font/google';

export const fontDisplay = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display-src',
  display: 'swap',
});

export const fontBody = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body-src',
  display: 'swap',
});

export const fontMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-src',
  display: 'swap',
});

// Landing-page blueprint typography (environesia-landing-page-master-prompt
// skill) — used only by the homepage and the shared header/footer. Kept
// separate from fontDisplay/fontBody so every other public page and
// wp-admin keep loading only Bricolage Grotesque/Plus Jakarta Sans.
export const fontLandingDisplay = Fraunces({
  subsets: ['latin'],
  variable: '--font-landing-display-src',
  display: 'swap',
});

export const fontLandingBody = Inter({
  subsets: ['latin'],
  variable: '--font-landing-body-src',
  display: 'swap',
});
