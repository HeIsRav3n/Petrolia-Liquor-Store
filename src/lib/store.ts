import { Product } from './types';
import { defaultProducts } from './data';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

// ─── In-memory cache — eliminates repeated disk reads ───────────────────────
let _cache: Product[] | null = null;

function invalidateCache() {
  _cache = null;
}

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadProducts(): Product[] {
  if (_cache !== null) return _cache;

  ensureDataDir();
  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8').replace(/^\uFEFF/, ''); // strip BOM if present
      _cache = JSON.parse(raw) as Product[];
      return _cache;
    } catch {
      // Corrupt or BOM-prefixed file — fall through to defaults
    }
  }
  // First run - seed with default products
  saveProducts(defaultProducts);
  return defaultProducts;
}

function saveProducts(products: Product[]) {
  ensureDataDir();
  // Write as UTF-8 without BOM — PowerShell's Set-Content adds BOM which breaks JSON.parse
  const json = JSON.stringify(products);
  fs.writeFileSync(DATA_FILE, Buffer.from(json, 'utf-8'));
  _cache = products; // Keep cache warm after write
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
  products.push(newProduct);
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
  if (filtered.length === products.length) return false;
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
  if (filters.is_miscellaneous) {
    // Fall back to Coolers & Ciders if no products explicitly tagged
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

  // Optional limit for lightweight homepage fetches
  if (filters.limit && filters.limit > 0) {
    products = products.slice(0, filters.limit);
  }

  return products;
}

// Export invalidator so admin actions can clear cache explicitly
export { invalidateCache };
