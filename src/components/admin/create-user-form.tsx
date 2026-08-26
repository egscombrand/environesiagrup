'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createUserAction, type CreateUserState } from '@/app/wp-admin/(protected)/users/actions';
import { useToast } from './toast-provider';

const inputClass =
  'mt-2 w-full rounded-[10px] border border-line bg-paper px-4 py-2.5 text-body text-ink outline-none focus:border-forest';

export function CreateUserForm() {
  const router = useRouter();
  const toast = useToast();
  const [state, formAction, pending] = useActionState<CreateUserState, FormData>(createUserAction, {});
  const lastState = useRef(state);

  useEffect(() => {
    if (state === lastState.current) return;
    lastState.current = state;
    if (state.error) toast('error', state.error);
  }, [state, toast]);

  if (state.invited) {
    return (
      <div className="rounded-[14px] border border-success/30 bg-success/5 p-6">
        <p className="font-mono text-label uppercase text-success">Invitation sent</p>
        <p className="mt-2 text-body text-ink">
          An invite email was sent. The user sets their own password via the link in that email — this
          system never creates or sees a password for them.
        </p>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-4 rounded-[10px] bg-forest px-4 py-2 text-small font-medium text-paper hover:opacity-90"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="font-mono text-label uppercase text-slate">
          Username<span className="text-danger"> *</span>
        </label>
        <input type="text" name="username" required className={inputClass} />
      </div>
      <div>
        <label className="font-mono text-label uppercase text-slate">
          Email<span className="text-danger"> *</span>
        </label>
        <input type="email" name="email" required className={inputClass} />
        <p className="mt-1 text-small text-slate">The password-setup invitation is sent to this address.</p>
      </div>
      <div>
        <label className="font-mono text-label uppercase text-slate">Full Name</label>
        <input type="text" name="full_name" className={inputClass} />
      </div>
      <div>
        <label className="font-mono text-label uppercase text-slate">
          Role<span className="text-danger"> *</span>
        </label>
        <select name="role" defaultValue="author" className={inputClass}>
          <option value="super_admin">Super Admin</option>
          <option value="editor">Editor</option>
          <option value="author">Author</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-[10px] bg-forest px-5 py-2.5 text-small font-medium text-paper hover:opacity-90 disabled:opacity-60"
      >
        {pending ? 'Sending invite…' : 'Invite User'}
      </button>
    </form>
  );
}
