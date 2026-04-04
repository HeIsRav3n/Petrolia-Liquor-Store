'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/types';


const ADMIN_PASSWORD = 'petrolia2024';

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }, []);

  // Handle authentication state carefully to avoid react-hooks/set-state-in-effect
  useEffect(() => {
    const checkAuth = () => {
      const stored = sessionStorage.getItem('admin-auth');
      if (stored === 'true') {
        setAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated) {
      const loadProducts = async () => {
        await fetchProducts();
      };
      loadProducts();
    }
  }, [authenticated, fetchProducts]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem('admin-auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem('admin-auth');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showNotification('success', 'Product deleted successfully');
      fetchProducts();
    } else {
      showNotification('error', 'Failed to delete product');
    }
  };

  const handleToggleStock = async (product: Product) => {
    const res = await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ in_stock: !product.in_stock }),
    });
    if (res.ok) {
      showNotification('success', `${product.name} marked as ${!product.in_stock ? 'in stock' : 'out of stock'}`);
      fetchProducts();
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    const res = await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !product.featured }),
    });
    if (res.ok) {
      showNotification('success', `${product.name} ${!product.featured ? 'marked as featured' : 'removed from featured'}`);
      fetchProducts();
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryOptions = [...new Set(products.map((p) => p.category))].sort();
  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.in_stock).length,
    outOfStock: products.filter((p) => !p.in_stock).length,
    featured: products.filter((p) => p.featured).length,
  };

  // === LOGIN SCREEN ===
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
        <div className="bg-[var(--color-surface)] rounded-sm border border-[var(--color-border)] p-8 max-w-md w-full animate-scale-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>Admin Portal</h1>
            <p className="text-text-secondary text-sm mt-1">Enter your password to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="input-field text-center text-lg"
                autoFocus
              />
              {authError && (
                <p className="text-red-500 text-sm text-center mt-2">{authError}</p>
              )}
            </div>
            <button type="submit" className="btn-primary w-full text-lg py-4">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // === ADMIN DASHBOARD ===
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg animate-slide-up ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Admin Header */}
      <header className="bg-white border-b border-border/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo.png" alt="Petrolia Liquor Store" className="h-10 w-auto" />
              </div>
            <div>
              <h1 className="font-bold text-primary text-lg" style={{ fontFamily: 'var(--font-heading)' }}>Admin Dashboard</h1>
              <p className="text-xs text-text-light">Petrolia Liquor Store</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-sm text-text-secondary hover:text-accent transition-colors">
              View Site →
            </a>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: stats.total, color: 'bg-blue-500', icon: '📦' },
            { label: 'In Stock', value: stats.inStock, color: 'bg-green-500', icon: '✅' },
            { label: 'Out of Stock', value: stats.outOfStock, color: 'bg-red-500', icon: '❌' },
            { label: 'Featured', value: stats.featured, color: 'bg-amber-500', icon: '⭐' },
          ].map((stat) => (
            <div key={stat.label} className="admin-card flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-text-secondary">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="admin-card mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10 w-full"
                />
                <svg className="w-5 h-5 text-text-light absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input-field w-full sm:w-[200px]"
              >
                <option value="">All Categories</option>
                <option value="Beer">Beer</option>
                <option value="Wine">Wine</option>
                <option value="Whisky">Whisky</option>
                <option value="Vodka">Vodka</option>
                <option value="Gin">Gin</option>
                <option value="Rum">Rum</option>
                <option value="Tequila">Tequila</option>
                <option value="Spirits">Spirits</option>
                <option value="Coolers & Ciders">Coolers & Ciders</option>
              </select>
            </div>
            <button
              onClick={() => { setEditingProduct(null); setShowAddModal(true); }}
              className="btn-primary flex items-center gap-2 whitespace-nowrap w-full md:w-auto justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="admin-card overflow-hidden p-0">
          <div className="bg-surface px-4 py-3 border-b border-border/50 flex justify-between items-center">
            <h2 className="font-semibold text-primary">Inventory ({filteredProducts.length} items)</h2>
          </div>
          {loading ? (
            <div className="p-12 text-center text-text-secondary">Loading products...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface border-b border-border/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Product</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Price</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Stock</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden sm:table-cell">Featured</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-white border border-border/50 flex items-center justify-center shrink-0 overflow-hidden p-1">
                            {product.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={product.image_url} alt={product.name || 'Product image'} className="w-full h-full object-contain" />
                  ) : (
                              <span className="text-xl">📦</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-primary line-clamp-2">{product.name}</p>
                            <p className="text-xs text-text-secondary mt-0.5">{product.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-primary">${product.price.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleStock(product)}
                          className={`text-xs font-medium px-3 py-1 rounded-full transition-colors cursor-pointer ${
                            product.in_stock
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {product.in_stock ? 'In Stock' : 'Out'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          className={`text-lg cursor-pointer transition-transform hover:scale-125 ${product.featured ? '' : 'opacity-30'}`}
                        >
                          ⭐
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setEditingProduct(product); setShowAddModal(true); }}
                            className="p-2 text-text-secondary hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
              {filteredProducts.length === 0 && (
                <div className="p-12 text-center text-text-secondary">
                  No products found matching your search.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => { setShowAddModal(false); setEditingProduct(null); }}
          onSave={() => { fetchProducts(); setShowAddModal(false); setEditingProduct(null); showNotification('success', editingProduct ? 'Product updated!' : 'Product added!'); }}
        />
      )}
    </div>
  );
}

// === PRODUCT MODAL COMPONENT ===
function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: () => void;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const body = {
      ...form,
      price: parseFloat(form.price),
    };

    const url = product ? `/api/products/${product.id}` : '/api/products';
    const method = product ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      onSave();
    }
    setSaving(false);
  };

  const categoryOptions = ['Beer', 'Wine', 'Whisky', 'Vodka', 'Rum', 'Tequila', 'Gin', 'Coolers', 'Liqueur'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[var(--color-surface)] rounded-sm shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in border border-[var(--color-border)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-surface rounded-lg transition-colors">
            <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Product Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field"
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Subcategory</label>
              <input
                type="text"
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                className="input-field"
                placeholder="e.g., Red Wine, IPA"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Country</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="input-field"
                placeholder="e.g., Canada, France"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Size</label>
              <input
                type="text"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                className="input-field"
                placeholder="e.g., 750ml, 355ml x 24"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Type</label>
              <input
                type="text"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input-field"
                placeholder="e.g., Lager, Red, Premium"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Product description..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Image URL</label>
              <input
                type="text"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className="input-field"
                placeholder="/images/products/my-product.jpg"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.in_stock}
                onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                className="w-4 h-4 text-accent rounded border-border focus:ring-accent"
              />
              <span className="text-sm text-text-secondary">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 text-accent rounded border-border focus:ring-accent"
              />
              <span className="text-sm text-text-secondary">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_new}
                onChange={(e) => setForm({ ...form, is_new: e.target.checked })}
                className="w-4 h-4 text-accent rounded border-border focus:ring-accent"
              />
              <span className="text-sm text-text-secondary">New Arrival</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4 border-t border-border/50">
            <button type="button" onClick={onClose} className="btn-outline flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
