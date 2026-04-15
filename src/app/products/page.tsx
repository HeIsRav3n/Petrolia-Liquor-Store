'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import { Product } from '@/lib/types';

const PAGE_SIZE = 24;

// Declared outside component — avoids "component created during render" lint error
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[15px] md:gap-[25px]">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-sm border border-[var(--color-border)] overflow-hidden animate-pulse">
          <div className="aspect-square bg-[var(--color-surface)]" />
          <div className="p-4 space-y-3">
            <div className="h-3 bg-[var(--color-surface)] rounded w-1/3" />
            <div className="h-4 bg-[var(--color-surface)] rounded w-3/4" />
            <div className="h-5 bg-[var(--color-surface)] rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    country: searchParams.get('country') || '',
    size: '',
    type: '',
    sort: searchParams.get('sort') || '',
    search: searchParams.get('search') || '',
  });

  // Single fetch — all products once, then filter client-side
  useEffect(() => {
    setLoading(true);
    fetch('/api/products', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => setAllProducts(Array.isArray(data) ? data : []))
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // Sync URL search params → filter state (on first load)
  useEffect(() => {
    const featured = searchParams.get('featured') === 'true';
    const isNew = searchParams.get('is_new') === 'true';
    if (featured) {
      setFilters((f) => ({ ...f, _featured: 'true' } as typeof f & { _featured: string }));
    }
    if (isNew) {
      setFilters((f) => ({ ...f, _is_new: 'true' } as typeof f & { _is_new: string }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  // Client-side filtering — no extra network calls
  const filteredProducts = useMemo(() => {
    let result = allProducts;

    const featured = searchParams.get('featured') === 'true';
    const isNew = searchParams.get('is_new') === 'true';

    if (featured) result = result.filter((p) => p.featured);
    if (isNew) result = result.filter((p) => p.is_new);
    if (filters.category) {
      result = result.filter((p) => p.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.subcategory) {
      result = result.filter((p) => p.subcategory.toLowerCase() === filters.subcategory.toLowerCase());
    }
    if (filters.country) {
      result = result.filter((p) => p.country.toLowerCase() === filters.country.toLowerCase());
    }
    if (filters.size) {
      result = result.filter((p) => p.size.toLowerCase() === filters.size.toLowerCase());
    }
    if (filters.type) {
      result = result.filter((p) => p.type.toLowerCase() === filters.type.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (filters.sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    else if (filters.sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    else if (filters.sort === 'name-asc') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    else if (filters.sort === 'name-desc') result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    else if (filters.sort === 'newest') {
      result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [allProducts, filters, searchParams]);

  // Paginate results
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageProducts = filteredProducts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Sidebar options derived from full dataset
  const categoryOptions = useMemo(() => [...new Set(allProducts.map((p) => p.category))].sort(), [allProducts]);
  const countryOptions = useMemo(() => [...new Set(allProducts.map((p) => p.country).filter(Boolean))].sort(), [allProducts]);
  const sizeOptions = useMemo(() => [...new Set(allProducts.map((p) => p.size).filter(Boolean))].sort(), [allProducts]);
  const typeOptions = useMemo(() => [...new Set(allProducts.map((p) => p.type).filter(Boolean))].sort(), [allProducts]);

  const pageTitle = filters.subcategory
    ? `${filters.category || 'Products'} ${filters.subcategory}`
    : filters.country && filters.category
    ? `${filters.category} — ${filters.country}`
    : filters.category || 'All Products';

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-[60px]">
      {/* Header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="max-w-[1060px] mx-auto px-4 md:px-[30px] py-[30px] md:py-[45px]">
          <h1 className="text-[2em] md:text-[2.5em] font-serif uppercase text-[var(--color-primary)] mb-[10px]">
            {pageTitle}
          </h1>
          <p className="text-[16px] text-[var(--color-text-primary)]">
            {filters.search
              ? `Search results for "${filters.search}"`
              : `Browse our full collection of premium beverages`}
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
              productCount={filteredProducts.length}
            />
          </div>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <SkeletonGrid />
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 border border-[var(--color-border)] rounded-sm bg-[var(--color-surface)]">
                <h3 className="text-lg font-serif uppercase text-[var(--color-primary)] mb-2">No products found</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <>
                {/* Results count */}
                <p className="text-[12px] text-[var(--color-text-secondary)] mb-4">
                  Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredProducts.length)} of {filteredProducts.length} products
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[15px] md:gap-[25px]">
                  {pageProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-[40px] flex items-center justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={safePage === 1}
                      className="px-4 py-2 text-sm border border-[var(--color-border)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-sm"
                    >
                      ← Prev
                    </button>

                    {(() => {
                      const pages: (number | '...')[] = [];
                      if (totalPages <= 7) {
                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                      } else {
                        pages.push(1);
                        if (safePage > 3) pages.push('...');
                        for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i);
                        if (safePage < totalPages - 2) pages.push('...');
                        pages.push(totalPages);
                      }
                      return pages.map((p, idx) =>
                        p === '...' ? (
                          <span key={`e${idx}`} className="px-2 text-[var(--color-text-secondary)] text-sm">…</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => { setPage(p as number); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className={`w-9 h-9 text-sm rounded-sm transition-colors border ${
                              safePage === p
                                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                                : 'border-[var(--color-border)] hover:bg-[var(--color-surface)]'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      );
                    })()}

                    <button
                      onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={safePage === totalPages}
                      className="px-4 py-2 text-sm border border-[var(--color-border)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-sm"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
