'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { STORE_INFO } from '@/lib/data';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  const handleEmailCheckout = () => {
    // Generate an email message with the order details
    if (items.length === 0) return;

    let message = "Hello Petrolia Liquor Store! I would like to place an order from my cart:\n\n";
    items.forEach(item => {
      message += `- ${item.quantity}x ${item.product.name} ($${item.product.price.toFixed(2)})\n`;
    });
    message += `\n*Total: $${totalPrice.toFixed(2)}*\n\n`;
    message += "Please let me know how we can proceed with payment and delivery/pickup. Thank you!";

    const emailUrl = `mailto:${STORE_INFO.email}?subject=New Order Request&body=${encodeURIComponent(message)}`;
    window.location.href = emailUrl;
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-[40px]">
      <div className="max-w-[1000px] mx-auto px-4 md:px-[40px]">
        <h1 className="text-[28px] md:text-[36px] font-serif uppercase text-[var(--color-primary)] text-center mb-[40px] tracking-wide">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 border border-[var(--color-border)] rounded-sm bg-[var(--color-surface)]">
            <p className="text-[var(--color-text-primary)] mb-6 text-lg">Your cart is currently empty.</p>
            <Link 
              href="/products" 
              className="inline-block bg-[var(--color-primary)] text-white px-8 py-3 text-[14px] font-display uppercase tracking-widest font-bold hover:bg-black transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-[var(--color-border)] relative group">
                  <div className="w-24 h-24 shrink-0 bg-[var(--color-surface)] border border-[var(--color-border)] p-2">
                      {item.product.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-contain" />
                      ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <Link href={`/products/${item.product.id}`} className="font-serif text-[18px] text-[var(--color-primary)] hover:underline">
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">{item.product.size}</p>
                    <p className="price-text mt-2">${item.product.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-[var(--color-border)]">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-3 py-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-dark)]"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-medium min-w-[40px] text-center text-[var(--color-text-primary)]">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-3 py-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-dark)]"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-4">
                <Link href="/products" className="text-[var(--color-primary)] hover:underline text-sm font-medium">
                  ← Continue Shopping
                </Link>
                <button 
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 h-fit sticky top-[120px]">
              <h2 className="font-serif text-[20px] text-[var(--color-primary)] mb-6 border-b border-[var(--color-border)] pb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Subtotal</span>
                  <span className="price-text text-[1em]">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-[var(--color-border)] pt-4 mb-8">
                <span className="font-bold text-[18px] text-[var(--color-primary)]">Total</span>
                <span className="price-text text-[1.4em]">${totalPrice.toFixed(2)}</span>
              </div>

              {/* Primary Action: Call to Order */}
              <a 
                href={`tel:${STORE_INFO.phone}`}
                className="w-full bg-[var(--color-primary)] text-white py-4 font-display uppercase tracking-widest font-bold hover:bg-[var(--color-primary-dark)] transition-colors flex flex-row items-center justify-center gap-2 whitespace-nowrap overflow-hidden text-[11px] sm:text-[13px] px-1"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.474 5.474l.772-1.548a1 1 0 011.06-.539l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <span className="truncate">Call To Order</span>
              </a>
              
              <div className="mt-4 text-center space-y-2">
                <p className="text-xs text-[var(--color-text-secondary)] italic">
                  Complete your order instantly by calling our store!
                </p>

                {/* Divider */}
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-[var(--color-border)]"></div>
                  <span className="text-xs text-[var(--color-text-secondary)] font-display uppercase tracking-wider">Or</span>
                  <div className="flex-1 h-px bg-[var(--color-border)]"></div>
                </div>

                {/* Secondary Action: Email */}
                <button 
                  onClick={handleEmailCheckout}
                  className="w-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] py-3 font-display uppercase tracking-widest font-bold hover:bg-[var(--color-primary)] hover:text-white transition-colors flex flex-row items-center justify-center gap-2 whitespace-nowrap overflow-hidden text-[10px] sm:text-[12px] px-1"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">Email Us</span>
                </button>
                <p className="text-xs text-[var(--color-text-secondary)] italic">
                  Complete your order instantly by sending it to our store via Email!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}