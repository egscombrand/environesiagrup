'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createUserAction, type CreateUserState } from '@/app/wp-admin/(protected)/users/actions';
import { useRequiredFieldsValidation } from './use-required-fields';
import { ValidationModal } from './validation-modal';
import { useToast } from './toast-provider';

const REQUIRED_FIELDS = [
  { name: 'username', label: 'Username' },
  { name: 'email', label: 'Email' },
];

function inputClass(hasError: boolean) {
  return `mt-2 w-full rounded-[10px] border ${
    hasError ? 'border-danger focus:border-danger' : 'border-[#e3e8ee] focus:border-[#2a7793]'
  } bg-white px-4 py-2.5 text-body text-ink outline-none`;
}

export function CreateUserForm() {
  const router = useRouter();
  const toast = useToast();
  const [state, formAction, pending] = useActionState<CreateUserState, FormData>(createUserAction, {});
  const lastState = useRef(state);
  const { formRef, errors, missing, modalOpen, validate, closeModal, goToField, handleFieldActivity } =
    useRequiredFieldsValidation(REQUIRED_FIELDS);

  useEffect(() => {
    if (state === lastState.current) return;
    lastState.current = state;
    if (state.error) toast('error', state.error);
  }, [state, toast]);

  if (state.invited) {
    return (
      <div className="rounded-[12px] border border-success/30 bg-success/5 p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-success">Invitation sent</p>
        <p className="mt-2 text-body text-ink">
          An invite email was sent. The user sets their own password via the link in that email — this
          system never creates or sees a password for them.
        </p>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-4 rounded-[10px] bg-[#2a7793] px-4 py-2 text-small font-medium text-white hover:opacity-90"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={(e) => {
        if (!validate()) {
          e.preventDefault();
          toast('error', 'Mohon lengkapi field yang wajib diisi.');
        }
      }}
      onInput={handleFieldActivity}
      onChange={handleFieldActivity}
      className="space-y-4"
    >
      <div>
        <label htmlFor="username" className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
          Username<span className="text-danger"> *</span>
        </label>
        <input id="username" type="text" name="username" className={inputClass(errors.has('username'))} />
        {errors.has('username') ? <p className="mt-1 text-small text-danger">Field ini wajib diisi.</p> : null}
      </div>
      <div>
        <label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
          Email<span className="text-danger"> *</span>
        </label>
        <input id="email" type="email" name="email" className={inputClass(errors.has('email'))} />
        {errors.has('email') ? (
          <p className="mt-1 text-small text-danger">Field ini wajib diisi.</p>
        ) : (
          <p className="mt-1 text-small text-[#64748b]">The password-setup invitation is sent to this address.</p>
        )}
      </div>
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Full Name</label>
        <input type="text" name="full_name" className={inputClass(false)} />
      </div>
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
          Role<span className="text-danger"> *</span>
        </label>
        <select name="role" defaultValue="author" className={inputClass(false)}>
          <option value="super_admin">Super Admin</option>
          <option value="editor">Editor</option>
          <option value="author">Author</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-[10px] bg-[#2a7793] px-5 py-2.5 text-small font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {pending ? 'Sending invite…' : 'Invite User'}
      </button>

      <ValidationModal open={modalOpen} missing={missing} onSelectField={goToField} onClose={closeModal} />
    </form>
  );
}
