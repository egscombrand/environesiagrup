'use server';

import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/admin/auth';
import { legalCardSchema, legalDocumentsSchema, type FieldPair } from '@/lib/admin/legal-fields';
import { revalidatePublicSite } from '@/lib/admin/revalidate';

const WRITE_ROLES: ('super_admin' | 'editor')[] = ['super_admin', 'editor'];

function nullIfEmpty(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? '').trim();
  return text.length > 0 ? text : null;
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Saves an entity's name fields. Used as a plain form action, so it throws on failure. */
export async function updateEntityAction(id: string, formData: FormData): Promise<void> {
  const { supabase } = await requireRole(WRITE_ROLES);
  const name = String(formData.get('name') ?? '').trim();
  const shortName = String(formData.get('short_name') ?? '').trim();
  if (!name || !shortName) throw new Error('Nama dan nama singkat wajib diisi.');

  const { error } = await supabase
    .from('legal_entities')
    .update({ name, short_name: shortName, legal_name: nullIfEmpty(formData.get('legal_name')) })
    .eq('id', id);
  if (error) throw new Error('Gagal menyimpan entitas.');
  revalidatePublicSite();
}

/** Adds an empty card under an entity, then opens its editor. */
export async function createCardAction(entityId: string): Promise<void> {
  const { supabase } = await requireRole(WRITE_ROLES);
  const { data: last } = await supabase
    .from('legal_cards')
    .select('sort_order')
    .eq('entity_id', entityId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  const id = `${entityId}-kartu-${crypto.randomUUID().slice(0, 8)}`;
  const { error } = await supabase.from('legal_cards').insert({
    id,
    entity_id: entityId,
    category: 'Lainnya',
    logo_alt: 'Logo',
    title: 'Kartu baru',
    intro: [],
    sort_order: (last?.sort_order ?? 0) + 1,
  });
  if (error) throw new Error('Gagal menambah kartu.');
  revalidatePublicSite();
  redirect(`/wp-admin/content/legal/cards/${id}`);
}

/**
 * Saves one card and its full list of documents. Documents are replaced as a set:
 * any document that is no longer in the list is removed, and every document in
 * the list is written with its position. A document id that does not belong to
 * this card is treated as new, so one card can never overwrite another's document.
 */
export async function saveCardAction(cardId: string, formData: FormData): Promise<{ error?: string }> {
  const { supabase } = await requireRole(WRITE_ROLES);

  const card = legalCardSchema.safeParse({
    category: String(formData.get('category') ?? ''),
    logo: nullIfEmpty(formData.get('logo')),
    logo_alt: String(formData.get('logo_alt') ?? ''),
    title: String(formData.get('title') ?? ''),
    subtitle: nullIfEmpty(formData.get('subtitle')),
    intro: parseJson(String(formData.get('intro') ?? '[]')) ?? [],
  });
  if (!card.success) return { error: card.error.issues[0]?.message ?? 'Data kartu tidak valid.' };

  const documents = legalDocumentsSchema.safeParse(parseJson(String(formData.get('documents') ?? '[]')));
  if (!documents.success) return { error: documents.error.issues[0]?.message ?? 'Data dokumen tidak valid.' };

  const { error: cardError } = await supabase
    .from('legal_cards')
    .update({
      category: card.data.category,
      logo: card.data.logo ?? null,
      logo_alt: card.data.logo_alt,
      title: card.data.title,
      subtitle: card.data.subtitle ?? null,
      intro: card.data.intro as FieldPair[],
    })
    .eq('id', cardId);
  if (cardError) return { error: 'Gagal menyimpan kartu.' };

  const { data: existing } = await supabase.from('legal_documents').select('id').eq('card_id', cardId);
  const owned = new Set((existing ?? []).map((row) => row.id));

  const keepIds = documents.data.filter((d) => d.id && owned.has(d.id)).map((d) => d.id as string);
  if (keepIds.length > 0) {
    const { error } = await supabase
      .from('legal_documents')
      .delete()
      .eq('card_id', cardId)
      .not('id', 'in', `(${keepIds.map((id) => `"${id}"`).join(',')})`);
    if (error) return { error: 'Gagal menghapus dokumen yang dihapus.' };
  } else {
    const { error } = await supabase.from('legal_documents').delete().eq('card_id', cardId);
    if (error) return { error: 'Gagal menghapus dokumen.' };
  }

  if (documents.data.length > 0) {
    const rows = documents.data.map((d, index) => ({
      id: d.id && owned.has(d.id) ? d.id : `${cardId}-doc-${crypto.randomUUID().slice(0, 8)}`,
      card_id: cardId,
      title: d.title,
      issuer: d.issuer || null,
      description: d.description || null,
      fields: d.fields as FieldPair[],
      external_url: d.external_url || null,
      cta_label: d.cta_label || null,
      sort_order: index + 1,
    }));
    const { error } = await supabase.from('legal_documents').upsert(rows, { onConflict: 'id' });
    if (error) return { error: 'Gagal menyimpan dokumen.' };
  }

  revalidatePublicSite();
  return {};
}

/** Deletes a card and, through the foreign key, all of its documents. */
export async function deleteCardAction(cardId: string): Promise<void> {
  const { supabase } = await requireRole(WRITE_ROLES);
  const { error } = await supabase.from('legal_cards').delete().eq('id', cardId);
  if (error) throw new Error('Gagal menghapus kartu.');
  revalidatePublicSite();
  redirect('/wp-admin/content/legal');
}
