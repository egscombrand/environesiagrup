import type { Metadata } from 'next';
import { LoginForm } from '@/components/admin/login-form';

export const metadata: Metadata = { title: 'Sign In' };

// A plain Server Component, start to finish — no "use client" anywhere in
// this page or LoginForm. The error message travels as a `?error=` query
// param on the Server Action's own redirect back here, not as client
// state, so there is nothing in this render path that can differ between
// the server pass and the client's first paint.
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6f9] px-6 py-16">
      <div className="w-full max-w-sm rounded-[16px] border border-[#e3e8ee] bg-white p-8 shadow-sm sm:p-10">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.08em] tracking-[0.14em] text-[#64748b]">ENVIROnesia</p>
        <p className="mt-1 text-center text-[11px] font-semibold uppercase tracking-[0.08em] tracking-[0.14em] text-[#64748b]/50">
          Admin Portal
        </p>

        <h1 className="mt-8 text-center font-display text-h2 text-ink">Welcome back</h1>
        <p className="mt-2 text-center text-body text-[#64748b]">Masuk ke panel administrasi.</p>

        <div className="mt-8">
          <LoginForm next={next} error={error} />
        </div>
      </div>
    </div>
  );
}
