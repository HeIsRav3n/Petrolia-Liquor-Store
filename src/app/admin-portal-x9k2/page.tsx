'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Product } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { logoutAction } from './actions';

const ITEMS_PER_PAGE = 50;

// ─── Shared option lists ───────────────────────────────────────────────
const CATEGORY_OPTIONS = ['Beer', 'Wine', 'Whisky', 'Vodka', 'Rum', 'Tequila', 'Gin', 'Brandy & Cognac', 'Coolers & Ciders', 'Spirits', 'Sparkling', 'Liqueur', 'Bitters', 'Miscellaneous'];
const SIZE_OPTIONS = ['50ml', '143ml', '200ml', '250ml', '300ml', '350ml', '355ml', '360ml', '375ml', '500ml', '700ml', '750ml', '900ml', '945ml', '1L', '1.14L', '1.75L', '1.89L', '2L', '3L', '4L', '5L', '355ml x 12', '355ml x 24', '330ml x 12', '330ml x 24', '440ml x 8'];
const COUNTRY_OPTIONS = ['Canada', 'USA', 'France', 'Italy', 'Spain', 'Australia', 'New Zealand', 'Mexico', 'Scotland', 'Ireland', 'Germany', 'Japan', 'Argentina', 'Chile', 'South Africa', 'Portugal', 'Netherlands', 'UK'];

type StatFilter = 'all' | 'inStock' | 'outOfStock' | 'featured';

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [statFilter, setStatFilter] = useState<StatFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      showNotification('error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleLogout = async () => {
    await logoutAction();
    router.push('/admin-portal-x9k2/login');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification('success', 'Product deleted');
        // Optimistic update — remove from local state immediately
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        const err = await res.json().catch(() => ({}));
        showNotification('error', err.error || 'Failed to delete product');
      }
    } catch {
      showNotification('error', 'Network error — could not delete product');
    }
  };

  const handleToggleStock = async (product: Product) => {
    const newVal = !product.in_stock;
    // Optimistic update
    setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, in_stock: newVal } : p));
    const res = await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ in_stock: newVal }),
    });
    if (res.ok) {
      showNotification('success', `${product.name} marked as ${newVal ? 'in stock' : 'out of stock'}`);
    } else {
      // Revert on failure
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, in_stock: product.in_stock } : p));
      showNotification('error', 'Failed to update stock');
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    const newVal = !product.featured;
    setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, featured: newVal } : p));
    const res = await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: newVal }),
    });
    if (res.ok) {
      showNotification('success', `${product.name} ${newVal ? 'featured' : 'unfeatured'}`);
    } else {
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, featured: product.featured } : p));
      showNotification('error', 'Failed to update featured');
    }
  };

  // Stats
  const stats = useMemo(() => ({
    total: products.length,
    inStock: products.filter((p) => p.in_stock).length,
    outOfStock: products.filter((p) => !p.in_stock).length,
    featured: products.filter((p) => p.featured).length,
  }), [products]);

  // Filtered products — search + category + stat card filter
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !filterCategory || p.category === filterCategory;
      const matchesStat =
        statFilter === 'all' ? true :
        statFilter === 'inStock' ? p.in_stock :
        statFilter === 'outOfStock' ? !p.in_stock :
        statFilter === 'featured' ? p.featured : true;
      return matchesSearch && matchesCategory && matchesStat;
    });
  }, [products, searchQuery, filterCategory, statFilter]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => { setCurrentPage(1); }, [searchQuery, filterCategory, statFilter]);

  const categoryOptions = useMemo(() => [...new Set(products.map((p) => p.category))].sort(), [products]);

  const statCards = [
    { key: 'all' as StatFilter, label: 'Total Products', value: stats.total, color: 'bg-blue-500', icon: '📦' },
    { key: 'inStock' as StatFilter, label: 'In Stock', value: stats.inStock, color: 'bg-emerald-500', icon: '✅' },
    { key: 'outOfStock' as StatFilter, label: 'Out of Stock', value: stats.outOfStock, color: 'bg-red-500', icon: '❌' },
    { key: 'featured' as StatFilter, label: 'Featured', value: stats.featured, color: 'bg-amber-500', icon: '⭐' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ─── Notification Toast ─── */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-[9999] px-5 py-3 rounded-lg shadow-xl animate-slide-up text-sm font-medium flex items-center gap-2 ${
            notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {notification.type === 'success' ? (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {notification.message}
        </div>
      )}

      {/* ─── Admin Header ─── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Petrolia" className="h-9 w-auto object-contain" loading="eager" />
            <div className="hidden sm:block">
              <h1 className="font-bold text-[var(--color-primary)] text-base leading-tight">Admin Dashboard</h1>
              <p className="text-xs text-gray-400">Petrolia Liquor Store</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors hidden sm:block"
            >
              View Site ↗
            </a>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors px-3 py-2 hover:bg-red-50 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* ─── Clickable Stat Cards ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {statCards.map((stat) => (
            <button
              key={stat.key}
              onClick={() => setStatFilter(stat.key)}
              className={`bg-white rounded-lg border p-4 flex items-center gap-3 shadow-sm text-left transition-all hover:shadow-md ${
                statFilter === stat.key
                  ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-lg shrink-0`}>
                {stat.icon}
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-[var(--color-primary)] leading-none">{stat.value}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{stat.label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Active stat filter badge */}
        {statFilter !== 'all' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Filtering by:</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold rounded-full">
              {statCards.find((s) => s.key === statFilter)?.label}
              <button onClick={() => setStatFilter('all')} className="ml-1 hover:opacity-70">✕</button>
            </span>
          </div>
        )}

        {/* ─── Toolbar ─── */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex flex-col xs:flex-row gap-2 flex-1">
              {/* Search */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-9 w-full text-sm"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input-field w-full xs:w-[180px] text-sm"
              >
                <option value="">All Categories</option>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Add Product */}
            <button
              onClick={() => { setEditingProduct(null); setShowAddModal(true); }}
              className="btn-primary flex items-center gap-2 text-sm whitespace-nowrap justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>
        </div>

        {/* ─── Products Table (desktop) + Cards (mobile) ─── */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h2 className="font-semibold text-[var(--color-primary)] text-sm">
              Inventory
              <span className="ml-2 text-gray-400 font-normal">
                {filteredProducts.length === products.length
                  ? `(${products.length} products)`
                  : `(${filteredProducts.length} of ${products.length})`}
              </span>
            </h2>
            {filteredProducts.length > ITEMS_PER_PAGE && (
              <span className="text-xs text-gray-400">Page {currentPage} / {totalPages}</span>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Loading products...</p>
            </div>
          ) : (
            <>
              {/* ─── DESKTOP TABLE ─── */}
              <div className="admin-product-table overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                      <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Stock</th>
                      <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Featured</th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-1">
                              {product.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" loading="lazy" decoding="async" />
                              ) : (
                                <span className="text-lg">📦</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-[var(--color-primary)] text-sm line-clamp-1">{product.name}</p>
                              <p className="text-[11px] text-gray-400">{product.size}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-[var(--color-primary)] text-sm">${product.price.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleToggleStock(product)}
                            className={`text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                              product.in_stock
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                          >
                            {product.in_stock ? 'In Stock' : 'Out'}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleToggleFeatured(product)}
                            className={`text-xl cursor-pointer transition-all hover:scale-110 ${product.featured ? 'opacity-100' : 'opacity-20 hover:opacity-50'}`}
                            title={product.featured ? 'Remove from featured' : 'Mark as featured'}
                          >
                            ⭐
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => { setEditingProduct(product); setShowAddModal(true); }}
                              className="p-2 text-gray-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-md transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ─── MOBILE CARDS ─── */}
              <div className="admin-product-cards divide-y divide-gray-100">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="p-4 flex gap-3">
                    <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-1">
                      {product.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" loading="lazy" decoding="async" />
                      ) : (
                        <span className="text-2xl">📦</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[var(--color-primary)] text-sm line-clamp-2 leading-tight">{product.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{product.category} · {product.size}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="font-bold text-[var(--color-primary)] text-sm">${product.price.toFixed(2)}</span>
                        <button
                          onClick={() => handleToggleStock(product)}
                          className={`text-[10px] font-semibold px-2 py-1 rounded-full transition-colors ${
                            product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {product.in_stock ? '✓ In Stock' : '✗ Out'}
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          className={`text-[10px] font-semibold px-2 py-1 rounded-full transition-colors ${
                            product.featured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {product.featured ? '⭐ Featured' : 'Not Featured'}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => { setEditingProduct(product); setShowAddModal(true); }}
                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-[var(--color-primary)] hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="p-12 text-center text-gray-400">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-sm">No products found matching your filters.</p>
                  <button onClick={() => { setSearchQuery(''); setFilterCategory(''); setStatFilter('all'); }} className="mt-3 text-sm text-[var(--color-primary)] hover:underline">
                    Clear all filters
                  </button>
                </div>
              )}
            </>
          )}

          {/* ─── Pagination ─── */}
          {totalPages > 1 && (
            <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-3 bg-gray-50/50">
              <span className="text-xs text-gray-400">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                {(() => {
                  const pages: (number | '...')[] = [];
                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    if (currentPage > 3) pages.push('...');
                    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                      pages.push(i);
                    }
                    if (currentPage < totalPages - 2) pages.push('...');
                    pages.push(totalPages);
                  }
                  return pages.map((p, idx) =>
                    p === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p as number)}
                        className={`w-8 h-8 text-sm rounded-md transition-colors ${
                          currentPage === p
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  );
                })()}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Add/Edit Modal ─── */}
      {showAddModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => { setShowAddModal(false); setEditingProduct(null); }}
          onSave={(saved) => {
            // Optimistic: update local state immediately
            if (editingProduct) {
              setProducts((prev) => prev.map((p) => p.id === saved.id ? saved : p));
            } else {
              setProducts((prev) => [saved, ...prev]);
            }
            setShowAddModal(false);
            setEditingProduct(null);
            showNotification('success', editingProduct ? 'Product updated!' : 'Product added!');
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PRODUCT MODAL
// ─────────────────────────────────────────────
function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (saved: Product) => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || '',
    price: product?.price?.toString() || '',
    category: product?.category || 'Beer',
    subcategory: product?.subcategory || '',
    country: product?.country || '',
    size: product?.size || '750ml',
    type: product?.type || '',
    description: product?.description || '',
    image_url: product?.image_url || '',
    in_stock: product?.in_stock ?? true,
    featured: product?.featured ?? false,
    is_new: product?.is_new ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const body = { ...form, price: parseFloat(form.price) };
      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const saved = await res.json();
        onSave(saved);
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.error || 'Failed to save product. Please try again.');
      }
    } catch {
      setError('Network error — please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-[var(--color-primary)]">
            {product ? '✏️ Edit Product' : '➕ Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Image Preview */}
          {form.image_url && !imageError && (
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.image_url}
                alt="Product preview"
                className="h-28 w-28 object-contain border border-gray-200 rounded-lg p-2 bg-gray-50"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Product Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                required
                placeholder="e.g. Johnnie Walker Black"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input-field"
                required
                placeholder="0.00"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field"
              >
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Subcategory — datalist dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Subcategory</label>
              <input
                type="text"
                list="subcategory-options"
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                className="input-field"
                placeholder="e.g. Lager, Red Wine, IPA"
              />
              <datalist id="subcategory-options">
                <option value="Lager" /><option value="Ale" /><option value="Stout" /><option value="IPA" />
                <option value="Pale Ale" /><option value="Wheat Beer" /><option value="Sour" />
                <option value="Red Wine" /><option value="White Wine" /><option value="Rosé" />
                <option value="Sparkling Wine" /><option value="Dessert Wine" />
                <option value="Scotch" /><option value="Bourbon" /><option value="Canadian Whisky" />
                <option value="Irish Whiskey" /><option value="Tennessee Whiskey" />
                <option value="Vodka" /><option value="Gin" /><option value="Rum" /><option value="Tequila" />
                <option value="Brandy" /><option value="Cognac" /><option value="Liqueur" />
                <option value="Cooler" /><option value="Cider" /><option value="Soda" /><option value="Juice" />
                <option value="Mixer" /><option value="Ice" /><option value="Gift Cards" />
              </datalist>
            </div>

            {/* Country — datalist dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Country</label>
              <input
                type="text"
                list="country-options"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="input-field"
                placeholder="e.g. Canada, France"
              />
              <datalist id="country-options">
                {COUNTRY_OPTIONS.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>

            {/* Size — datalist dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Size</label>
              <input
                type="text"
                list="size-options"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                className="input-field"
                placeholder="e.g. 750ml, 1.14L"
              />
              <datalist id="size-options">
                {SIZE_OPTIONS.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>

            {/* Type — datalist dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Type</label>
              <input
                type="text"
                list="type-options"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input-field"
                placeholder="e.g. Lager, Red, VSOP"
              />
              <datalist id="type-options">
                <option value="Lager" /><option value="Light Lager" /><option value="Pale Lager" />
                <option value="Ale" /><option value="Stout" /><option value="IPA" /><option value="Wheat" />
                <option value="Red" /><option value="White" /><option value="Rosé" /><option value="Sparkling" />
                <option value="Scotch" /><option value="Bourbon" /><option value="Canadian" /><option value="Irish" />
                <option value="Tennessee" /><option value="Blended" /><option value="Single Malt" />
                <option value="VS" /><option value="VSOP" /><option value="XO" />
                <option value="Reposado" /><option value="Blanco" /><option value="Añejo" />
                <option value="Dark Rum" /><option value="White Rum" /><option value="Spiced Rum" />
                <option value="London Dry" /><option value="Premium" /><option value="Cooler" />
                <option value="Cider" /><option value="Soda" /><option value="Juice" /><option value="Mixer" />
              </datalist>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field resize-none"
                rows={3}
                placeholder="Product description..."
              />
            </div>

            {/* Image URL */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Image URL</label>
              <input
                type="text"
                value={form.image_url}
                onChange={(e) => { setForm({ ...form, image_url: e.target.value }); setImageError(false); }}
                className="input-field"
                placeholder="https://... or /images/products/my-product.jpg"
              />
              {imageError && <p className="text-[11px] text-red-500 mt-1">⚠ Image URL could not be loaded — check the path.</p>}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100">
            {[
              { key: 'in_stock', label: 'In Stock', color: 'text-green-600' },
              { key: 'featured', label: 'Featured ⭐', color: 'text-amber-600' },
              { key: 'is_new', label: 'New Arrival 🆕', color: 'text-blue-600' },
            ].map(({ key, label, color }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[key as keyof typeof form] as boolean}
                  onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                  className="w-4 h-4 accent-[var(--color-primary)] cursor-pointer"
                />
                <span className={`text-sm font-medium ${color}`}>{label}</span>
              </label>
            ))}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-3 border-t border-gray-100">
            <button type="button" onClick={onClose} className="btn-outline flex-1 text-sm">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 text-sm" disabled={saving}>
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
