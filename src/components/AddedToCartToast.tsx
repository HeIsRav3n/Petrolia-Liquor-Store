'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function AddedToCartToast() {
  const { recentlyAdded, clearRecentlyAdded, totalItems } = useCart();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!recentlyAdded) return;

    // Clear any existing timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);

    setExiting(false);
    setVisible(true);

    // After 3s, start exit animation
    timerRef.current = setTimeout(() => {
      setExiting(true);
      // After animation completes, hide and clear
      exitTimerRef.current = setTimeout(() => {
        setVisible(false);
        clearRecentlyAdded();
      }, 350);
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentlyAdded]);

  const handleDismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    setExiting(true);
    exitTimerRef.current = setTimeout(() => {
      setVisible(false);
      clearRecentlyAdded();
    }, 350);
  };

  if (!visible || !recentlyAdded) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Added to cart notification"
      className={`fixed bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] right-4 sm:right-5 z-[9000] max-w-[320px] w-[calc(100vw-2rem)] sm:w-auto ${
        exiting
          ? 'opacity-0 translate-y-4 scale-95'
          : 'opacity-100 translate-y-0 scale-100'
      }`}
      style={{ transitionProperty: 'opacity, transform', transitionDuration: '300ms', transitionTimingFunction: 'ease-in-out' }}
    >
      <div className="bg-white border border-[var(--color-border)] rounded-sm shadow-xl overflow-hidden">
        {/* Green progress bar */}
        {!exiting && (
          <div
            className="h-[3px] bg-[var(--color-primary)]"
            style={{ animation: 'toast-shrink 3s linear forwards' }}
          />
        )}

        <div className="p-4 flex items-start gap-3">
          {/* Checkmark icon */}
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[var(--color-primary)] uppercase tracking-wide mb-0.5">
              Added to Cart!
            </p>
            <p className="text-[12px] text-[var(--color-text-secondary)] line-clamp-1 mb-2">
              {recentlyAdded.quantity > 1 && (
                <span className="font-medium text-[var(--color-text-primary)]">{recentlyAdded.quantity}x </span>
              )}
              {recentlyAdded.product.name}
            </p>

            <div className="flex items-center gap-2">
              <Link
                href="/cart"
                onClick={handleDismiss}
                className="text-[11px] font-display font-bold uppercase tracking-widest bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-sm hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                View Cart ({totalItems})
              </Link>
              <button
                onClick={handleDismiss}
                className="text-[11px] font-display uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors py-1.5 px-1"
              >
                Continue
              </button>
            </div>
          </div>

          {/* Dismiss X */}
          <button
            onClick={handleDismiss}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors p-0.5 shrink-0 -mt-0.5"
            aria-label="Dismiss notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
