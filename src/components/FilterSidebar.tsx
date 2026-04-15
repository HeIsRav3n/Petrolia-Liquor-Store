'use client';

interface FilterSidebarProps {
  filters: {
    category: string;
    subcategory: string;
    country: string;
    size: string;
    type: string;
    sort: string;
  };
  onFilterChange: (key: string, value: string) => void;
  categories: string[];
  countries: string[];
  sizes: string[];
  types: string[];
  productCount: number;
}

// Sort sizes intelligently: ml first (ascending), then L (ascending)
function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const parseSize = (s: string) => {
      const ml = s.match(/^([\d.]+)ml$/i);
      if (ml) return parseFloat(ml[1]);
      const l = s.match(/^([\d.]+)L$/i);
      if (l) return parseFloat(l[1]) * 1000;
      const pack = s.match(/^[\d.]+ml\s*x\s*([\d]+)$/i);
      if (pack) return 999999; // packs go last
      return 999998;
    };
    return parseSize(a) - parseSize(b);
  });
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  categories,
  countries,
  sizes,
  types,
  productCount,
}: FilterSidebarProps) {
  const hasActiveFilters = filters.category || filters.subcategory || filters.country || filters.size || filters.type;
  const sortedSizes = sortSizes(sizes);
  const hasCountries = countries.filter(Boolean).length > 0;

  const clearFilters = () => {
    onFilterChange('category', '');
    onFilterChange('subcategory', '');
    onFilterChange('country', '');
    onFilterChange('size', '');
    onFilterChange('type', '');
  };

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden sticky top-24">
        {/* Header */}
        <div className="p-4 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[var(--color-primary)] flex items-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </h3>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-[var(--color-primary)] hover:underline font-medium">
                Clear All
              </button>
            )}
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">{productCount} products found</p>
        </div>

        <div className="p-4 space-y-5">
          {/* Sort */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Sort By</label>
            <select
              value={filters.sort || ''}
              onChange={(e) => onFilterChange('sort', e.target.value)}
              className="input-field text-sm py-2"
            >
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A – Z</option>
              <option value="name-desc">Name: Z – A</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Category</label>
            <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1">
              <button
                onClick={() => { onFilterChange('category', ''); onFilterChange('subcategory', ''); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  !filters.category ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { onFilterChange('category', cat); onFilterChange('subcategory', ''); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.category === cat
                      ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Country — only shown when data exists */}
          {hasCountries && (
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Country</label>
              <select
                value={filters.country}
                onChange={(e) => onFilterChange('country', e.target.value)}
                className="input-field text-sm py-2"
              >
                <option value="">All Countries</option>
                {countries.filter(Boolean).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {/* Size */}
          {sortedSizes.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Size</label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => onFilterChange('size', '')}
                  className={`filter-btn text-xs ${!filters.size ? 'filter-btn-active' : ''}`}
                >
                  All
                </button>
                {sortedSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => onFilterChange('size', s)}
                    className={`filter-btn text-xs ${filters.size === s ? 'filter-btn-active' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Type */}
          {types.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => onFilterChange('type', e.target.value)}
                className="input-field text-sm py-2"
              >
                <option value="">All Types</option>
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
