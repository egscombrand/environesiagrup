// One-off import: uploads public/environesiagrup/bangsap.jpeg to the Supabase
// Storage bucket "media", at legacy/environesiagrup/bangsap.jpeg — same
// pattern as scripts/import-public-media.ts for the Governance hero photos.
//
// Only Storage is written. The database is not touched here, and the file in
// /public is not deleted, so the old copy remains until every reference is
// checked. Idempotent: an object at the same path is overwritten with the
// same bytes.
//
// Usage: npx tsx scripts/import-bangsap-media.ts

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const ASSET = { publicFile: 'environesiagrup/bangsap.jpeg', path: 'legacy/environesiagrup/bangsap.jpeg', fileType: 'image/jpeg' };

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
  const localPath = path.join('public', ASSET.publicFile);
  const bytes = await readFile(localPath);

  const { error } = await supabase.storage.from(BUCKET).upload(ASSET.path, bytes, {
    contentType: ASSET.fileType,
    upsert: true,
  });
  if (error) {
    console.error(`upload failed: ${error.message}`);
    process.exit(1);
  }

  const publicUrl = `${url}/storage/v1/object/public/${BUCKET}/${ASSET.path}`;
  const response = await fetch(publicUrl, { method: 'HEAD' });
  if (!response.ok) {
    console.error(`uploaded, but ${publicUrl} returned ${response.status}`);
    process.exit(1);
  }

  console.log(`ok: ${ASSET.path} (${bytes.byteLength} bytes)`);
  console.log(`legacy-media.ts entry:`);
  console.log(`  "/${ASSET.publicFile}": { id: "${randomUUID()}", path: "${ASSET.path}" },`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
