import { describe, expect, it } from 'vitest';
import { slugify } from './slug-format';

describe('slugify', () => {
  it('lowercases and turns spaces into hyphens', () => {
    expect(slugify('Environesia Consultant')).toBe('environesia-consultant');
  });

  it('strips symbols that are not needed in a URL', () => {
    expect(slugify('Layanan & Jasa: Konsultasi!')).toBe('layanan-jasa-konsultasi');
  });

  it('keeps Indonesian/accented characters safely, by folding them to plain letters', () => {
    expect(slugify('Pembangunan Berkelanjutan — Jénérösitÿ')).toBe('pembangunan-berkelanjutan-jenerosity');
  });

  it('collapses repeated separators and trims leading/trailing hyphens', () => {
    expect(slugify('  -- Dua   Spasi --  ')).toBe('dua-spasi');
  });

  it('truncates very long input to a reasonable URL length', () => {
    const long = 'kata '.repeat(40).trim();
    expect(slugify(long).length).toBeLessThanOrEqual(96);
  });
});
