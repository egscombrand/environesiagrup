import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import type { ResourceConfig } from './resources/types';

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

/**
 * A minimal fake of the Supabase query builder: every chain method records
 * what it was called with (on the entry for its own `.from(table)` call)
 * and returns itself, so a test can assert exactly which filters a crud.ts
 * function applied — in particular, that a `scope` (e.g. post_type =
 * 'siaran_pers') is always present on list/get/update/delete, and is always
 * forced onto the row on create/update, never read from what was submitted.
 */
function makeFakeSupabase(response: { data?: unknown; error?: unknown } = { data: null, error: null }) {
  const log: { table: string; calls: string[]; lastWrite: unknown }[] = [];
  const CHAIN_METHODS = ['select', 'eq', 'neq', 'is', 'order', 'range', 'update', 'insert', 'delete', 'limit'] as const;

  function from(table: string) {
    const entry = { table, calls: [] as string[], lastWrite: undefined as unknown };
    log.push(entry);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- test double, shape mirrors the real fluent builder
    const builder: any = {};
    for (const method of CHAIN_METHODS) {
      builder[method] = (...args: unknown[]) => {
        entry.calls.push(`${method}(${args.map((a) => JSON.stringify(a)).join(',')})`);
        if (method === 'insert' || method === 'update') entry.lastWrite = args[0];
        return builder;
      };
    }
    const resolve = () => Promise.resolve({ data: response.data ?? null, error: response.error ?? null });
    builder.maybeSingle = resolve;
    builder.single = resolve;
    builder.then = (onFulfilled: (v: unknown) => unknown, onRejected?: (e: unknown) => unknown) =>
      resolve().then(onFulfilled, onRejected);
    return builder;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- test double stands in for SupabaseClient<Database>
  return { from, log } as any;
}

/** A tiny resource split across one shared table, the same shape as Siaran Pers / Berita Perusahaan. */
function makeScopedResource(overrides: Partial<ResourceConfig> = {}): ResourceConfig {
  return {
    slug: 'kind-a',
    table: 'shared_table',
    title: 'Kind A',
    singular: 'Item',
    titleField: 'title',
    scope: { column: 'kind', value: 'kind_a' },
    hasStatus: true,
    hasSortOrder: false,
    softDelete: true,
    authorScoped: false,
    defaultSort: { column: 'created_at', ascending: false },
    columns: [{ key: 'title', label: 'Title' }],
    fields: [{ name: 'title', label: 'Title', type: 'text', required: true }],
    schema: z.object({ title: z.string().min(1), status: z.enum(['draft', 'published', 'archived']).default('draft') }),
    ...overrides,
  };
}

function formData(entries: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(entries)) fd.set(key, value);
  return fd;
}

describe('a scoped resource (one table split into several editors)', () => {
  it('listResourceRows filters by the scope column/value', async () => {
    const { listResourceRows } = await import('./crud');
    const supabase = makeFakeSupabase({ data: [] });
    await listResourceRows(makeScopedResource(), supabase);

    const call = supabase.log.find((e: { table: string }) => e.table === 'shared_table');
    expect(call.calls).toContain('eq("kind","kind_a")');
  });

  it('getResourceRow filters by the scope column/value, so the wrong editor 404s instead of loading the row', async () => {
    const { getResourceRow } = await import('./crud');
    const supabase = makeFakeSupabase({ data: { id: '1', title: 'x' } });
    await getResourceRow(makeScopedResource(), '1', supabase);

    const call = supabase.log.find((e: { table: string }) => e.table === 'shared_table');
    expect(call.calls).toContain('eq("kind","kind_a")');
  });

  it('createResourceRow forces the scope value onto the new row, ignoring any value submitted under that name', async () => {
    const { createResourceRow } = await import('./crud');
    const supabase = makeFakeSupabase({ data: { id: 'new-id' } });
    // Even though the form has no field for `kind` at all (it isn't in
    // resource.fields, matching the real Siaran Pers/Berita Perusahaan
    // configs), this proves the written row still gets the right value.
    await createResourceRow(makeScopedResource(), formData({ title: 'Hello', status: 'draft' }), supabase, 'user-1');

    const call = supabase.log.find((e: { table: string }) => e.table === 'shared_table');
    expect(call.lastWrite).toMatchObject({ kind: 'kind_a', title: 'Hello' });
  });

  it('updateResourceRow forces the scope value and scopes the WHERE clause, so it can never edit the other type’s row', async () => {
    const { updateResourceRow } = await import('./crud');
    const supabase = makeFakeSupabase({ data: { id: '1', title: 'old' } });
    await updateResourceRow(makeScopedResource(), '1', formData({ title: 'Updated', status: 'draft' }), supabase, 'user-1');

    const updateCall = supabase.log.find((e: { calls: string[] }) => e.calls.some((c: string) => c.startsWith('update(')));
    expect(updateCall.lastWrite).toMatchObject({ kind: 'kind_a', title: 'Updated' });
    expect(updateCall.calls).toContain('eq("kind","kind_a")');
  });

  it('deleteResourceRow scopes its WHERE clause by the scope column/value', async () => {
    const { deleteResourceRow } = await import('./crud');
    const supabase = makeFakeSupabase({ data: { id: '1' } });
    await deleteResourceRow(makeScopedResource(), '1', supabase, 'user-1');

    const deleteCall = supabase.log.find((e: { calls: string[] }) =>
      e.calls.some((c: string) => c.startsWith('update(') || c.startsWith('delete('))
    );
    expect(deleteCall.calls).toContain('eq("kind","kind_a")');
  });

  it('setResourceStatus scopes its WHERE clause by the scope column/value', async () => {
    const { setResourceStatus } = await import('./crud');
    const supabase = makeFakeSupabase({ data: null });
    await setResourceStatus(makeScopedResource(), '1', 'published', supabase, 'user-1');

    const call = supabase.log.find((e: { table: string }) => e.table === 'shared_table');
    expect(call.calls).toContain('eq("kind","kind_a")');
  });

  it('a resource with no scope never adds the extra filter (every other resource keeps working as before)', async () => {
    const { listResourceRows } = await import('./crud');
    const supabase = makeFakeSupabase({ data: [] });
    const unscoped = makeScopedResource({ scope: undefined });
    await listResourceRows(unscoped, supabase);

    const call = supabase.log.find((e: { table: string }) => e.table === 'shared_table');
    expect(call.calls.some((c: string) => c.startsWith('eq('))).toBe(false);
  });
});
