'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { STORE_INFO } from '@/lib/data';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          router.push('/products');
          return;
        }
        const data = await res.json();
        setProduct(data);

        // Fetch related products
        const relatedRes = await fetch(`/api/products?category=${encodeURIComponent(data.category)}`);
        const allRelated = await relatedRes.json();
        setRelated(allRelated.filter((p: Product) => p.id !== data.id).slice(0, 4));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return null; // Handled by redirect
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-[60px]">
      {/* Breadcrumb */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-[1060px] mx-auto px-4 md:px-[30px] pt-[20px] pb-[40px]">
          <nav className="flex items-center gap-2 text-[12px] font-display uppercase tracking-wider text-[var(--color-text-primary)]">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
            <span className="opacity-50">/</span>
            <Link href="/products" className="hover:text-[var(--color-primary)] transition-colors">Products</Link>
            <span className="opacity-50">/</span>
            <Link href={`/products?category=${product.category}`} className="hover:text-[var(--color-primary)] transition-colors">{product.category}</Link>
            <span className="opacity-50">/</span>
            <span className="text-[var(--color-primary)] truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1060px] mx-auto px-4 md:px-[30px] mt-[-20px] relative z-10">
        <div className="bg-white border border-[var(--color-border)] shadow-sm">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="relative bg-[var(--color-surface)] border-r border-b md:border-b-0 border-[var(--color-border)] p-8 md:p-12 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
              {product.is_new && (
                <span className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider">NEW</span>
              )}
              {!product.in_stock && (
                <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                  SOLD OUT
                </div>
              )}
              {product.image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center opacity-20 text-[var(--color-primary)]">
                  <svg className="w-32 h-32 md:w-48 md:h-48 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <p className="text-[12px] font-display uppercase tracking-widest mt-4">Product Image</p>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 md:p-10 lg:p-[60px] flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4 text-[12px] font-display uppercase tracking-widest text-[var(--color-text-primary)]">
                <span className="font-bold text-[var(--color-primary)]">{product.category}</span>
                <span className="opacity-50">•</span>
                <span>{product.subcategory}</span>
              </div>

              <h1 className="text-[24px] md:text-[32px] font-serif uppercase text-[var(--color-primary)] mb-[15px] leading-tight">
                {product.name}
              </h1>

              <p className="price-text text-[24px] md:text-[28px] mb-6">
                ${product.price.toFixed(2)}
              </p>

              <p className="text-[15px] text-[var(--color-text-primary)] leading-[1.6] mb-[40px]">
                {product.description}
              </p>

              {/* Product Details Grid */}
              <div className="grid grid-cols-2 gap-[15px] mb-[40px] pt-[30px] border-t border-[var(--color-border)]">
                <div>
                  <p className="text-[11px] font-display uppercase tracking-widest text-gray-400 mb-1">Country</p>
                  <p className="text-[14px] text-[var(--color-primary)]">{product.country}</p>
                </div>
                <div>
                  <p className="text-[11px] font-display uppercase tracking-widest text-gray-400 mb-1">Size</p>
                  <p className="text-[14px] text-[var(--color-primary)]">{product.size}</p>
                </div>
                <div>
                  <p className="text-[11px] font-display uppercase tracking-widest text-gray-400 mb-1">Type</p>
                  <p className="text-[14px] text-[var(--color-primary)]">{product.type}</p>
                </div>
              </div>

              {/* Order Buttons */}
              {product.in_stock ? (
                <div className="space-y-[15px]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center border border-[var(--color-border)] bg-[var(--color-surface)]">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-dark)]"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-medium text-[var(--color-text-primary)]">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-dark)]"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => addToCart(product, quantity)}
                      className="flex-1 bg-[var(--color-primary)] text-white py-3 px-6 font-display uppercase tracking-wider hover:bg-black transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a href={`tel:${STORE_INFO.phone}`} className="btn-call w-full text-[13px] py-[12px] text-center block">
                      📞 CALL TO ORDER
                    </a>
                    <a href={`mailto:${STORE_INFO.email}?subject=Inquiry about ${encodeURIComponent(product.name)}`} className="btn-primary w-full text-[13px] py-[12px] text-center block flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      EMAIL US
                    </a>
                  </div>
                  <p className="text-center text-[12px] mt-4 opacity-70 italic text-[var(--color-text-primary)]">
                    Local delivery and curbside pickup available.
                  </p>
                </div>
              ) : (
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-[30px] text-center">
                  <p className="text-black font-medium mb-3 uppercase tracking-wide text-[14px]">Currently Out of Stock</p>
                  <a href={`tel:${STORE_INFO.phone}`} className="text-[13px] text-[var(--color-primary)] hover:opacity-70 underline uppercase font-display font-medium tracking-wide">
                    Call us to check future availability
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-[60px] md:mt-[80px] pt-[40px] border-t border-[var(--color-border)]">
            <h2 className="text-[22px] md:text-[26px] font-serif uppercase text-[var(--color-primary)] text-center mb-[30px] tracking-wide">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[15px] md:gap-[30px]">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
