import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getCollection } from './content';
import type { StatEntry, EntityEntry, PillarEntry } from './content-types';

describe('Fase 2 content collections', () => {
  it('reads 2 real stats, sorted by urutan', () => {
    const stats = getCollection<StatEntry>('stats')
      .map((e) => e.data)
      .sort((a, b) => a.urutan - b.urutan);
    expect(stats).toEqual([
      { label: 'Tahun Pengalaman', nilai: 10, satuan: '+', urutan: 1 },
      { label: 'Negara', nilai: 10, satuan: '', urutan: 2 },
    ]);
  });

  it('reads 4 core entities and 1 supporting entity', () => {
    const entities = getCollection<EntityEntry>('entities').map((e) => e.data);
    expect(entities.filter((e) => e.lini === 'inti')).toHaveLength(4);
    expect(entities.filter((e) => e.lini === 'penunjang')).toHaveLength(1);
    expect(entities.map((e) => e.nama)).toContain('Bikin Indonesia Berdaya');
  });

  it('reads 4 pillars in chain order', () => {
    const pillars = getCollection<PillarEntry>('pillars')
      .map((e) => e.data)
      .sort((a, b) => a.urutan - b.urutan);
    expect(pillars.map((p) => p.slug)).toEqual([
      'konsultasi',
      'pengujian-sampling',
      'pelatihan-kompetensi',
      'sertifikasi-profesi',
    ]);
  });

  it('gives every entity a logo file that actually exists in public/', () => {
    const entities = getCollection<EntityEntry>('entities').map((e) => e.data);

    const missing = entities
      .filter((entity) => {
        if (!entity.logo) return true;
        return !fs.existsSync(path.join(process.cwd(), 'public', entity.logo));
      })
      .map((entity) => entity.slug);

    expect(missing).toEqual([]);
  });
});
