import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { fontDisplay, fontBody, fontMono } from '@/lib/fonts';
import '../globals.css';

export const metadata: Metadata = {
  title: { default: 'wp-admin', template: '%s — wp-admin' },
  robots: { index: false, follow: false },
};

// A separate root layout from src/app/[locale]/layout.tsx — Next's
// "multiple root layouts" pattern. wp-admin is not locale-prefixed, has no
// next-intl provider, and never renders the public Header/Footer.
export default function WpAdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
