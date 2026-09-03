import Link from 'next/link';
import { loginAction } from '@/app/wp-admin/login/actions';

// A plain Server Component — no "use client", no hooks, no useActionState.
// The form posts straight to the Server Action; failure comes back as a
// `?error=` query param on the redirect back to this same page (read and
// rendered by the page itself), not as client-side hook state. Nothing
// here can differ between the server render and the client's first paint,
// because nothing here runs on the client at all.
export function LoginForm({ next, error }: { next?: string; error?: string }) {
  return (
    <form action={loginAction} className="space-y-5" noValidate>
      <input type="hidden" name="next" value={next ?? '/wp-admin/dashboard'} />

      <div>
        <label htmlFor="admin-username" className="font-mono text-label uppercase text-slate">
          Username
        </label>
        <input
          id="admin-username"
          name="username"
          type="text"
          autoComplete="username"
          autoFocus
          required
          className="mt-2 w-full rounded-[10px] border border-line bg-paper px-4 py-3 text-body text-ink outline-none transition-colors focus:border-forest"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="admin-password" className="font-mono text-label uppercase text-slate">
            Password
          </label>
          <Link href="/wp-admin/forgot-password" className="text-small text-forest hover:underline">
            Lupa password?
          </Link>
        </div>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-[10px] border border-line bg-paper px-4 py-3 text-body text-ink outline-none transition-colors focus:border-forest"
        />
      </div>

      {error ? (
        <p role="alert" className="text-small text-[#A8482D]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="w-full rounded-[10px] bg-forest px-4 py-3 text-small font-medium text-paper transition-opacity hover:opacity-90"
      >
        Masuk
      </button>
    </form>
  );
}
