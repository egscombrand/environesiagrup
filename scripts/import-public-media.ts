// One-off import: uploads the hero photos that were hardcoded in /public to the
// Supabase Storage bucket "media", at the paths they are stored under. The
// Tata Kelola hero rows then point at these paths (image_path).
//
// Only Storage is written. The database is not touched here, and the files in
// /public are not deleted, so the old copies remain until every reference is
// checked.
//
// Idempotent: an object at the same path is overwritten with the same bytes.
//
// Usage: npx tsx scripts/import-public-media.ts

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const GOVERNANCE_MEDIA_ASSETS = {
  desktop: { publicFile: 'BannerS2.jpg', path: 'legacy/banners2.jpg', fileType: 'image/jpeg', fileSize: 3677211 },
  mobile: { publicFile: 'banermobile.jpg', path: 'legacy/banermobile.jpg', fileType: 'image/jpeg', fileSize: 1092484 },
};

for (const file of ['.env.local', '.env']) {
  if (existsSync(file)) process.loadEnvFile?.(file);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const BUCKET = 'media';
const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  let failed = 0;

  for (const [slot, asset] of Object.entries(GOVERNANCE_MEDIA_ASSETS)) {
    const localPath = path.join('public', asset.publicFile);
    const bytes = await readFile(localPath);

    if (bytes.byteLength !== asset.fileSize) {
      console.error(`[${slot}] ${localPath} is ${bytes.byteLength} bytes, expected ${asset.fileSize}. Skipped.`);
      failed++;
      continue;
    }

    const { error } = await supabase.storage.from(BUCKET).upload(asset.path, bytes, {
      contentType: asset.fileType,
      upsert: true,
    });
    if (error) {
      console.error(`[${slot}] upload failed: ${error.message}`);
      failed++;
      continue;
    }

    const publicUrl = `${url}/storage/v1/object/public/${BUCKET}/${asset.path}`;
    const response = await fetch(publicUrl, { method: 'HEAD' });
    if (!response.ok) {
      console.error(`[${slot}] uploaded, but ${publicUrl} returned ${response.status}`);
      failed++;
      continue;
    }

    console.log(`[${slot}] ok: ${asset.path} (${bytes.byteLength} bytes)`);
  }

  if (failed > 0) {
    console.error(`${failed} file(s) failed. Run 0030 only after all files are uploaded.`);
    process.exit(1);
  }
  console.log('All files are in Storage. Run migration 0030 next.');
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
