'use client';

import { useState } from 'react';

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

function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const parseSize = (s: string) => {
      const ml = s.match(/^([\d.]+)\s*ml$/i);
      if (ml) return parseFloat(ml[1]);
      const l = s.match(/^([\d.]+)\s*L$/i);
      if (l) return parseFloat(l[1]) * 1000;
      return 999999;
    };
    return parseSize(a) - parseSize(b);
  });
}

function CollapseSection({
  title,
  children,
  defaultOpen = true,
  activeCount,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  activeCount?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[var(--color-border)] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 px-1 text-left hover:text-[var(--color-primary)] transition-colors group"
        type="button"
      >
        <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider group-hover:text-[var(--color-primary)] transition-colors flex items-center gap-2">
          {title}
          {activeCount ? (
            <span className="w-4 h-4 bg-[var(--color-primary)] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
              {activeCount}
            </span>
          ) : null}
        </span>
        <svg
          className={`w-4 h-4 text-[var(--color-text-secondary)] transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
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
  const hasActiveFilters =
    filters.category || filters.subcategory || filters.country || filters.size || filters.type;
  const sortedSizes = sortSizes(sizes);
  const validCountries = countries.filter(Boolean).sort();

  const clearFilters = () => {
    onFilterChange('category', '');
    onFilterChange('subcategory', '');
    onFilterChange('country', '');
    onFilterChange('size', '');
    onFilterChange('type', '');
  };

  return (
    <aside className="w-full lg:w-[240px] xl:w-[260px] shrink-0">
      <div className="bg-white rounded-lg border border-[var(--color-border)] shadow-sm sticky top-24">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="font-semibold text-[var(--color-primary)] text-sm">Filters</span>
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-[11px] text-[var(--color-primary)] hover:underline font-medium">
              Clear all
            </button>
          )}
        </div>
        <p className="text-[11px] text-[var(--color-text-secondary)] px-4 py-2 border-b border-[var(--color-border)]">
          {productCount.toLocaleString()} products found
        </p>

        <div className="px-4 divide-y divide-[var(--color-border)]">
          {/* Sort */}
          <CollapseSection title="Sort By" defaultOpen={true}>
            <select
              value={filters.sort || ''}
              onChange={(e) => onFilterChange('sort', e.target.value)}
              className="input-field text-sm py-2 w-full"
            >
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A – Z</option>
              <option value="name-desc">Name: Z – A</option>
              <option value="newest">Newest First</option>
            </select>
          </CollapseSection>

          {/* Category */}
          <CollapseSection
            title="Category"
            defaultOpen={true}
            activeCount={filters.category ? 1 : 0}
          >
            <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1">
              <button
                onClick={() => { onFilterChange('category', ''); onFilterChange('subcategory', ''); }}
                className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                  !filters.category
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { onFilterChange('category', cat); onFilterChange('subcategory', ''); }}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                    filters.category === cat
                      ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </CollapseSection>

          {/* Country */}
          {validCountries.length > 0 && (
            <CollapseSection
              title="Country"
              defaultOpen={false}
              activeCount={filters.country ? 1 : 0}
            >
              <select
                value={filters.country}
                onChange={(e) => onFilterChange('country', e.target.value)}
                className="input-field text-sm py-2 w-full"
              >
                <option value="">All Countries</option>
                {validCountries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </CollapseSection>
          )}

          {/* Size */}
          {sortedSizes.length > 0 && (
            <CollapseSection
              title="Size"
              defaultOpen={false}
              activeCount={filters.size ? 1 : 0}
            >
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  onClick={() => onFilterChange('size', '')}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                    !filters.size
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  All
                </button>
                {sortedSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => onFilterChange('size', s)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      filters.size === s
                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                        : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </CollapseSection>
          )}

          {/* Type */}
          {types.length > 0 && (
            <CollapseSection
              title="Type"
              defaultOpen={false}
              activeCount={filters.type ? 1 : 0}
            >
              <select
                value={filters.type}
                onChange={(e) => onFilterChange('type', e.target.value)}
                className="input-field text-sm py-2 w-full"
              >
                <option value="">All Types</option>
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </CollapseSection>
          )}
        </div>
      </div>
    </aside>
  );
}
