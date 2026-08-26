'use client';

import { useId, useState } from 'react';
import { useActionState } from 'react';
import Link from 'next/link';
import { signInAction, type LoginState } from '@/app/wp-admin/login/actions';

const initialState: LoginState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(signInAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const usernameId = useId();
  const passwordId = useId();
  const errorId = useId();

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="next" value={next ?? '/wp-admin/dashboard'} />

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
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? errorId : undefined}
          className="mt-2 w-full rounded-[10px] border border-line bg-paper px-4 py-3 text-body text-ink outline-none transition-colors focus:border-forest disabled:opacity-60"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor={passwordId} className="font-mono text-label uppercase text-slate">
            Password
          </label>
          <Link href="/wp-admin/forgot-password" className="text-small text-forest hover:underline">
            Lupa password?
          </Link>
        </div>
        <div className="relative mt-2">
          <input
            id={passwordId}
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            disabled={pending}
            aria-invalid={state.error ? true : undefined}
            aria-describedby={state.error ? errorId : undefined}
            className="w-full rounded-[10px] border border-line bg-paper px-4 py-3 pr-12 text-body text-ink outline-none transition-colors focus:border-forest disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            aria-pressed={showPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-small text-slate hover:text-ink"
          >
            {showPassword ? 'Sembunyikan' : 'Tampilkan'}
          </button>
        </div>
      </div>

      {state.error ? (
        <div
          id={errorId}
          role="alert"
          className="rounded-[10px] border border-[#A8482D]/30 bg-[#A8482D]/5 px-4 py-3"
        >
          <p className="text-small font-medium text-[#A8482D]">Tidak dapat masuk</p>
          <p className="mt-1 text-small text-[#A8482D]/90">{state.error}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-[10px] bg-forest px-4 py-3 text-small font-medium text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}
