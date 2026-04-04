'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AvailabilityPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Ensure the code runs only on the client side and ONLY on the cart page
    if (typeof window !== 'undefined' && pathname === '/cart') {
      const hasSeenPopup = sessionStorage.getItem('hasSeenCartAvailabilityPopup');
      
      if (!hasSeenPopup) {
        // slight delay for better user experience
        const popupTimer = setTimeout(() => {
          setIsOpen(true);
        }, 800); // Faster popup for cart

        return () => clearTimeout(popupTimer);
      }
    }
  }, [pathname]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenCartAvailabilityPopup', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      {/* Box Container */}
      <div className="relative w-[500px] max-w-full bg-white shadow-2xl p-12 flex flex-col items-center text-center">
        
        {/* Close Button overlapping exactly like image */}
        <button 
          onClick={handleClose}
          title="Close Popup"
          className="absolute -top-[18px] -right-[18px] w-[36px] h-[36px] bg-white border border-gray-200 rounded-full flex items-center justify-center text-black hover:bg-gray-100 shadow-md transition-all duration-200 z-10"
        >
          {/* using crisp unicode X */}
          <span className="text-[18px] font-medium leading-none relative top-[1px]">&#10005;</span>
        </button>

        {/* Heading exact line breaks and weight */}
        <h2 className="text-[34px] font-sans text-black leading-[1.3] mb-12 tracking-normal font-normal">
          Call Us At 780-438-<br />
          0448 Before Placing<br />
          Order to Confirm Item<br />
          Availability
        </h2>

        {/* Logo */}
        <div className="w-[280px] mb-14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/images/logo.png" 
            alt="Petrolia Liquor Store Logo" 
            className="w-full h-auto object-contain mix-blend-multiply bg-transparent"
          />
        </div>

        {/* Action Button */}
        <a 
          href="tel:+17804380448"
          onClick={handleClose}
          className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-[4px] font-bold text-[18px] hover:bg-[#6b0d10] transition-colors shadow-none"
        >
          Call 780-438-0448
        </a>
      </div>
    </div>
  );
}
