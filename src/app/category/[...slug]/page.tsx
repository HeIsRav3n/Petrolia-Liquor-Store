'use client';

import { useState, useEffect, useCallback, use } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import Link from 'next/link';

const categoryMap: Record<string, Record<string, { field: keyof Product; value: string }>> = {
  beer: {
    ale: { field: "subcategory", value: "ale" },
    cider: { field: "subcategory", value: "cider" },
    ipa: { field: "subcategory", value: "ipa" },
    lager: { field: "subcategory", value: "lager" }
  },
  coolers: {
    caesars: { field: "subcategory", value: "caesars" },
    seltzers: { field: "subcategory", value: "seltzers" },
    sodas: { field: "subcategory", value: "sodas" },
    teas: { field: "subcategory", value: "teas" }
  },
  wine: {
    argentina: { field: "country", value: "argentina" },
    australia: { field: "country", value: "australia" },
    brazil: { field: "country", value: "brazil" },
    canada: { field: "country", value: "canada" },
    chile: { field: "country", value: "chile" },
    france: { field: "country", value: "france" },
    germany: { field: "country", value: "germany" },
    greece: { field: "country", value: "greece" },
    hungary: { field: "country", value: "hungary" },
    italy: { field: "country", value: "italy" },
    japan: { field: "country", value: "japan" },
    korea: { field: "country", value: "korea" },
    montenegro: { field: "country", value: "montenegro" },
    "new-zealand": { field: "country", value: "new zealand" },
    portugal: { field: "country", value: "portugal" },
    "republic-of-moldova": { field: "country", value: "republic of moldova" },
    "south-africa": { field: "country", value: "south africa" },
    spain: { field: "country", value: "spain" },
    usa: { field: "country", value: "usa" }
  },
  whisky: {
    bourbon: { field: "subcategory", value: "bourbon" },
    rye: { field: "subcategory", value: "rye" },
    scotch: { field: "subcategory", value: "scotch" }
  }
};

export default function CategoryPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = use(params);
  const slugArray = resolvedParams.slug;
  const mainCategoryRaw = slugArray[0] ? decodeURIComponent(slugArray[0]).toLowerCase().trim() : '';
  const subCategoryRaw = slugArray[1] ? decodeURIComponent(slugArray[1]).toLowerCase().trim() : '';

  // Handle differences in naming between URL slugs and CSV data
  let mainCategory = mainCategoryRaw.replace(/-/g, ' ');
  if (mainCategory === 'coolers' || mainCategory === 'ready to drink') {
    mainCategory = 'coolers & ciders';
  } else if (mainCategory === 'whisky' || mainCategory === 'whiskey') {
    mainCategory = 'whisky';
  }
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data: Product[] = await res.json();
      
      const filtered = data.filter(product => {
        // Normalize CSV fields
        const pCategory = (product.category || "").toLowerCase().trim();
        const pSubcategory = (product.subcategory || "").toLowerCase().trim();
        const pCountry = (product.country || "").toLowerCase().trim();
        const pDesc = (product.description || "").toLowerCase().trim();
        const pName = (product.name || "").toLowerCase().trim();

        const pType = (product.type || "").toLowerCase().trim();

        // Enforce main category guard ALWAYS to prevent mixing (e.g. beer showing in wine)
        let mainMatch = pCategory === mainCategory || pType === mainCategory;
        
        // Special case for 'miscellaneous', 'vodka', 'rum', 'tequila', etc.
        // that don't have subcategories in our map
        if (!mainMatch && mainCategory) {
           mainMatch = pCategory.includes(mainCategory) || pType.includes(mainCategory);
        }

        if (!mainMatch) return false;

        // If no subcategory is provided (e.g., /category/wine) or it's 'all-...', return everything in main
        if (!subCategoryRaw || subCategoryRaw.startsWith('all-')) {
          return true;
        }

        // Check strict mapping
        const rule = categoryMap[mainCategoryRaw]?.[subCategoryRaw];
        
        if (rule) {
           const fieldValue = (product[rule.field] as string || "").toLowerCase().trim();
           if (fieldValue === rule.value) return true;
        }

        // Auto-Fallback (Smart Fix): If strict match returns empty or rule doesn't exist, try fallback
        // Since CSV sometimes buries data in description/name, check there too.
        if (
          pSubcategory.includes(subCategoryRaw.replace(/-/g, ' ')) ||
          pCountry.includes(subCategoryRaw.replace(/-/g, ' ')) ||
          pName.includes(subCategoryRaw.replace(/-/g, ' ')) ||
          pDesc.includes(subCategoryRaw.replace(/-/g, ' '))
        ) {
          return true;
        }

        return false;
      });

      console.log("Selected:", mainCategory, subCategoryRaw);
      console.log("Filtered Results:", filtered);

      setProducts(filtered);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [mainCategory, mainCategoryRaw, subCategoryRaw]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const displayTitle = subCategoryRaw && !subCategoryRaw.startsWith('all-')
    ? `${mainCategoryRaw.replace(/-/g, ' ')} ${subCategoryRaw.replace(/-/g, ' ')}`
    : mainCategoryRaw.replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-[60px]">
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="max-w-[1060px] mx-auto px-4 md:px-[30px] py-[30px] md:py-[45px]">
          <h1 className="text-[2em] md:text-[2.5em] font-serif uppercase text-[var(--color-primary)] mb-[10px]">
            {displayTitle}
          </h1>
          <p className="text-[16px] text-[var(--color-text-primary)]">
            Explore our selection of {displayTitle}
          </p>
        </div>
      </div>

      <div className="max-w-[1060px] mx-auto px-4 md:px-[30px] mt-[30px] md:mt-[45px]">
        <div className="mb-6">
          <Link href="/products" className="text-[var(--color-primary)] hover:underline text-sm font-medium">
            ← Back to All Products
          </Link>
        </div>

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
              <p className="text-[var(--color-text-primary)]">Try adjusting your category selection.</p>
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
  );
}
