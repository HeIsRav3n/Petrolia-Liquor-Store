import { STORE_INFO } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Petrolia Liquor Store',
  description: 'Get in touch with Petrolia Liquor Store. Call us to place an order or visit us at our location in Petrolia, Ontario.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <section className="relative h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden">
        {/* Background Image / Gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-[var(--color-background)] z-10"></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/images/hero/hero-3.png" 
            alt="Petrolia Liquor Store Selection" 
            className="w-full h-full object-cover grayscale-[0.3] brightness-75 scale-105"
          />
        </div>

        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 uppercase tracking-wider">
            Get in Touch
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-display font-light leading-relaxed">
            Have a question or want to place an order? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 md:px-[60px] -mt-20 relative z-30 pb-24">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Phone Card */}
              <div className="bg-[var(--color-surface)] p-8 border border-[var(--color-border)] shadow-xl hover:shadow-2xl transition-all group rounded-sm">
                <div className="w-14 h-14 bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-[var(--color-primary)] mb-2 uppercase tracking-wide">Phone</h3>
                <p className="text-[var(--color-text-secondary)] text-sm mb-4">Call us to place an order or ask a question.</p>
                <a href={`tel:${STORE_INFO.phone}`} className="text-2xl font-display font-bold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors">
                  {STORE_INFO.phoneDisplay}
                </a>
              </div>

              {/* Email Card */}
              <div className="bg-[var(--color-surface)] p-8 border border-[var(--color-border)] shadow-xl hover:shadow-2xl transition-all group rounded-sm">
                <div className="w-14 h-14 bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-[var(--color-primary)] mb-2 uppercase tracking-wide">Email</h3>
                <p className="text-[var(--color-text-secondary)] text-sm mb-4">Send us your order details or inquiries.</p>
                <a href={`mailto:${STORE_INFO.email}`} className="text-sm sm:text-base md:text-lg font-display font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors whitespace-nowrap">
                  {STORE_INFO.email}
                </a>
              </div>

              {/* Location Card */}
              <div className="bg-[var(--color-surface)] p-8 border border-[var(--color-border)] shadow-xl hover:shadow-2xl transition-all group rounded-sm md:col-span-2">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="w-14 h-14 bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-0 group-hover:scale-110 transition-transform shrink-0">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-[var(--color-primary)] mb-1 uppercase tracking-wide">Store Location</h3>
                    <p className="text-[var(--color-text-primary)] text-lg font-display">{STORE_INFO.address}</p>
                  </div>
                  <div className="md:ml-auto">
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(STORE_INFO.address)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[var(--color-primary)] font-bold uppercase tracking-widest text-[13px] hover:underline"
                    >
                      <span>Get Directions</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Integration */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl overflow-hidden rounded-sm">
              <div className="h-[400px] md:h-[500px] w-full bg-gray-100">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2374.3402452287865!2d-113.5247942!3d53.4802879!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a01f5e27a65a2d%3A0xc348507cfb9fb39!2sPetrolia%20Liquor%20Store!5e0!3m2!1sen!2sca!4v1715000000000!5m2!1sen!2sca" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Petrolia Liquor Store Location"
                  className="grayscale hover:grayscale-0 transition-all duration-700"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Hours Card */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 shadow-xl rounded-sm">
              <h3 className="text-xl font-serif text-[var(--color-primary)] mb-6 uppercase tracking-wide border-b border-[var(--color-border)] pb-4">
                Store Hours
              </h3>
              <div className="space-y-4">
                {STORE_INFO.hours.map((h) => (
                  <div key={h.day} className="flex justify-between items-center group">
                    <span className="text-[var(--color-text-secondary)] font-display text-sm group-hover:text-[var(--color-primary)] transition-colors">{h.day}</span>
                    <span className="text-[var(--color-text-primary)] font-bold text-sm bg-[var(--color-background)] px-3 py-1 rounded-sm border border-[var(--color-border)]">
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ordering CTA */}
            <div className="bg-[var(--color-primary)] p-8 shadow-xl text-white rounded-sm relative overflow-hidden group">
              {/* Decoration */}
              <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
              
              <h3 className="text-2xl font-serif mb-4 uppercase tracking-widest relative z-10">Ordering is Easy</h3>
              <p className="text-white/80 mb-8 font-light relative z-10 leading-relaxed">
                Browse our selection online, then call or email us to secure your favorite spirits for pickup.
              </p>
              
              <div className="space-y-4 relative z-10">
                <a 
                  href={`tel:${STORE_INFO.phone}`} 
                  className="flex items-center justify-center gap-3 w-full bg-white text-[var(--color-primary)] py-4 font-bold uppercase tracking-widest text-[13px] hover:bg-black hover:text-white transition-all shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call to Order
                </a>
                
                <a 
                  href={`mailto:${STORE_INFO.email}`} 
                  className="flex items-center justify-center gap-3 w-full border-2 border-white/30 text-white py-4 font-bold uppercase tracking-widest text-[13px] hover:bg-white hover:text-[var(--color-primary)] transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Us
                </a>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                {[
                  { n: '01', t: 'Select your drinks' },
                  { n: '02', t: 'Call Or Email store' },
                  { n: '03', t: 'Pick up and enjoy' }
                ].map(step => (
                  <div key={step.n} className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity">
                    <span className="text-[var(--color-primary-light)] font-serif font-bold text-lg opacity-40">{step.n}</span>
                    <span className="text-sm font-display tracking-wide">{step.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

