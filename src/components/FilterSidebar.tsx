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

  const clearFilters = () => {
    onFilterChange('category', '');
    onFilterChange('subcategory', '');
    onFilterChange('country', '');
    onFilterChange('size', '');
    onFilterChange('type', '');
  };

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden sticky top-24">
        {/* Header */}
        <div className="p-4 bg-surface border-b border-border/50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-primary flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </h3>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-accent hover:text-accent-hover font-medium">
                Clear All
              </button>
            )}
          </div>
          <p className="text-xs text-text-light mt-1">{productCount} products found</p>
        </div>

        <div className="p-4 space-y-5">
          {/* Sort */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Sort By</label>
            <select
              value={filters.sort || ''}
              onChange={(e) => onFilterChange('sort', e.target.value)}
              className="input-field text-sm py-2"
            >
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A - Z</option>
              <option value="name-desc">Name: Z - A</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Category</label>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              <button
                onClick={() => { onFilterChange('category', ''); onFilterChange('subcategory', ''); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  !filters.category ? 'bg-accent/10 text-accent font-medium' : 'text-text-secondary hover:bg-surface'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { onFilterChange('category', cat); onFilterChange('subcategory', ''); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.category === cat ? 'bg-accent/10 text-accent font-medium' : 'text-text-secondary hover:bg-surface'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Country</label>
            <select
              value={filters.country}
              onChange={(e) => onFilterChange('country', e.target.value)}
              className="input-field text-sm py-2"
            >
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Size</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => onFilterChange('size', '')}
                className={`filter-btn text-xs ${!filters.size ? 'filter-btn-active' : ''}`}
              >
                All
              </button>
              {sizes.map((s) => (
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

          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Type</label>
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
        </div>
      </div>
    </aside>
  );
}
