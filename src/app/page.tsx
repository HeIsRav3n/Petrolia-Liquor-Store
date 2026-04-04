'use client';

import Link from 'next/link';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { useState, useEffect } from 'react';

export default function Home() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [dontForgetProducts, setDontForgetProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [featuredRes, miscRes] = await Promise.all([
          fetch('/api/products?featured=true'),
          fetch('/api/products?is_miscellaneous=true'),
          fetch('/api/products?is_petrolia_pick=true')
        ]);
        
        const featuredData = await featuredRes.json();
        const miscData = await miscRes.json();

        setBestSellers(featuredData.slice(0, 4));
        setDontForgetProducts(miscData.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="bg-[var(--color-background)]">
      <Hero />

      <main className="max-w-[1280px] mx-auto px-4 md:px-[40px] py-[40px]">
        
        {/* SHOP FOR SECTION */}
        <section className="mb-[60px]">
          <div className="flex justify-between items-end mb-[20px] border-b border-[var(--color-border)] pb-2">
            <h2 className="text-[18px] md:text-[22px] font-serif uppercase text-[var(--color-primary)] tracking-wider">
              SHOP FOR
            </h2>
            <Link href="/products" className="text-[12px] text-[var(--color-primary)] hover:underline">More categories ›</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
            {/* New Arrivals Card */}
            <Link href="/products?sort=newest" className="group block relative border border-[var(--color-border)] p-16 md:p-24 bg-[var(--color-surface)] text-center hover:shadow-lg transition-shadow">
              <div className="font-serif italic text-[36px] md:text-[48px] text-[var(--color-text-primary)] mb-4">New Arrivals</div>
              <div className="text-[12px] md:text-[14px] text-[var(--color-primary)] uppercase tracking-[0.2em] opacity-80">New Arrivals</div>
            </Link>
            
            {/* Petrolia Picks Card */}
            <Link href="/products?featured=true" className="group block relative border border-[var(--color-border)] p-16 md:p-24 bg-[var(--color-surface)] text-center hover:shadow-lg transition-shadow">
              <div className="font-serif italic text-[36px] md:text-[48px] text-[var(--color-text-primary)] mb-4">Petrolia Picks</div>
              <div className="text-[12px] md:text-[14px] text-[var(--color-primary)] uppercase tracking-[0.2em] opacity-80">Petrolia Picks</div>
            </Link>
          </div>
        </section>

        {/* BEST SELLERS SECTION */}
        <section className="mb-[60px]">
          <div className="flex justify-between items-end mb-[20px] border-b border-[var(--color-border)] pb-2">
            <h2 className="text-[18px] md:text-[22px] font-serif uppercase text-[var(--color-primary)] tracking-wider">
              BEST SELLERS
            </h2>
            <Link href="/products?featured=true" className="text-[12px] text-[var(--color-primary)] hover:underline">More best selling ›</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[20px] md:gap-[30px]">
            {bestSellers.slice(0,4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* DONT FORGET THESE SECTION */}
        <section className="mb-[60px]">
          <div className="flex justify-between items-end mb-[20px] border-b border-[var(--color-border)] pb-2">
            <h2 className="text-[18px] md:text-[22px] font-serif uppercase text-[var(--color-primary)] tracking-wider">
              DON&apos;T FORGET THESE
            </h2>
            <Link href="/category/miscellaneous" className="text-[12px] text-[var(--color-primary)] hover:underline">More miscellaneous ›</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[15px] md:gap-[25px]">
            {dontForgetProducts.slice(0,4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* STORE INFO & LOGO SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-[40px] items-center py-[40px] border-t border-[var(--color-border)]">
          {/* Info Box */}
          <div className="bg-[var(--color-surface)] p-8 md:p-12 text-center rounded-sm">
            <div className="font-serif italic text-[32px] md:text-[40px] text-[var(--color-primary)] mb-6">
              Subscribe to Our Newsletter
            </div>
            <p className="text-[14px] text-[var(--color-text-secondary)] mb-8">
              Get the latest updates on new arrivals, special promotions, and exclusive events.
            </p>
            <form className="flex w-full max-w-md mx-auto h-[48px]">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="flex-1 px-4 py-2 border border-r-0 border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-primary)] focus:outline-none focus:border-gray-400 min-w-0" 
              />
              <button 
                type="button" 
                className="bg-[var(--color-primary)] text-white px-6 uppercase font-display text-sm font-bold tracking-wider hover:bg-[var(--color-primary-dark)] transition-colors whitespace-nowrap shrink-0"
              >
                SIGN UP
              </button>
            </form>
          </div>

          {/* Balanced Logo Block */}
          <div className="flex justify-center bg-[var(--color-surface)] p-8 md:p-12 rounded-sm h-full items-center">
             <div className="w-[300px] md:w-[500px] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/logo.png" 
                  alt="Petrolia Liquor Store" 
                  className="w-full h-auto object-contain mix-blend-multiply bg-transparent" 
                />
             </div>
          </div>
        </section>

      </main>
    </div>
  );
}
