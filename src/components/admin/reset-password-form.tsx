'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createRecoveryClient } from '@/lib/supabase/recovery-client';

const MIN_LENGTH = 8;
const VERIFY_TIMEOUT_MS = 8000;

export function ResetPasswordForm() {
  const router = useRouter();
  const supabase = useMemo(() => createRecoveryClient(), []);
  const [ready, setReady] = useState(false);
  const [linkExpired, setLinkExpired] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const passwordId = useId();
  const confirmId = useId();

  useEffect(() => {
    // The recovery client auto-detects the token in the URL hash on load and
    // fires one of these events once the session is established. Until
    // then, the form stays disabled — submitting without that session just
    // fails with an auth error, so this only smooths the UX.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Separate effect (rather than folded into the one above) so it re-reads
  // the latest `ready` on every change instead of only at mount.
  useEffect(() => {
    if (ready) return;
    const timeout = setTimeout(() => setLinkExpired(true), VERIFY_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [ready]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < MIN_LENGTH) {
      setError(`Password minimal ${MIN_LENGTH} karakter.`);
      return;
    }
    if (password !== confirm) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setPending(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setPending(false);

    if (updateError) {
      setError('Link reset tidak valid atau sudah kedaluwarsa. Minta link baru.');
      return;
    }

    setSuccess(true);
    await supabase.auth.signOut();
    setTimeout(() => router.push('/wp-admin/login'), 1800);
  }

  if (success) {
    return (
      <div className="rounded-[10px] border border-[#2a7793]/30 bg-[#2a7793]/5 px-4 py-4">
        <p className="text-small font-medium text-[#2a7793]">Password updated successfully</p>
        <p className="mt-1 text-small text-ink">Mengarahkan ke halaman masuk…</p>
      </div>
    );
  }

  if (!ready && linkExpired) {
    return (
      <div className="rounded-[10px] border border-[#A8482D]/30 bg-[#A8482D]/5 px-4 py-4">
        <p className="text-small font-medium text-[#A8482D]">Link tidak dapat diverifikasi</p>
        <p className="mt-1 text-small text-ink">
          Link ini mungkin sudah kedaluwarsa, sudah pernah dipakai, atau dibuka bukan sebagai klik
          langsung dari email. Minta link baru untuk melanjutkan.
        </p>
        <Link
          href="/wp-admin/forgot-password"
          className="mt-3 inline-block text-small text-[#2a7793] hover:underline"
        >
          ← Minta link baru
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor={passwordId} className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
          New password
        </label>
        <div className="relative mt-2">
          <input
            id={passwordId}
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            minLength={MIN_LENGTH}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={pending}
            className="w-full rounded-[10px] border border-[#e3e8ee] bg-white px-4 py-3 pr-12 text-body text-ink outline-none transition-colors focus:border-[#2a7793] disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            aria-pressed={showPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-small text-[#64748b] hover:text-ink"
          >
            {showPassword ? 'Sembunyikan' : 'Tampilkan'}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor={confirmId} className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
          Confirm password
        </label>
        <input
          id={confirmId}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          required
          minLength={MIN_LENGTH}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          disabled={pending}
          className="mt-2 w-full rounded-[10px] border border-[#e3e8ee] bg-white px-4 py-3 text-body text-ink outline-none transition-colors focus:border-[#2a7793] disabled:opacity-60"
        />
      </div>

      {!ready ? <p className="text-small text-[#64748b]">Memverifikasi link reset…</p> : null}

      {error ? (
        <p role="alert" className="text-small text-[#A8482D]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || !ready}
        className="w-full rounded-[10px] bg-[#2a7793] px-4 py-3 text-small font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Updating…' : 'Update Password'}
      </button>
    </form>
  );
}
