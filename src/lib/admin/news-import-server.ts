import 'server-only';

import ExcelJS from 'exceljs';
import { parseCsvText } from './news-import';

type CellLike = ExcelJS.CellValue;

function cellLink(value: CellLike): string {
  if (value && typeof value === 'object' && 'hyperlink' in value && typeof value.hyperlink === 'string') {
    return value.hyperlink;
  }
  return '';
}

function cellToText(value: CellLike): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    if ('richText' in value && Array.isArray(value.richText)) {
      return value.richText.map((part) => part.text).join('');
    }
    if ('text' in value && typeof value.text === 'string') return value.text;
    if ('hyperlink' in value && typeof value.hyperlink === 'string') return value.hyperlink;
    if ('result' in value) return cellToText(value.result as CellLike);
  }
  return '';
}

export type SpreadsheetRows = {
  /** Cell text, header row included. */
  rows: string[][];
  /** Same shape: the hyperlink target of each cell, or '' when the cell has none. */
  links: string[][];
};

/**
 * Reads the first sheet of an .xlsx workbook, or a .csv file, into plain
 * string rows (header row included). Legacy .xls is rejected by the caller
 * before this is reached.
 */
export async function readSpreadsheetRows(bytes: Buffer, fileName: string): Promise<SpreadsheetRows> {
  const lower = fileName.toLowerCase();

  if (lower.endsWith('.csv')) {
    const rows = parseCsvText(bytes.toString('utf8'));
    return { rows, links: rows.map((row) => row.map(() => '')) };
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(bytes as unknown as ArrayBuffer);
  const sheet = workbook.worksheets[0];
  if (!sheet) return { rows: [], links: [] };

  const rows: string[][] = [];
  const links: string[][] = [];
  const width = sheet.actualColumnCount;
  sheet.eachRow({ includeEmpty: false }, (row) => {
    const values: string[] = [];
    const targets: string[] = [];
    for (let column = 1; column <= width; column++) {
      const value = row.getCell(column).value;
      values.push(cellToText(value));
      targets.push(cellLink(value));
    }
    rows.push(values);
    links.push(targets);
  });
  return { rows, links };
}
