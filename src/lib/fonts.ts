import { Bricolage_Grotesque, Plus_Jakarta_Sans, IBM_Plex_Mono } from 'next/font/google';

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
