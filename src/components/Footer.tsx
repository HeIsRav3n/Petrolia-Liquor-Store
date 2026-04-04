import Link from 'next/link';
import { STORE_INFO, categories } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] pt-[60px] pb-[30px]">
      <div className="max-w-[1060px] mx-auto px-4 md:px-[30px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px] mb-[40px]">
          
          {/* Store Hours */}
          <div>
            <h4 className="text-[var(--color-primary)] font-serif uppercase text-[1.067em] mb-[15px]">Store Hours</h4>
            <ul className="text-[var(--color-primary)] text-[14px] leading-[1.6]">
              {STORE_INFO.hours.map((h) => (
                <li key={h.day} className="mb-1">
                  <strong>{h.day}:</strong> {h.time}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[var(--color-primary)] font-serif uppercase text-[1.067em] mb-[15px]">Quick Links</h4>
            <ul className="space-y-[10px] text-[14px]">
              <li><Link href="/products" className="hover:text-[var(--color-primary-light)] transition-colors">Shop All</Link></li>
              <li><Link href="/about" className="hover:text-[var(--color-primary-light)] transition-colors">Our Story</Link></li>
              <li><Link href="/privacy" className="hover:text-[var(--color-primary-light)] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-[var(--color-primary-light)] transition-colors">Refund Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[var(--color-primary-light)] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[var(--color-primary)] font-serif uppercase text-[1.067em] mb-[15px]">Categories</h4>
            <ul className="text-[14px] leading-[1.6]">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id} className="mb-1">
                  <Link href={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`} className="text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Connected */}
          <div>
            <h4 className="text-[var(--color-primary)] font-serif uppercase text-[1.067em] mb-[15px]">Stay Connected</h4>
            <div className="flex gap-4 mb-6">
              <a href={STORE_INFO.socials?.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href={STORE_INFO.socials?.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            
            <h4 className="text-[var(--color-primary)] font-serif uppercase text-[1.067em] mb-[10px]">Location</h4>
            <a 
              href="https://maps.google.com?daddr=11431 40 Ave NW,Edmonton , AB," 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[14px] text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors flex items-start gap-2 group"
            >
              <svg className="w-5 h-5 shrink-0 mt-0.5 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{STORE_INFO.address}</span>
            </a>
          </div>

        </div>

        <div className="flex justify-center mb-8">
          <div className="w-[150px] md:w-[200px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/logo.png" 
              alt="Petrolia Liquor Store" 
              className="w-full h-auto object-contain mix-blend-multiply bg-transparent"
            />
          </div>
        </div>

        <hr className="border-t border-[var(--color-border)] my-[30px]" />

        {/* Bottom copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[12px] md:text-[14px] text-[var(--color-primary)] pb-4 opacity-70">
          <p>&copy; {new Date().getFullYear()} Petrolia Liquor Store.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>MUST BE 19+ TO PURCHASE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
