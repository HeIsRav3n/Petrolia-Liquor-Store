"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function FloatingCart() {
  const { totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    const setMount = () => {
      setMounted(true);
    };
    setMount();
  }, []);

  if (!mounted) return null;

  // Always show it if they scroll, or just always show it?
  // Let's just always show it fixed on the right, since it's a shortcut.
  // The user said: "So When Scrolling It Can Easily Be Clicked. Let It Be On The Right Hand Side And A Mini Stick Man Walking Drunk On It & Drinking"

  return (
    <Link 
      href="/cart"
      className="fixed bottom-12 right-6 z-50 flex flex-col items-center justify-center group"
      aria-label="View Cart"
    >
      {/* Drunk Stickman Animation */}
      <div className="relative w-16 h-16 mb-[-10px] drunk-wobble z-10 pointer-events-none">
        <div className="w-full h-full drunk-hiccup">
          <svg viewBox="0 0 60 80" className="w-full h-full text-[var(--color-primary)]">
            {/* Head */}
            <circle cx="30" cy="15" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
            
            {/* Body */}
            <line x1="30" y1="23" x2="30" y2="45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            
            {/* Left Arm (Drinking Arm) */}
            <g className="drunk-arm-drink">
              <line x1="30" y1="28" x2="15" y2="35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              {/* Bottle */}
              <g transform="translate(10, 30) rotate(-30)">
                <rect x="0" y="5" width="8" height="15" rx="2" fill="currentColor" />
                <rect x="2" y="0" width="4" height="5" fill="currentColor" />
              </g>
            </g>
            
            {/* Right Arm (Swinging) */}
            <line className="drunk-arm-swing" x1="30" y1="28" x2="45" y2="40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            
            {/* Left Leg */}
            <line className="drunk-leg-left" x1="30" y1="45" x2="20" y2="70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            
            {/* Right Leg */}
            <line className="drunk-leg-right" x1="30" y1="45" x2="40" y2="70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Cart Button */}
      <div className="relative bg-[var(--color-surface)] border-2 border-[var(--color-primary)] p-3 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-[var(--color-primary)] group-hover:text-white text-[var(--color-primary)]">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        
        {/* Item Count Badge */}
        {totalItems > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
            {totalItems}
          </div>
        )}
      </div>
    </Link>
  );
}
