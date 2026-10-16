import { describe, expect, it } from 'vitest';
import { extractBlockRecords, extractTableRecords, extractRecordsFromPages, type PdfPage } from './pdf-rule-engine';

function page(num: number, text: string): PdfPage {
  return { num, text };
}

describe('extractBlockRecords — labeled format ("Nama Proyek: ...")', () => {
  it('reads a fully-labeled record as "high" confidence', () => {
    const records = extractBlockRecords([
      page(
        1,
        [
          'Nama Proyek: Kajian AMDAL Pelabuhan',
          'Klien: PT Pelindo',
          'Sektor: Transportasi',
          'Lokasi: Jawa Barat',
          'Tahun: 2023',
          'Layanan: AMDAL',
        ].join('\n')
      ),
    ]);

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      project_name: 'Kajian AMDAL Pelabuhan',
      client: 'PT Pelindo',
      sector: 'Transportasi',
      location: 'Jawa Barat',
      year: 2023,
      service: 'AMDAL',
      brand: 'Environesia',
      source_page: 1,
      confidence: 'high',
    });
  });

  it('reads a bare "Label" line followed by its value on the next line', () => {
    const records = extractBlockRecords([
      page(1, ['Nama Proyek', 'Monitoring Lingkungan Tambang', 'Klien', 'PT Tambang Jaya'].join('\n')),
    ]);

    expect(records).toHaveLength(1);
    expect(records[0].project_name).toBe('Monitoring Lingkungan Tambang');
    expect(records[0].client).toBe('PT Tambang Jaya');
  });

  it('starts a new record every time a new "Nama Proyek" label appears, never merging two projects', () => {
    const records = extractBlockRecords([
      page(1, ['Nama Proyek: Proyek A', 'Klien: Klien A', 'Nama Proyek: Proyek B', 'Klien: Klien B'].join('\n')),
    ]);

    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({ project_name: 'Proyek A', client: 'Klien A' });
    expect(records[1]).toMatchObject({ project_name: 'Proyek B', client: 'Klien B' });
  });

  it('keeps a record open across a page boundary until the next anchor', () => {
    const records = extractBlockRecords([page(1, 'Nama Proyek: Proyek Lintas Halaman'), page(2, 'Klien: PT Lintas')]);

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({ project_name: 'Proyek Lintas Halaman', client: 'PT Lintas', source_page: 1 });
  });

  it('explicitly sets brand only when a label names a known company, never inferring it', () => {
    const withBrand = extractBlockRecords([page(1, 'Nama Proyek: X\nBrand: GreenLab')]);
    const withoutBrand = extractBlockRecords([page(1, 'Nama Proyek: Uji Lab GreenLab Indonesia')]);

    expect(withBrand[0].brand).toBe('GreenLab');
    expect(withoutBrand[0].brand).toBe('Environesia');
  });

  it('sets sector to "Perlu Ditinjau" when nothing (label or keyword) matches a real sector', () => {
    const records = extractBlockRecords([page(1, 'Nama Proyek: Sesuatu yang Ambigu')]);
    expect(records[0].sector).toBe('Perlu Ditinjau');
  });

  it('classifies sector by keyword when no explicit Sektor label is given', () => {
    const records = extractBlockRecords([
      page(1, 'Nama Proyek: Studi Lingkungan\nKlien: PT X\nLayanan: Kajian dampak PLTU unit 3'),
    ]);
    expect(records[0].sector).toBe('Energi & Ketenagalistrikan');
  });
});

describe('extractBlockRecords — organization-anchored blocks (no labels at all)', () => {
  it('reads the real Bhimasena-style block exactly per the acceptance criteria', () => {
    const records = extractBlockRecords([
      page(
        1,
        [
          'PT Bhimasena Power Indonesia',
          'Environmental Permit Amandement',
          '(Adendum ANDAL dan RKL RPL PLTU 2 x 1.000 MW) PT Bhimasena Power Indonesia',
          'Kabupaten Batang, Provinsi Jawa Tengah',
          'Tahun: 2019',
          'Nilai Kontrak: Rp516.890.000',
        ].join('\n')
      ),
    ]);

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      client: 'PT Bhimasena Power Indonesia',
      project_name: 'Environmental Permit Amandement (Adendum ANDAL dan RKL RPL PLTU 2 x 1.000 MW)',
      location: 'Kabupaten Batang, Provinsi Jawa Tengah',
      year: 2019,
      sector: 'Energi & Ketenagalistrikan',
      confidence: 'high',
    });
    expect(records[0].brand).toBe('Environesia');
  });

  it('never stores Nilai Kontrak / Contract Value in any field, under any spelling', () => {
    const variants = [
      'Nilai Kontrak: Rp1.000.000',
      'Contract Value: USD 500,000',
      'Contract Price: Rp2 miliar',
      'Project Value: Rp3 miliar',
      'Budget: Rp4 miliar',
    ];
    for (const line of variants) {
      const records = extractBlockRecords([page(1, ['PT Contoh Sejahtera', 'Kajian Lingkungan', line].join('\n'))]);
      expect(JSON.stringify(records)).not.toMatch(/kontrak|contract|budget/i);
    }
  });

  it('splits two consecutive organization-anchored blocks into two separate projects', () => {
    const records = extractBlockRecords([
      page(
        1,
        [
          'PT Alpha Konsultan',
          'Audit Lingkungan Tahunan',
          'Kabupaten Sleman, Provinsi DIY',
          'Tahun: 2021',
          'PT Beta Industri',
          'Sertifikasi Kompetensi Operator',
          'Kota Surabaya, Provinsi Jawa Timur',
          'Tahun: 2020',
        ].join('\n')
      ),
    ]);

    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({ client: 'PT Alpha Konsultan', project_name: 'Audit Lingkungan Tahunan', year: 2021 });
    expect(records[1]).toMatchObject({ client: 'PT Beta Industri', project_name: 'Sertifikasi Kompetensi Operator', year: 2020 });
  });

  it('still creates the project with null fields when location/year are missing', () => {
    const records = extractBlockRecords([page(1, ['PT Tanpa Detail', 'Kajian Awal'].join('\n'))]);

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({ client: 'PT Tanpa Detail', project_name: 'Kajian Awal', location: null, year: null });
  });

  it('keeps a specific entity when a Brand/Perusahaan label explicitly names one', () => {
    const records = extractBlockRecords([page(1, ['PT Mitra Jaya', 'Pengujian Laboratorium', 'Perusahaan: GreenLab'].join('\n'))]);
    expect(records[0].brand).toBe('GreenLab');
  });
});

describe('extractBlockRecords — never rejects a project for incomplete data (core rule)', () => {
  it('captures a project from only a client name + one heading line, nothing else at all', () => {
    const records = extractBlockRecords([page(1, ['PT ABC', 'Environmental Study'].join('\n'))]);

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      project_name: 'Environmental Study',
      client: 'PT ABC',
      location: null,
      year: null,
      service: null,
    });
    // Missing data never blocks the project from being returned — it's
    // just low confidence so the admin knows to take a closer look.
    expect(records[0].confidence).toBe('low');
    expect(records[0].sector).toBe('Perlu Ditinjau');
    expect(records[0].brand).toBe('Environesia');
  });

  it('captures a project from a bare heading line with no organization prefix at all', () => {
    const records = extractBlockRecords([page(1, 'Kajian Dampak Lingkungan Kawasan Industri')]);

    expect(records).toHaveLength(1);
    expect(records[0].project_name).toBe('Kajian Dampak Lingkungan Kawasan Industri');
    expect(records[0].client).toBeNull();
  });

  it('detects projects from a numbered list, with no labels and no organization-prefix lines', () => {
    const records = extractBlockRecords([
      page(
        1,
        [
          '1. Kajian AMDAL Kawasan Pelabuhan',
          'Klien: PT Pelabuhan Nusantara',
          'Tahun: 2020',
          '2. Audit Lingkungan Tahunan',
          'Klien: PT Industri Baja',
          'Tahun: 2022',
        ].join('\n')
      ),
    ]);

    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({ project_name: 'Kajian AMDAL Kawasan Pelabuhan', client: 'PT Pelabuhan Nusantara', year: 2020 });
    expect(records[1]).toMatchObject({ project_name: 'Audit Lingkungan Tahunan', client: 'PT Industri Baja', year: 2022 });
  });

  it('never fabricates data for a field it could not find — missing fields are null, not guessed', () => {
    const records = extractBlockRecords([page(1, 'Studi Kelayakan Lingkungan')]);
    expect(records[0]).toMatchObject({ client: null, location: null, year: null, service: null, description: null });
  });
});

describe('extractTableRecords', () => {
  it('parses a pipe-delimited header + rows table', () => {
    const records = extractTableRecords([
      page(
        1,
        [
          'No | Nama Proyek | Klien | Lokasi | Tahun',
          '1 | Audit Lingkungan RS | RS Sardjito | Yogyakarta | 2022',
          '2 | Kajian UKL-UPL | Dinas PU | Kalimantan Timur | 2021',
        ].join('\n')
      ),
    ]);

    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({ project_name: 'Audit Lingkungan RS', client: 'RS Sardjito', location: 'Yogyakarta', year: 2022 });
    expect(records[1]).toMatchObject({ project_name: 'Kajian UKL-UPL', client: 'Dinas PU', location: 'Kalimantan Timur', year: 2021 });
  });

  it('parses a whitespace-aligned table without pipes', () => {
    const records = extractTableRecords([
      page(1, 'Nama Proyek        Klien           Tahun\nSertifikasi Operator   PT Industri Maju   2020'),
    ]);

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({ project_name: 'Sertifikasi Operator', client: 'PT Industri Maju', year: 2020 });
  });

  it('still creates a project for a row with fewer cells than the header — missing trailing columns are null, the row is never dropped', () => {
    const records = extractTableRecords([
      page(
        1,
        [
          'Nama Proyek | Klien | Lokasi | Tahun',
          'Kajian Lingkungan Awal | PT Mitra',
          'Audit Lengkap | PT Lengkap | Jakarta | 2023',
        ].join('\n')
      ),
    ]);

    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({ project_name: 'Kajian Lingkungan Awal', client: 'PT Mitra', location: null, year: null });
    expect(records[1]).toMatchObject({ project_name: 'Audit Lengkap', client: 'PT Lengkap', location: 'Jakarta', year: 2023 });
  });

  it('ignores a line that merely contains 2+ words without a recognizable header', () => {
    expect(extractTableRecords([page(1, 'Ini bukan tabel sama sekali\njuga bukan baris data')])).toHaveLength(0);
  });
});

describe('extractRecordsFromPages — nothing found anywhere in the document is ever lost', () => {
  it('captures both a fully-labeled project AND an unrelated bare-heading project on a different page in the same document', () => {
    // Regression test for the core bug this fix addresses: a labeled block
    // succeeding on page 1 must never cause an unrelated, unlabeled block
    // on page 2 to be silently dropped.
    const records = extractRecordsFromPages([
      page(1, 'Nama Proyek: Proyek Berlabel\nKlien: Klien Jelas\nLokasi: Bali\nTahun: 2024\nLayanan: Audit'),
      page(2, 'Kajian Lingkungan Tanpa Label Apa Pun'),
    ]);

    expect(records).toHaveLength(2);
    expect(records.find((r) => r.project_name === 'Proyek Berlabel')).toBeTruthy();
    expect(records.find((r) => r.project_name === 'Kajian Lingkungan Tanpa Label Apa Pun')).toBeTruthy();
  });

  it('combines table rows and organization-anchored blocks found on different pages', () => {
    const records = extractRecordsFromPages([
      page(1, 'No | Nama Proyek | Klien\n1 | Proyek Tabel | PT Tabel'),
      page(2, 'PT Blok Terpisah\nProyek Blok'),
    ]);

    expect(records).toHaveLength(2);
    expect(records.find((r) => r.project_name === 'Proyek Tabel')).toBeTruthy();
    expect(records.find((r) => r.project_name === 'Proyek Blok')).toBeTruthy();
  });

  it('never fabricates a project out of an empty page', () => {
    expect(extractRecordsFromPages([page(1, '')])).toHaveLength(0);
  });
});
