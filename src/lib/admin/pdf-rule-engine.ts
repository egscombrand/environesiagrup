// The PDF Import rule engine — pure text-in, structured-data-out logic,
// deliberately kept free of 'server-only' or any PDF-binary parsing (that
// lives in pdf-import.ts) so it stays trivially unit-testable in jsdom
// with synthetic per-page text, the same way project-duplicate.ts is.
//
// No AI/LLM involved, and — this is the governing rule — a block of text
// that reads as a project is NEVER dropped for being incomplete. Missing
// fields become null (or "Environesia" for brand, or "Perlu
// Ditinjau" for an unclear sector); the project itself still always makes
// it into the result, to be completed by the admin in Review. The only
// thing ever actually discarded is a Contract Value line, and a stray
// field-only line (e.g. a lone "Tahun: 2020") with no project identity at
// all to attach to.
//
// A project is recognized by any of: an explicit "Nama Proyek:" label (or
// a bare label line followed by its value), a detected table row, an
// unlabeled block anchored by an organization name (PT/CV/Dinas/...) or a
// numbered-list marker ("1. ..."), or — failing all of those — simply the
// first not-otherwise-claimed line of text on a page, read as a bare
// heading. Sector is classified by exact label match first, then keyword
// matching; "Perlu Ditinjau" when neither applies. Brand is NEVER inferred
// from body text — only ever set to a specific entity from an explicit
// label naming one; everything else defaults to "Environesia Company
// Group" (every project in this portfolio belongs to the group even when
// no specific entity is named), never the unhelpful "Belum Ditentukan".
import { SECTOR_VALUES, COMPANY_VALUES, type SectorValue } from './project-options';

type SectorOrReview = SectorValue | 'Perlu Ditinjau';
type ConfidenceValue = 'high' | 'medium' | 'low';

export type ExtractedProject = {
  project_name: string;
  client: string | null;
  sector: SectorOrReview | null;
  location: string | null;
  year: number | null;
  service: string | null;
  brand: (typeof COMPANY_VALUES)[number];
  description: string | null;
  source_page: number | null;
  confidence: ConfidenceValue;
};

export type PdfPage = { num: number; text: string };

// ---------------------------------------------------------------------
// Label vocabulary — Indonesian + English variants of each field name, as
// they tend to appear in real portfolio documents ("Nama Proyek: ...",
// "Client: ...", "Lokasi - ..."). Longer/more specific labels are tried
// before shorter ones that could be a substring of them. "project_name" is
// the one label that also acts as a block anchor — every other field only
// ever attaches to a block that's already open.
// ---------------------------------------------------------------------
type RecordField = 'project_name' | 'client' | 'sector' | 'location' | 'year' | 'service' | 'brand' | 'description';

const LABEL_WORDS: Record<RecordField, string[]> = {
  project_name: ['nama proyek', 'project name', 'nama pekerjaan', 'judul proyek'],
  client: ['klien', 'client', 'pemberi kerja', 'pengguna jasa'],
  sector: ['sektor', 'sector'],
  location: ['lokasi', 'location', 'wilayah'],
  year: ['tahun pelaksanaan', 'tahun', 'year'],
  service: ['lingkup pekerjaan', 'ruang lingkup', 'layanan', 'service', 'jasa'],
  brand: ['brand', 'perusahaan', 'company', 'entitas'],
  description: ['deskripsi', 'description', 'keterangan'],
};

const LABEL_LINE_RE = (() => {
  const all = (Object.keys(LABEL_WORDS) as RecordField[]).flatMap((field) =>
    LABEL_WORDS[field].map((word) => ({ field, word }))
  );
  all.sort((a, b) => b.word.length - a.word.length);
  return all.map(({ field, word }) => ({
    field,
    // "Label: value", "Label - value", or a bare "Label" line (value read
    // from the next non-empty line instead).
    regex: new RegExp(`^\\s*${word.replace(/\s+/g, '\\s+')}\\s*[:\\-–]?\\s*(.*)$`, 'i'),
  }));
})();

// Always recognized and thrown away immediately, before any other
// matching runs — this figure is never part of the public portfolio
// record, under any of these spellings.
const CONTRACT_VALUE_RE =
  /^\s*(nilai\s*kontrak|nilai\s*proyek|contract\s*value|contract\s*price|project\s*value|budget)\b/i;

// A real organization name line ("PT Bhimasena Power Indonesia", "Dinas
// Lingkungan Hidup Kota Bandung") — also acts as a block anchor.
const CLIENT_PREFIX_RE =
  /^(PT|CV|PD|UD|Perum|Perseroda|PDAM|Dinas|Kementerian|Kemen\w*|Pemerintah|Pemprov|Pemkab|Pemkot|Badan|Balai|Sekretariat|RSUD|RSUP|RS\.?|Rumah\s+Sakit|Universitas|Institut|Politeknik|Yayasan|Koperasi)\s+\S.*/i;

// A numbered-list marker ("1. ...", "01) ...", "No. 3 ...") — also acts as
// a block anchor, for portfolios laid out as a plain numbered list rather
// than labels or an organization-first block.
const NUMBERING_RE = /^\s*(?:no\.?\s*)?\d{1,3}[.)]\s+(\S.*)$/i;

const LOCATION_LINE_RE = /\b(kabupaten|kota|provinsi)\b/i;

const SECTOR_KEYWORDS: Record<SectorValue, string[]> = {
  Transportasi: ['jalan tol', 'pelabuhan', 'bandara', 'kereta api', 'mrt', 'lrt', 'transportasi', 'jembatan', 'terminal'],
  'Rumah Sakit': ['rumah sakit', 'klinik', 'puskesmas', 'hospital', ' rs '],
  'Pengolahan Limbah & Persampahan': ['tpa', 'tps', 'limbah', 'sampah', 'persampahan', 'ipal', 'pengolahan air limbah'],
  'Pemerintahan & Fasilitas Publik': [
    'pemerintah',
    'dinas',
    'kementerian',
    'fasilitas publik',
    'balai kota',
    'kantor bupati',
    'sekolah',
    'kampus',
    'universitas',
  ],
  'Migas & Pertambangan': ['tambang', 'migas', 'minyak dan gas', 'minyak bumi', 'pertambangan', 'batu bara', 'smelter'],
  Industri: ['pabrik', 'kawasan industri', 'industri', 'manufaktur'],
  'Energi & Ketenagalistrikan': ['pltu', 'plts', 'pltg', 'pembangkit listrik', 'ketenagalistrikan', 'kelistrikan'],
};

const SERVICE_KEYWORDS = [
  'environmental permit amandement',
  'environmental permit amendment',
  'environmental permit',
  'adendum andal',
  'andal',
  'rkl-rpl',
  'rkl rpl',
  'rkl/rpl',
  'ukl-upl',
  'ukl upl',
  'amdal',
  'monitoring lingkungan',
  'audit lingkungan',
  'kajian lingkungan',
  'dokumen lingkungan',
  'izin lingkungan',
  'sertifikasi',
];

function classifySector(explicitValue: string | null, contextText: string): SectorOrReview {
  if (explicitValue) {
    const exact = SECTOR_VALUES.find((s) => s.toLowerCase() === explicitValue.trim().toLowerCase());
    if (exact) return exact;
  }
  const haystack = `${explicitValue ?? ''} ${contextText}`.toLowerCase();
  for (const sector of SECTOR_VALUES) {
    if (SECTOR_KEYWORDS[sector].some((kw) => haystack.includes(kw))) return sector;
  }
  return 'Perlu Ditinjau';
}

function classifyBrand(explicitValue: string | null): (typeof COMPANY_VALUES)[number] {
  // Only ever picks a specific entity (GreenLab, Bikin Indonesia Berdaya,
  // ...) when a label explicitly names one, exactly as stated — never
  // inferred from body text. Everything in this portfolio is still a real
  // Environesia project even when no specific entity is
  // named, so that's the default — never the unhelpful "Belum Ditentukan".
  if (!explicitValue) return 'Environesia';
  const needle = explicitValue.trim().toLowerCase();
  const match = COMPANY_VALUES.find((c) => c !== 'Belum Ditentukan' && needle.includes(c.toLowerCase()));
  return match ?? 'Environesia';
}

function parseYear(raw: string | null): number | null {
  if (!raw) return null;
  const match = raw.match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : null;
}

function detectService(text: string): string | null {
  const lower = text.toLowerCase();
  const sorted = [...SERVICE_KEYWORDS].sort((a, b) => b.length - a.length);
  for (const kw of sorted) {
    const idx = lower.indexOf(kw);
    if (idx !== -1) return text.slice(idx, idx + kw.length);
  }
  return null;
}

/** Removes a repeated organization-name occurrence from joined text (e.g. the Bhimasena example — see extractBlockRecords). */
function stripDuplicate(text: string, needle: string | null): string {
  if (!needle) return text;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text
    .replace(new RegExp(escaped, 'gi'), '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[,\-–\s]+|[,\-–\s]+$/g, '')
    .trim();
}

type FieldValue = { value: string; viaLabel: boolean };
type DraftRecord = Partial<Record<RecordField, FieldValue>> & { page: number };

// Based on the FINAL computed values (including a keyword-classified
// sector or keyword-detected service, not only explicit labels) — a
// well-formed organization-anchored block like the Bhimasena example
// deserves "high" confidence on its real completeness, not a lower score
// just because it never had literal "Sektor:"/"Layanan:" labels.
function scoreConfidence(fields: {
  client: string | null;
  sector: SectorOrReview;
  location: string | null;
  year: number | null;
  service: string | null;
}): ConfidenceValue {
  const count = [
    fields.client,
    fields.sector !== 'Perlu Ditinjau' ? fields.sector : null,
    fields.location,
    fields.year,
    fields.service,
  ].filter(Boolean).length;
  if (count >= 4) return 'high';
  if (count >= 2) return 'medium';
  return 'low';
}

/**
 * Builds the final project from whatever was actually found — nothing
 * here rejects a record for missing fields. The one true requirement is a
 * non-empty project_name; if even that's missing, the organization name
 * (if any was captured) stands in for it, since a bare "PT ABC" with
 * genuinely nothing else is still worth surfacing in Review rather than
 * silently losing it. Only a record with truly no identifying text at all
 * returns null.
 */
function finalizeRecord(record: DraftRecord): ExtractedProject | null {
  const name = (record.project_name?.value.trim() || record.client?.value.trim()) ?? '';
  if (!name) return null;

  const client = record.client?.value.trim() || null;
  const explicitSector = record.sector?.value.trim() || null;
  const contextText = [name, client, record.service?.value, record.description?.value].filter(Boolean).join(' ');
  const sector = classifySector(explicitSector, contextText);
  const location = record.location?.value.trim() || null;
  const year = parseYear(record.year?.value ?? null);
  const service = record.service?.value.trim() || detectService(name);

  return {
    project_name: name,
    client,
    sector,
    location,
    year,
    service,
    brand: classifyBrand(record.brand?.value ?? null),
    description: record.description?.value.trim() || null,
    source_page: record.page,
    confidence: scoreConfidence({ client, sector, location, year, service }),
  };
}

const splitRow = (line: string) => line.split(/\s*\|\s*|\t+|\s{2,}/).map((c) => c.trim()).filter(Boolean);

/**
 * Finds the first table (header row + consecutive data rows) in a page's
 * lines, if any — shared by extractTableRecords (which builds records from
 * it) and extractBlockRecords (which must skip the same line range, so a
 * table's own cell text never also gets misread as a stray heading).
 */
function findTableRegion(lines: string[]): { start: number; end: number; header: (RecordField | null)[] } | null {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const cells = splitRow(line);
    if (cells.length < 2) continue;

    const header: (RecordField | null)[] = cells.map((cell) => {
      const lower = cell.toLowerCase();
      const entry = (Object.keys(LABEL_WORDS) as RecordField[]).find((field) =>
        LABEL_WORDS[field].some((w) => lower.includes(w))
      );
      return entry ?? null;
    });
    // A real header needs project_name plus at least one other recognized column.
    if (!header.includes('project_name') || header.filter(Boolean).length < 2) continue;

    let j = i + 1;
    for (; j < lines.length; j++) {
      const rowLine = lines[j];
      if (!rowLine || splitRow(rowLine).length === 0) break;
    }
    return { start: i, end: j, header };
  }
  return null;
}

/** Header row + delimited rows ("No | Nama Proyek | Klien | Lokasi | Tahun"). Short/incomplete rows still produce a project with the missing cells left null. */
export function extractTableRecords(pages: PdfPage[]): ExtractedProject[] {
  const records: ExtractedProject[] = [];

  for (const page of pages) {
    const lines = page.text.split('\n').map((l) => l.trim());
    const region = findTableRegion(lines);
    if (!region) continue;

    for (let j = region.start + 1; j < region.end; j++) {
      const rowCells = splitRow(lines[j]);
      const draft: DraftRecord = { page: page.num };
      rowCells.forEach((cell, idx) => {
        const field = region.header[idx];
        if (field) draft[field] = { value: cell, viaLabel: true };
      });
      // A row with fewer cells than the header still becomes a project —
      // the missing trailing columns are simply left null, never a
      // reason to drop the row or stop reading the table.
      const finalized = finalizeRecord(draft);
      if (finalized) records.push(finalized);
    }
  }

  return records;
}

/**
 * The main pass: one unified reading of each page's lines, recognizing a
 * new project from any of — an explicit "Nama Proyek:" label, an
 * organization-name line, a numbered-list marker, or (if nothing else
 * claims it) simply the first not-yet-claimed line, read as a bare
 * heading. Once a project is "open", every subsequent field label
 * (Klien/Sektor/Lokasi/Tahun/Layanan/Brand/Deskripsi) attaches to it, and
 * any other unclaimed line is folded into its name/description, right up
 * until the next anchor starts a new one — including across a page
 * boundary, so a label on page 1 can still pick up its fields on page 2. A
 * field-only line with no project open yet (a stray "Tahun: 2020" with
 * nothing before it) is the one thing that's dropped — there's no project
 * for it to belong to. Any line inside a detected table (see
 * extractTableRecords) is skipped here too, so the table's own cells are
 * never also misread as a stray heading.
 */
export function extractBlockRecords(pages: PdfPage[]): ExtractedProject[] {
  const records: ExtractedProject[] = [];
  let current: DraftRecord | null = null;
  let currentIsOrgAnchored = false;
  let currentNameLines: string[] = [];

  function closeCurrent() {
    if (!current) return;
    if (currentNameLines.length > 0) {
      const joined = currentNameLines.join(' ').replace(/\s{2,}/g, ' ').trim();
      const cleaned = currentIsOrgAnchored ? stripDuplicate(joined, current.client?.value ?? null) : joined;
      if (cleaned) current.project_name = { value: cleaned, viaLabel: false };
    }
    const finalized = finalizeRecord(current);
    if (finalized) records.push(finalized);
    current = null;
    currentIsOrgAnchored = false;
    currentNameLines = [];
  }

  for (const page of pages) {
    const lines = page.text.split('\n').map((l) => l.trim());
    const tableRegion = findTableRegion(lines);

    for (let i = 0; i < lines.length; i++) {
      if (tableRegion && i >= tableRegion.start && i < tableRegion.end) continue;

      const line = lines[i];
      if (!line) {
        // A blank line is the one reliable paragraph-break signal in plain
        // extracted text — close whatever's open rather than risking two
        // genuinely separate blocks (e.g. an org-anchored block followed
        // by an unrelated bare heading) silently merging into one project.
        closeCurrent();
        continue;
      }
      if (CONTRACT_VALUE_RE.test(line)) continue;

      // Field labels (never open a new block on their own).
      let matchedField: RecordField | null = null;
      let inlineValue = '';
      for (const { field, regex } of LABEL_LINE_RE) {
        const m = line.match(regex);
        if (m) {
          matchedField = field;
          inlineValue = m[1]?.trim() ?? '';
          break;
        }
      }

      if (matchedField && matchedField !== 'project_name') {
        let value = inlineValue;
        if (!value) {
          for (let j = i + 1; j < lines.length; j++) {
            if (!lines[j] || CONTRACT_VALUE_RE.test(lines[j])) continue;
            if (LABEL_LINE_RE.some(({ regex }) => regex.test(lines[j]))) break;
            value = lines[j];
            i = j;
            break;
          }
        }
        if (value && current) current[matchedField] = { value, viaLabel: true };
        continue;
      }

      if (matchedField === 'project_name') {
        closeCurrent();
        current = { page: page.num };
        if (inlineValue) currentNameLines = [inlineValue];
        continue;
      }

      const numberingMatch = line.match(NUMBERING_RE);
      if (numberingMatch) {
        closeCurrent();
        current = { page: page.num };
        currentNameLines = [numberingMatch[1]];
        continue;
      }

      if (CLIENT_PREFIX_RE.test(line)) {
        closeCurrent();
        current = { page: page.num, client: { value: line, viaLabel: true } };
        currentIsOrgAnchored = true;
        continue;
      }

      if (LOCATION_LINE_RE.test(line)) {
        if (current) current.location = { value: line, viaLabel: true };
        continue;
      }

      // Plain, unclaimed line: fold into whatever's open — but only if it
      // was opened on THIS SAME page. Field labels may still attach to a
      // block carried over from a previous page (that's the one legitimate
      // cross-page case: "Nama Proyek:" on page 1, "Klien:" at the top of
      // page 2), but an ordinary line is too ambiguous to risk silently
      // merging into a stale block from an earlier page — it starts a new
      // ("implicit") project instead, never silently dropped either way.
      if (!current || current.page !== page.num) {
        closeCurrent();
        current = { page: page.num };
      }
      currentNameLines.push(line);
    }
  }
  closeCurrent();

  return records;
}

function dedupe(records: ExtractedProject[]): ExtractedProject[] {
  const seen = new Set<string>();
  const result: ExtractedProject[] = [];
  for (const r of records) {
    const key = `${r.project_name.toLowerCase()}|${r.source_page}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(r);
  }
  return result;
}

/** Table rows and block records are independent passes over the same pages — both always run, neither gated behind the other finding nothing. */
export function extractRecordsFromPages(pages: PdfPage[]): ExtractedProject[] {
  return dedupe([...extractTableRecords(pages), ...extractBlockRecords(pages)]);
}
