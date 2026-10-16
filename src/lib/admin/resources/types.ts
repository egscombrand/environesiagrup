import type { ZodTypeAny } from 'zod';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'number'
  | 'boolean'
  | 'select'
  | 'image'
  | 'file'
  | 'date'
  | 'tags'
  | 'url'
  | 'color'
  | 'entity-select'
  | 'entity-multiselect'
  | 'icon'
  /**
   * The resource's slug/URL. Rendered as a small "Edit URL/Slug" action
   * instead of a normal field — see ResourceForm and slug-field.tsx. Only
   * meaningful on a resource that also sets `slugSource`.
   */
  | 'slug'
  /**
   * A full WYSIWYG rich text editor (TipTap) storing sanitized HTML — for
   * content too long/structured for a markdown textarea ('richtext'). See
   * rich-text-editor.tsx and lib/admin/sanitize-html.ts.
   */
  | 'html';

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
  placeholder?: string;
  /** Media folder to upload into, for type: 'image'. */
  mediaFolder?: string;
  /** Card section this field renders under in the form. Defaults to "Details". */
  section?: string;
};

export type ColumnKind = 'text' | 'status' | 'image' | 'date' | 'badge' | 'icon';

export type ColumnConfig = {
  key: string;
  label: string;
  kind?: ColumnKind;
};

export type ListFilterConfig = {
  /** Row value key this filter matches against (usually a field/column name). */
  key: string;
  /** Label for the "no filter applied" option, e.g. "Semua Sektor". */
  label: string;
  options: { value: string; label: string }[];
};

export type ResourceConfig = {
  slug: string;
  table: string;
  title: string;
  singular: string;
  /** Column used as the row's display title in the list table and confirm dialogs. */
  titleField: string;
  slugSource?: string;
  /** Overrides the generic "Manage all {title}…" list-page description. */
  description?: string;
  /** Overrides the generic "Search {title}…" placeholder. */
  searchPlaceholder?: string;
  fields: FieldConfig[];
  columns: ColumnConfig[];
  schema: ZodTypeAny;
  hasStatus: boolean;
  hasSortOrder: boolean;
  softDelete: boolean;
  authorScoped: boolean;
  defaultSort: { column: string; ascending: boolean };
  /**
   * Restricts this resource to rows where `column = value` — for splitting
   * one physical table into several distinct editors/listings (e.g. "posts"
   * into Siaran Pers vs Berita Perusahaan). Enforced on every read and
   * write in crud.ts: list and get filter by it, create and update force it
   * onto the row regardless of what was submitted, so one resource's data
   * can never leak into or be edited through the other's editor.
   */
  scope?: { column: string; value: string };
  /** Optional many-to-many relation (e.g. pillar_entities) managed alongside the main row. */
  relation?: {
    table: string;
    thisKey: string;
    otherKey: string;
    /** Form field name holding the selected related ids (string[]). */
    fieldName: string;
  };
  /** Extra dropdown filters shown in the list table, beyond search + status. */
  listFilters?: ListFilterConfig[];
};
