import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getCollection } from './content';

const CONTENT_DIR = path.join(process.cwd(), 'content');

const TEMPLATED_COLLECTIONS = [
  'leadership',
  'milestones',
  'projects',
  'posts',
  'jobs',
  'documents',
  'entities',
];

describe('content templates', () => {
  it('ships a template for every collection that still needs authoring', () => {
    for (const collection of TEMPLATED_COLLECTIONS) {
      const templatePath = path.join(CONTENT_DIR, collection, '_TEMPLATE.md');
      expect(fs.existsSync(templatePath), `missing template for ${collection}`).toBe(true);
    }
  });

  it('never surfaces a template through getCollection', () => {
    for (const collection of TEMPLATED_COLLECTIONS) {
      const slugs = getCollection(collection).map((entry) => entry.slug);
      expect(slugs, `template leaked into ${collection}`).not.toContain('_TEMPLATE');
    }
  });

  it('leaves the still-unauthored collections empty', () => {
    for (const collection of ['leadership', 'milestones', 'projects', 'posts', 'jobs', 'documents']) {
      expect(getCollection(collection), `${collection} should still be empty`).toEqual([]);
    }
  });

  it('leaves the already-authored collections untouched', () => {
    expect(getCollection('entities')).toHaveLength(5);
    expect(getCollection('pillars')).toHaveLength(4);
    expect(getCollection('stats')).toHaveLength(2);
  });
});
