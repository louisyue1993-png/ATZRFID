// Database operations helper functions
import { getSupabaseClient } from '@/storage/database/supabase-client';

// Product Operations
export async function getProducts() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProductById(id: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createProduct(product: any) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('products')
    .insert({
      ...product,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, updates: any) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('products')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const client = getSupabaseClient();
  const { error } = await client
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function getProductsByCategory(category: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function searchProducts(query: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,keywords.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Blog Operations
export async function getBlogPosts() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getBlogPostById(id: number) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getBlogPostBySlug(slug: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

export async function createBlogPost(post: any) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('blog_posts')
    .insert({
      ...post,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBlogPost(id: number, updates: any) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('blog_posts')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBlogPost(id: number) {
  const client = getSupabaseClient();
  const { error } = await client
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function getPublishedBlogPosts() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getBlogPostsByCategory(category: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .eq('category', category)
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Page Content Operations
export async function getPageContent(page: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('page_contents')
    .select('*')
    .eq('page', page)
    .single();

  if (error) throw error;
  return data;
}

export async function updatePageContent(page: string, updates: any) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('page_contents')
    .upsert({
      page,
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
