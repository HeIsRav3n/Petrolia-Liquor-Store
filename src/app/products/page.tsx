'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import { Product } from '@/lib/types';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    country: searchParams.get('country') || '',
    size: '',
    type: '',
    sort: searchParams.get('sort') || '',
    search: searchParams.get('search') || '',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set('category', filters.category);
      if (filters.subcategory) params.set('subcategory', filters.subcategory);
      if (filters.country) params.set('country', filters.country);
      if (filters.size) params.set('size', filters.size);
      if (filters.type) params.set('type', filters.type);
      if (filters.search) params.set('search', filters.search);
      if (filters.sort) params.set('sort', filters.sort);
      if (searchParams.get('featured') === 'true') params.set('featured', 'true');
      if (searchParams.get('is_miscellaneous') === 'true') params.set('is_miscellaneous', 'true');

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch ALL products once on mount for full filter sidebar options
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setAllProducts(Array.isArray(data) ? data : []))
      .catch(() => setAllProducts([]));
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const categoryOptions = [...new Set(allProducts.map((p) => p.category))].sort();
  const countryOptions = [...new Set(allProducts.map((p) => p.country))].sort();
  const sizeOptions = [...new Set(allProducts.map((p) => p.size))].sort();
  const typeOptions = [...new Set(allProducts.map((p) => p.type))].sort();

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-[60px]">
      {/* Header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="max-w-[1060px] mx-auto px-4 md:px-[30px] py-[30px] md:py-[45px]">
          <h1 className="text-[2em] md:text-[2.5em] font-serif uppercase text-[var(--color-primary)] mb-[10px]">
            {filters.subcategory
              ? `${filters.category || 'Products'} ${filters.subcategory}`
              : filters.country && filters.category
              ? `${filters.category} ${filters.country}`
              : filters.category || 'All Products'}
          </h1>
          <p className="text-[16px] text-[var(--color-text-primary)]">
            {filters.search
              ? `Search results for "${filters.search}"`
              : 'Browse our full collection of premium beverages'}
          </p>
        </div>
      </div>

      <div className="max-w-[1060px] mx-auto px-4 md:px-[30px] mt-[30px] md:mt-[45px]">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="lg:hidden mb-[20px] btn-outline w-full text-[13px]"
        >
          {mobileFiltersOpen ? 'HIDE FILTERS' : 'SHOW FILTERS'}
        </button>

        <div className="flex flex-col lg:flex-row gap-[30px]">
          {/* Sidebar */}
          <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block w-full lg:w-[250px] shrink-0`}>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categoryOptions}
              countries={countryOptions}
              sizes={sizeOptions}
              types={typeOptions}
              productCount={products.length}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[15px] md:gap-[30px]">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-sm border border-[var(--color-border)] overflow-hidden animate-pulse mb-[30px]">
                    <div className="aspect-square bg-[var(--color-surface)]" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-[var(--color-surface)] rounded w-1/3" />
                      <div className="h-4 bg-[var(--color-surface)] rounded w-3/4" />
                      <div className="h-5 bg-[var(--color-surface)] rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 border border-[var(--color-border)] rounded-sm bg-[var(--color-surface)]">
                <h3 className="text-lg font-serif uppercase text-[var(--color-primary)] mb-2">No products found</h3>
                <p className="text-[var(--color-text-primary)]">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[15px] md:gap-[30px]">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center"><p className="font-display text-[var(--color-text-primary)]">Loading...</p></div>}>
      <ProductsContent />
    </Suspense>
  );
}
