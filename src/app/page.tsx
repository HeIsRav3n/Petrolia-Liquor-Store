'use client';

import Link from 'next/link';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { STORE_INFO } from '@/lib/data';
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
    // Fetch Best Sellers — featured products, max 4, no browser cache
    fetch('/api/products?featured=true&in_stock=true&limit=4', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => setBestSellers(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => setBestSellers([]))
      .finally(() => setLoadingBest(false));

    // Fetch "Don't Forget These" — Coolers & Ciders, max 4
    fetch('/api/products?category=Coolers%20%26%20Ciders&in_stock=true&limit=4', { cache: 'no-store' })
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
            <Link
              href="/products?sort=newest"
              className="group block border border-[var(--color-border)] p-12 sm:p-16 md:p-24 bg-[var(--color-surface)] text-center hover:shadow-md transition-all duration-300 hover:border-[var(--color-surface-dark)]"
            >
              <div className="font-serif italic text-[32px] sm:text-[38px] md:text-[48px] text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                New Arrivals
              </div>
              <div className="text-[11px] md:text-[13px] text-[var(--color-primary)] uppercase tracking-[0.2em] opacity-70">
                Just In
              </div>
            </Link>

            <Link
              href="/products?featured=true"
              className="group block border border-[var(--color-border)] p-12 sm:p-16 md:p-24 bg-[var(--color-surface)] text-center hover:shadow-md transition-all duration-300 hover:border-[var(--color-surface-dark)]"
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
              No featured products yet.
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

        {/* ─── STORE INFO ─── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-[2px] border border-[var(--color-border)] overflow-hidden">

          {/* Store Hours */}
          <div className="bg-[var(--color-surface)] p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="font-serif uppercase text-[18px] md:text-[22px] text-[var(--color-primary)] tracking-wider">
                Store Hours
              </h2>
            </div>

            <div className="space-y-3">
              {STORE_INFO.hours.map((h) => (
                <div key={h.day} className="flex justify-between items-center border-b border-[var(--color-border)] pb-3 last:border-0 last:pb-0">
                  <span className="font-display text-[13px] font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">{h.day}</span>
                  <span className="font-display text-[13px] text-[var(--color-primary)] font-semibold">{h.time}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
              <p className="text-[12px] text-[var(--color-text-secondary)] uppercase tracking-wider font-display mb-1">Call Us</p>
              <a
                href={`tel:${STORE_INFO.phone}`}
                className="text-[var(--color-primary)] font-serif text-[20px] hover:underline"
              >
                {STORE_INFO.phoneDisplay}
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="bg-[var(--color-background)] p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="font-serif uppercase text-[18px] md:text-[22px] text-[var(--color-primary)] tracking-wider">
                Find Us
              </h2>
            </div>

            <address className="not-italic mb-6">
              <p className="font-display text-[15px] text-[var(--color-text-primary)] leading-relaxed">
                {STORE_INFO.address}
              </p>
            </address>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_INFO.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-primary text-sm w-fit"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Get Directions
            </a>

            <div className="mt-6 pt-5 border-t border-[var(--color-border)] flex gap-4">
              <a
                href={STORE_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors flex items-center gap-1.5 text-[12px] font-display uppercase tracking-wider"
              >
                Facebook
              </a>
              <a
                href={STORE_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors flex items-center gap-1.5 text-[12px] font-display uppercase tracking-wider"
              >
                Instagram
              </a>
            </div>
          </div>
        </section>

        {/* ─── LOGO ─── */}
        <div className="flex justify-center py-[50px]">
          <div className="w-[200px] md:w-[320px] opacity-60 hover:opacity-100 transition-opacity duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="Petrolia Liquor Store"
              className="w-full h-auto object-contain mix-blend-multiply"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

      </main>
    </div>
  );
}
