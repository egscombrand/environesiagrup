// Next.js only inlines NEXT_PUBLIC_* vars into the client bundle when it can
// statically see the literal `process.env.NEXT_PUBLIC_X` member expression —
// a helper that reads `process.env[name]` via a variable defeats that
// analysis and silently resolves to undefined in the browser. Keep these as
// direct literal reads.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url) throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL');
if (!anonKey) throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');

export const SUPABASE_URL = url;
export const SUPABASE_ANON_KEY = anonKey;
