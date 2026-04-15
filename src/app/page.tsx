'use client';

import Link from 'next/link';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { useState, useEffect } from 'react';

// Declared outside component — avoids "component created during render" lint error
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-[15px] md:gap-[25px]">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="aspect-[3/4] bg-[var(--color-surface)] animate-pulse rounded-sm" />
      ))}
    </div>
  );
}

export default function Home() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [dontForgetProducts, setDontForgetProducts] = useState<Product[]>([]);
  const [loadingBest, setLoadingBest] = useState(true);
  const [loadingDont, setLoadingDont] = useState(true);

  useEffect(() => {
    // Fetch Best Sellers — featured products, max 4
    fetch('/api/products?featured=true&limit=4')
      .then((r) => r.json())
      .then((data) => setBestSellers(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => setBestSellers([]))
      .finally(() => setLoadingBest(false));

    // Fetch "Don't Forget These" — Coolers & Ciders, max 4
    fetch('/api/products?is_miscellaneous=true&limit=4')
      .then((r) => r.json())
      .then((data) => setDontForgetProducts(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => setDontForgetProducts([]))
      .finally(() => setLoadingDont(false));
  }, []);



  return (
    <div className="bg-[var(--color-background)]">
      <Hero />

      <main className="max-w-[1280px] mx-auto px-4 md:px-[40px] py-[40px]">

        {/* ─── SHOP FOR ─── */}
        <section className="mb-[50px]">
          <div className="flex justify-between items-end mb-[20px] border-b border-[var(--color-border)] pb-2">
            <h2 className="text-[17px] md:text-[22px] font-serif uppercase text-[var(--color-primary)] tracking-wider">
              Shop For
            </h2>
            <Link href="/products" className="text-[12px] text-[var(--color-primary)] hover:underline">
              More categories ›
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] md:gap-[30px]">
            {/* New Arrivals */}
            <Link
              href="/products?sort=newest"
              className="group block relative border border-[var(--color-border)] p-12 sm:p-16 md:p-24 bg-[var(--color-surface)] text-center hover:shadow-md transition-all duration-300 hover:border-[var(--color-surface-dark)]"
            >
              <div className="font-serif italic text-[32px] sm:text-[38px] md:text-[48px] text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                New Arrivals
              </div>
              <div className="text-[11px] md:text-[13px] text-[var(--color-primary)] uppercase tracking-[0.2em] opacity-70">
                Just In
              </div>
            </Link>

            {/* Petrolia Picks */}
            <Link
              href="/products?featured=true"
              className="group block relative border border-[var(--color-border)] p-12 sm:p-16 md:p-24 bg-[var(--color-surface)] text-center hover:shadow-md transition-all duration-300 hover:border-[var(--color-surface-dark)]"
            >
              <div className="font-serif italic text-[32px] sm:text-[38px] md:text-[48px] text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                Petrolia Picks
              </div>
              <div className="text-[11px] md:text-[13px] text-[var(--color-primary)] uppercase tracking-[0.2em] opacity-70">
                Staff Favourites
              </div>
            </Link>
          </div>
        </section>

        {/* ─── BEST SELLERS ─── */}
        <section className="mb-[60px]">
          <div className="flex justify-between items-end mb-[20px] border-b border-[var(--color-border)] pb-2">
            <h2 className="text-[17px] md:text-[22px] font-serif uppercase text-[var(--color-primary)] tracking-wider">
              Best Sellers
            </h2>
            <Link href="/products?featured=true" className="text-[12px] text-[var(--color-primary)] hover:underline">
              More best selling ›
            </Link>
          </div>
          {loadingBest ? <SkeletonGrid /> : bestSellers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[15px] md:gap-[25px]">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-[var(--color-text-secondary)] text-sm">
              No featured products yet — check back soon.
            </div>
          )}
        </section>

        {/* ─── DON'T FORGET THESE ─── */}
        <section className="mb-[60px]">
          <div className="flex justify-between items-end mb-[20px] border-b border-[var(--color-border)] pb-2">
            <h2 className="text-[17px] md:text-[22px] font-serif uppercase text-[var(--color-primary)] tracking-wider">
              Don&apos;t Forget These
            </h2>
            <Link href="/category/coolers" className="text-[12px] text-[var(--color-primary)] hover:underline">
              More ›
            </Link>
          </div>
          {loadingDont ? <SkeletonGrid /> : dontForgetProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[15px] md:gap-[25px]">
              {dontForgetProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-[var(--color-text-secondary)] text-sm">
              Check out our coolers &amp; ciders selection.
            </div>
          )}
        </section>

        {/* ─── NEWSLETTER + LOGO ─── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-[30px] items-stretch py-[40px] border-t border-[var(--color-border)]">
          {/* Newsletter */}
          <div className="bg-[var(--color-surface)] p-8 md:p-12 text-center rounded-sm flex flex-col justify-center">
            <div className="font-serif italic text-[26px] md:text-[36px] text-[var(--color-primary)] mb-4">
              Subscribe to Our Newsletter
            </div>
            <p className="text-[13px] text-[var(--color-text-secondary)] mb-6">
              Get the latest updates on new arrivals, special promotions, and exclusive events.
            </p>
            <form className="flex w-full max-w-md mx-auto h-[48px]">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 px-4 py-2 border border-r-0 border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-primary)] focus:outline-none focus:border-gray-400 min-w-0 text-sm"
              />
              <button
                type="button"
                className="bg-[var(--color-primary)] text-white px-5 uppercase font-display text-xs font-bold tracking-wider hover:bg-[var(--color-primary-dark)] transition-colors whitespace-nowrap shrink-0"
              >
                Sign Up
              </button>
            </form>
          </div>

          {/* Logo */}
          <div className="flex justify-center bg-[var(--color-surface)] p-8 md:p-12 rounded-sm items-center">
            <div className="w-[220px] md:w-[380px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="Petrolia Liquor Store"
                className="w-full h-auto object-contain mix-blend-multiply bg-transparent"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
