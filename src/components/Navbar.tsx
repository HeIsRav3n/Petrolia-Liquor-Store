'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { STORE_INFO } from '@/lib/data';
import AnimatedMartini from './AnimatedMartini';
import { useCart } from '@/context/CartContext';


interface NavItem {
  href: string;
  label: string;
  hasDropdown?: boolean;
  items?: { label: string; href: string }[];
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { totalItems } = useCart();


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const buildItems = (main: string | null, labels: string[]) => labels.map(label => {
    if (label === 'DELIVERY & CURBSIDE') return { label, href: '/delivery-info' };
    if (label === 'CONTACT US') return { label, href: '/contact' };
    
    if (main) {
      if (label.startsWith('ALL ')) {
         return { label, href: `/category/${main}` };
      }
      return { label, href: `/category/${main}/${slugify(label)}` };
    }
    return { label, href: `/category/${slugify(label)}` };
  });

  const navLinks: NavItem[] = [
    { href: '/', label: 'HOME' },
    { href: '/products', label: 'ALL' },
    { 
      href: '/category/beer', 
      label: 'BEER', 
      hasDropdown: true,
      items: buildItems('beer', ['ALL BEER', 'ALE', 'CIDER', 'IPA', 'LAGER'])
    },
    { 
      href: '/category/coolers', 
      label: 'COOLERS', 
      hasDropdown: true,
      items: buildItems('coolers', ['ALL COOLERS', 'CAESARS', 'SELTZERS', 'SODAS', 'TEAS'])
    },
    { 
      href: '/category/wine', 
      label: 'WINE', 
      hasDropdown: true,
      items: buildItems('wine', [
        'ALL WINE', 'ARGENTINA', 'AUSTRALIA', 'BRAZIL', 'CANADA', 'CHILE', 
        'FRANCE', 'GERMANY', 'GREECE', 'HUNGARY', 'ITALY', 'JAPAN', 'KOREA', 
        'MONTENEGRO', 'NEW ZEALAND', 'PORTUGAL', 'REPUBLIC OF MOLDOVA', 
        'SOUTH AFRICA', 'SPAIN', 'USA'
      ])
    },
    { 
      href: '/category/whisky', 
      label: 'WHISKEY', 
      hasDropdown: true,
      items: buildItems('whisky', ['ALL WHISKEY', 'BOURBON', 'RYE', 'SCOTCH'])
    },
    { href: '/category/vodka', label: 'VODKA' },
    { href: '/category/rum', label: 'RUM' },
    {
      href: '#',
      label: 'MORE',
      hasDropdown: true,
      items: buildItems(null, [
        'TEQUILA', 'BRANDY', 'COGNAC', 'GIN', 'ICE WINE', 'LIQUEUR', 
        'PORT', 'SHERRY', 'BITTERS', 'READY TO DRINK', 'GRAIN ALCOHOL', 
        'MISCELLANEOUS', 'DELIVERY & CURBSIDE', 'CONTACT US'
      ])
    }
  ];

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <>
      {/* Top Header Section */}
      <header className="bg-white pt-4 pb-2">
        <div className="max-w-[1280px] mx-auto px-4 md:px-[40px]">
          {/* Top Info Bar */}
          {/* Top Utility Bar */}
          <div className="flex flex-col md:flex-row items-center justify-end gap-3 md:gap-4 text-[11px] md:text-[12px] text-[var(--color-primary)] mb-3 font-display uppercase tracking-wider">
            <Link 
              href="/delivery-info" 
              className="hover:text-black transition-colors font-bold flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-100 rounded-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Delivery & Curbside Pick Up Info
            </Link>
            
            <div className="hidden md:block h-3 w-px bg-gray-200 mx-1"></div>
            
            <div className="flex gap-2 items-center opacity-90">
              <Link href="/login" className="hover:underline font-medium">Sign in</Link>
              <span className="opacity-40 font-light text-[10px]">/</span>
              <Link href="/register" className="hover:underline font-medium">Create Account</Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 border-b border-gray-100 pb-4 md:border-0 md:pb-0">
            {/* Logo (Left) */}
            <Link href="/" className="flex-shrink-0 group relative">
              <div className="flex items-center gap-3">
                <div className="w-[120px] md:w-[180px] relative z-20">
                  <style>{`
                    @keyframes liftAndPour {
                      0% { transform: scale(1) translate(0, 0) rotate(0deg); }
                      10% { transform: scale(0.7) translate(-25px, -25px) rotate(35deg); }
                      35% { transform: scale(0.7) translate(-25px, -25px) rotate(35deg); }
                      45% { transform: scale(0.7) translate(-25px, -25px) rotate(0deg); }
                      85% { transform: scale(0.7) translate(-25px, -25px) rotate(0deg); }
                      95% { transform: scale(1) translate(0, 0) rotate(0deg); }
                      100% { transform: scale(1) translate(0, 0) rotate(0deg); }
                    }
                    @keyframes popMartini {
                      0% { transform: scale(0) translateX(20px); opacity: 0; }
                      10% { transform: scale(1) translateX(0); opacity: 1; }
                      90% { transform: scale(1) translateX(0); opacity: 1; }
                      100% { transform: scale(0) translateX(20px); opacity: 0; }
                    }
                    @keyframes streamPour {
                      0%, 10% { stroke-dashoffset: 150; opacity: 0; }
                      12% { opacity: 1; }
                      20% { stroke-dashoffset: 0; opacity: 1; }
                      30% { stroke-dashoffset: 0; opacity: 1; }
                      38% { stroke-dashoffset: -150; opacity: 1; }
                      40%, 100% { stroke-dashoffset: -150; opacity: 0; }
                    }
                    @keyframes streamWobble {
                      0%, 15% { transform: translateX(0); }
                      20% { transform: translateX(2px); }
                      25% { transform: translateX(-1px); }
                      30% { transform: translateX(1px); }
                      35% { transform: translateX(0); }
                      100% { transform: translateX(0); }
                    }
                    @keyframes fillMartini {
                      0%, 15% { transform: scaleY(0); opacity: 0; }
                      16% { transform: scaleY(0); opacity: 1; }
                      38% { transform: scaleY(1); opacity: 1; }
                      90% { transform: scaleY(1); opacity: 1; }
                      100% { transform: scaleY(0); opacity: 0; }
                    }
                    @keyframes handSwoop {
                      0%, 40% { transform: translate(40px, -40px); opacity: 0; }
                      45% { transform: translate(16px, -10px); opacity: 1; }
                      55% { transform: translate(16px, -10px); opacity: 1; }
                      65% { transform: translate(40px, -40px); opacity: 0; }
                      100% { opacity: 0; }
                    }
                    @keyframes oliveDrop {
                      0%, 40% { transform: translate(40px, -40px); opacity: 0; }
                      45% { transform: translate(16px, -10px); opacity: 1; }
                      55% { transform: translate(16px, -10px); opacity: 1; }
                      60% { transform: translate(16px, 14px) rotate(-30deg); opacity: 1; }
                      90% { transform: translate(16px, 14px) rotate(-30deg); opacity: 1; }
                      100% { opacity: 0; }
                    }
                    @keyframes splashDrop {
                      0%, 59% { transform: scale(0); opacity: 0; }
                      60% { transform: scale(1) translateY(0); opacity: 1; }
                      65% { transform: scale(1.5) translateY(-10px); opacity: 0; }
                      100% { opacity: 0; }
                    }

                    .group:hover .animate-pour-logo {
                      animation: liftAndPour 6s ease-in-out forwards;
                      transform-origin: center;
                    }
                    .group:hover .animate-martini {
                      animation: popMartini 6s ease-in-out forwards;
                    }
                    .group:hover .animate-stream-path {
                      animation: streamPour 6s linear forwards;
                    }
                    .group:hover .animate-stream-container {
                      animation: streamWobble 6s ease-in-out forwards;
                    }
                    .group:hover .animate-fill {
                      animation: fillMartini 6s ease-in-out forwards;
                      transform-origin: 16px 22px;
                    }
                    .group:hover .animate-hand {
                      animation: handSwoop 6s ease-in-out forwards;
                    }
                    .group:hover .animate-olive {
                      animation: oliveDrop 6s ease-in-out forwards;
                    }
                    .group:hover .animate-splash {
                      animation: splashDrop 6s ease-out forwards;
                    }
                  `}</style>
                  <img 
                    src="/images/logo.png" 
                    alt="Petrolia Liquor Store" 
                    className="w-full h-auto object-contain mix-blend-multiply animate-pour-logo drop-shadow-sm transition-all duration-300 bg-transparent"
                  />
                </div>
              </div>
              
              {/* Animated Martini Cup, Pour Stream, Hand & Olive */}
              <div className="absolute -bottom-1 -right-2 md:-right-6 w-12 h-16 md:w-16 md:h-20 pointer-events-none z-10 flex flex-col items-center">
                {/* Pour Stream Container (for wobble) */}
                <svg className="absolute w-full h-full overflow-visible top-[-30px] left-[-25px] md:left-[-35px] md:top-[-35px] animate-stream-container">
                  {/* Thick main stream */}
                  <path d="M -15 -10 Q 5 -5 16 18" fill="none" stroke="#222" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="150" strokeDashoffset="150" className="animate-stream-path opacity-0" />
                  {/* Liquid highlight */}
                  <path d="M -15 -10 Q 5 -5 16 18" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="150" strokeDashoffset="150" className="animate-stream-path opacity-0" style={{ opacity: 0.6 }} />
                </svg>
                
                {/* Martini Cup */}
                <svg viewBox="0 0 32 32" className="w-full h-full animate-martini opacity-0 origin-bottom absolute bottom-0 right-0">
                  {/* Liquid inside martini - Carefully shaped to fit the V */}
                  <path d="M 5.5 10 L 16 22 L 26.5 10 Z" fill="#222" className="animate-fill opacity-0" />
                  
                  {/* Splash Drops */}
                  <g className="animate-splash opacity-0 origin-center" fill="#222">
                    <circle cx="12" cy="10" r="1.5" />
                    <circle cx="20" cy="9" r="1" />
                    <circle cx="16" cy="7" r="1.5" />
                  </g>
                  
                  {/* Glass Outline */}
                  <path d="M 2 6 L 16 22 L 30 6 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="text-black" />
                  <path d="M 16 22 L 16 30 M 10 30 L 22 30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-black" />
                  
                  {/* Front glass reflection to make liquid look inside */}
                  <path d="M 8 11 L 14 18" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" style={{ opacity: 0.3 }} />
                </svg>

                {/* Hand & Olive */}
                <svg viewBox="0 0 32 32" className="absolute w-full h-full overflow-visible bottom-0 right-0">
                  {/* Olive */}
                  <g className="animate-olive opacity-0">
                    <line x1="-5" y1="-5" x2="5" y2="5" stroke="#222" strokeWidth="1" />
                    <circle cx="0" cy="0" r="3.5" fill="#84cc16" />
                    <circle cx="1" cy="-1" r="1.5" fill="#ef4444" />
                  </g>
                  
                  {/* Hand */}
                  <g className="animate-hand opacity-0">
                    {/* Sleeve */}
                    <path d="M 10 -5 L 25 -20 L 35 -5 L 15 10 Z" fill="#111" />
                    {/* Hand body */}
                    <path d="M 5 -2 L 15 8 L 20 2 L 10 -8 Z" fill="#fed7aa" />
                    {/* Index Finger */}
                    <path d="M 10 -8 Q 5 -4 0 0 Q 2 2 5 0 Q 8 -4 12 -6 Z" fill="#fed7aa" />
                    {/* Thumb */}
                    <path d="M 15 8 Q 5 4 0 0 Q 2 -2 5 0 Q 8 4 12 6 Z" fill="#fed7aa" />
                    {/* Cute Red Nails */}
                    <circle cx="1" cy="-1" r="1.5" fill="#e11d48" />
                    <circle cx="1" cy="1" r="1.5" fill="#e11d48" />
                  </g>
                </svg>
              </div>
            </Link>

            {/* Search and Cart Section */}
            <div className="flex items-center gap-3 w-full md:w-auto flex-1 justify-end">
              <form onSubmit={handleSearch} className="relative w-full md:w-[480px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search all products..."
                  className="w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] font-display text-[14px] h-[48px] px-5 py-2 border border-[var(--color-border)] outline-none placeholder-[var(--color-text-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                />
                <button type="submit" className="absolute right-0 top-0 h-[48px] w-[50px] flex items-center justify-center text-[var(--color-primary)]">
                  <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>

              <Link href="/cart" className="flex items-center gap-2.5 bg-[var(--color-surface)] h-[48px] px-5 text-[var(--color-primary)] font-display text-[14px] uppercase font-bold hover:bg-[var(--color-surface-dark)] transition-colors relative border border-[var(--color-border)]">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="hidden sm:inline">CART</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>



              {/* Animated Martini Logo (Top Right) */}
              <Link href="/" title="Home">
                <AnimatedMartini />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-[var(--color-primary)]"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation (Red Bar) */}
      <nav className="hidden md:block bg-[var(--color-primary)] w-full sticky top-0 z-[1000] shadow-md">
        <div className="max-w-[1280px] mx-auto">
          <ul className="flex items-center justify-center">
            {navLinks.map((link) => (
              <li 
                key={link.label} 
                className="relative"
                onMouseEnter={() => link.hasDropdown && handleMouseEnter(link.label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-1.5 text-white font-display font-medium text-[13px] uppercase px-5 py-[16px] hover:bg-black/10 transition-colors tracking-widest whitespace-nowrap"
                >
                  {link.label}
                  {link.hasDropdown && (
                    <svg className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>

                {/* Dropdown Menu */}
                {link.hasDropdown && link.items && (
                  <div 
                    className={`absolute top-full left-1/2 -translate-x-1/2 w-[260px] bg-white shadow-2xl rounded-b-md border-t-2 border-[var(--color-primary)] transition-all duration-300 origin-top z-[1001] ${activeDropdown === link.label ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible -translate-y-2 scale-95'}`}
                  >
                    <ul className="py-3">
                      {link.items.map((subitem) => (
                        <li key={subitem.label}>
                          <Link
                            href={subitem.href}
                            className="block px-6 py-2.5 text-[12px] text-gray-700 hover:text-[var(--color-primary)] hover:bg-gray-50 transition-colors uppercase font-medium tracking-wider"
                          >
                            {subitem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[1100] md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Nav Sidebar */}
      <div className={`fixed top-0 left-0 w-[80%] max-w-[320px] h-full bg-white z-[1200] transform transition-transform duration-300 md:hidden overflow-y-auto ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 bg-[var(--color-primary)] flex items-center justify-between">
          <span className="text-white font-bold text-lg">MENU</span>
          <button onClick={() => setMobileOpen(false)} className="text-white">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
        </div>
        
        <ul className="flex flex-col py-2">
          {navLinks.map((link) => (
            <li key={link.label} className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <Link
                  href={link.href}
                  onClick={() => !link.hasDropdown && setMobileOpen(false)}
                  className="flex-1 text-gray-800 font-display font-bold text-[14px] uppercase p-4 hover:bg-gray-50"
                >
                  {link.label}
                </Link>
                {link.hasDropdown && (
                  <button 
                    onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                    className="p-4 text-[var(--color-primary)] border-l border-gray-100"
                  >
                    <svg className={`w-4 h-4 transition-transform duration-200 ${mobileExpanded === link.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Mobile Accordion Content */}
              {link.hasDropdown && link.items && (
                <div className={`bg-gray-50 overflow-hidden transition-all duration-300 ${mobileExpanded === link.label ? 'max-h-[1000px] border-b border-gray-100' : 'max-h-0'}`}>
                  <ul className="py-2">
                    {link.items.map((subitem) => (
                      <li key={subitem.label}>
                        <Link
                          href={subitem.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-8 py-3 text-[13px] text-gray-600 hover:text-[var(--color-primary)] uppercase font-medium"
                        >
                          {subitem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
          <li className="mt-4 px-4 pb-8">
            <a href={`tel:${STORE_INFO.phone}`} className="flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white font-display font-bold text-[14px] uppercase py-4 rounded-md shadow-md">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.474 5.474l.772-1.548a1 1 0 011.06-.539l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              CALL TO ORDER
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
