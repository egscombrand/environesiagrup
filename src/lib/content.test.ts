import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { getCollection } from './content';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = path.join(__dirname, '__fixtures__');

type SampleEntry = { title: string; order: number };

describe('getCollection', () => {
  it('parses frontmatter and content from every .mdx file in the collection', () => {
    const entries = getCollection<SampleEntry>('sample-collection', FIXTURES_DIR);

    expect(entries).toHaveLength(2);
    expect(entries[0]).toEqual({
      slug: 'first-item',
      data: { title: 'First item', order: 1 },
      content: 'Sample body content.',
    });
    expect(entries[1].slug).toBe('second-item');
  });

  it('returns an empty array when the collection directory does not exist', () => {
    expect(getCollection('missing-collection', FIXTURES_DIR)).toEqual([]);
  });
});
