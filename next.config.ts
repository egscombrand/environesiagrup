import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },

  // pdf-parse (PDF Import's rule-engine text extraction) and its
  // @napi-rs/canvas dependency ship worker/native files that break when
  // Turbopack tries to statically bundle them into .next/server/chunks/ssr
  // (surfaces as "Setting up fake worker failed: Cannot find module
  // .../pdf.worker.mjs"). Marking them external makes Next.js load them via
  // Node's own require/import from node_modules at runtime instead.
  serverExternalPackages: ['pdf-parse', '@napi-rs/canvas'],

  images: {
    // Default (75) covers everything else; 100 is used for the entity brand
    // rail so those logos are served at full source fidelity, not softened
    // by the default JPEG-ish compression.
    qualities: [75, 100],

    remotePatterns: [
      ...(supabaseHostname
        ? [
            {
              protocol: 'https' as const,
              hostname: supabaseHostname,
              pathname: '/storage/v1/object/public/**',
            },
          ]
        : []),

      // The Business Projects Deck's real Environesia project photos are
      // hosted on the group's existing legacy site.
      { protocol: 'https' as const, hostname: 'environesia.co.id', pathname: '/assets/**' },
    ],
  },
};

export default withNextIntl(nextConfig);
