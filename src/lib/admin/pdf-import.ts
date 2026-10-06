import 'server-only';

// Must be imported before 'pdf-parse' itself — registers pdf-parse's
// bundler-safe worker (see next.config.ts's serverExternalPackages comment
// for why the default worker resolution breaks under Turbopack's SSR
// bundling).
import 'pdf-parse/worker';
import { PDFParse } from 'pdf-parse';
import { extractRecordsFromPages, type ExtractedProject } from './pdf-rule-engine';

export type { ExtractedProject } from './pdf-rule-engine';

export type PdfExtractionResult =
  | { ok: true; projects: ExtractedProject[] }
  | { ok: false; error: 'could_not_process' | 'no_text_layer' | 'no_projects_found'; message: string };

/**
 * Reads a PDF's real text layer per page (no OCR, no AI) and hands it to
 * the pure rule engine in pdf-rule-engine.ts. A PDF that's a scan/image
 * with no text layer is reported honestly as unprocessable rather than
 * silently producing nothing.
 */
export async function extractProjectsFromPdf(pdfBytes: Buffer): Promise<PdfExtractionResult> {
  let pages: { num: number; text: string }[];
  try {
    const parser = new PDFParse({ data: pdfBytes });
    const result = await parser.getText();
    await parser.destroy();
    pages = result.pages;
  } catch (err) {
    return {
      ok: false,
      error: 'could_not_process',
      message: err instanceof Error ? `PDF could not be processed: ${err.message}` : 'PDF could not be processed.',
    };
  }

  // A genuine scan/image-only PDF yields essentially nothing — not merely
  // "little" text. A real document can legitimately be this short (the
  // minimal "PT ABC" / "Environmental Study" case is only ~26 characters),
  // so this only rejects documents with no extractable text at all, never
  // a short-but-real one — a project must never be lost to an
  // over-eager "no text layer" guess.
  const totalChars = pages.reduce((sum, p) => sum + p.text.replace(/\s+/g, '').length, 0);
  if (totalChars === 0) {
    return {
      ok: false,
      error: 'no_text_layer',
      message:
        'PDF ini tampaknya berupa hasil scan/gambar tanpa lapisan teks. Fitur ini menggunakan text extraction, bukan OCR, sehingga dokumen ini belum dapat diproses.',
    };
  }

  const projects = extractRecordsFromPages(pages);

  if (projects.length === 0) {
    return { ok: false, error: 'no_projects_found', message: 'No project data could be identified from this document.' };
  }

  return { ok: true, projects };
}

export { findPossibleDuplicate, type ExistingProjectForDuplicateCheck } from './project-duplicate';
