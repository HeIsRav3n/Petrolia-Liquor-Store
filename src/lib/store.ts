import { Product } from './types';
import { defaultProducts } from './data';
import fs from 'fs';
import path from 'path';

// ─── File paths ──────────────────────────────────────────────────────────────
// On Vercel, the project dir is READ-ONLY at runtime. Writes go to /tmp.
// On local dev, writes go directly to data/products.json.
const PROJECT_FILE = path.join(process.cwd(), 'data', 'products.json');
const TMP_FILE = '/tmp/petrolia_products.json';

// ─── In-memory cache — eliminates repeated disk reads ───────────────────────
let _cache: Product[] | null = null;

function invalidateCache() {
  _cache = null;
}

function ensureDataDir() {
  const dir = path.dirname(PROJECT_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function isWritable(filePath: string): boolean {
  try {
    fs.accessSync(path.dirname(filePath), fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function loadProducts(): Product[] {
  if (_cache !== null) return _cache;

  // Priority: /tmp (has recent mutations) → project file (seed data) → defaults
  for (const file of [TMP_FILE, PROJECT_FILE]) {
    if (fs.existsSync(file)) {
      try {
        const raw = fs.readFileSync(file, 'utf-8').replace(/^\uFEFF/, ''); // strip BOM
        const parsed = JSON.parse(raw) as Product[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          _cache = parsed;
          return _cache;
        }
      } catch {
        // corrupt file — try next source
      }
    }
  }

  // First run — seed defaults
  saveProducts(defaultProducts);
  return defaultProducts;
}

function saveProducts(products: Product[]) {
  const json = JSON.stringify(products);
  const buf = Buffer.from(json, 'utf-8');

  // Try the project data dir first (works in local dev)
  try {
    ensureDataDir();
    if (isWritable(PROJECT_FILE)) {
      fs.writeFileSync(PROJECT_FILE, buf);
      _cache = products;
      return;
    }
  } catch {
    // fall through to /tmp
  }

  // Vercel / read-only environments — write to /tmp
  fs.writeFileSync(TMP_FILE, buf);
  _cache = products;
}

export function getProducts(): Product[] {
  return loadProducts();
}

export function getProductById(id: string): Product | undefined {
  return loadProducts().find((p) => p.id === id);
}

export function addProduct(product: Omit<Product, 'id' | 'created_at'>): Product {
  const products = loadProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    is_petrolia_pick: product.is_petrolia_pick ?? false,
    is_miscellaneous: product.is_miscellaneous ?? false,
    created_at: new Date().toISOString().split('T')[0],
  };
  products.unshift(newProduct); // add to front so it appears first
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = loadProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates, id };
  saveProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = loadProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false; // not found
  saveProducts(filtered);
  return true;
}

export function getFilteredProducts(filters: {
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
}): Product[] {
  let products = loadProducts();

  if (filters.category) {
    products = products.filter(
      (p) => p.category.toLowerCase() === filters.category!.toLowerCase()
    );
  }
  if (filters.subcategory) {
    products = products.filter(
      (p) => p.subcategory.toLowerCase() === filters.subcategory!.toLowerCase()
    );
  }
  if (filters.country) {
    products = products.filter(
      (p) => p.country.toLowerCase() === filters.country!.toLowerCase()
    );
  }
  if (filters.size) {
    products = products.filter(
      (p) => p.size.toLowerCase() === filters.size!.toLowerCase()
    );
  }
  if (filters.type) {
    products = products.filter(
      (p) => p.type.toLowerCase() === filters.type!.toLowerCase()
    );
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }
  if (filters.featured) {
    products = products.filter((p) => p.featured);
  }
  if (filters.is_new) {
    products = products.filter((p) => p.is_new);
  }
  if (filters.is_petrolia_pick) {
    products = products.filter((p) => p.is_petrolia_pick);
  }
  if (filters.in_stock !== undefined) {
    products = products.filter((p) => p.in_stock === filters.in_stock);
  }
  if (filters.is_miscellaneous) {
    const tagged = products.filter((p) => p.is_miscellaneous);
    if (tagged.length > 0) {
      products = tagged;
    } else {
      products = products.filter(
        (p) =>
          p.category.toLowerCase() === 'coolers & ciders' ||
          p.category.toLowerCase() === 'coolers'
      );
    }
  }

  // Sorting
  if (filters.sort === 'price-asc') {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price-desc') {
    products = [...products].sort((a, b) => b.price - a.price);
  } else if (filters.sort === 'name-asc') {
    products = [...products].sort((a, b) => a.name.localeCompare(b.name));
  } else if (filters.sort === 'name-desc') {
    products = [...products].sort((a, b) => b.name.localeCompare(a.name));
  } else if (filters.sort === 'newest') {
    products = [...products].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  if (filters.limit && filters.limit > 0) {
    products = products.slice(0, filters.limit);
  }

  return products;
}

export { invalidateCache };
