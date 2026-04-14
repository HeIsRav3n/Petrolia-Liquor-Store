'use client';

import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      className="product-card group relative flex flex-col h-full p-2"
      id={`product-${product.id}`}
    >
      {/* Badges */}
      {product.is_new && (
        <span className="badge-label absolute top-3 right-3 z-10">NEW</span>
      )}
      {!product.in_stock && (
        <span className="badge-label absolute top-3 left-3 z-10 !bg-black">SOLD OUT</span>
      )}

      {/* Image */}
      <Link
        href={`/products/${product.id}`}
        className="block mb-3 bg-[#fdfdfd] border border-[var(--color-border)] overflow-hidden rounded-sm"
      >
        <div className="relative aspect-square flex items-center justify-center overflow-hidden p-4">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.06]"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="opacity-10 group-hover:opacity-20 transition-opacity duration-300 flex flex-col items-center">
              <svg className="w-16 h-16 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="text-center px-1 flex flex-col flex-1">
        <div className="text-[11px] text-[var(--color-primary)] font-serif mb-1 italic opacity-75 capitalize">
          {product.category}
        </div>
        <Link href={`/products/${product.id}`} className="block flex-1">
          <h3 className="text-[13px] md:text-[14px] font-serif text-[var(--color-text-primary)] leading-tight mb-2 line-clamp-2 min-h-[36px] group-hover:text-[var(--color-primary)] transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="price-text mt-auto pt-1">
          ${product.price.toFixed(2)}
        </div>

        {/* Add to Cart — visible on mobile too */}
        {product.in_stock && (
          <>
            {/* Desktop: hover overlay */}
            <div className="hidden md:block absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleAddToCart}
                className="w-full bg-[var(--color-primary)] text-white py-2.5 text-[12px] font-display uppercase tracking-wider hover:bg-black transition-colors rounded-sm"
              >
                Add to Cart
              </button>
            </div>

            {/* Mobile: always visible compact button */}
            <button
              onClick={handleAddToCart}
              className="md:hidden mt-3 w-full bg-[var(--color-primary)] text-white py-2.5 text-[11px] font-display uppercase tracking-wider active:bg-black transition-colors rounded-sm"
            >
              + Add to Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
}
