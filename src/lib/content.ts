import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type CollectionEntry<T> = {
  slug: string;
  data: T;
  content: string;
};

export function getCollection<T>(
  collection: string,
  baseDir: string = path.join(process.cwd(), 'content')
): CollectionEntry<T>[] {
  const dir = path.join(baseDir, collection);

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx$/, ''),
        data: data as T,
        content: content.trim(),
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}
