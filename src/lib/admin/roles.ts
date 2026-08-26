import type { Database } from '@/lib/supabase/database.types';

// Split out from auth.ts (which pulls in 'server-only' + next/headers) so
// Client Components can safely import the role type/labels without dragging
// server-only code into the browser bundle.
export type Role = Database['public']['Enums']['user_role'];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  editor: 'Editor',
  author: 'Author',
};
