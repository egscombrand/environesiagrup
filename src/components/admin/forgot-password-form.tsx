'use client';

import { useId } from 'react';
import { useActionState } from 'react';
import Link from 'next/link';
import { requestPasswordResetAction, type ForgotPasswordState } from '@/app/wp-admin/forgot-password/actions';

const initialState: ForgotPasswordState = {};

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, initialState);
  const usernameId = useId();

  if (state.sent) {
    return (
      <div className="rounded-[10px] border border-[#2a7793]/30 bg-[#2a7793]/5 px-4 py-4">
        <p className="text-small font-medium text-[#2a7793]">Check your inbox</p>
        <p className="mt-1 text-small text-ink">
          Jika username tersebut terdaftar, link untuk mengatur ulang password telah dikirim ke email
          yang terhubung dengan akun tersebut.
        </p>
        <Link href="/wp-admin/login" className="mt-4 inline-block text-small text-[#2a7793] hover:underline">
          ← Kembali ke halaman masuk
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div>
        <label htmlFor={usernameId} className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
          Username
        </label>
        <input
          id={usernameId}
          name="username"
          type="text"
          autoComplete="username"
          required
          autoFocus
          disabled={pending}
          className="mt-2 w-full rounded-[10px] border border-[#e3e8ee] bg-white px-4 py-3 text-body text-ink outline-none transition-colors focus:border-[#2a7793] disabled:opacity-60"
        />
      </div>

      {state.error ? (
        <p role="alert" className="text-small text-[#A8482D]">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-[10px] bg-[#2a7793] px-4 py-3 text-small font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send Reset Link'}
      </button>

      <Link href="/wp-admin/login" className="block text-center text-small text-[#64748b] hover:text-ink">
        ← Kembali ke halaman masuk
      </Link>
    </form>
  );
}
