'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound } from 'lucide-react';
import { ROLE_LABELS, type Role } from '@/lib/admin/roles';
import { updateUserRoleAction, deleteUserAction, resetUserPasswordAction } from '@/app/wp-admin/(protected)/users/actions';
import { DeleteButton } from './delete-button';
import { useToast } from './toast-provider';

export function UserRow({
  profile,
  isSelf,
}: {
  profile: { id: string; username: string; full_name: string | null; role: Role; created_at: string };
  isSelf: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();
  const toast = useToast();

  return (
    <tr className="border-b border-line last:border-0 hover:bg-stone/40">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-[11px] font-medium text-paper">
            {profile.username.slice(0, 1).toUpperCase()}
          </span>
          <span className="text-ink">
            {profile.username}
            {isSelf ? <span className="ml-2 text-small text-slate">(You)</span> : null}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-slate">{profile.full_name ?? '—'}</td>
      <td className="px-4 py-3">
        {isSelf ? (
          ROLE_LABELS[profile.role]
        ) : (
          <select
            defaultValue={profile.role}
            disabled={pending}
            onChange={(e) =>
              startTransition(async () => {
                await updateUserRoleAction(profile.id, e.target.value as Role);
                router.refresh();
              })
            }
            className="rounded-[8px] border border-line bg-paper px-2 py-1 text-small text-ink"
          >
            <option value="super_admin">Super Admin</option>
            <option value="editor">Editor</option>
            <option value="author">Author</option>
          </select>
        )}
      </td>
      <td className="px-4 py-3 text-slate">{new Date(profile.created_at).toLocaleDateString('id-ID')}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          {isSelf ? null : (
            <button
              type="button"
              disabled={pending || resetSent}
              onClick={() =>
                startTransition(async () => {
                  const result = await resetUserPasswordAction(profile.id);
                  if (result?.error) {
                    toast('error', result.error);
                    return;
                  }
                  setResetSent(true);
                  toast('success', `Password reset email sent to ${profile.username}.`);
                })
              }
              aria-label="Reset password"
              title="Reset password"
              className="rounded-[8px] p-1.5 text-slate hover:bg-forest/10 hover:text-forest disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          {isSelf ? null : (
            <DeleteButton action={deleteUserAction.bind(null, profile.id)} itemLabel={profile.username} iconOnly />
          )}
        </div>
      </td>
    </tr>
  );
}
