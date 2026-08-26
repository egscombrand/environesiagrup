// Bootstrap / occasional CLI: create a wp-admin user directly via the
// Supabase service-role admin API, without ever generating or handling a
// password in this app's code — generateLink('invite') creates the account
// with no password set and returns a one-time link the person uses to
// choose their own password at /wp-admin/reset-password. Standalone scripts
// run outside Next's bundler, so this builds its own service-role client
// instead of importing src/lib/supabase/admin.ts (which deliberately throws
// when imported outside a Next Server Component via the `server-only`
// package marker).
//
// Usage:
//   npx tsx scripts/create-admin-user.ts <username> <email> [role] [full_name]
//   role defaults to "super_admin"; role is one of super_admin|editor|author

import { createClient } from '@supabase/supabase-js';

process.loadEnvFile?.('.env.local');

const [, , username, email, role = 'super_admin', ...fullNameParts] = process.argv;
const fullName = fullNameParts.join(' ') || undefined;

if (!username || !email) {
  console.error('Usage: npx tsx scripts/create-admin-user.ts <username> <email> [role] [full_name]');
  process.exit(1);
}

if (!['super_admin', 'editor', 'author'].includes(role)) {
  console.error(`Invalid role "${role}". Must be super_admin, editor, or author.`);
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

if (!url || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data, error } = await admin.auth.admin.generateLink({
    type: 'invite',
    email,
    options: {
      data: { username: username.toLowerCase(), full_name: fullName, role },
      redirectTo: `${siteUrl}/wp-admin/reset-password`,
    },
  });

  if (error) {
    console.error(`Failed to create user: ${error.message}`);
    process.exit(1);
  }

  console.log('User created (no password set).');
  console.log(`  username: ${username.toLowerCase()}`);
  console.log(`  email:    ${email}`);
  console.log(`  role:     ${role}`);
  console.log(`  user id:  ${data.user?.id}`);
  console.log('\nOne-time link to set the password (also emailed, if the project can send mail):');
  console.log(`  ${data.properties.action_link}`);
  console.log('\nThis link is single-use and expires — open it to set the password, then sign in with the username above.');
}

main();
