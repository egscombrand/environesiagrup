import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env';

const PUBLIC_ADMIN_PATHS = ['/wp-admin/login', '/wp-admin/forgot-password', '/wp-admin/reset-password'];

// Guards /wp-admin/*: refreshes the Supabase session cookie (required for
// SSR auth to keep working at all) and redirects unauthenticated requests to
// /wp-admin/login. Role-level authorization (which admin sections a given
// role may reach) is enforced again, server-side, in each protected layout
// — this middleware only answers "is anyone logged in".
export async function guardWpAdmin(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some((path) => request.nextUrl.pathname === path);

  if (!user && !isPublicAdminPath) {
    const loginUrl = new URL('/wp-admin/login', request.url);
    loginUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isPublicAdminPath) {
    return NextResponse.redirect(new URL('/wp-admin/dashboard', request.url));
  }

  return response;
}
