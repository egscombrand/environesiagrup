import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';
import { publicMediaUrl } from './media';

type PostRow = Database['public']['Tables']['posts']['Row'];

export type Post = PostRow & { coverImageUrl?: string };

function mapPost(row: PostRow): Post {
  return { ...row, coverImageUrl: publicMediaUrl(row.cover_image_path) };
}

export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('published_at', { ascending: false });

  if (error) throw new Error(`Failed to load posts: ${error.message}`);
  return (data ?? []).map(mapPost);
}

export async function getFeaturedPublishedPosts(limit = 3): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts.slice(0, limit);
}

export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .is('deleted_at', null)
    .maybeSingle();

  if (error) throw new Error(`Failed to load post "${slug}": ${error.message}`);
  return data ? mapPost(data) : null;
}

export async function getPublishedPostSlugs(): Promise<string[]> {
  const posts = await getPublishedPosts();
  return posts.map((post) => post.slug);
}

export async function listPostsForAdmin(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to load posts: ${error.message}`);
  return (data ?? []).map(mapPost);
}

export async function getPostByIdForAdmin(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`Failed to load post: ${error.message}`);
  return data ? mapPost(data) : null;
}
