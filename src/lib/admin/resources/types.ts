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
  | 'icon';

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
