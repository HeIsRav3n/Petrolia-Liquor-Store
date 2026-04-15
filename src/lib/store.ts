/**
 * store.ts — Supabase-backed product store
 *
 * All mutations (add / update / delete) are written to Supabase Postgres so
 * changes are permanent across Vercel serverless invocations.
 *
 * Read flow:   Supabase  →  local data/products.json  →  defaultProducts
 * Write flow:  Supabase only (permanent)
 */

import { Product } from './types';
import { defaultProducts } from './data';
import { supabase } from './supabase';
import fs from 'fs';
import path from 'path';

const TABLE = 'products';
const PROJECT_FILE = path.join(process.cwd(), 'data', 'products.json');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadLocalProducts(): Product[] {
  try {
    if (fs.existsSync(PROJECT_FILE)) {
      const raw = fs.readFileSync(PROJECT_FILE, 'utf-8').replace(/^\uFEFF/, '');
      const parsed = JSON.parse(raw) as Product[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // corrupt file — fall through
  }
  return defaultProducts;
}

// ─── Public API (all async) ───────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error || !data || data.length === 0) {
    console.warn('[store] Supabase unavailable, using local fallback:', error?.message);
    return loadLocalProducts();
  }
  return data as Product[];
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    // fallback to local file
    return loadLocalProducts().find((p) => p.id === id);
  }
  return data as Product;
}

export async function addProduct(
  product: Omit<Product, 'id' | 'created_at'>
): Promise<Product> {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    is_petrolia_pick: product.is_petrolia_pick ?? false,
    is_miscellaneous: product.is_miscellaneous ?? false,
    created_at: new Date().toISOString().split('T')[0],
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert(newProduct)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to add product to Supabase: ${error?.message}`);
  }
  return data as Product;
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...updates, id })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return data as Product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  return !error;
}

export async function getFilteredProducts(filters: {
  category?: string;
  subcategory?: string;
  country?: string;
  size?: string;
  type?: string;
  search?: string;
  featured?: boolean;
  is_new?: boolean;
  is_petrolia_pick?: boolean;
  is_miscellaneous?: boolean;
  in_stock?: boolean;
  sort?: string;
  limit?: number;
}): Promise<Product[]> {
  let query = supabase.from(TABLE).select('*');

  if (filters.category)     query = query.ilike('category', filters.category);
  if (filters.subcategory)  query = query.ilike('subcategory', filters.subcategory);
  if (filters.country)      query = query.ilike('country', filters.country);
  if (filters.size)         query = query.ilike('size', filters.size);
  if (filters.type)         query = query.ilike('type', filters.type);

  if (filters.featured === true)          query = query.eq('featured', true);
  if (filters.is_new === true)            query = query.eq('is_new', true);
  if (filters.is_petrolia_pick === true)  query = query.eq('is_petrolia_pick', true);
  if (filters.is_miscellaneous === true)  query = query.eq('is_miscellaneous', true);
  if (filters.in_stock !== undefined)     query = query.eq('in_stock', filters.in_stock);

  if (filters.sort === 'price-asc')  query = query.order('price', { ascending: true });
  else if (filters.sort === 'price-desc') query = query.order('price', { ascending: false });
  else if (filters.sort === 'name-asc')   query = query.order('name', { ascending: true });
  else if (filters.sort === 'name-desc')  query = query.order('name', { ascending: false });
  else if (filters.sort === 'newest')     query = query.order('created_at', { ascending: false });

  if (filters.limit && filters.limit > 0) query = query.limit(filters.limit);

  const { data, error } = await query;

  if (error) {
    console.warn('[store] Supabase getFilteredProducts failed, using fallback:', error.message);
    return loadLocalProducts();
  }

  let products = (data || []) as Product[];

  // Client-side full-text search (multi-column OR is simpler this way)
  if (filters.search) {
    const q = filters.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  return products;
}

/** Seed all products from the local JSON file into Supabase — run once */
export async function seedToSupabase(): Promise<{ inserted: number; error: string | null }> {
  const products = loadLocalProducts();
  if (products.length === 0) return { inserted: 0, error: 'No local products to seed' };

  const BATCH = 500;
  let inserted = 0;

  for (let i = 0; i < products.length; i += BATCH) {
    const chunk = products.slice(i, i + BATCH);
    const { error } = await supabase
      .from(TABLE)
      .upsert(chunk, { onConflict: 'id' });
    if (error) return { inserted, error: error.message };
    inserted += chunk.length;
  }

  return { inserted, error: null };
}
