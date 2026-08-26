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
      <div className="rounded-[10px] border border-forest/30 bg-forest/5 px-4 py-4">
        <p className="text-small font-medium text-forest">Check your inbox</p>
        <p className="mt-1 text-small text-ink">
          Jika username tersebut terdaftar, link untuk mengatur ulang password telah dikirim ke email
          yang terhubung dengan akun tersebut.
        </p>
        <Link href="/wp-admin/login" className="mt-4 inline-block text-small text-forest hover:underline">
          ← Kembali ke halaman masuk
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div>
        <label htmlFor={usernameId} className="font-mono text-label uppercase text-slate">
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
          className="mt-2 w-full rounded-[10px] border border-line bg-paper px-4 py-3 text-body text-ink outline-none transition-colors focus:border-forest disabled:opacity-60"
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
        className="w-full rounded-[10px] bg-forest px-4 py-3 text-small font-medium text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send Reset Link'}
      </button>

      <Link href="/wp-admin/login" className="block text-center text-small text-slate hover:text-ink">
        ← Kembali ke halaman masuk
      </Link>
    </form>
  );
}
