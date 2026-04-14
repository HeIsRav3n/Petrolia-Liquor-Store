'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { STORE_INFO } from '@/lib/data';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  const handleEmailCheckout = () => {
    if (items.length === 0) return;
    let message = 'Hello Petrolia Liquor Store! I would like to place an order:\n\n';
    items.forEach((item) => {
      message += `- ${item.quantity}x ${item.product.name} ($${item.product.price.toFixed(2)})\n`;
    });
    message += `\nTotal: $${totalPrice.toFixed(2)}\n\nPlease let me know how to proceed. Thank you!`;
    window.location.href = `mailto:${STORE_INFO.email}?subject=New Order Request&body=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-[30px] md:py-[50px]">
      <div className="max-w-[1000px] mx-auto px-4 md:px-[40px]">
        <h1 className="text-[26px] md:text-[36px] font-serif uppercase text-[var(--color-primary)] text-center mb-[30px] md:mb-[45px] tracking-wide">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16 md:py-24 border border-[var(--color-border)] rounded-sm bg-[var(--color-surface)] animate-fade-in">
            <div className="text-5xl mb-6">🛒</div>
            <p className="text-[var(--color-text-primary)] mb-2 text-lg font-serif">Your cart is empty.</p>
            <p className="text-[var(--color-text-secondary)] text-sm mb-8">Add some products to get started!</p>
            <Link
              href="/products"
              className="inline-block bg-[var(--color-primary)] text-white px-8 py-3 text-[13px] font-display uppercase tracking-widest font-bold hover:bg-black transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* ─── Cart Items ─── */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-start sm:items-center gap-4 p-4 border border-[var(--color-border)] bg-white rounded-sm animate-fade-in"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 shrink-0 bg-[var(--color-surface)] border border-[var(--color-border)] p-2 rounded-sm">
                    {item.product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.id}`} className="font-serif text-[15px] md:text-[17px] text-[var(--color-primary)] hover:underline line-clamp-2">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{item.product.size}</p>
                    <p className="price-text mt-1 text-sm">${item.product.price.toFixed(2)}</p>
                  </div>

                  {/* Qty + Remove */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {/* Qty controls */}
                    <div className="flex items-center border border-[var(--color-border)]">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-dark)] transition-colors text-lg leading-none"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-9 h-9 flex items-center justify-center font-medium text-sm text-[var(--color-text-primary)]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-dark)] transition-colors text-lg leading-none"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    {/* Subtotal */}
                    <span className="text-[13px] font-medium text-[var(--color-text-secondary)]">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-400 hover:text-red-600 p-1 transition-colors"
                      title="Remove item"
                      aria-label={`Remove ${item.product.name}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-2">
                <Link href="/products" className="text-[var(--color-primary)] hover:underline text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* ─── Order Summary ─── */}
            {/* On mobile: appears below cart items naturally. On lg+: sticky sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-sm lg:sticky lg:top-[70px]">
                <h2 className="font-serif text-[19px] text-[var(--color-primary)] mb-5 border-b border-[var(--color-border)] pb-4 uppercase tracking-wide">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-5 text-sm">
                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                    <span className="price-text text-[1em]">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>Taxes</span>
                    <span className="italic">Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-[var(--color-border)] pt-4 mb-6">
                  <span className="font-bold text-[16px] text-[var(--color-primary)]">Total</span>
                  <span className="price-text text-[1.3em]">${totalPrice.toFixed(2)}</span>
                </div>

                {/* Call to Order */}
                <a
                  href={`tel:${STORE_INFO.phone}`}
                  className="w-full bg-[var(--color-primary)] text-white py-4 font-display uppercase tracking-wider font-bold hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center gap-2 text-[13px] mb-4 rounded-sm"
                >
                  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.474 5.474l.772-1.548a1 1 0 011.06-.539l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Call To Order
                </a>

                <p className="text-xs text-[var(--color-text-secondary)] italic text-center mb-4">
                  Complete your order instantly by calling our store!
                </p>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-[var(--color-border)]" />
                  <span className="text-xs text-[var(--color-text-secondary)] font-display uppercase tracking-wider">Or</span>
                  <div className="flex-1 h-px bg-[var(--color-border)]" />
                </div>

                {/* Email */}
                <button
                  onClick={handleEmailCheckout}
                  className="w-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] py-3 font-display uppercase tracking-wider font-bold hover:bg-[var(--color-primary)] hover:text-white transition-colors flex items-center justify-center gap-2 text-[12px] rounded-sm"
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Order
                </button>
                <p className="text-xs text-[var(--color-text-secondary)] italic text-center mt-3">
                  Send your order directly to our inbox.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}